import queryString from 'query-string';

export default function toQueryString (hash = {}) {
  return queryString.stringify(hash, {arrayFormat: 'bracket'});
}
