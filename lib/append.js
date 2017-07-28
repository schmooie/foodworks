const fs = require('fs');
const Transform = require('stream').Transform;

function rename(metaData) {
  const { newName, originalName, originalPath, newPath } = metaData;
  const isJSON = originalPath.indexOf('.json') > -1;
  const isTxt = originalPath.indexOf('.txt') > -1;

  if (isJSON) {
    appendMetaToJSON(originalPath, newPath, metaData);
  }

  if (isTxt) {
    appendMetaToTxt(
      originalPath,
      newPath,
      // empty string to kickoff first new line
      ['', originalName, originalPath, newName, newPath].join('\n')
    );
  }

  console.log(metaData);
  return metaData;
}

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

function appendMetaToJSON(filePath, newPath, objToMerge) {
  // don't know how to do this with streams :(

  fs.readFile(filePath, 'utf8', (readErr, data) => {
    if (readErr) {
      // TODO
      console.error(readErr);
    } else {
      try {
        const originalObj = JSON.parse(data);
        fs.writeFile(newPath, JSON.stringify(Object.assign({}, originalObj, objToMerge)), (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
          }
        });
      } catch (jsonParseErr) {
        // TODO
        console.error(jsonParseErr);
      }
    }
  });
}

module.exports = rename;
