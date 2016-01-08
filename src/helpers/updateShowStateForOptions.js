import stateKeyFromOptions from './stateKeyFromOptions';
import existingStateForKey from './existingStateForKey';

export default function updateShowStateForOptions (dataManager, newShowState, options, id, silent = false) {
  const key = stateKeyFromOptions(options);
  const state = existingStateForKey(dataManager, key);
  state.byId[id] = newShowState;
  dataManager.setStateForKey(Object.assign({}, state), key, silent);
}
