#!/bin/bash

# Ensure the script stops if any command fails
set -e

# Check if the user provided a name for the project
if [ -z "$1" ]; then
    echo "Usage: $0 <project-name>"
    exit 1
fi

# Project name from the first argument
PROJECT_NAME=$1

# Initialize a new Hardhat project
mkdir $PROJECT_NAME
cd $PROJECT_NAME

# Initialize Hardhat
npx hardhat init --force

# Create necessary directories
mkdir -p contracts artifacts

# Copy the Solidity file to the contracts directory (Assuming the file name is passed as a second argument)
if [ -n "$2" ]; then
    cp $2 contracts/
else
    echo "Please provide the Solidity file to compile."
    exit 1
fi

# Compile the contract using Hardhat
npx hardhat compile

# Print the location of the compiled artifacts
echo "Compiled artifacts can be found in the 'artifacts' directory."
