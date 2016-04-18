import stateKeyFromOptions from './stateKeyFromOptions';
import existingStateForKey from './existingStateForKey';
import buildCacheKeyFromOptions from './buildCacheKeyFromOptions';

export default function updateIndexStateForOptions (dataManager, newIndexState, options, silent = false) {
  const stateKey = stateKeyFromOptions(options);
  const state = existingStateForKey(dataManager, stateKey);
  const whereKey = buildCacheKeyFromOptions(options.where);
  // treat the state as immutable
  const byWhere = Object.assign({}, state.byWhere || {}, {
    [whereKey]: newIndexState,
  });
  const newState = Object.assign({}, state || {}, {
    byWhere,
  });
  dataManager.setStateForKey(newState, stateKey, silent);
}
