const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const TEXT_FILE_NAME = 'text.txt';
const TEXT_FILE_PATH = path.join(__dirname, TEXT_FILE_NAME);

const writeStream = fs.createWriteStream(TEXT_FILE_PATH);

const rl = readline.createInterface({ input, output });

console.log('--Please enter text--');

const q = () =>
  rl.question('Waiting for input: ', (answer) => {
    if (answer === 'exit') {
      process.exit();
    }
    writeStream.write(answer);
    console.log(`"${answer}" was written to ${TEXT_FILE_PATH}`);
    return q();
  });
  
q();

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', (code) => {
  console.log(`\n--Program exited with code ${code}--`);
});
