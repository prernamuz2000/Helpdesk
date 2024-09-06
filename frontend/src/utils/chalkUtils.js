// utils/chalkUtils.js
const chalk = require('chalk');
// Utility functions for colored print
const print = (message, color = 'white') => {
  const coloredMessage = chalk[color](message);
  console.log(coloredMessage);
};
module.exports = {
  printRed: (message) => print(message, 'red'),
  printBlue: (message) => print(message, 'blue'),
  printGreen: (message) => print(message, 'green'),
  printYellow: (message) => print(message, 'yellow'),
  printMagenta: (message) => print(message, 'magenta'),
  printCyan: (message) => print(message, 'cyan'),
  printWhite: (message) => print(message, 'white'),
  printBlack: (message) => print(message, 'black'),
};
