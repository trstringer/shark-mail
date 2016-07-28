const fs = require('fs');

module.exports = (() => {
  function unreadInboxEmails() {
    return new Promise((resolve, reject) => {
      reject(Error('not implemented'));
    });
  }

  function pendingOutboxEmails(outboxPath) {
    return new Promise((resolve, reject) => {
      fs.readdir(outboxPath, (err, files) => {
        if (err) {
          reject(err);
        }
        else {
          // we only want to process *.email files
          files = files.filter((file) => /\.email$/.test(file));
          
          const filesContent = files.map((emailFile) => {
            return {
              path: `${outboxPath}/${emailFile}`,
              text: fs.readFileSync(`${outboxPath}/${emailFile}`, 'utf8')
            };
          });

          resolve(filesContent);
        }
      });
    });
  }

  function parseEmailsToBeSent(filesystemEmails) {
    return new Promise((resolve, reject) => {
      try {
        const filesystemEmailsToSend = filesystemEmails.filter((fsEmail) => fsEmail.text[0] !== '*');
        const emailsToSend = filesystemEmailsToSend.map((fsEmail) => {
          const emailLines = fsEmail.text.split('\n');
          return {
            path: fsEmail.path,
            to: emailLines[0],
            subject: emailLines[1],
            text: emailLines.slice(2).join('\n')
          };
        });
        resolve(emailsToSend);
      }
      catch (ex) {
        reject(ex);
      }
    });
  }

  function archiveEmail(email, archivePath) {
    return new Promise((resolve, reject) => {
      fs.rename(email.path, `${archivePath}/${email.path.substring(email.path.lastIndexOf('/') + 1)}`, (err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      });
    });
  }

  function sendAndArchive() {

  }
  
  return {
    unreadInboxEmails,
    pendingOutboxEmails,
    parseEmailsToBeSent,
    archiveEmail,
    sendAndArchive
  };
})();