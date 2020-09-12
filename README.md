# Laboratório de Experimentação de Software (LAB 6)

Para cada questão a seguir, foi elaborado uma _query_ GraphQL que retorna os atributos necessários para a sua métrica dentro dos **100 repositórios mais populares no GitHub**, de acordo com o número de estrelas.

**Obs.:** múltiplas _queries_ são ótimas porque permitem assincronia, porém, caso queira todos os resultados em uma única requisição, veja o tópico sobre [_query_ única](##-📃-query-única).

## :bookmark_tabs:  Perguntas e _queries_

Os atributos `nameWithOwner` e `url` estão presentes em todas as _queries_ para fácil identificação do repositório.

> **RQ 01: Sistemas populares são maduros/antigos?**
>
> Métrica: idade do repositório (calculado a partir da data de sua criação)

```GraphQL
{
  search(query: "stars:>100", type: REPOSITORY, first: 100) {
    nodes {
      ... on Repository {
        nameWithOwner
        url
        createdAt
      }
    }
  }
}
```

> **RQ 02: Sistemas populares recebem muita contribuição externa?**
>
> Métrica: total de pull requests aceitas

```GraphQL
{
  search(query: "stars:>100", type: REPOSITORY, first: 100) {
    nodes {
      ... on Repository {
        nameWithOwner
        url
        pullRequests(states: MERGED) {
          totalCount
        }
      }
    }
  }
}
```

**:warning: AVISO:** aparentemente, a filtragem dos _pull requests_ aceitos através de `states: MERGED` é uma tarefa muito pesada para uma quantidade grande de repositórios (no caso, 100). É possível solucionar isto simplesmente removendo este filtro ou diminuindo a quantidade de repositórios.

> **RQ 03: Sistemas populares lançam releases com frequência?**
>
> Métrica: total de releases

```GraphQL
{
  search(query: "stars:>100", type: REPOSITORY, first: 100) {
    nodes {
      ... on Repository {
        nameWithOwner
        url
        releases {
          totalCount
        }
      }
    }
  }
}
```

> **RQ 04: Sistemas populares são atualizados com frequência?**
>
> Métrica: tempo até a última atualização (calculado a partir da data de última atualização)

```GraphQL
{
  search(query: "stars:>100", type: REPOSITORY, first: 100) {
    nodes {
      ... on Repository {
        nameWithOwner
        url
        updatedAt
      }
    }
  }
}
```

> **RQ 05: Sistemas populares são escritos nas linguagens mais populares?**
>
> Métrica: linguagem primária de cada um desses repositórios

```GraphQL
{
  search(query: "stars:>100", type: REPOSITORY, first: 100) {
    nodes {
      ... on Repository {
        nameWithOwner
        url
        primaryLanguage {
          name
        }
      }
    }
  }
}
```

> **RQ 06: Sistemas populares possuem um alto percentual de issues fechadas?**
>
> Métrica: razão entre número de issues fechadas pelo total de issues

```GraphQL
{
  search(query: "stars:>100", type: REPOSITORY, first: 100) {
    nodes {
      ... on Repository {
        nameWithOwner
        url
        closed_issues: issues(states: CLOSED) {
          totalCount
        }
        all_issues: issues {
          totalCount
        }
      }
    }
  }
}
```

> **RQ 07 (bônus): Sistemas escritos em linguagens mais populares recebem mais contribuição externa, lançam mais releases e são atualizados com mais frequência?**
>
> Dica: compare os resultados para os sistemas com as linguagens da reportagem com os resultados de sistemas em outras linguagens.

```GraphQL
{
  search(query: "stars:>100", type: REPOSITORY, first: 100) {
    nodes {
      ... on Repository {
        nameWithOwner
        url
        primaryLanguage {
          name
        }
        pullRequests(states: MERGED) {
          totalCount
        }
        releases {
          totalCount
        }
        updatedAt
      }
    }
  }
}
```

**:warning: AVISO:** aparentemente, a filtragem dos _pull requests_ aceitos através de `states: MERGED` é uma tarefa muito pesada para uma quantidade grande de repositórios (no caso, 100). É possível solucionar isto simplesmente removendo este filtro ou diminuindo a quantidade de repositórios.

## :page_with_curl: _Query_ única

A _query_ a seguir é um agupamento de todas as anteriores, possibilitando o retorndo de todos os atributos necessários em uma única requisição. Porém, antente-se que tal método pode tanto prolongar o tempo de resposta quanto a API do GitHub pode negá-la por _timeout_.

```GraphQL
{
  search(query: "stars:>100", type: REPOSITORY, first: 100) {
    nodes {
      ... on Repository {
        nameWithOwner
        url
        createdAt
        updatedAt
        pullRequests(states: MERGED) {
          totalCount
        }
        releases {
          totalCount
        }
        primaryLanguage {
          name
        }
        closed_issues: issues(states: CLOSED) {
          totalCount
        }
        all_issues: issues {
          totalCount
        }
      }
    }
  }
}
```

**:warning: AVISO:** aparentemente, a filtragem dos _pull requests_ aceitos através de `states: MERGED` é uma tarefa muito pesada para uma quantidade grande de repositórios (no caso, 100). É possível solucionar isto simplesmente removendo este filtro ou diminuindo a quantidade de repositórios.

## :checkered_flag: Conclusão

Através do retorno das _queries_, é possível obter todas as métricas necessárias para responder cada questão. Para ser mais preciso, os atributos utilizados para cada uma são:

- **RQ 01:** `createdAt`
- **RQ 02:** `pullRequests.totalCount`
- **RQ 03:** `releases.totalCount`
- **RQ 04:** `updatedAt`
- **RQ 05:** `primaryLanguage.name`
- **RQ 06:** `closed_issues.totalCount` e `all_issues.totalCount`
- **RQ 07:** `primaryLanguage.name`, `pullRequests.totalCount`, `releases.totalCount` e `updatedAt`
