const fs = require('fs');
const path = require('path');

const ORIGINAL_FOLDER = path.resolve(__dirname, 'files/original');

getFileNamesFromDir(ORIGINAL_FOLDER)
.then(fileName => console.log(fileName))

function getFileNamesFromDir(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, fileNames) => {
      if (err) {
        reject(err);
      } else {
        resolve(fileNames.map(fileName => dir + fileName));
      }
    });
  });
}
