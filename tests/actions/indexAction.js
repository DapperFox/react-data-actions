import 'whatwg-fetch';
import fetchMock from 'fetch-mock';
import expect from 'expect';
import indexAction from '../../src/actions/indexAction';
import DataManager from '../../src/DataManager';

describe('indexAction', function () {
  beforeEach(function () {
    fetchMock.restore();
    this.dataManager = new DataManager();
  });

  it('should do GET request to /models for index', function () {
    fetchMock.get('/model', [{ id: 1, name: 'hi' }]);
    const state = indexAction(this.dataManager, {
      path: '/model',
    });
    expect(state.isFetching).toEqual(true);
    expect(fetchMock.called('/model')).toEqual(true);
  });

  it('should do set .data for state', function (done) {
    fetchMock.get('/model', [{ id: 1, name: 'hi' }]);
    indexAction(this.dataManager, {
      path: '/model',
    });
    this.dataManager.subscribe((key) => { // next subscriber event should be related to this
      if (key === '/model') {
        const state = indexAction(this.dataManager, {
          path: '/model',
        });
        expect(state.data[0].name).toEqual('hi');
        done();
      }
    });
  });

  it('should do set byId equiv for state in dataManager', function (done) {
    fetchMock.get('/model', [{ id: 'guid-1', name: 'hi' }]);
    indexAction(this.dataManager, {
      path: '/model',
    });
    this.dataManager.subscribe((key) => { // next subscriber event should be related to this
      if (key === '/model') {
        const state = this.dataManager.getStateForKey(key);
        expect(state.byId['guid-1'].data.name).toEqual('hi');
        done();
      }
    });
  });
});
