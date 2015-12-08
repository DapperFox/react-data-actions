export default function existingStateForKey (dataManager, key) {
  let state = dataManager.getStateForKey(key);
  if (!state) {
    state = {
      byId: {},
      byWhere: {},
    };
  }
  return state;
}
