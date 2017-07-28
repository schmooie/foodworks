const fs = require('fs');
const path = require('path');

const rename = require('./lib/rename');
const append = require('./lib/append');

const ORIGIN_FOLDER = path.resolve(__dirname, 'files/original');
const DESTINATION_FOLDER = path.resolve(__dirname, 'files/moved');

getFileNamesFromDir(ORIGIN_FOLDER)
// .then(fileName => console.log(fileName))
.then((fileNames) => {
  fileNames.forEach(fileName => console.log(getMetaData(fileName)));
});

function appendZero(int) {
  return ('0' + int).slice(-2);
}

function getMetaData(fileName) {
  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    // index 0 months
    appendZero(now.getMonth() + 1),
    appendZero(now.getDate()),
    appendZero(now.getHours()),
    now.getSeconds(),
  ].join('_');
  const originalName = path.basename(fileName, path.extname(fileName));
  const newName = `${originalName}_edited_${timestamp}`;

  return {
    newName,
    originalName,
    originalPath: fileName,
    newPath: fileName
      .replace(ORIGIN_FOLDER, DESTINATION_FOLDER)
      .replace(originalName, newName),
  };
}

function getFileNamesFromDir(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, fileNames) => {
      if (err) {
        reject(err);
      } else {
        resolve(fileNames.map(fileName => `${dir}/${fileName}`));
      }
    });
  });
}
