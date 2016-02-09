import createAction from '../../src/actions/createAction';
import DataManager from '../../src/DataManager';
import 'whatwg-fetch';
import fetchMock from 'fetch-mock';
import expect from 'expect';

describe('createAction', function () {
  beforeEach(function () {
    fetchMock.restore();
    this.dataManager = new DataManager();
    this.dataManager.setStateForKey({
      byId: {
      },
    }, '/model');
  });

  it('should performRequest POST to /models', function () {
    fetchMock.mock('/model', 'POST', { id: 1, name: 'hi' });
    const action = createAction(this.dataManager, {
      path: '/model',
      performRequest: true,
    });

    action({ name: 'hi' });
    expect(fetchMock.called('/model')).toEqual(true);
  });

  it('should NOT performRequest POST to /models performRequest is false', function () {
    fetchMock.mock('/model', 'POST', { id: 1, name: 'hi' });
    const action = createAction(this.dataManager, {
      path: '/model',
      performRequest: false,
    });

    action({ name: 'hi' });
    expect(fetchMock.called('/model')).toEqual(false);
  });

  it('should store response state /models', function () {
    fetchMock.mock('/model', 'POST', { id: 1, name: 'hi' });
    const action = createAction(this.dataManager, {
      path: '/model',
      performRequest: true,
      waitFor: true,
    });

    return action({ name: 'hi' }).then(() => {
      expect(fetchMock.called('/model')).toEqual(true);
      expect(this.dataManager.getStateForKey('/model').byId[1].data.name).toEqual('hi');
    });
  });

  it('should store response state /models with full replacement', function () {
    fetchMock.mock('/model', 'POST', { id: 1, name: 'hi', post: 2 });
    const action = createAction(this.dataManager, {
      path: '/model',
      performRequest: true,
      waitFor: true,
    });

    return action({ name: 'hi', pre: 2 }).then(() => {
      expect(fetchMock.called('/model')).toEqual(true);
      expect(this.dataManager.getStateForKey('/model').byId[1].data.name).toEqual('hi');
      expect(this.dataManager.getStateForKey('/model').byId[1].data.pre).toEqual(undefined);
      expect(this.dataManager.getStateForKey('/model').byId[1].data.post).toEqual(2);
    });
  });
});
