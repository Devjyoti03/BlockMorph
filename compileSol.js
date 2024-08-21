const { exec } = require('child_process');
const path = require('path');

function compileSolidity(hardhatDir) {
  return new Promise((resolve, reject) => {
    exec('npx hardhat compile', { cwd: hardhatDir }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error compiling Solidity: ${error}`);
        return reject(error);
      }
      console.log(`Solidity compiled successfully: ${stdout}`);
      resolve(stdout);
    });
  });
}


const fs = require('fs');
const archiver = require('archiver');

function zipProject(hardhatDir, outputZipPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Zipped project size: ${archive.pointer()} total bytes`);
      resolve();
    });

    archive.on('error', (err) => {
      console.error(`Error zipping project: ${err}`);
      reject(err);
    });

    archive.pipe(output);
    archive.directory(hardhatDir, false);
    archive.finalize();
  });
}
