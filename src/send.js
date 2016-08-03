const sendMail = require('./send-mail');
const content = require('./content');
const display = require('./display');

module.exports = () => {
  content.retrieve()
    .then((rawEmails) => {
      return Promise.all(rawEmails.map(sendMail.send))
        .then(content.archive);
    })
    .then((rawEmails) => display(`sent ${rawEmails.length} email(s)`))
    .catch((err) => display(err.message));
};