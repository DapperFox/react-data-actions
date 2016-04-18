import updateIndexAction from '../../src/actions/updateIndexAction';
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
      where: {
        dennis: 'bestest',
      },
    };
    this.action = updateIndexAction(this.dataManager, this.options);
  });

  it('should set dataManager data', function () {
    const spy = expect.spyOn(this.dataManager, 'setStateForKey');
    this.action({
      id: 1,
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should replace by path completely', function () {
    const data = [
      { id: 1, hello: 'there' },
      { id: 'bob', villa: true },
    ];
    this.action(data);
    const whereKey = buildCacheKeyFromOptions(this.options.where);
    const state = this.dataManager.getStateForKey('/model');
    expect(state.byWhere[whereKey].data.length).toEqual(2);
    expect(state.byWhere[whereKey].data[0].id).toEqual(1);
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
