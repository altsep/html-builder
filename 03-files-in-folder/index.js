const fs = require('fs');
const path = require('path');

const SECRET_FOLDER_PATH = path.join(__dirname, 'secret-folder');

const f = (dir) => {
  let result = [];
  fs.readdir(
    dir,
    {
      withFileTypes: true,
    },
    (err, list) => {
      if (err) {
        throw new Error(err);
      }
      list.forEach((item) => {
        const ITEM_PATH = path.join(dir, item.name);
        if (item.isDirectory()) {
          // make function recursive
          // f(ITEM_PATH);
          return;
        } else {
          fs.stat(ITEM_PATH, (err, stats) => {
            if (err) {
              throw new Error(err);
            } else {
              const ext = path.extname(ITEM_PATH);
              const basename = path.basename(ITEM_PATH, ext);
              console.log(
                basename + (ext && ' - ' + ext.replace('.', '')) + ' - ' + stats.size + ' bytes'
              );
              result.push(item.name);
            }
          });
        }
      });
    }
  );
};

f(SECRET_FOLDER_PATH);
