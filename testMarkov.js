const fs = require('fs');
const { MarkovMachine } = require('./markov');

fs.readFile('sample.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    process.exit(1);
  }

  let mm = new MarkovMachine(data);
  console.log(mm.makeText());
  console.log(mm.makeText(50));
});
