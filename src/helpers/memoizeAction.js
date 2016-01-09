import _ from 'lodash';

function dataManagerMemoizeResolver (dataManager) {
  return dataManager.uniqueId;
}

export default function memoizeAction (func) {
  return _.memoize(func, dataManagerMemoizeResolver);
}
