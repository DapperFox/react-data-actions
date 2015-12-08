import stateKeyFromOptions from './stateKeyFromOptions';
import existingStateForKey from './existingStateForKey';
import buildCacheKeyFromOptions from './buildCacheKeyFromOptions';

export default function updateIndexStateForOptions (dataManager, newIndexState, options, silent = false) {
  const stateKey = stateKeyFromOptions(options);
  const state = existingStateForKey(dataManager, stateKey);
  const whereKey = buildCacheKeyFromOptions(options);
  state.byWhere[whereKey] = newIndexState;
  dataManager.setStateForKey(state, stateKey, silent);
}
