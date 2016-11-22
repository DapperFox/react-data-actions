import patchAction from '../../src/actions/patchAction';
import fetchMock from 'fetch-mock';
import expect from 'expect';
import DataManager from '../../src/DataManager';
import 'whatwg-fetch';

describe('patchAction', function () {
  beforeEach(function () {
    fetchMock.restore();
    this.dataManager = new DataManager();
    this.dataManager.setStateForKey({
      byId: {
        '1': {
          data: {
            id: 1,
            hi: 1,
            guid: 'guid-1',
            something: 'before',
          },
        },
      },
    }, '/model');
  });

  it('should performRequest PATCH to /models/1 when id is 1', function () {
    fetchMock.patch('/model/1', {});
    const action = patchAction(this.dataManager, {
      path: '/model',
      performRequest: true,
    });

    action({ id: 1, hi: 2 });
    expect(fetchMock.called('/model/1')).toEqual(true);
  });

  it('should performRequest PATCH to /models/guid-1 when idAttribute is guid', function () {
    fetchMock.patch('/model/guid-1', {});
    const action = patchAction(this.dataManager, {
      idAttribute: 'guid',
      path: '/model',
      performRequest: true,
    });

    action({ guid: 'guid-1', hi: 2 });
    expect(fetchMock.called('/model/guid-1')).toEqual(true);
  });

  it('should NOT performRequest PATCH to /models/guid-1 when idAttribute is guid', function () {
    fetchMock.patch('/model/1', {});
    const action = patchAction(this.dataManager, {
      path: '/model',
      performRequest: false,
    });

    action({ id: '1', hi: 2 });
    expect(fetchMock.called('/model/1')).toEqual(false);
  });

  it('should patch immediately model/1 when performRequest is false', function () {
    const action = patchAction(this.dataManager, {
      path: '/model',
      performRequest: false,
    });

    action({ id: 1, hi: 2 });
    expect(this.dataManager.getStateForKey('/model').byId[1].data.hi).toEqual(2);
  });

  it('should patch model/1 when performRequest is true, ignoring results, when waitFor is false', function () {
    fetchMock.patch('/model/1', JSON.stringify({
      id: 1,
      hi: 3,
      blah: 'test',
    }));
    const action = patchAction(this.dataManager, {
      path: '/model',
      performRequest: true,
      waitFor: false,
    });

    return action({ id: 1, hi: 2 }).then(() => {
      expect(this.dataManager.getStateForKey('/model').byId[1].data.hi).toEqual(2);
    });
  });

  it('should patch model/1 when performRequest is true, merging results with old model, when waitFor is true', function () {
    fetchMock.patch('/model/1', JSON.stringify({
      id: 1,
      hi: 3,
      blah: 'test',
    }));
    const action = patchAction(this.dataManager, {
      path: '/model',
      performRequest: true,
      waitFor: true,
    });
    return action({ id: 1, hi: 2 }).then(() => {
      expect(this.dataManager.getStateForKey('/model').byId[1].data.hi).toEqual(3);
      expect(this.dataManager.getStateForKey('/model').byId[1].data.blah).toEqual('test');
      expect(this.dataManager.getStateForKey('/model').byId[1].data.something).toEqual('before');
    });
  });

  it('should patch model/1 with action data, even if waitFor is true on a 204', function () {
    fetchMock.patch('/model/1', 204);
    const action = patchAction(this.dataManager, {
      path: '/model',
      performRequest: true,
      waitFor: true,
    });
    return action({ id: 1, hi: 2 }).then(() => {
      expect(this.dataManager.getStateForKey('/model').byId[1].data.hi).toEqual(2);
    });
  });

  it('action promise should resolve with newest copy of model', function () {
    fetchMock.patch('/model/1', { id: 1, name: 'hi', post: 2 });
    const action = patchAction(this.dataManager, {
      path: '/model',
      performRequest: true,
      waitFor: true,
    });

    return action({ id: '1', name: 'hi' }).then((model) => {
      expect(model.name).toEqual('hi');
      expect(model.post).toEqual(2);
    });
  });

  it('action promise should resolve with latest copy on 204', function () {
    fetchMock.patch('/model/1', 204);
    const action = patchAction(this.dataManager, {
      path: '/model',
      performRequest: true,
      waitFor: true,
    });

    return action({ id: '1', name: 'hi' }).then((model) => {
      expect(model.name).toEqual('hi');
      expect(model.something).toEqual('before');
    });
  });
});
