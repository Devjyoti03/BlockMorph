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
        # Return success message and the ABI of the compiled contract
        return jsonify({
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
# this will deploy the compiled brownie project
def deploy():
    user_id = request.json['user_id']
    user_dir = os.path.join(SESSION_DIR, user_id)

    deployment_address = deploy_contract(user_dir)
    return jsonify({"message": "Deployment successful.", "deployment_address": deployment_address})

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
        # Generate the documentation using the generate_documentation function
        response_data = generate_documentation(demo_code, language)
        return jsonify(response_data)
    
    except ValueError as e:
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)