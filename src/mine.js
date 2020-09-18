const moment = require('moment');
const ObjectsToCsv = require('objects-to-csv');
const fetch = require('./utils/fetch');
const l = require('./utils/logger');

class Mine {
  constructor(objective, current = 1) {
    this.objective = objective;
    this.current = current;
    this.cursor = null;
  }

  async start(token) {
    l.title('\n--- Iniciando busca ---');
    const digs = [];
    let tag = `[${this.current}/${this.objective}]`;
    while (this.current <= this.objective) {
      console.log(`${tag} Buscando...`);
      // eslint-disable-next-line no-await-in-loop
      await this.dig(token, tag);
      tag = `[${this.current}/${this.objective}]`;
    }
    await Promise.all(digs);
    l.title('--- Fim da busca ---\n');
    l.info('Veja o resultado em storage.csv :D');
  }

  async dig(token, tag) {
    try {
      await fetch(token, this.cursor).then((res) => {
        this.cursor = res.pageInfo.endCursor || null;
        this.current += 1;
        return Mine.store(Mine.polish(res.nodes, tag), tag);
      });
    } catch (e) {
      l.error(`${tag} Erro na requisição:`, e.message);
      l.info(`${tag} Tentando novamente...`);
    }
  }

  static async store(data, tag) {
    console.log(`${tag} Salvando...`);
    return new ObjectsToCsv(data)
      .toDisk('./storage.csv', { append: true, bom: true })
      .then(() => {
        l.success(`${tag} Salvo em storage.csv`);
      });
  }

  static polish(dirt, tag) {
    console.log(`${tag} Formatando...`);
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
