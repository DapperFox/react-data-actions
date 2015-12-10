import 'whatwg-fetch';
import _ from 'lodash';
import { getFetchConfiguration } from '../configureFetch';
import {
  buildCacheKeyFromOptions,
  buildRequestPath,
  createInitialFetchState,
  existingStateForKey,
  headersFromResponse,
  isStateFetching,
  isStateStale,
  stateKeyFromOptions,
  toQueryString,
  updateIndexStateForOptions,
  updateShowStateForOptions,
} from '../helpers/';

function processResponseFailure (response, dataManager, options) {
  const headers = headersFromResponse(response);
  updateIndexStateForOptions(dataManager, {
    data: undefined,
    isFetching: false,
    hasError: true,
    fetchDate: new Date(),
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  }, options);
}

async function processResponse (response, dataManager, options) {
  try {
    const responseJSON = await response.json();
    if (response.ok) {
      const headers = headersFromResponse(response);
      if (_.isArray(responseJSON)) {
        responseJSON.forEach((mo) => {
          const id = mo[options.idAttribute || 'id'];
          if (id) {
            updateShowStateForOptions(dataManager, {
              data: mo,
              isFetching: false,
              hasError: false,
              fetchDate: new Date(),
              status: response.status,
              headers: headers,
            }, options, id, true);
          }
        });
      }
      updateIndexStateForOptions(dataManager, {
        data: responseJSON,
        isFetching: false,
        hasError: false,
        fetchDate: new Date(),
        status: response.status,
        headers: headers,
      }, options);
    } else {
      processResponseFailure(response, dataManager, options);
    }
  } catch (e) {
    processResponseFailure(response, dataManager, options);
  }
}

async function processRequestForData (dataManager, options) {
  let fetchURL = buildRequestPath(options);
  if (options.where) {
    fetchURL = `${fetchURL}?${toQueryString(options.where)}`;
  }
  const response = await fetch(fetchURL, Object.assign({}, getFetchConfiguration(), {
    method: 'GET',
  }));
  processResponse(response, dataManager, options);
}

export default function indexAction (dataManager, options) {
  const stateKey = stateKeyFromOptions(options);
  const state = existingStateForKey(dataManager, stateKey);
  const whereKey = buildCacheKeyFromOptions(options);
  let currentState = state.byWhere[whereKey];
  if (isStateStale(currentState, options) && !isStateFetching(state)) {
    // so its stale or not there, fetch it.
    currentState = createInitialFetchState(currentState);
    updateIndexStateForOptions(dataManager, currentState, options);
    processRequestForData(dataManager, options, currentState); // this returns a new state
  }
  return currentState;
}
