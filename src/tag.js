const fs = require('fs');

module.exports = (() => {
  const inboxFolder = 'sharkm';
  const inboxPath = `${process.env.HOME}\${inboxFolder}`;
  const tagCachePath = `${inboxPath}\tags`;

  function testTagExists(tag) {
    return new Promise((resolve, reject) => {
      fs.readFile(tagCachePath, (err, data) => {
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
      fs.access(tagCachePath, (err) => {
        if (err) {
          fs.open(tagCachePath, 'a', (err, fd) => {
            if (err) {
              reject(err);
            }
            else {
              fs.close(fd, reject);
              resolve();
            }
          });
        }
      });
    });
  }

  function addTagToTagCacheFile(tag) {
    return new Promise((resolve, reject) => {
      fs.appendFile(tagCachePath, tag, (err) => {
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