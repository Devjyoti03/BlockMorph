from flask import Flask, request, jsonify, send_file, render_template
import os
import json
import uuid
import subprocess
import shutil
from flask_cors import CORS
from dotenv import load_dotenv
from generate_code import generate_solidity_code
from brownie import project
from test_contract import test_contract
from scan_contract import scan_contract
from deploy_contract import deploy_contract
from get_options import process_url
from generate_docs import generate_documentation



load_dotenv()

app = Flask(__name__)
CORS(app)

# Directory to store user session files
SESSION_DIR  = os.path.join(os.getcwd(), 'user_contracts')
PROJECT_DIR  = os.path.join(os.getcwd(), 'user_projects')

if not os.path.exists(SESSION_DIR):
    os.makedirs(SESSION_DIR)
if not os.path.exists(PROJECT_DIR):
    os.makedirs(PROJECT_DIR)
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# Set BASE_DIR to the parent directory of CURRENT_DIR
# BASE_DIR = os.path.dirname(CURRENT_DIR)


# print(BASE_DIR)



@app.route('/delete_project', methods=['POST'])
def delete_project():
    user_id = request.json.get('user_id')
    
    if not user_id:
        return jsonify({"success": False, "message": "User ID is missing."}), 400
    
    # Define the user directory based on the user_id
    user_dir = os.path.join(PROJECT_DIR, user_id)
    
    try:
        # Check if the directory exists
        if not os.path.exists(user_dir):
            return jsonify({"success": False, "message": "Project directory not found."}), 404
        
        # Delete the directory and all its contents
        shutil.rmtree(user_dir)
        
        return jsonify({"success": True, "message": f"Project '{user_id}' deleted successfully."})
    
    except Exception as e:
        return jsonify({"success": False, "message": "An error occurred.", "details": str(e)}), 500



