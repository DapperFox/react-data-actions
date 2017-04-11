import queryString from 'qs';

export default function toQueryString (hash = {}) {
  return queryString.stringify(hash, {
    arrayFormat: 'brackets',
  });
}
