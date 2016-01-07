import _ from 'lodash';
import {
  isStateStale,
} from 'helpers/';

class SimpleActionsGeneratorGenerator {
  constructor (o = {}) {
    this.options = Object.assign({
      maxAge: -1,
    }, o);
    if (this.options.name) {
      this.key = `::${this.options.name}`;
    } else {
      this.key = _.uniqueId('::');
    }
  }

  getAction () {
    return (dataManager) => {
      const state = dataManager.getStateForKey(this.key);
      if (isStateStale(state, this.options)) {
        return undefined;
      } else {
        return state.value;
      }
    };
  }

  setAction () {
    return (dataManager) => {
      return (newValue, silent = false) => {
        const state = dataManager.getStateForKey(this.key);
        if (!state || state.value !== newValue) {
          dataManager.setStateForKey({
            fetchDate: new Date(),
            value: newValue,
          }, this.key, silent);
          return true;
        }
        return false;
      };
    };
  }

  clearAction () {
    return (dataManager) => {
      return (silent = false) => {
        if (dataManager.getStateForKey(this.key) !== undefined) {
          dataManager.setStateForKey(undefined, this.key, silent);
        }
      };
    };
  }
}
export default function actionsGenerator (name) {
  return new SimpleActionsGeneratorGenerator(name);
}
