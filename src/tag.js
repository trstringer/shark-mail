const fs = require('fs');
const config = require('./app-config');

module.exports = (() => {
  

  function testTagExists(tag) {
    return new Promise((resolve, reject) => {
      fs.readFile(config.tagCachePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        }
        else {
          const tags = data.split('\n');
          if (tags.indexOf(tag) > -1) {
            resolve(true);
          }
          else {
            resolve(false);
          }
        }
      });
    });
  }

  function createTagCacheFileIfNotExists() {
    return new Promise((resolve, reject) => {
      fs.access(config.tagCachePath, (err) => {
        if (err) {
          fs.access(config.tagCachePath, (err) => {
            if (err) {
              fs.appendFile(config.tagCachePath, '', (err) => {
                if (err) {
                  reject(err);
                }
                else {
                  resolve();
                }
              });
            }
            else {
              resolve();
            }
          });
        }
        else {
          resolve();
        }
      });
    });
  }

  function addTagToTagCacheFile(tag) {
    return new Promise((resolve, reject) => {
      fs.appendFile(config.tagCachePath, `${tag}\n`, (err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(tag);
        }
      });
    });
  }

  const exists = 
    (tag) => createTagCacheFileIfNotExists().then(() => testTagExists(tag));

  const cache = 
    (tag) => createTagCacheFileIfNotExists().then(() => addTagToTagCacheFile(tag));
  
  return {
    exists,
    cache
  };
})();