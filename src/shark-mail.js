const program = require('commander');
const https = require('https');

function display(output) {
  process.stdout.write(`${output}\n`);
}

function getEmail() {
  const emailCredentials = require(`${process.env.HOME}/shark-mail.js`);
  const options = {
    host: "mail.google.com",
    path: "/mail/feed/atom",
    headers: {
      'Authorization': 'Basic ' + new Buffer(emailCredentials.username + ':' + emailCredentials.password).toString('base64')
    }
  };
  https.get(options, (res) => {
    var requestData = '';
    res.on('data', (data) => {
      requestData += data;
    });
    res.on('end', () => {
      // do something with the email data
      display(requestData);
    });
  }).on('error', (err) => display.apply(null, `error :: ${err.message}`));
}

program
  .command('fetch')
  .action(getEmail)
  .description('fetch new email messages');

program.parse(process.argv);