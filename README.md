# LAB-6 | Sprint 2

## :card_index: Sumário

1. [:label: Versões](#label-versões)
2. [:information_source: Introdução](#information_source-introdução)
3. [:fire: Instalação](#fire-instalação)
4. [:busts_in_silhouette: Autores](#busts_in_silhouette-autores)

## :label: Versões

1. [Sprint 2 (v0.2.0)](https://github.com/TheMarini/LAB-6/tree/v0.2.0)
2. [Sprint 1 (v0.1.0)](https://github.com/TheMarini/LAB-6/tree/v0.1.0)
  
## :information_source: Introdução

Nesta segunda entrega do projeto, o objetivo foi o seguinte:

> **Sprint 02:** Paginação (consulta 1000 repositórios) + dados em arquivo .csv
> - Valor: 4 pontos
> - Entrega em 16/09/2020 até às 18:30 no Canvas e no SGA

Tendo isto em vista, foi desenvolvido um _script_ em Node.js que, a partir de um _token_ da API do GitHub, realiza uma busca paginada - da _query_ GraphQL a seguir - enquanto, paralelamente, os resultados são salvos em um arquivo CSV.


```GraphQL
{
  search(query: "stars:>100", type: REPOSITORY, first: 1000) {
   repositoryCount
   pageInfo {
     endCursor
   }
   nodes {
     ... on Repository {
       nameWithOwner
       createdAt
       pushedAt
       stargazers {
         totalCount
       }
       mergedPullRequests: pullRequests(states: MERGED) {
         totalCount
       }
       releases {
         totalCount
       }
       primaryLanguage {
         name
       }
       closedIssues: issues(states: CLOSED) {
         totalCount
       }
       totalIssues: issues {
         totalCount
       }
     }
   }
  }
}
```

**:warning: AVISO:** devido há limitações da API do GitHub, só é possível ter uma boa taxa de sucesso na requisição da _query_ acima se ela for feita de 5 em 5 resultados. Por isto, este é o número máximo de resultados por página configurado no código, necessitando então de 200 requisições no total para se chegar aos 1000 do enunciado.

## :fire: Instalação

1. Instale as dependências:
    ```
    npm install
    ```
2. (Recomendado) Crie a váriável de ambiente `TOKEN` a partir de um arquivo `.env`, na raiz do projeto, com o seguinte conteúdo:
   ```
   TOKEN=seu_token_do_GitHub_API
   ```
   :information_source: Não se preocupe, caso não queira realizar o item acima, poderá informar seu _token_ diretamente na linha de comando.
3. Execute:
    ```
    npm start
    ```
4. Pronto, agora é só esperar e o resultado estará na raiz do projeto com o nome `storage.csv` :heavy_check_mark:

## :busts_in_silhouette: Autores

- [Bruno Marini](https://github.com/TheMarini)


