const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'project-dist');

const cleanDir = async (dir) => {
  await fsPromises.rm(dir, { force: true, recursive: true });
  await fsPromises.mkdir(dir, { recursive: true });
};

const makeHtml = async () => {
  const COMPONENTS_DIR = path.join(__dirname, 'components');
  const TEMPLATE = path.join(__dirname, 'template.html');

  let file = await fsPromises.readFile(TEMPLATE, 'utf8');
  const COMPONENT_PLACEHOLDERS = file.match(/{{\w+}}/g);
  COMPONENT_PLACEHOLDERS.forEach(async (c) => {
    const name = c.replace(/\W/g, '');
    const content = await fsPromises.readFile(
      path.join(COMPONENTS_DIR, name + '.html'),
      'utf8'
    );
    file = file.replace(c, content);
    const OUTPUT = path.join(DIST_DIR, 'index.html');
    const writeStream = fs.createWriteStream(OUTPUT);
    writeStream.write(file);
  });
};

const copyFolder = async (dir, outputDir) => {
  const items = await fsPromises.readdir(dir, { withFileTypes: true });

  items.forEach(async (item) => {
    const { name } = item;
    const ITEM_PATH = path.join(dir, name);
    const CURRENT_DIR_NAME = path.basename(path.dirname(ITEM_PATH));
    const OUTPUT_DIR = path.join(outputDir, CURRENT_DIR_NAME);
    const OUTPUT_FILE = path.join(OUTPUT_DIR, name);

    if (item.isDirectory()) {
      copyFolder(ITEM_PATH, OUTPUT_DIR);
      return;
    }

    await fsPromises.mkdir(OUTPUT_DIR, { recursive: true });
    const readStream = fs.createReadStream(ITEM_PATH);
    const writeStream = fs.createWriteStream(OUTPUT_FILE);
    readStream.pipe(writeStream);
  });
};

const makeStyles = async () => {
  const STYLES_DIR = path.join(__dirname, 'styles');

  const items = await fsPromises.readdir(STYLES_DIR, { withFileTypes: true });
  const OUTPUT = path.join(DIST_DIR, 'style.css');
  const writeStream = fs.createWriteStream(OUTPUT);

  items.forEach((item) => {
    const { name } = item;
    const ext = path.extname(name);

    if (item.isDirectory() || ext !== '.css') return;
    
    const FILE = path.join(STYLES_DIR, name);
    const readStream = fs.createReadStream(FILE, {
      encoding: 'utf8',
    });
    readStream.pipe(writeStream);
  });
};

const ASSETS_DIR = path.join(__dirname, 'assets');

const bundleFiles = async (dist, assets) => {
  await cleanDir(dist);
  await makeHtml();
  await makeStyles();
  await copyFolder(assets, dist);
};

bundleFiles(DIST_DIR, ASSETS_DIR);
