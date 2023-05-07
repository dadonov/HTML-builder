const fs = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');
const { stdout } = require('process');


//creating bundle.css
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
fs.writeFile(bundle, '', err => { if (err) throw new Error('Something got wrong') })

async function mergeStyles() {
  const stylesFolder = path.join(__dirname, 'styles');
  const styles = await readdir(stylesFolder, { withFileTypes: true });

  styles.forEach((style) => {
    if (style.isFile() && path.extname(style.name) === ".css") {
      const stylePath = path.join(stylesFolder, style.name);
      const readableStream = fs.createReadStream(stylePath, 'utf-8');

      readableStream.on('data', (chunk) => {
        fs.appendFile(bundle, chunk, () => stdout.write(`Merged data from ${style.name} to bundle.css\n`))
      })
    }
  })
}
// If bundle.css already exists remove it to actualize potential changes
// Otherwise simply merge styles to newly created bundle.css
fs.access(bundle, (error) => {
  if (error) {
    mergeStyles()
  } else {
    fs.rm(bundle, { recursive: true }, () => {
      mergeStyles()
    })
  }
});

