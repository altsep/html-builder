const fs = require('fs');
const path = require('path');

const TEXT_PATH = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(TEXT_PATH);

readStream.pipe(process.stdout);
