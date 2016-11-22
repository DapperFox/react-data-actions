import 'whatwg-fetch';
import _ from 'lodash';
import { getFetchConfiguration } from '../configureFetch';
import {
  buildRequestPath,
  existingStateForKey,
  stateKeyFromOptions,
} from '../helpers/';


function deleteFromWhereCollection (id, idAttribute, collection) {
  return _.reject(collection, (modelData) => { // this breaks refs too :)
    return modelData && modelData[idAttribute] === id;
  });
}

function cascadeDeletion (id, options, dataManager) {
  const idAttribute = options.idAttribute || 'id';
  const stateKey = stateKeyFromOptions(options);
  const states = existingStateForKey(dataManager, stateKey);
  if (states.byId[id]) {
    delete states.byId[id];
  }
  const keys = Object.keys(states.byWhere);
  keys.forEach((i) => {
    states.byWhere[i] = Object.assign({}, states.byWhere[i]); // gotta clone this guy, break dat reference.
    const whereCollection = states.byWhere[i].data;
    if (whereCollection && _.isArray(whereCollection)) {
      states.byWhere[i].data = deleteFromWhereCollection(id, idAttribute, whereCollection);
    }
  });
  dataManager.setStateForKey(Object.assign({}, states), stateKey);
}

function processDeletion (id, options, dataManager) {
  if (!options.invalidate) {
    cascadeDeletion(id, options, dataManager);
  } else {
    const stateKey = stateKeyFromOptions(options);
    dataManager.setStateForKey(undefined, stateKey);
  }
}

function performRequest (id, options, dataManager) {
  const fetchURL = buildRequestPath(options, id);
  return window.fetch(fetchURL, Object.assign({}, getFetchConfiguration(), {
    method: 'DELETE',
  })).then((response) => {
    if (response.ok) {
      return response;
    } else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }).then((response) => {
    if (response.status !== 204) {
      return response.json();
    } else {
      return {};
    }
  }).then((body) => {
    if (options.waitFor) {
      processDeletion(id, options, dataManager);
    }
    return body;
  });
}

export default function deleteAction (dataManager, options) {
  const idAttribute = options.idAttribute || 'id';
  return (data) => {
    const id = options[idAttribute] || options.id || data[idAttribute];
    if (!options.waitFor || !options.performRequest) {
      processDeletion(id, options, dataManager);
    }
    if (options.performRequest) {
      return performRequest(id, options, dataManager);
    }
    return undefined;
  };
}
