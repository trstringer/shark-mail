const config = require('./app-config');

module.exports = (() => {
  function flattenEmail(email) {
    return new Promise((resolve, reject) => {

    });
  }
  
  function saveEmailToDisk(email) {
    return new Promise((resolve, reject) => {

    });
  }

  const cache = (email) => flattenEmail(email).then(saveEmailToDisk);
  
  return {
    cache
  };
})();