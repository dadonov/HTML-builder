const { stdout } = process;
const { stat } = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');


async function readFiles() {
  const folderPath = path.join(__dirname, 'secret-folder');
  const files = await readdir(folderPath, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isFile()) {
      stat(path.join(folderPath, file.name),
        (_, stats) => {
          const fileName = file.name.split(".")[0];
          const fileExtension = path.extname(file.name).slice(1);
          const fileSize = stats.size;

          stdout.write(`${fileName} - ${fileExtension} - ${fileSize} bytes\n`)
        })
    }
  });
}
readFiles()
