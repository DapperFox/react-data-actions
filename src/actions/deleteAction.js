import 'whatwg-fetch';
import _ from 'lodash';
import { getFetchConfiguration } from '../configureFetch';
import {
  buildRequestPath,
  existingStateForKey,
  stateKeyFromOptions,
} from '../helpers/';


function deleteFromWhereCollection (id, idAttribute, collection) {
  return _.reject(collection, (modelData) => {// this breaks refs too :)
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
  for (const i in states.byWhere) {
    if (states.byWhere.hasOwnProperty(i)) {
      states.byWhere[i] = Object.assign({}, states.byWhere[i]); // gotta clone this guy, break dat reference.
      const whereCollection = states.byWhere[i].data;
      if (whereCollection && _.isArray(whereCollection)) {
        states.byWhere[i].data = deleteFromWhereCollection(id, idAttribute, whereCollection);
      }
    }
  }
  dataManager.setStateForKey(states, stateKey);
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
  return fetch(fetchURL, Object.assign({}, getFetchConfiguration(), {
    method: 'DELETE',
  })).then((response) => {
    if (response.ok) {
      if (options.waitFor) {
        processDeletion(id, options, dataManager);
      }
    }
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
  };
}
