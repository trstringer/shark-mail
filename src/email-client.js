const nodemailer = require('nodemailer');

module.exports = (() => {
  function send(emailOptions, senderConfig) {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport(senderConfig);

      transporter.sendMail(emailOptions, (err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(emailOptions);
        }
      });
    });
  }

  function sendMany(emails, senderConfig) {
    return Promise.all(
      emails.map((emailToSend) => send(emailToSend, senderConfig))
    );
  }
  
  return {
    send,
    sendMany
  };
})();