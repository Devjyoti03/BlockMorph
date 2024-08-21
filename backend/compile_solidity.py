import subprocess
import os
import shutil

def compile_solidity(solidity_file, user_dir):
    # Create a Hardhat project in the user's directory
    os.makedirs(os.path.join(user_dir, "contracts"), exist_ok=True)
    shutil.copy(solidity_file, os.path.join(user_dir, "contracts/contract.sol"))
    
    # Run Hardhat compilation command
    subprocess.run(["npx", "hardhat", "compile"], cwd=user_dir, check=True)

    # Return paths to compiled files (bytecode, ABI, etc.)
    compiled_files = [os.path.join(user_dir, "artifacts/contracts/contract.sol/SimpleStorage.json")]
    return compiled_files
