const fetch = require('./utils/fetch');
const l = require('./utils/logger');

class Mine {
  constructor(objective, current = 1) {
    this.objective = objective;
    this.current = current;
    this.cursor = null;
  }

  async start(token) {
    l.info('\n--- Iniciando busca ---');
    const digs = [];
    while (this.current <= this.objective) {
      console.log(`Buscando... página ${this.current}/${this.objective}\n`);
      // eslint-disable-next-line no-await-in-loop
      await this.dig(token);
    }
    await Promise.all(digs);
    console.log('\nColeta de dados finalizada!\n');
  }

  async dig(token) {
    try {
      await fetch(token, this.cursor).then((res) => {
        console.log(res);
        this.cursor = res.pageInfo.endCursor || null;
        this.current += 1;
      });
    } catch (e) {
      console.error('Erro na requisição: ', e);
      console.log('\nTentando novamente...');
    }
  }
}

module.exports = Mine;