@app.route('/compile', methods=['POST'])
def compile_contract():
    data = request.json
    
    contract_name  = data.get('contract_name')
    user_id = data.get('meta_acc')
    project_folder = os.path.join(PROJECT_DIR, user_id)

    # Check for necessary inputs
    
    if not contract_name:
        return jsonify({'error': 'No contract name provided'}), 400

    try:
        # Save the contract code to a .sol file
        
        # Compile the project (this compiles all contracts in the contracts directory)
        result = subprocess.run(['brownie', 'compile'], capture_output=True, cwd=project_folder, check=True)
        if result.returncode != 0:
            # If compilation fails, return the error message from solc
            return jsonify({
                'error': 'Compilation failed',
                'details': result.stderr.decode('utf-8')
            }), 500

        # Load the build artifacts
        build_folder = os.path.join(project_folder, 'build', 'contracts')
        build_files = os.listdir(build_folder)
        if not build_files:
            return jsonify({'error': 'No contracts found in the build folder'}), 500

        # Assuming there's only one contract compiled
        build_path = os.path.join(build_folder, build_files[0])
        with open(build_path, "r") as build_file:
            build_data = json.load(build_file)

        # Extract the ABI
        abi = build_data.get('abi', [])
        print(abi)
        print("compilation successful")
        # Return success message and the ABI of the compiled contract
        return jsonify({
            "success":True,
            'status': True,
            'message': 'Compilation successful',
            'abi': abi
        }), 200

    except subprocess.CalledProcessError as e:
        return jsonify({'error': 'Compilation failed', 'details': e.stderr.decode('utf-8')}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/getOptions', methods=["POST"])
def getOptions():
    user_link = request.json['url']
    # user_acc = request.json["meta_acc"]
    print("trying")
    try:
        result = process_url(user_link)
        return jsonify({'success':True,'data':result})
    except Exception as e:
        return jsonify({'success':False})

@app.route('/process_link', methods=['POST'])
def process_link():
    solidity_code = request.json.get('solCode')
    user_id = request.json.get("meta_id")
    
    if not solidity_code or not user_id:
        return jsonify({"success": False, "message": "Solidity code or User ID is missing."}), 400

    # Define the user directory where the Brownie project will be created
    user_dir = os.path.join(PROJECT_DIR, user_id)
    
    # Create the directory for the user if it doesn't exist
    os.makedirs(user_dir, exist_ok=True)
    
    try:
        # Initialize a new Brownie project in the user's directory
        subprocess.run(['brownie', 'init'], cwd=user_dir, check=True)

        # Define the path where the Solidity file will be saved
        contracts_dir = os.path.join(user_dir, 'contracts')
        os.makedirs(contracts_dir, exist_ok=True)

        # Save the Solidity code to a .sol file
        solidity_file_path = os.path.join(contracts_dir, 'MyContract.sol')
        with open(solidity_file_path, 'w') as solidity_file:
            solidity_file.write(solidity_code)

        deploy_file_path = os.path.join(user_dir, "scripts")

        
        with open(f'{deploy_file_path}/deploy.py', "w") as deploy_file:
            deploy_file.write('''\
from brownie import MyContract, accounts, network, config

def get_account():
    # Load the account from the private key specified in the config file
    if network.show_active() in config["networks"]:
        return accounts.add(config["wallets"]["from_key"])
    else:
        return accounts[0]  # Fallback to a default account if no config is found

def main():
    account = get_account()
    
    # Deploy the contract
    deployed_contract = MyContract.deploy({"from": account})

    # Print the address of the deployed contract
    print(f"Contract deployed at address: {deployed_contract.address}")
    return deployed_contract.address
''')
        # Create the brownie-config.yaml file in the project directory
        brownie_config_path = os.path.join(user_dir, 'brownie-config.yaml')
        with open(brownie_config_path, 'w') as config_file:
            config_file.write('''\
networks:
  default: avax-test
  amoy:
    host: https://rpc-amoy.polygon.technology/
    chainid: 80002
    explorer: https://amoy.polygonscan.com/
    name: Polygon Amoy Testnet
  avax-test:
    host: https://api.avax-test.network/ext/bc/C/rpc
    chainid: 43113
    explorer: https://testnet.snowtrace.io/
    name: Avalanche Fuji C-Chain Testnet
wallets:
  from_key: "enter the acc pvt key here"
''')


        return jsonify({"success": True, "user_id": user_id, "message": "Solidity code file saved and Brownie project initialized successfully."})

    except subprocess.CalledProcessError as e:
        return jsonify({"success": False, "message": "Failed to initialize Brownie project.", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"success": False, "message": "An error occurred.", "details": str(e)}), 500



@app.route('/test', methods=['POST'])
def test():
    user_id = request.json['user_id']
    user_dir = os.path.join(SESSION_DIR, user_id)

    test_results = test_contract(user_dir)
    return jsonify({"message": "Testing complete.", "test_results": test_results})

@app.route('/scan', methods=['POST'])
# this will scan for errors using slither
def scan():
    user_id = request.json['user_id']
    user_dir = os.path.join(SESSION_DIR, user_id)

    scan_results = scan_contract(user_dir)
    return jsonify({"message": "Security scan complete.", "scan_results": scan_results})

@app.route('/deploy', methods=['POST'])
def deploy():
    user_id = request.json['meta_acc']
    user_dir = os.path.join(PROJECT_DIR, user_id)
    
   

    try:
        # Run the Brownie deploy script with the environment variable
        result = subprocess.run(
            ['brownie', 'run', 'scripts/deploy.py'],
            cwd=user_dir,
            capture_output=True,
            text=True,
            check=True,
            
        )

        # Extract the deployment address from the result
        deployment_address = None
        for line in result.stdout.splitlines():
            if "Contract deployed at address:" in line:
                deployment_address = line.split(": ")[1].strip()
                break

        if deployment_address:
            print("successfully deployed at: ", deployment_address)
            return jsonify({
            "status": True,
            "deployment_address": deployment_address})
        else:
            return jsonify({"success":False,"message": "Deployment failed.", "details": result.stdout}), 500

    except subprocess.CalledProcessError as e:
        return jsonify({"message": "Deployment failed.", "details": e.stdout}), 500
    except Exception as e:
        return jsonify({"message": "An error occurred.", "details": str(e)}), 500

@app.route('/download/<user_id>', methods=['GET'])
def download(user_id):
    user_dir = os.path.join(SESSION_DIR, user_id)
    zip_filename = f'{user_id}_contract_package.zip'
    zip_filepath = os.path.join(SESSION_DIR, zip_filename)

    shutil.make_archive(zip_filepath.replace('.zip', ''), 'zip', user_dir)
    return send_file(zip_filepath, as_attachment=True)

@app.route('/generate', methods=['POST'])
def generate_response():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    if 'language' not in data or 'code' not in data:
        return jsonify({"error": "'language' and 'code' keys are required in the JSON request"}), 400
    
    language = data['language']
    demo_code = data['code']
    
    try:
        response_data = generate_documentation(demo_code, language)
        return jsonify(response_data)
    
    except ValueError as e:
        return jsonify({"error": str(e)}), 500
       
if __name__ == '__main__':
    app.run(debug=False)