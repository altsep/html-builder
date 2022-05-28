const fsPromises = require('fs/promises');
const path = require('path');

const SECRET_FOLDER_PATH = path.join(__dirname, 'secret-folder');

const findRecursively = async (dir) => {
  try {
    const files = await fsPromises.readdir(dir, { withFileTypes: true });
    
    files.forEach(async (item) => {
      const ITEM_PATH = path.join(dir, item.name);
      if (item.isDirectory()) {
        // findRecursively(ITEM_PATH);
        return;
      } else {
        const stats = await fsPromises.stat(ITEM_PATH);
        const ext = path.extname(ITEM_PATH);
        const basename = path.basename(ITEM_PATH, ext);
        const output =
          basename +
          (ext && ' - ' + ext.slice(1)) +
          ' - ' +
          stats.size +
          ' bytes';
        console.log(output);
      }
    });
  } catch (err) {
    if (err) throw err;
  }
};

findRecursively(SECRET_FOLDER_PATH);
