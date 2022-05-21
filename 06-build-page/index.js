const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'project-dist');

fs.mkdir(DIST_DIR, { recursive: true }, (err) => {
  if (err) throw err;

  const COMPONENTS_DIR = path.join(__dirname, 'components');
  const TEMPLATE = path.join(__dirname, 'template.html');

  fs.readFile(TEMPLATE, 'utf8', (err, data) => {
    if (err) throw err;
    const COMPONENT_PLACEHOLDERS = data.match(/{{\w+}}/g);
    COMPONENT_PLACEHOLDERS.forEach((c) => {
      const name = c.replace(/\W/g, '');
      fs.readFile(
        path.join(COMPONENTS_DIR, name + '.html'),
        'utf8',
        (err, cData) => {
          if (err) throw err;
          data = data.replace(c, cData);
          const OUTPUT = path.join(DIST_DIR, 'index.html');
          const writeStream = fs.createWriteStream(OUTPUT);
          writeStream.write(data);
        }
      );
    });

    const STYLES_DIR = path.join(__dirname, 'styles');

    fs.readdir(STYLES_DIR, { withFileTypes: true }, (err, list) => {
      if (err) throw err;
      const OUTPUT = path.join(DIST_DIR, 'style.css');
      const writeStream = fs.createWriteStream(OUTPUT);
      list.forEach((item) => {
        const { name } = item;
        const ext = path.extname(name);
        if (item.isDirectory() || ext !== '.css') return;
        const FILE = path.join(STYLES_DIR, name);
        const readStream = fs.createReadStream(FILE, { encoding: 'utf8' });
        readStream.pipe(writeStream);
      });
    });

    const ASSETS_DIR = path.join(__dirname, 'assets');

    copyFolder(ASSETS_DIR, DIST_DIR);
  });
});

const copyFolder = (dir, outputDir) => {
  fs.readdir(dir, { withFileTypes: true }, (err, list) => {
    if (err) throw err;
    list.forEach((item) => {
      const { name } = item;
      const ITEM_PATH = path.join(dir, name);
      const CURRENT_DIR_NAME = path.basename(path.dirname(ITEM_PATH));
      const OUTPUT_DIR = path.join(outputDir, CURRENT_DIR_NAME);
      const OUTPUT_FILE = path.join(OUTPUT_DIR, name);
      if (item.isDirectory()) {
        copyFolder(ITEM_PATH, OUTPUT_DIR);
        return;
      }
      fs.mkdir(OUTPUT_DIR, { recursive: true }, (err) => {
        if (err) throw err;
        const readStream = fs.createReadStream(ITEM_PATH);
        const writeStream = fs.createWriteStream(OUTPUT_FILE);
        readStream.pipe(writeStream);
      });
    });
  });
};
