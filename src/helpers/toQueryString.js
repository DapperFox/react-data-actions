import _ from 'lodash';
export default function toQueryString (hash = {}) {
  return _.map(hash, (value, key) => {
    if (_.isArray(value)) {
      return _.map(value, (sub) => {
        return `${encodeURIComponent(key)}[]=${encodeURIComponent(sub)}`;
      }).join('&');
    } else {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
  }).join('&');
}
