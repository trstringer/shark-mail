const nodemailer = require('nodemailer');

module.exports = (() => {
  function transform(emailRaw) {
    const emailLines = emailRaw.split('\n');
    
    return {
      to: emailLines.shift(),
      subject: emailLines.shift(),
      text: emailLines.join('\n')
    };
  }

  function sendEmail(emailRaw) {
    return new Promise((resolve, reject) => {
      const senderConfig = require(`${process.env.HOME}/.shark-mail.js`).sender;
      const transporter = nodemailer.createTransport(senderConfig);
      const transformedEmail = transform(emailRaw.data);

      transporter.sendMail(transformedEmail, (err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(emailRaw);
        }
      });
    });
  }

  return {
    send: sendEmail
  };
})();