const fetch = require('./utils/fetch');
const l = require('./utils/logger');

class Mine {
  constructor(objective, current = 1) {
    this.objective = objective;
    this.current = current;
    this.cursor = null;
    this.storage = [];
  }

  async start(token) {
    l.info('\n--- Iniciando busca ---');
    const digs = [];
    while (this.current <= this.objective) {
      console.log(`Buscando... página ${this.current}/${this.objective}`);
      // eslint-disable-next-line no-await-in-loop
      await this.dig(token);
    }
    await Promise.all(digs);
    console.log('Coleta de dados finalizada!\n');
  }

  async dig(token) {
    try {
      await fetch(token, this.cursor).then((res) => {
        this.cursor = res.pageInfo.endCursor || null;
        l.info('Página encontrada. Formatando...\n');
        this.storage.push(Mine.polish(res.nodes));
        this.current += 1;
      });
    } catch (e) {
      console.error('Erro na requisição: ', e);
      console.log('\nTentando novamente...');
    }
  }

  static polish(dirt) {
    return dirt.map((repo) => {
      return {
        '<usuário>/<repositório>': repo.nameWithOwner,
        'Data de criação': repo.createdAt,
        'Data do último push': repo.pushedAt,
        'Nº de estrelas': repo.stargazers.totalCount,
        'Nº de PRs aceitas': repo.mergedPullRequests.totalCount,
        'Nº de releases': repo.releases.totalCount,
        'Linguagem principal': repo.primaryLanguage
          ? repo.primaryLanguage.name
          : 'N/A',
        'Issues fechadas': repo.closedIssues.totalCount,
        'Total de issues': repo.totalIssues.totalCount,
      };
    });
  }
}

module.exports = Mine;
