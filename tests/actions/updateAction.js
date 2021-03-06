import updateAction from '../../src/actions/updateAction';
import DataManager from '../../src/DataManager';
import 'whatwg-fetch';
import fetchMock from 'fetch-mock';
import expect from 'expect';

describe('updateAction', function () {
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
      byWhere: {
        '{}': {
          data: [{
            id: 1,
            hi: 1,
            guid: 'guid-1',
            something: 'before',
          }],
        },
      },
    }, '/model');
  });

  it('should performRequest PUT to /models/1 when id is 1', function () {
    fetchMock.put('/model/1', {});
    const action = updateAction(this.dataManager, {
      path: '/model',
      performRequest: true,
    });

    action({ id: 1, hi: 2 });
    expect(fetchMock.called('/model/1')).toEqual(true);
  });

  it('should performRequest PUT to /models/guid-1 when idAttribute is guid', function () {
    fetchMock.put('/model/guid-1', {});
    const action = updateAction(this.dataManager, {
      idAttribute: 'guid',
      path: '/model',
      performRequest: true,
    });

    action({ guid: 'guid-1', hi: 2 });
    expect(fetchMock.called('/model/guid-1')).toEqual(true);
  });

  it('should NOT performRequest PUT to /models/guid-1 when idAttribute is guid', function () {
    fetchMock.put('/model/1', {});
    const action = updateAction(this.dataManager, {
      path: '/model',
      performRequest: false,
    });

    action({ id: '1', hi: 2 });
    expect(fetchMock.called('/model/1')).toEqual(false);
  });

  it('should update immediately model/1 byId when performRequest is false', function () {
    const action = updateAction(this.dataManager, {
      path: '/model',
      performRequest: false,
    });

    action({ id: 1, hi: 2 });
    expect(this.dataManager.getStateForKey('/model').byId[1].data.hi).toEqual(2);
  });

  it('should update immediately model/1 in byWhere when performRequest is false', function () {
    const action = updateAction(this.dataManager, {
      path: '/model',
      performRequest: false,
    });

    action({ id: 1, hi: 2 });
    const state = this.dataManager.getStateForKey('/model').byWhere['{}'];
    expect(state.data[0].hi).toEqual(2);
  });

  it('should update model/1 when performRequest is true, ignoring results, when waitFor is false', function () {
    fetchMock.put('/model/1', JSON.stringify({
      id: 1,
      hi: 3,
      blah: 'test',
    }));
    const action = updateAction(this.dataManager, {
      path: '/model',
      performRequest: true,
      waitFor: false,
    });

    return action({ id: 1, hi: 2 }).then(() => {
      expect(this.dataManager.getStateForKey('/model').byId[1].data.hi).toEqual(2);
    });
  });

  it('should update model/1 when performRequest is true, using results, when waitFor is true', function () {
    fetchMock.put('/model/1', JSON.stringify({
      id: 1,
      hi: 3,
      blah: 'test',
    }));
    const action = updateAction(this.dataManager, {
      path: '/model',
      performRequest: true,
      waitFor: true,
    });
    return action({ id: 1, hi: 2 }).then(() => {
      expect(this.dataManager.getStateForKey('/model').byId[1].data.hi).toEqual(3);
      expect(this.dataManager.getStateForKey('/model').byId[1].data.something).toEqual(undefined);
    });
  });

  it('should update model/1 when performRequest is true, REPLACING old model completely with results, when waitFor is true', function () {
    fetchMock.put('/model/1', JSON.stringify({
      id: 1,
      hi: 2,
    }));
    const action = updateAction(this.dataManager, {
      path: '/model',
      performRequest: true,
      waitFor: true,
    });
    return action({ id: 1, hi: 2 }).then(() => {
      expect(this.dataManager.getStateForKey('/model').byId[1].data.hi).toEqual(2);
      expect(this.dataManager.getStateForKey('/model').byId[1].data.something).toEqual(undefined);
    });
  });

  it('should update model/1 with action data, even if waitFor is true on a 204', function () {
    fetchMock.put('/model/1', 204);
    const action = updateAction(this.dataManager, {
      path: '/model',
      performRequest: true,
      waitFor: true,
    });
    return action({ id: 1, hi: 2 }).then(() => {
      expect(this.dataManager.getStateForKey('/model').byId[1].data.hi).toEqual(2);
    });
  });

  it('action promise should resolve with newest copy of model', function () {
    fetchMock.put('/model', { id: 1, name: 'hi', post: 2 });
    const action = updateAction(this.dataManager, {
      path: '/model',
      performRequest: true,
      waitFor: true,
    });

    return action({ name: 'hi' }).then((model) => {
      expect(model.name).toEqual('hi');
      expect(model.post).toEqual(2);
    });
  });

  it('action promise should go to catch on 400', function (done) {
    fetchMock.put('/model', 400);
    const action = updateAction(this.dataManager, {
      path: '/model',
      performRequest: true,
      waitFor: true,
    });

    action({ name: 'hi' }).catch(() => {
      done();
    });
  });
});
