const fs = require('fs');
const path = require('path');

const DIR_NAME = 'files';
const DIR_PATH = path.join(__dirname, DIR_NAME);
const DIR_COPY_PATH = path.join(__dirname, DIR_NAME + '-copy');

const mkCopyDir = () =>
  fs.mkdir(DIR_COPY_PATH, (err) => {
    if (err) throw err;
  });

fs.access(DIR_COPY_PATH, (err) => {
  if (err && err.code === 'ENOENT') {
    mkCopyDir();
  } else if (err) {
    throw err;
  }

  fs.rm(DIR_COPY_PATH, { recursive: true }, (err) => {
    if (err) throw err;
    mkCopyDir();

    fs.readdir(DIR_PATH, { withFileTypes: true }, (err, list) => {
      if (err) throw err;
      list.forEach((item) => {
        if (item.isDirectory()) return;
        const FILE_PATH = path.join(DIR_PATH, item.name);
        const FILE_COPY_PATH = path.join(DIR_COPY_PATH, item.name);
        const readStream = fs.createReadStream(FILE_PATH);
        const writeStream = fs.createWriteStream(FILE_COPY_PATH);
        readStream.pipe(writeStream);
      });
    });
  });
});
