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

  function getOutboxEmails() {
    return new Promise((resolve, reject) => {
      fs.readdir(config.outboxPath, (err, filenames) => {
        if (err) {
          reject(err);
        }
        else {
          const emailFileNames = filenames.filter((filename) => /\.email$/.test(filename));
          Promise.all(emailFileNames.map((filename) => {
            return new Promise((resolve, reject) => {
              const fullFileName = `${config.outboxPath}/${filename}`;
              fs.readFile(fullFileName, 'utf8', (err, data) => {
                if (err) {
                  reject(err);
                }
                else {
                  resolve({ filename: fullFileName, data });
                }
              });
            });
          })).then(resolve, reject);
        }
      });
    });
  }

  function moveSentEmail(rawEmails) {
    return Promise.all(rawEmails.map((rawEmail) => {
      return new Promise((resolve, reject) => {
        const rawEmailPartialFileName = rawEmail.filename.substring(rawEmail.filename.lastIndexOf('/') + 1);
        const newEmailFullFileName = `${config.archivePath}/${rawEmailPartialFileName}`;

        fs.rename(rawEmail.filename, newEmailFullFileName, (err) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(Object.assign({}, { filename: newEmailFullFileName, data: rawEmail.data }));
          }
        });
      });
    }));
  }
  
  return {
    cache: saveEmailToDisk,
    retrieve: getOutboxEmails,
    archive: moveSentEmail
  };
})();