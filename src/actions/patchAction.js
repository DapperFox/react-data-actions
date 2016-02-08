import 'whatwg-fetch';
import _ from 'lodash';
import { getFetchConfiguration } from '../configureFetch';
import {
  buildRequestPath,
  existingStateForKey,
  stateKeyFromOptions,
} from '../helpers/';

function patchFromWhereCollection (id, idAttribute, patchData, collection) {
  return collection.map((model) => {
    if (model[idAttribute] === id) {
      return Object.assign({}, model, patchData);
    } else {
      return model;
    }
  });
}

function cascadePatch (id, patchData, options, dataManager) {
  const stateKey = stateKeyFromOptions(options);
  const states = existingStateForKey(dataManager, stateKey);
  const idAttribute = options.idAttribute || 'id';
  if (states.byId[id]) {
    const oldModel = states.byId[id].data;
    states.byId[id] = Object.assign({}, states.byId[id], {
      fetchDate: new Date(),
      data: Object.assign({}, oldModel, patchData),
      hasError: false,
      isFetching: false,
      response: 200,
    });
  }
  for (const i in states.byWhere) {
    if (states.byWhere.hasOwnProperty(i)) {
      states.byWhere[i] = Object.assign({}, states.byWhere[i]);// gotta clone this guy, break dat reference.
      if (states.byWhere[i].data && _.isArray(states.byWhere[i].data)) {
        states.byWhere[i].data = patchFromWhereCollection(id, idAttribute, patchData, states.byWhere[i].data);
      }
    }
  }
  dataManager.setStateForKey(Object.assign({}, states), stateKey);
}

function processPatch (id, patchData, options, dataManager) {
  if (!options.invalidate) {
    cascadePatch(id, patchData, options, dataManager);
  } else {
    dataManager.setStateForKey(undefined, stateKeyFromOptions(options));
  }
}


function performRequest (id, patchData, options, dataManager) {
  return new Promise((resolve, reject) => {
    let requestResponse;
    const fetchURL = buildRequestPath(options, id);
    return fetch(fetchURL, Object.assign({}, getFetchConfiguration(), {
      method: 'PATCH',
      body: JSON.stringify(patchData),
    })).then((response) => {
      requestResponse = response;
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
        return patchData;
      }
    }).then((newPatchData) => {
      if (options.waitFor) {
        processPatch(id, newPatchData, options, dataManager);
      }
      resolve(requestResponse, newPatchData);
    }).catch((response) => {
      reject(response);
    });
  });
}

export default function patchAction (dataManager, options) {
  return (patchData) => {
    const idAttribute = options.idAttribute || 'id';
    const id = patchData[idAttribute] || options[idAttribute] || options.id;
    if (!options.waitFor || !options.performRequest) {
      processPatch(id, patchData, options, dataManager);
    }
    if (options.performRequest) {
      return performRequest(id, patchData, options, dataManager);
    }
  };
}
