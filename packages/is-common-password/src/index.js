const fs = require('fs');
const path = require('path');

module.exports = (password) => {
  const passwords = fs
    .readFileSync(path.resolve(__dirname, './10-million-password-list-top-1000.txt'), 'utf8')
    .split('\n');
  return passwords.includes(password);
};
