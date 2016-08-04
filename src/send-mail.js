const nodemailer = require('nodemailer');

module.exports = (() => {
  function transform(emailRaw) {
    const emailLines = emailRaw.split('\n');
    const rawRecipient = emailLines.shift();
    const recipient = interpretRecipient(rawRecipient);

    if (!recipient) {
      throw Error(`recipient '${rawRecipient}' not found in address book`);
    }
    
    return {
      to: recipient,
      subject: emailLines.shift(),
      text: emailLines.join('\n')
    };
  }

  function interpretRecipient(recipient) {
    // if the recipient is an email address, just return that
    // otherwise we need to do an address book lookup
    const emailAddressPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailAddressPattern.test(recipient) ? 
      recipient : lookupAddressBookEmailAddress(recipient);
  }

  function lookupAddressBookEmailAddress(name) {
    const addressBook = require(`${process.env.HOME}/.shark-mail.js`).addressBook;

    const foundItems = addressBook.filter(
      (entry) => entry.name.toLowerCase() === name.toLowerCase());

    if (foundItems && foundItems.length > 0) {
      return foundItems[0].email;
    }
    else {
      return null;
    }
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