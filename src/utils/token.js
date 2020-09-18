const {
  validateGitHubToken,
  ValidationError,
} = require('validate-github-token');
const io = require('./io');
const l = require('./logger');

class Token {
  constructor(token) {
    this.token = token;
  }

  async set() {
    this.token = await io.question('Digite seu token: ');
  }

  async validate(token = this.token) {
    try {
      const validated = await validateGitHubToken(token);

      l.success('\nToken válido :D');
      l.info(
        'Nº de requisições restantes a API:',
        validated.rateLimit.remaining
      );

      return true;
    } catch (err) {
      if (err instanceof ValidationError) {
        l.jump();
        l.error(err.message);
        l.jump();
      } else throw err;
    }

    return false;
  }

  async validateLoop() {
    let isValid = await this.validate();
    while (!isValid) {
      l.error(
        'Token inválido, tente novamente digitando-o ou alterando a variável de ambiente TOKEN'
      );

      // eslint-disable-next-line no-await-in-loop
      await this.set();
      // eslint-disable-next-line no-await-in-loop
      isValid = await this.validate();
    }
  }

  async check() {
    l.title('\n--- Configuração ---');
    if (this.token) {
      l.info('Variável de ambiente TOKEN encontrada');
      l.log('Validando TOKEN...');
    } else {
      l.error('Não foi possível identificar a variável de ambiente TOKEN');
      await this.set();
    }
    await this.validateLoop();
    return true;
  }
}

module.exports = Token;
