const { stdout, stdin, exit } = process;
const fs = require('fs');
const path = require('path');

// creating new text.txt file
const filePath = path.join(__dirname, 'text.txt');
fs.writeFile(
  filePath,
  '',
  (err) => {
    if (err) throw new Error('Something got wrong');
  }
);

stdout.write('text.txt has been created\n')
stdout.write('Edit mode on. Press Ctrl-C or enter \'exit\' to exit\n');

stdin.on('data', (data) => {
  const stringifiedData = data.toString();
  if (stringifiedData.trim() === 'exit') {
    stdout.write('Edit mode off\n');
    exit();
  }

  fs.appendFile(filePath,
    stringifiedData,
    () => {
      stdout.write('text.txt has been edited. Continue editing or press Ctrl-C or enter \'exit\' to exit\n');
    });
});

process.on('SIGINT', () => {
  stdout.write('\nEdit mode off\n');
  exit();
})

