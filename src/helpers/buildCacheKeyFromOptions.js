import _ from 'lodash';

export default function buildCacheKeyFromOptions (options = {}) {
  const keys = _.keys(options).sort();
  return JSON.stringify(_.zipObject(keys, keys.map((key) => {
    return options[key];
  })));
}
