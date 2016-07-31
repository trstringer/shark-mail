const parseString = require('xml2js').parseString;

function extractMail(parsedMail) {
  const emails = parsedMail.feed.entry;
  const extractedEmails = [];

  for (let i = 0; i < emails.length; i++) {
    extractedEmails.push({
      id: emails[i].id[0],
      author: {
        name: emails[i].author[0].name[0],
        email: emails[i].author[0].email[0]
      },
      subject: emails[i].title,
      body: emails[i].summary
    });
  }

  return extractedEmails;
}

module.exports = (rawMail) => {
  return new Promise((resolve, reject) => {
    parseString(rawMail, (err, result) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(extractMail(result));
      }
    });
  });
};