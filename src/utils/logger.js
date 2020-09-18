const colors = {
  white: '\x1b[37m%s\x1b[0m',
  blue: '\x1b[36m%s\x1b[0m',
  green: '\x1b[32m%s\x1b[0m',
  red: '\x1b[31m%s\x1b[0m',
  magenta: '\x1b[35m%s\x1b[0m',
};

module.exports = {
  log(...m) {
    console.log(...m);
  },
  title(...m) {
    console.log(colors.magenta, ...m);
  },
  message(...m) {
    console.log(colors.white, ...m);
  },
  info(...m) {
    console.log(colors.blue, ...m);
  },
  success(...m) {
    console.log(colors.green, ...m);
  },
  error(...m) {
    console.error(colors.red, ...m);
  },
  jump() {
    console.log('');
  },
};
