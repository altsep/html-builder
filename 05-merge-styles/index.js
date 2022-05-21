const fs = require('fs');
const path = require('path');
const stream = require('stream');

const myTransform = new stream.Transform({
  transform(chunk, encoding, callback) {
    // /* remove spaces */
    // const data = chunk.toString().replace(/(?<=,|{|;|}|\))\s+/g, '');
    callback(null, /* data */ chunk);
  },
});

const STYLES_DIR = path.join(__dirname, 'styles');

fs.readdir(STYLES_DIR, { withFileTypes: true }, (err, list) => {
  if (err) throw err;
  const OUTPUT = path.join(__dirname, 'project-dist', 'bundle.css');
  const writeStream = fs.createWriteStream(OUTPUT);
  list.forEach((item) => {
    const ext = path.extname(item.name);
    if (item.isDirectory() || ext !== '.css') return;
    const FILE = path.join(STYLES_DIR, item.name);
    const readStream = fs.createReadStream(FILE, { encoding: 'utf8' });
    readStream.pipe(myTransform).pipe(writeStream);
  });
});
