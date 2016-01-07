import expect from 'expect';
import DataManager from '../../src/DataManager';
import existingStateForKey from '../../src/helpers/existingStateForKey';
import _ from 'lodash';

describe('#existingStateForKey', () => {
  beforeEach(function () {
    this.dataManager = new DataManager();
  });
  it('should return an object when key value is empty', function () {
    const state = existingStateForKey(this.dataManager, 'blah');
    expect(state).toBeA('object');
  });
  it('should return empty byId object when key value is empty', function () {
    const state = existingStateForKey(this.dataManager, 'blah');
    const keys = _.keys(state.byId);
    expect(state.byId).toBeA('object');
    expect(keys.length).toEqual(0);
  });
  it('should return empty byWhere object when key value is empty', function () {
    const state = existingStateForKey(this.dataManager, 'blah');
    const keys = _.keys(state.byWhere);
    expect(state.byId).toBeA('object');
    expect(keys.length).toEqual(0);
  });
  
  it('should return exact state from dataManager', function () {
    this.dataManager.setStateForKey('there', 'hi');
    expect(existingStateForKey(this.dataManager, 'hi')).toEqual('there');
  });
});
