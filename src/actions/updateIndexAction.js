import {
  buildCacheKeyFromOptions,
  existingStateForKey,
  stateKeyFromOptions,
  updateIndexStateForOptions,
} from '../helpers/';

export default function updateIndexAction (dataManager, options) {
  const stateKey = stateKeyFromOptions(options);
  return (allData, meta = {}) => {
    const state = existingStateForKey(dataManager, stateKey);
    const whereKey = buildCacheKeyFromOptions(options.where);
    const currentState = state.byWhere[whereKey];
    const newState = Object.assign({}, currentState, meta, {
      data: allData,
    });
    updateIndexStateForOptions(dataManager, newState, options);
  };
}
