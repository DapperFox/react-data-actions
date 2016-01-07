import expect from 'expect';
import actionsGenerator from '../src/actionsGenerator';
import DataManager from '../src/DataManager';

describe('actionsGenerator', function () {
  beforeEach(function () {
    this.dataManager = new DataManager();
  });

  it('#constructor create unique key when no options', function () {
    const x = actionsGenerator();
    expect(x.key).toExist('key was created');
  });

  it('#constructor create unique key is different than other key', function () {
    const x = actionsGenerator();
    const y = actionsGenerator();
    expect(x.key).toNotEqual(y.key, 'Keys are different');
  });

  it('#getAction generates getter for undefined value', function () {
    const actions = actionsGenerator({
      name: 'hi',
    });
    const val = actions.getAction()(this.dataManager);
    expect(val).toEqual(undefined);
  });

  it('#setAction generates setter function', function () {
    const actions = actionsGenerator({
      name: 'hi',
    });
    const setter = actions.setAction()(this.dataManager);
    expect(setter).toBeA('function');
  });

  it('#setAction generates updates state when ran with function', function () {
    const actions = actionsGenerator({
      name: 'hi',
    });
    const setter = actions.setAction()(this.dataManager);
    const val = {
      hi: 1,
    };
    setter(val);
    expect(actions.getAction()(this.dataManager)).toEqual(val);
  });

  it('#setAction returns true on set', function () {
    const actions = actionsGenerator({
      name: 'hi',
    });
    const setter = actions.setAction()(this.dataManager);
    const val = {
      hi: 1,
    };
    expect(setter(val)).toEqual(true);
  });

  it('#setAction returns false when its the same', function () {
    const actions = actionsGenerator({
      name: 'hi',
    });
    const setter = actions.setAction()(this.dataManager);
    const val = {
      hi: 1,
    };
    expect(setter(val)).toEqual(true);
    expect(setter(val)).toEqual(false);
  });

  it('#setAction does not dispatch if same', function () {
    const spy = expect.createSpy();
    this.dataManager.subscribe(spy);

    const actions = actionsGenerator({
      name: 'hi',
    });
    const setter = actions.setAction()(this.dataManager);
    const val = {
      hi: 1,
    };
    setter(val);
    expect(spy.calls.length).toEqual(1);
    setter(val);
    expect(spy.calls.length).toEqual(1);
  });

  it('#setAction does not dispatch is second arg is true', function () {
    const spy = expect.createSpy();
    this.dataManager.subscribe(spy);

    const actions = actionsGenerator({
      name: 'hi',
    });
    const setter = actions.setAction()(this.dataManager);
    const val = {
      hi: 1,
    };
    setter(val, true);
    expect(spy.calls.length).toEqual(0);
  });
});
