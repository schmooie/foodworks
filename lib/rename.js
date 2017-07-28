const fs = require('fs');
const Transform = require('stream').Transform;

function appendAndRename(metaData) {
  const { newName, originalName, originalPath, newPath } = metaData;
  const isJSON = originalPath.indexOf('.json') > -1;
  const isTxt = originalPath.indexOf('.txt') > -1;

  if (isJSON) {
    return appendMetaToJSON(metaData);
  } else if (isTxt) {
    return appendMetaToTxt(
      metaData,
      // empty string to kickoff first new line
      ['', originalName, originalPath, newName, newPath].join('\n')
    );
  } else {
    return Promise.reject(metaData);
  }
}

function appendMetaToTxt(metaData, appendee) {
  const { originalPath, newPath } = metaData;
  const appendTransform = new Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk);
    },
    flush(callback) {
      this.push(appendee);
      callback();
    }
  });

  return new Promise((resolve, reject) => {
    fs.createReadStream(originalPath)
    .on('error', () => reject(metaData))
    .pipe(appendTransform)
    .on('error', () => reject(metaData))
    .pipe(fs.createWriteStream(newPath))
    .on('error', () => reject(metaData))
    .on('close', () => resolve(metaData));
  });

}

function appendMetaToJSON(metaData) {
  // don't know how to do this with streams :(
  const { originalPath, newPath } = metaData;

  // for testing: ensure that failed files get printed
  // return Promise.reject(metaData);

  return new Promise((resolve, reject) => {
    fs.readFile(originalPath, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(metaData);
      } else {
        try {
          const originalObj = JSON.parse(data);

          fs.writeFile(newPath, JSON.stringify(Object.assign({}, originalObj, metaData)), (writeErr) => {
            if (writeErr) {
              reject(metaData);
            }
            resolve(metaData);
          });
        } catch (jsonParseErr) {
          reject(metaData);
        }
      }
    });
  });
}

module.exports = appendAndRename;
