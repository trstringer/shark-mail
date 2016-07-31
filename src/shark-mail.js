const program = require('commander');
const fetch = require('./fetch');

program
  .command('fetch')
  .action(fetch)
  .description('fetch new email messages');

program.parse(process.argv);