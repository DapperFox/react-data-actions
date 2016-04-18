import stateKeyFromOptions from './stateKeyFromOptions';
import existingStateForKey from './existingStateForKey';

export default function updateShowStateForOptions (dataManager, newShowState, options, id, silent = false) {
  const key = stateKeyFromOptions(options);
  const state = existingStateForKey(dataManager, key);
  // treat as byId as immutable
  const byId = Object.assign({}, state.byId || {}, {
    [id]: newShowState,
  });
  // treat state is immutable, lets make a new copy
  const newState = Object.assign({}, state || {}, {
    byId,
  });
  dataManager.setStateForKey(newState, key, silent);
}
