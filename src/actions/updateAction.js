import 'whatwg-fetch';
import _ from 'lodash';
import { getFetchConfiguration } from '../configureFetch';
import {
  buildRequestPath,
  existingStateForKey,
  stateKeyFromOptions,
} from '../helpers/';

function updateFromWhereCollection (id, idAttribute, modelData, collection) {
  return collection.map((model) => {
    if (model[idAttribute] === id) {
      return modelData;
    } else {
      return model;
    }
  });
}

function cascadeUpdate (id, modelData, options, dataManager) {
  const stateKey = stateKeyFromOptions(options);
  const states = existingStateForKey(dataManager, stateKey);
  const idAttribute = options.idAttribute || 'id';
  if (states.byId[id]) {
    states.byId[id] = Object.assign({}, states.byId[id], {
      fetchDate: new Date(),
      data: modelData,
      hasError: false,
      isFetching: false,
      response: 200,
    });
  }
  for (const i in states.byWhere) {
    if (states.byWhere.hasOwnProperty(i)) {
      states.byWhere[i] = Object.assign({}, states.byWhere[i]);// gotta clone this guy, break dat reference.
      if (states.byWhere[i].data && _.isArray(states.byWhere[i].data)) {
        states.byWhere[i].data = updateFromWhereCollection(id, idAttribute, modelData, states.byWhere[i].data);
      }
    }
  }
  dataManager.setStateForKey(Object.assign({}, states), stateKey);
}

function processUpdate (id, modelData, options, dataManager) {
  if (!options.invalidate) {
    cascadeUpdate(id, modelData, options, dataManager);
  } else {
    dataManager.setStateForKey(undefined, stateKeyFromOptions(options));
  }
}

function performRequest (id, modelData, options, dataManager) {
  return new Promise((resolve, reject) => {
    const fetchURL = buildRequestPath(options, id);
    return fetch(fetchURL, Object.assign({}, getFetchConfiguration(), {
      method: 'PUT',
      body: JSON.stringify(modelData),
    })).then((response) => {
      try {
        if (response.ok) {
          const newModelData = response.json();
          if (options.waitFor) {
            processUpdate(id, newModelData || modelData, options, dataManager);
          }
          resolve(response, modelData);
        } else {
          reject(response);
        }
      } catch (e) {
        reject(response);
      }
    }).catch((response) => {
      reject(response);
    });
  });
}

export default function updateAction (dataManager, options) {
  return (modelData) => {
    const idAttribute = options.idAttribute || 'id';
    const id = modelData[idAttribute] || options[idAttribute] || options.id;
    if (!options.waitFor || !options.performRequest) {
      processUpdate(id, modelData, options, dataManager);
    }
    if (options.performRequest) {
      return performRequest(id, modelData, options, dataManager);
    }
  };
}
