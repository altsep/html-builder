const fs = require('fs');
const path = require('path');

const TEXT = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(TEXT, 'utf8');

readStream.pipe(process.stdout);
