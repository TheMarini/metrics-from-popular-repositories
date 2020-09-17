const Token = require('./utils/token');
const Mine = require('./mine');

class Factory {
  constructor(token, results) {
    this.token = new Token(token);
    this.mine = new Mine(results);
  }

  async start() {
    if (await this.token.check()) {
      this.mine.start(this.token.token);
    }
    return false;
  }
}

module.exports = Factory;
