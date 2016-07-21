const fs = require('fs');

module.exports = (() => {
  const configFilename = '.shark_mail';

  function getHomeDirectory() {
    if (process.platform === 'win32') {
      return process.env.USERPROFILE;
    }
    else {
      return process.env.HOME;
    }
  }

  function configFileExists() {
    return new Promise((resolve, reject) => {
      fs.access(`${getHomeDirectory()}/${configFilename}`, (err) => {
        err ? resolve(false) : resolve(true);
      });
    });
  }

  function copyBaseConfig() {
    return new Promise((resolve, reject) => {
      const reader = fs.createReadStream(`${__dirname}/config.base.json`);
      const writer = fs.createWriteStream(`${getHomeDirectory()}/${configFilename}`);

      reader.on('error', reject);
      writer
        .on('error', reject)
        .on('close', resolve);

      reader.pipe(writer);
    });
  }

  function getConfigFileObject() {
    return new Promise((resolve, reject) => {
      fs.readFile(`${getHomeDirectory()}/${configFilename}`, (err, data) => {
        if (err) {
          reject(err);
        }
        else {
          try {
            const dataJson = JSON.parse(data);
            resolve(dataJson);
          }
          catch (ex) {
            reject(ex);
          }
        }
      });
    });
  }

  function getConfiguration() {
    return new Promise((resolve, reject) => {
      configFileExists()
        .then((exists) => {
          if(!exists) {
            return copyBaseConfig();
          }
        })
        .then(() => {
          return getConfigFileObject();
        })
        .then(resolve)
        .catch(reject);
    });
  }
  
  return {
    getConfiguration
  };
})();