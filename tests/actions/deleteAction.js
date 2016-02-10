import deleteAction from '../../src/actions/deleteAction';
import DataManager from '../../src/DataManager';
import 'whatwg-fetch';
import fetchMock from 'fetch-mock';
import expect from 'expect';

describe('deleteAction', function () {
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

  it('should performRequest DELETE to /models/1 when id is 1', function () {
    fetchMock.mock('/model/1', 'DELETE', {});
    const action = deleteAction(this.dataManager, {
      path: '/model',
      performRequest: true,
    });

    action({ id: 1, hi: 2 });
    expect(fetchMock.called('/model/1')).toEqual(true);
  });

  it('should remove from dataManager byId', function () {
    fetchMock.mock('/model/1', 'DELETE', {});
    const action = deleteAction(this.dataManager, {
      path: '/model',
      performRequest: true,
    });

    let state = this.dataManager.getStateForKey('/model');
    expect(state.byId[1]).toExist();
    action({ id: 1, hi: 2 });
    state = this.dataManager.getStateForKey('/model');
    expect(state.byId[1]).toEqual(undefined);
  });

  it('should remove from dataManager byWhere', function () {
    fetchMock.mock('/model/1', 'DELETE', {});
    const action = deleteAction(this.dataManager, {
      path: '/model',
      performRequest: true,
    });

    let state = this.dataManager.getStateForKey('/model');
    expect(state.byWhere['{}'].data[0]).toExist();
    expect(state.byWhere['{}'].data[0].id).toEqual(1);
    const length = state.byWhere['{}'].data.length;
    action({ id: 1, hi: 2 });
    state = this.dataManager.getStateForKey('/model');
    const postLength = state.byWhere['{}'].data.length;
    expect(length > postLength).toEqual(true);
  });
});
