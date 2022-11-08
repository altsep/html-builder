const fs = require('fs');
const path = require('path');
const stream = require('stream');

const myTransform = new stream.Transform({
  transform(chunk, encoding, callback) {
    /* remove spaces */
    // const data = chunk.toString().replace(/(?<=,|{|;|}|\))\s+/g, '');
    callback(null, /* data */ chunk);
  },
});

const STYLES_DIR = path.join(__dirname, 'styles');

fs.readdir(STYLES_DIR, { withFileTypes: true }, (err, list) => {
  if (err) throw err;
  list.forEach((item) => {
    const ext = path.extname(item.name);
    if (item.isDirectory() || ext !== '.css') return;
    const FILE_PATH = path.join(STYLES_DIR, item.name);
    const readStream = fs.createReadStream(FILE_PATH, { encoding: 'utf8' });
    const OUTPUT_PATH = path.join(__dirname, 'project-dist', 'bundle.css');
    const writeStream = fs.createWriteStream(OUTPUT_PATH);
    readStream.pipe(myTransform).pipe(writeStream);
    // stream.pipeline(readStream, writeStream, (err) => {
    //   if (err) throw err;
    // });
  });
});
