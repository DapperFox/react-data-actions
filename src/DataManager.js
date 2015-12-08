export default class DataManager {

  constructor () {
    this.listeners = [];
    this.state = {};
    this.isDispatching = false;
  }

  static getInstance () {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  subscribe (handler) {
    this.listeners.push(handler);
  }

  unsubscribe (handler) {
    const index = this.listeners.indexOf(handler);
    this.listeners.splice(index, 1);
  }

  dispatch (key) {
    if (this.isDispatching) {
      return;
    }
    this.isDispatching = true;
    // slice to clone. children can cause rendering unsubscribes
    this.listeners.slice().forEach((handler) => {
      handler(key);
    });
    this.isDispatching = false;
  }

  getStateForKey (key) {
    return this.state[key];
  }

  setStateForKey (state, key, skipDispatch) {
    this.state[key] = state;
    if (!skipDispatch) {
      this.dispatch(key);
    }
  }
}
