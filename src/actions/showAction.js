import 'whatwg-fetch';
import { getFetchConfiguration } from '../configureFetch';
import {
  buildRequestPath,
  createInitialFetchState,
  existingStateForKey,
  headersFromResponse,
  isStateFetching,
  isStateStale,
  stateKeyFromOptions,
  updateShowStateForOptions,
} from '../helpers/';

function processResponseFailure (response, dataManager, options, id) {
  const headers = headersFromResponse(response);
  updateShowStateForOptions(dataManager, {
    data: undefined,
    fetchDate: new Date(),
    hasError: true,
    isFetching: false,
    status: response.status,
    statusText: response.statusText,
    headers,
  }, options, id);
}

async function processResponse (response, dataManager, options, id) {
  if (response.ok) {
    let responseJSON;
    try {
      responseJSON = await response.json();
    } catch (e) {
      processResponseFailure(response, dataManager, options, id);
      return;
    }
    const headers = headersFromResponse(response);
    updateShowStateForOptions(dataManager, {
      data: responseJSON,
      fetchDate: new Date(),
      hasError: false,
      isFetching: false,
      status: response.status,
      headers,
    }, options, id);
  } else {
    processResponseFailure(response, dataManager, options, id);
  }
}

async function processRequestForData (dataManager, options) {
  const id = options[options.idAttribute] || options.id;
  const fetchURL = buildRequestPath(options, id);
  const response = await window.fetch(fetchURL, Object.assign({}, getFetchConfiguration(), {
    method: 'GET',
  }));

  processResponse(response, dataManager, options, id);
}


export default function showAction (dataManager, options) {
  const stateKey = stateKeyFromOptions(options);
  const state = existingStateForKey(dataManager, stateKey);
  const idAttribute = options.idAttribute || 'id';
  const id = options[idAttribute] || options.id;
  let currentState = state.byId[id];
  if (isStateStale(currentState, options) && !isStateFetching(state)) {
    // so its stale or not there, fetch it.
    currentState = createInitialFetchState(currentState);
    updateShowStateForOptions(dataManager, currentState, options, id);
    processRequestForData(dataManager, options);
  }
  return currentState;
}
