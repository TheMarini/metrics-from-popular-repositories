const moment = require('moment');
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
        l.info('Página encontrada. Formatando... ');
        const data = Mine.polish(res.nodes);
        l.info('Salvando...\n');
        Mine.store(data);
        this.current += 1;
      });
    } catch (e) {
      console.error('Erro na requisição: ', e);
      console.log('\nTentando novamente...');
    }
  }

  // eslint-disable-next-line no-unused-vars
  static store(data) {
    // console.log(data);
  }

  static polish(dirt) {
    return dirt.map((repo) => {
      return {
        '<usuário>/<repositório>': repo.nameWithOwner,
        'Nº de estrelas': repo.stargazers.totalCount,
        'Idade (anos)': moment().diff(repo.createdAt, 'years', true).toFixed(2),
        'Data de criação': repo.createdAt,
        'Último push (dias)': moment()
          .diff(repo.pushedAt, 'days', true)
          .toFixed(2),
        'Data do último push': repo.pushedAt,
        'Linguagem principal': repo.primaryLanguage
          ? repo.primaryLanguage.name
          : 'N/A',
        'Nº de PRs aceitas': repo.mergedPullRequests.totalCount,
        'Nº de releases': repo.releases.totalCount,
        'Proporção de issues fechadas': (
          repo.closedIssues.totalCount / repo.totalIssues.totalCount || 0
        ).toFixed(2),
        'Issues fechadas': repo.closedIssues.totalCount,
        'Total de issues': repo.totalIssues.totalCount,
      };
    });
  }
}

module.exports = Mine;
