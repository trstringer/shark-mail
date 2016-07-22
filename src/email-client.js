module.exports = (() => {
  function send(email, options) {
    return new Promise((resolve, reject) => {
      reject(Error('not imlpemented'));
    });
  }
  
  return {
    send
  };
})();