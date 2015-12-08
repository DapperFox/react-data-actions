import {
  buildRequestPath,
  stateKeyFromOptions,
  updateShowStateForOptions,
  updateIndexStateForOptions,
} from '../helpers/';

function invalidateAllAction (dataManager, options) {
  return () => {
    const stateKey = stateKeyFromOptions(options);
    dataManager.setStateForKey(undefined, stateKey);
  };
}
function invalidateShowAction (dataManager, options) {
  const idAttribute = options.idAttribute || 'id';
  return (modelData = {}) => {
    const id = modelData[idAttribute] || options[idAttribute];
    return updateShowStateForOptions(dataManager, undefined, options, id);
  };
}
function invalidateIndexAction (dataManager, options) {
  return () => {
    return updateIndexStateForOptions(dataManager, undefined, options);
  };
}

export { invalidateIndexAction, invalidateShowAction, invalidateAllAction };
