const fs = require('fs');
const path = require('path');

const appendAndRename = require('./lib/rename');

const ORIGIN_FOLDER = path.resolve(__dirname, 'files/original');
const DESTINATION_FOLDER = path.resolve(__dirname, 'files/moved');

if (!fs.existsSync(DESTINATION_FOLDER)){
  fs.mkdirSync(DESTINATION_FOLDER);
}

getFileNamesFromDir(ORIGIN_FOLDER)
.then(fileNames => fileNames.map(getMetaData))
.then((arrOfMetaData) => {
  const promises = arrOfMetaData.map(metaData => reflect(appendAndRename(metaData)));
  return Promise.all(promises);
})
.then((metaData) => {
  const errorFiles = metaData
  .filter(({ status }) => status === 'rejected')
  .map(({ error }) => error.originalName);
  const renamed = metaData.filter(({ status }) => status === 'resolved');

  console.log(`renamed ${renamed.length} files, with ${errorFiles.length} errors ${errorFiles.length ? '(' + errorFiles.join(', ') + ')' : ''}`);
});

// force resolve everything
function reflect(promise) {
  return promise.then(
    (data) => ({ data, status: 'resolved' }),
    (error) => ({ error, status: 'rejected' }));
}

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
