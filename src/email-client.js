const nodemailer = require('nodemailer');

module.exports = (() => {
  function send(emailOptions, senderConfig) {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport(senderConfig);

      transporter.sendMail(emailOptions, (err, info) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(info);
        }
      });
    });
  }
  
  return {
    send
  };
})();