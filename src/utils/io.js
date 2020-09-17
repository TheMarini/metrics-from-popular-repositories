const readline = require('readline');

const io = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

module.exports = {
  question(message) {
    io.resume();
    return new Promise((resolve) => {
      io.question(message, (answer) => {
        resolve(answer);
        io.pause();
      });
    });
  },
};
