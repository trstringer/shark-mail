const display = require('./display');
const https = require('https');
const parse = require('./parse');
const tag = require('./tag');
const content = require('./content');

module.exports = () => {
  const mailConfig = require(`${process.env.HOME}/.shark-mail.js`);
  const options = {
    host: "mail.google.com",
    path: "/mail/feed/atom",
    headers: {
      'Authorization': 'Basic ' + new Buffer(mailConfig.cred.username + ':' + mailConfig.cred.password).toString('base64')
    }
  };
  https.get(options, (res) => {
    var requestData = '';
    res.on('data', (data) => {
      requestData += data;
    });
    res.on('end', () => {
      // do something with the email data
      parse(requestData)
        .then((emails) => {
          let newEmailCount = 0;
          for (let i = 0; i < emails.length; i++) {
            tag.exists(emails[i].id)
              .then((exists) => {
                if (exists) {
                  display(`tag ${emails[i].id} exists in cache`);
                }
                else {
                  display(`tag ${emails[i].id} does not exist, caching now...`);
                  newEmailCount++;
                  return content.cache(emails[i]);
                }
              })
              .then((email) => {
                if (email) {
                  display(`cached ${email.id}`);
                  return tag.cache(email.id);
                }
              })
              .then(() => {
                if (i === emails.length - 1) {
                  display(`new email(s) received :: ${newEmailCount}`);
                }
              })
              .catch((err) => display(err.message));
          }
        });
    });
  }).on('error', (err) => display.apply(null, `error :: ${err.message}`));
};