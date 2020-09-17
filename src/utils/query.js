module.exports = (cursor) => {
  const after = cursor ? `, after: "${cursor}"` : '';

  return `
  {
    search(type: REPOSITORY, query: "stars:>100", first: 10${after}) {
      pageInfo{
        endCursor
      }
      nodes {
        ... on Repository {
          nameWithOwner
          url
          createdAt
          updatedAt
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
  `;
};
