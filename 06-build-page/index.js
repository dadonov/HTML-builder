const { access, rm, mkdir, readFile, writeFile, readdir, stat, copyFile } = require('node:fs/promises');
const { join } = require('path');

const TEMPLATE_PATH = join(__dirname, 'template.html');
const COMPONENTS_DIR = join(__dirname, 'components');
const STYLES_DIR = join(__dirname, 'styles');
const ASSETS_DIR = join(__dirname, 'assets');
const DIST_DIR = join(__dirname, 'project-dist');
const DIST_INDEX_HTML = join(DIST_DIR, 'index.html');
const DIST_STYLE_CSS = join(DIST_DIR, 'style.css');
const DIST_ASSETS_DIR = join(DIST_DIR, 'assets');

async function checkDistDirectory() {
  try {
    await access(DIST_DIR);
    await rm(DIST_DIR, { recursive: true });
  } catch (error) {
    // Ignore the error if the directory doesn't exist
  }
  buildPage();
}

checkDistDirectory();

async function buildPage() {
  try {
    // Сreating project-dist
    await mkdir(DIST_DIR);

    // Reading template.html content
    let template = await readFile(TEMPLATE_PATH, 'utf8');
    // Finding all the tags in template.html
    const tagRegex = /{{(.*?)}}/g;
    const tags = Array.from(template.matchAll(tagRegex), match => match[1]);

    // Substituting tags with components
    for (const tag of tags) {
      const componentPath = join(COMPONENTS_DIR, `${tag}.html`);
      const component = await readFile(componentPath, 'utf8');
      template = template.replace(`{{${tag}}}`, component);
    }

    // Writing edited template to the index.html
    await writeFile(DIST_INDEX_HTML, template);

    // Building .css from styles folder
    const styleFiles = await readdir(STYLES_DIR);
    const stylePromises = styleFiles.map((file) => {
      const filePath = join(STYLES_DIR, file);
      return readFile(filePath, 'utf8');
    });
    const styles = await Promise.all(stylePromises);

    // Writing built styles to style.css
    const combinedStyles = styles.join('\n');
    await writeFile(DIST_STYLE_CSS, combinedStyles);

    //Copying assets folder
    await copyFolder(ASSETS_DIR, DIST_ASSETS_DIR);

    console.log('Page has been successfully built');
  } catch (err) {
    console.error('Error:', err);
  }
}

async function copyFolder(src, dest) {
  await mkdir(dest, { recursive: true });
  const files = await readdir(src);

  for (const file of files) {
    const srcPath = join(src, file);
    const destPath = join(dest, file);
    const fileStat = await stat(srcPath);

    if (fileStat.isDirectory()) {
      await copyFolder(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}
