import 'whatwg-fetch';
import { getFetchConfiguration } from '../configureFetch';
import {
  buildRequestPath,
  createInitialFetchState,
  stateKeyFromOptions,
  updateShowStateForOptions,
} from '../helpers/';


function processAddition (modelData, dataManager, options) {
  const idAttribute = options.idAttribute || 'id';
  const id = modelData[idAttribute];
  if (options.invalidate) {
    const stateKey = stateKeyFromOptions(options);
    dataManager.setStateForKey(undefined, stateKey);
  } else {
    if (id) {
      updateShowStateForOptions(dataManager, Object.assign(createInitialFetchState(), {
        data: modelData,
        fetchDate: new Date(),
        isFetching: false,
        status: 200,
      }), options, id);
    }
  }
}

function performRequest (data, dataManager, options) {
  return new Promise((resolve, reject) => {
    const fetchURL = buildRequestPath(options);
    return fetch(fetchURL, Object.assign({}, getFetchConfiguration(), {
      method: 'POST',
      body: JSON.stringify(data),
    })).then((response) => {
      try {
        if (response.ok) {
          let modelData;
          if (response.bodyUsed) {
            modelData = response.json();
          }
          processAddition(modelData || data, dataManager, options);
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

export default function createAction (dataManager, options) {
  return (data) => {
    if (options.performRequest) {
      return performRequest(data, dataManager, options);
    } else {
      processAddition(data, dataManager, options);
    }
  };
}
