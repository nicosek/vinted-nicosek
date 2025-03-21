const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const getPage = (query) => Math.max(1, parseInt(query.page) || 1);
const getLimit = (query) =>
  Math.max(1, Math.min(parseInt(query.limit) || DEFAULT_LIMIT, MAX_LIMIT));

module.exports = { getPage, getLimit };
