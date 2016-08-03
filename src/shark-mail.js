const program = require('commander');
const fetch = require('./fetch');
const send = require('./send');

program
  .command('fetch')
  .action(fetch)
  .description('fetch new email messages');

program
  .command('send')
  .action(send)
  .description('send all emails in the outbox');

program.parse(process.argv);