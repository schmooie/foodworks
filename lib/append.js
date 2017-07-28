const fs = require('fs');
const Transform = require('stream').Transform;

function rename(metaData) {
  const { newName, originalName, originalPath, newPath } = metaData;
  const isJSON = originalPath.indexOf('.json') > -1;
  const isTxt = originalPath.indexOf('.txt') > -1;

  if (isJSON) {
  }

  if (isTxt) {
    appendMetaToTxt(
      originalPath,
      newPath,
      ['', originalName, originalPath, newName, newPath].join('\n')
    );
  }

  console.log(metaData);


  return metaData;
}

function appendMetaToJSON() {}

function appendMetaToTxt(filePath, newPath, appendee) {
  const appendTransform = new Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk);
    },
    flush(callback) {
      this.push(appendee);
      callback();
    }
  });

  fs.createReadStream(filePath)
  .pipe(appendTransform)
  .pipe(fs.createWriteStream(newPath));
}

module.exports = rename;
