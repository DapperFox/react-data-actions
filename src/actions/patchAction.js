import 'whatwg-fetch';
import _ from 'lodash';
import { getFetchConfiguration } from '../configureFetch';
import {
  buildRequestPath,
  existingStateForKey,
  stateKeyFromOptions,
} from '../helpers/';

function patchFromWhereCollection (id, idAttribute, patchedData, collection) {
  return collection.map((model) => {
    if (model[idAttribute] === id) {
      return patchedData;
    } else {
      return model;
    }
  });
}

function dataForId (id, options, dataManager) {
  const stateKey = stateKeyFromOptions(options);
  const states = existingStateForKey(dataManager, stateKey);
  if (states.byId[id]) {
    return states.byId[id].data || {};
  }
  return {};
}

function cascadePatch (id, patchedData, options, dataManager) {
  const stateKey = stateKeyFromOptions(options);
  const states = existingStateForKey(dataManager, stateKey);
  const idAttribute = options.idAttribute || 'id';
  if (states.byId[id]) {
    states.byId[id] = Object.assign({}, states.byId[id], {
      fetchDate: new Date(),
      data: patchedData,
      hasError: false,
      isFetching: false,
      response: 200,
    });
  }
  const keys = Object.keys(states.byWhere || {});
  keys.forEach((i) => {
    states.byWhere[i] = Object.assign({}, states.byWhere[i]);// gotta clone this guy, break dat reference.
    if (states.byWhere[i].data && _.isArray(states.byWhere[i].data)) {
      states.byWhere[i].data = patchFromWhereCollection(id, idAttribute, patchedData, states.byWhere[i].data);
    }
  });
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
  const fetchURL = buildRequestPath(options, id);
  return window.fetch(fetchURL, Object.assign({}, getFetchConfiguration(), {
    method: 'PATCH',
    body: JSON.stringify(patchData),
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
      return patchData;
    }
  }).then((properPatchData) => {
    const oldData = dataForId(id, options, dataManager);
    const newPatchData = Object.assign({}, oldData, properPatchData);
    if (options.waitFor) {
      processPatch(id, newPatchData, options, dataManager);
    }
    return newPatchData;
  });
}

export default function patchAction (dataManager, options) {
  return (patchData) => {
    const idAttribute = options.idAttribute || 'id';
    const id = patchData[idAttribute] || options[idAttribute] || options.id;
    if (!options.waitFor || !options.performRequest) {
      const oldData = dataForId(id, options, dataManager);
      const newPatchData = Object.assign({}, oldData, patchData);
      processPatch(id, newPatchData, options, dataManager);
    }
    if (options.performRequest) {
      return performRequest(id, patchData, options, dataManager);
    }
    return undefined;
  };
}
