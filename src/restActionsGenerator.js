import 'whatwg-fetch';
import {
  indexAction,
  showAction,
  deleteAction,
  patchAction,
  updateAction,
  createAction,
  invalidateAllAction,
  invalidateIndexAction,
  invalidateShowAction,
  updateIndexAction,
  appendIndexAction,
} from './actions/';

import {
  memoizeAction,
} from './helpers/';

class RestActionsGeneratorGenerator {
  constructor (o) {
    this.generatedFunctions = {};
    this.isBatchProcessing = false;
    this.config = Object.assign({
      waitFor: true,
      performRequest: true,
    }, o || {}); // why clone? cause of the where clause object!
  }

  generatedFunctionsKeysFromOptions (name, options) {
    const key = JSON.stringify(options);
    return `${name}::${key}`;
  }

  cacheGeneratorFunction (key, options, generator) {
    const generatedFunctionsKey = this.generatedFunctionsKeysFromOptions(key, options);
    let fn = this.generatedFunctions[generatedFunctionsKey];
    if (!fn) {
      fn = generator();
      this.generatedFunctions[generatedFunctionsKey] = fn;
    }
    return fn;
  }

  indexAction (o) {
    const options = this.mergeOptions(o);
    return this.cacheGeneratorFunction('index', options, () => {
      return (dataManager) => {
        return indexAction(dataManager, options);
      };
    });
  }

  showAction (o) {
    const options = this.mergeOptions(o);
    return this.cacheGeneratorFunction('show', options, () => {
      return (dataManager) => {
        return showAction(dataManager, options);
      };
    });
  }

  createAction (o) {
    const options = this.mergeOptions(o);
    return this.cacheGeneratorFunction('create', options, () => {
      return memoizeAction((dataManager) => {
        return createAction(dataManager, options);
      });
    });
  }

  deleteAction (o) {
    const options = this.mergeOptions(o);
    return this.cacheGeneratorFunction('delete', options, () => {
      return memoizeAction((dataManager) => {
        return deleteAction(dataManager, options);
      });
    });
  }

  patchAction (o) {
    const options = this.mergeOptions(o);
    return this.cacheGeneratorFunction('patch', options, () => {
      return memoizeAction((dataManager) => {
        return patchAction(dataManager, options);
      });
    });
  }

  updateAction (o) {
    const options = this.mergeOptions(o);
    return this.cacheGeneratorFunction('update', options, () => {
      return memoizeAction((dataManager) => {
        return updateAction(dataManager, options);
      });
    });
  }

  updateIndexAction (o) {
    const options = this.mergeOptions(o);
    return this.cacheGeneratorFunction('update', options, () => {
      return memoizeAction((dataManager) => {
        return updateIndexAction(dataManager, options);
      });
    });
  }

  appendIndexAction (o) {
    const options = this.mergeOptions(o);
    return this.cacheGeneratorFunction('update', options, () => {
      return memoizeAction((dataManager) => {
        return appendIndexAction(dataManager, options);
      });
    });
  }

  invalidateShowAction (o) {
    const options = this.mergeOptions(o);
    return this.cacheGeneratorFunction('invalidateShow', options, () => {
      return memoizeAction((dataManager) => {
        return invalidateShowAction(dataManager, options);
      });
    });
  }

  invalidateIndexAction (o) {
    const options = this.mergeOptions(o);
    return this.cacheGeneratorFunction('invalidateIndex', options, () => {
      return memoizeAction((dataManager) => {
        return invalidateIndexAction(dataManager, options);
      });
    });
  }

  invalidateAllAction (o) {
    const options = this.mergeOptions(o);
    return this.cacheGeneratorFunction('invalidateAll', options, () => {
      return memoizeAction((dataManager) => {
        return invalidateAllAction(dataManager, options);
      });
    });
  }

  /* HELPERS */
  mergeOptions (o) {
    return Object.assign({}, this.config, o || {});
  }
}

export default function restActionsGenerator (config) {
  return new RestActionsGeneratorGenerator(config); // i can use new if i want to.
}
export {
  RestActionsGeneratorGenerator,
}
