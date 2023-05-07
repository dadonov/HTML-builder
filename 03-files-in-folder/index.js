const { stdout } = process;
const { stat } = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const folderPath = path.join(__dirname, 'secret-folder');

function convertToKb(bytes) {
  const kiloBytes = (bytes / 1000).toFixed(3);
  return `${kiloBytes}kb`
}

async function readFiles() {
  const files = await readdir(folderPath, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isFile()) {
      stat(path.join(folderPath, file.name),
        (_, stats) => {
          const fileName = file.name.split(".")[0];
          const fileExtension = path.extname(file.name).slice(1);
          const fileSize = stats.size;

          stdout.write(`${fileName} - ${fileExtension} - ${convertToKb(fileSize)}\n`)
        })
    }
  });
}
readFiles()
