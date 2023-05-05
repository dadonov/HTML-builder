const fs = require('fs');
const { stdout } = require('process');
const path = require('path');

const filePath = path.join(__dirname, "text.txt")
const readStream = fs.createReadStream(filePath, 'utf-8');
readStream.on('data', chunk => stdout.write(chunk));
