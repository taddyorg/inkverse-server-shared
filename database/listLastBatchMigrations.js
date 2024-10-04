const database = require('./index');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

database.raw("SELECT * FROM migrations WHERE batch = (SELECT MAX(batch) FROM migrations)")
.then(data => {
  console.log('Migrations from the last batch:', data.rows); // Adjust for your DB client

  rl.question('Are you sure you want to rollback the migration? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      // Run the rollback
      database.migrate.rollback()
        .then(() => {
          console.log('Rollback completed.');
          rl.close();
          process.exit(0);
        })
        .catch(err => {
          console.error('Error during rollback:', err);
          rl.close();
          process.exit(1);
        });
    } else {
      console.log('Rollback aborted.');
      rl.close();
      process.exit(0);
    }
  });
})
.catch(err => {
  console.error('Error executing query:', err);
  process.exit(1);
});
