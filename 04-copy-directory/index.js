
const fs = require('fs');
const path = require('path');
const { mkdir, copyFile, readdir } = require('node:fs/promises');
const { stdout } = require('process');

const src = path.join(__dirname, 'files')
const dest = path.join(__dirname, 'files-copy');

async function copyDir() {
  const copy = await mkdir(dest, { recursive: false });
  const files = await readdir(src);

  files.forEach((file) => {
    copyFile(path.join(src, file), path.join(dest, file));
  })
}

//if a copy exists, delete it and create again. otherwise simply create a copy
fs.access(dest, (error) => {
  if (error) {
    copyDir()
    stdout.write('Copy of folder has been created');
  } else {
    fs.rm(dest, { recursive: true }, () => {
      copyDir()
      stdout.write('Copy of folder has been actualized');
    })
  }
});
