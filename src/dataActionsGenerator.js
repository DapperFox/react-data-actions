import 'whatwg-fetch';
import {
  indexAction,
  showAction,
  deleteAction,
  updateAction,
  createAction,
  invalidateAllAction,
  invalidateIndexAction,
  invalidateShowAction,
} from './actions/';

class RestActionsGenerator {
  constructor (o) {
    this.memoized = {};
    this.isBatchProcessing = false;
    this.config = Object.assign({
      waitFor: true,
      performRequest: true,
    }, o || {}); // why clone? cause of the where clause object!
  }

  memoizedKeysFromOptions (name, options) {
    const key = JSON.stringify(options);
    return `${name}::${key}`;
  }

  memoizedFunction (key, options, generator) {
    const memoizedKey = this.memoizedKeysFromOptions(key, options);
    let fn = this.memoized[memoizedKey];
    if (!fn) {
      fn = generator();
      this.memoized[memoizedKey] = fn;
    }
    return fn;
  }

  indexAction (o) {
    const options = this.mergeOptions(o);
    return this.memoizedFunction('index', options, () => {
      return (dataManager) => {
        return indexAction(dataManager, options);
      };
    });
  }

  showAction (o) {
    const options = this.mergeOptions(o);
    return this.memoizedFunction('show', options, () => {
      return (dataManager) => {
        return showAction(dataManager, options);
      };
    });
  }

  createAction (o) {
    const options = this.mergeOptions(o);
    return this.memoizedFunction('create', options, () => {
      return (dataManager) => {
        return createAction(dataManager, options);
      };
    });
  }

  deleteAction (o) {
    const options = this.mergeOptions(o);
    return this.memoizedFunction('delete', options, () => {
      return (dataManager) => {
        return deleteAction(dataManager, options);
      };
    });
  }

  updateAction (o) {
    const options = this.mergeOptions(o);
    return this.memoizedFunction('update', options, () => {
      return (dataManager) => {
        return updateAction(dataManager, options);
      };
    });
  }

  invalidateShowAction (o) {
    const options = this.mergeOptions(o);
    return this.memoizedFunction('invalidateShow', options, () => {
      return (dataManager) => {
        return invalidateShowAction(dataManager, options);
      };
    });
  }

  invalidateIndexAction (o) {
    const options = this.mergeOptions(o);
    return this.memoizedFunction('invalidateIndex', options, () => {
      return (dataManager) => {
        return invalidateIndexAction(dataManager, options);
      };
    });
  }

  invalidateAllAction (o) {
    const options = this.mergeOptions(o);
    return this.memoizedFunction('invalidateAll', options, () => {
      return (dataManager) => {
        return invalidateAllAction(dataManager, options);
      };
    });
  }

  /* HELPERS */
  mergeOptions (o) {
    return Object.assign({}, this.config, o || {});
  }
}

export default function dataActionsGenerator (config) {
  return new RestActionsGenerator(config); // i can use new if i want to.
}
