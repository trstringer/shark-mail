const config = require('./app-config');
const fs = require('fs');

module.exports = (() => {
  function flattenEmail(email) {
    let flattenedEmail = '';
    flattenedEmail += `${new Date(email.created).toString()}\n`;
    flattenedEmail += `${email.author.name} <${email.author.email}>\n\n`;
    flattenedEmail += `${email.subject}\n\n`;
    flattenedEmail += `${email.body}\n`;

    return flattenedEmail;
  }

  function generateEmailFileName(email) {
    return `${email.author.name.split(' ').join('-')}.${email.id.substring(email.id.lastIndexOf(':') + 1)}.email`;
  }
  
  function saveEmailToDisk(email) {
    return new Promise((resolve, reject) => {
      const flattenedEmail = flattenEmail(email);
      const emailFileName = `${config.inboxPath}/${generateEmailFileName(email)}`;

      fs.writeFile(emailFileName, flattenedEmail, (err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(email);
        }
      });
    });
  }
  
  return {
    cache: saveEmailToDisk
  };
})();