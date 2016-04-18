import appendIndexAction from '../../src/actions/appendIndexAction';
import DataManager from '../../src/DataManager';
import expect from 'expect';
import {
  buildCacheKeyFromOptions,
} from '../../src/helpers';

describe('appendIndexAction', function () {
  beforeEach(function () {
    this.dataManager = new DataManager();
    this.options = {
      path: '/model',
    };
    this.action = appendIndexAction(this.dataManager, this.options);
  });

  it('should set dataManager data', function () {
    const spy = expect.spyOn(this.dataManager, 'setStateForKey');
    this.action({
      id: 1,
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should add new model set dataManager to byId', function () {
    this.action({
      id: 1,
    });
    const state = this.dataManager.getStateForKey('/model');
    expect(state.byId[1]).toExist();
  });

  it('should add new model set dataManager to byWhere', function () {
    this.action({
      id: 10,
    });
    const whereKey = buildCacheKeyFromOptions(this.options.where);
    const state = this.dataManager.getStateForKey('/model');
    expect(state.byWhere[whereKey].data[0]).toExist();
    expect(state.byWhere[whereKey].data[0].id).toEqual(10);
  });

  it('should add replace existing model set dataManager to byWhere', function () {
    const whereKey = buildCacheKeyFromOptions(this.options.where);
    this.dataManager.setStateForKey({
      byId: {
        '10': {
          data: {
            id: 1,
            hi: 1,
            guid: 'guid-1',
            something: 'before',
          },
        },
      },
      byWhere: {
        [whereKey]: {
          data: [{
            id: 10,
            hi: 'first',
            guid: 'guid-1',
            something: 'before',
          }],
        },
      },
    }, '/model');
    const state = this.dataManager.getStateForKey('/model');
    expect(state.byWhere[whereKey].data[0].hi).toEqual('first');
    this.action({
      id: 10,
      hi: 'second',
    });
    const nextState = this.dataManager.getStateForKey('/model');
    expect(nextState.byWhere[whereKey].data[0].hi).toEqual('second');
    expect(nextState.byId['10'].data.hi).toEqual('second');
  });

  it('should allow modification of meta data liek fetchDate', function () {
    const whereKey = buildCacheKeyFromOptions(this.options.where);
    const fetchDate = new Date(new Date().getTime() - 1000);
    this.dataManager.setStateForKey({
      byWhere: {
        [whereKey]: {
          fetchDate,
          data: [{
            id: 10,
            hi: 'first',
            guid: 'guid-1',
            something: 'before',
          }],
        },
      },
    }, '/model');
    const state = this.dataManager.getStateForKey('/model');
    expect(state.byWhere[whereKey].data[0].hi).toEqual('first');
    const newFetch = new Date();
    this.action({
      id: 10,
      hi: 'second',
    }, {
      fetchDate: newFetch,
    });
    const nextState = this.dataManager.getStateForKey('/model');
    expect(nextState.byWhere[whereKey].fetchDate).toEqual(newFetch);
  });
});
