import subprocess
import os
from pathlib import Path

def deploy_contract(user_dir):
    # Navigate to the user's Brownie project directory
    project_dir = Path(user_dir)
    
    # Make sure the project directory exists
    if not project_dir.exists():
        raise FileNotFoundError("Brownie project directory does not exist.")

    # Change the current working directory to the project directory
    os.chdir(project_dir)

    # Execute the Brownie deployment script
    try:
        
        result = subprocess.run(
            ["brownie", "run", "scripts/deploy.py", "--network", "polygon-amoy"],
            check=True,
            capture_output=True,
            text=True
        )
        
        # Extract the deployment address from the result
        output = result.stdout
        deployment_address = extract_deployment_address(output)
        
        return deployment_address
    except subprocess.CalledProcessError as e:
        print(f"Deployment failed: {e.output}")
        raise RuntimeError("Deployment failed.")

def extract_deployment_address(output):
    # Assuming the deployment address is printed at the end of the output
    # Adjust this logic according to your actual Brownie script output
    lines = output.splitlines()
    for line in lines:
        if "Contract deployed at:" in line:
            return line.split("at:")[-1].strip()
    raise ValueError("Deployment address not found in output.")
