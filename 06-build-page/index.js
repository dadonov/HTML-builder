const fs = require('fs').promises;
const path = require('path');

const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const COMPONENTS_DIR = path.join(__dirname, 'components');
const STYLES_DIR = path.join(__dirname, 'styles');
const ASSETS_DIR = path.join(__dirname, 'assets');
const DIST_DIR = path.join(__dirname, 'project-dist');
const DIST_INDEX_HTML = path.join(DIST_DIR, 'index.html');
const DIST_STYLE_CSS = path.join(DIST_DIR, 'style.css');
const DIST_ASSETS_DIR = path.join(DIST_DIR, 'assets');

async function checkDistDirectory() {
  try {
    await fs.access(DIST_DIR);
    await fs.rm(DIST_DIR, { recursive: true });
  } catch (error) {
    // Ignore the error if the directory doesn't exist
  }
  buildPage();
}

checkDistDirectory();

async function buildPage() {
  try {
    // Сreating project-dist
    await fs.mkdir(DIST_DIR);

    // Reading template.html content
    let template = await fs.readFile(TEMPLATE_PATH, 'utf8');
    // Finding all the tags in template.html
    const tagRegex = /{{(.*?)}}/g;
    const tags = [];
    let match;;
    while ((match = tagRegex.exec(template)) !== null) {
      tags.push(match[1]);
    }

    // Substituting tags with components
    for (const tag of tags) {
      const componentPath = path.join(COMPONENTS_DIR, `${tag}.html`);
      const component = await fs.readFile(componentPath, 'utf8');
      template = template.replace(`{{${tag}}}`, component);
    }

    // Writing edited template to the index.html
    await fs.writeFile(DIST_INDEX_HTML, template);

    // Building .css from styles folder
    const styleFiles = await fs.readdir(STYLES_DIR);
    const styles = await Promise.all(styleFiles.map((file) => {
      const filePath = path.join(STYLES_DIR, file);
      return fs.readFile(filePath, 'utf8');
    })
    );

    // Writing built styles to style.css
    const combinedStyles = styles.join('\n');
    await fs.writeFile(DIST_STYLE_CSS, combinedStyles);

    //Copying assets folder
    await copyFolder(ASSETS_DIR, DIST_ASSETS_DIR);

    console.log('Page has been successfully built');
  } catch (err) {
    console.error('Error:', err);
  }
}

async function copyFolder(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const files = await fs.readdir(src);

  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const fileStat = await fs.stat(srcPath);

    if (fileStat.isDirectory()) {
      await copyFolder(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}
