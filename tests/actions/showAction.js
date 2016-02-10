import showAction from '../../src/actions/showAction';
import DataManager from '../../src/DataManager';
import 'whatwg-fetch';
import fetchMock from 'fetch-mock';
import expect from 'expect';

describe('showAction', function () {
  beforeEach(function () {
    fetchMock.restore();
    this.dataManager = new DataManager();
  });

  it('should do GET request to /models/1 with id of 1', function () {
    fetchMock.mock('/model/1', 'GET', { id: 1, name: 'hi' });
    const state = showAction(this.dataManager, {
      path: '/model',
      id: 1,
    });
    expect(state.isFetching).toEqual(true);
    expect(fetchMock.called('/model/1')).toEqual(true);
  });

  it('should do set .data for state that returns', function (done) {
    fetchMock.mock('/model/1', 'GET', { id: 1, name: 'hi' });
    showAction(this.dataManager, {
      path: '/model',
      id: 1,
    });
    this.dataManager.subscribe((key) => { // next subscriber event should be related to this
      if (key === '/model') {
        const state = showAction(this.dataManager, {
          path: '/model',
          id: 1,
        });
        expect(state.data.name).toEqual('hi');
        done();
      }
    });
  });

  it('should NOT do request if data exists and maxAge is -1', function () {
    this.dataManager.setStateForKey({
      byId: {
        '1': {
          isFetching: false,
          fetchDate: new Date(),
          data: {
            id: 1,
            hi: 1,
            guid: 'guid-1',
            something: 'before',
          },
        },
      },
    }, '/model');


    fetchMock.mock('/model/1', 'GET', { id: 1, name: 'hi' });
    showAction(this.dataManager, {
      path: '/model',
      id: 1,
      maxAge: -1,
    });
    expect(fetchMock.called('/model/1')).toEqual(false);
  });

  it('should do set byId equiv for state in dataManager', function (done) {
    fetchMock.mock('/model/1', 'GET', { id: 1, name: 'hi' });
    showAction(this.dataManager, {
      path: '/model',
      id: 1,
    });
    this.dataManager.subscribe((key) => { // next subscriber event should be related to this
      if (key === '/model') {
        const state = this.dataManager.getStateForKey(key);
        expect(state.byId[1].data.name).toEqual('hi');
        done();
      }
    });
  });
});
