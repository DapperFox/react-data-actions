import _ from 'lodash';
import {
  buildCacheKeyFromOptions,
  existingStateForKey,
  stateKeyFromOptions,
  updateIndexStateForOptions,
  updateShowStateForOptions,
  createInitialFetchState,
} from '../helpers/';

export default function appendIndexAction (dataManager, options) {
  const stateKey = stateKeyFromOptions(options);
  return (model, meta = {}) => {
    const idAttribute = options.idAttribute || 'id';
    const id = model[idAttribute];
    const state = existingStateForKey(dataManager, stateKey);
    const whereKey = buildCacheKeyFromOptions(options.where);
    let currentState = state.byWhere[whereKey];
    if (!currentState) {
      currentState = createInitialFetchState();
    }
    const data = currentState.data || [];
    let match = false;
    if (!_.isArray(data)) {
      throw new Error('Existing data is not an array and must be for append');
    }
    let newData = data.slice(0);
    if (id) {
      newData = _.map(data, (datum) => {
        const datumId = datum[idAttribute];
        if (datumId === id) {
          match = true;
          return model;
        } else {
          return datum;
        }
      });
      updateShowStateForOptions(dataManager, {
        data: model,
        isFetching: false,
        hasError: false,
        fetchDate: new Date(),
        status: currentState.status,
        headers: currentState.headers,
      }, options, id, true);
    }
    // i think its okay to be smart here
    // no match, we have a new array, push to it
    if (!match) {
      newData.push(model);
    }
    const newState = Object.assign({}, currentState, meta, {
      data: newData,
    }); // create a newState object too
    updateIndexStateForOptions(dataManager, newState, options);
  };
}
