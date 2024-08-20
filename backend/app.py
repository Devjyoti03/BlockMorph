from flask import Flask, request, jsonify, send_file, render_template
import os
import uuid
import shutil
from flask_cors import CORS
from dotenv import load_dotenv
from generate_code import generate_solidity_code
from compile_solidity import compile_solidity
from test_contract import test_contract
from scan_contract import scan_contract
from deploy_contract import deploy_contract

load_dotenv()

app = Flask(__name__)
CORS(app)
# Directory to store user session files
SESSION_DIR = "user_sessions"

if not os.path.exists(SESSION_DIR):
    os.makedirs(SESSION_DIR)



@app.route('/process_link', methods=['POST'])
def process_link():
    user_link = request.json['link']
    user_id = str(uuid.uuid4())
    user_dir = os.path.join(SESSION_DIR, user_id)
    os.makedirs(user_dir, exist_ok=True)

    # Generate Solidity code based on the link
    solidity_code = generate_solidity_code(user_link)
    solidity_file = os.path.join(user_dir, 'contract.sol')
    with open(solidity_file, 'w') as f:
        f.write(solidity_code)

    return jsonify({"user_id": user_id, "message": "Solidity code generated successfully."})

@app.route('/compile', methods=['POST'])
def compile():
    user_id = request.json['user_id']
    user_dir = os.path.join(SESSION_DIR, user_id)
    solidity_file = os.path.join(user_dir, 'contract.sol')

    compiled_files = compile_solidity(solidity_file, user_dir)
    return jsonify({"message": "Compilation successful.", "compiled_files": compiled_files})

@app.route('/test', methods=['POST'])
def test():
    user_id = request.json['user_id']
    user_dir = os.path.join(SESSION_DIR, user_id)

    test_results = test_contract(user_dir)
    return jsonify({"message": "Testing complete.", "test_results": test_results})

@app.route('/scan', methods=['POST'])
def scan():
    user_id = request.json['user_id']
    user_dir = os.path.join(SESSION_DIR, user_id)

    scan_results = scan_contract(user_dir)
    return jsonify({"message": "Security scan complete.", "scan_results": scan_results})

@app.route('/deploy', methods=['POST'])
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

if __name__ == '__main__':
    app.run(debug=True)
