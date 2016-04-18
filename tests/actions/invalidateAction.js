import {
  invalidateIndexAction,
  invalidateShowAction,
  invalidateAllAction,
} from '../../src/actions/invalidateAction';
import DataManager from '../../src/DataManager';
import expect from 'expect';
import {
  buildCacheKeyFromOptions,
} from '../../src/helpers';


describe('invalidateAction', function () {
  describe('invalidateIndexAction', function () {
    beforeEach(function () {
      this.dataManager = new DataManager();
      this.options = {
        path: '/model',
      };
      this.action = invalidateIndexAction(this.dataManager, this.options);
    });

    it('should remove all related byWhere data from dataManager', function () {
      const whereKey = buildCacheKeyFromOptions(this.options.where);
      this.dataManager.setStateForKey({
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
      this.action();
      const nextState = this.dataManager.getStateForKey('/model');
      expect(nextState.byWhere[whereKey]).toEqual(undefined);
    });
  });

  describe('invalidateShowAction', function () {
    beforeEach(function () {
      this.dataManager = new DataManager();
      this.options = {
        path: '/model',
      };
      this.id = 'by-id--id';
      this.action = invalidateShowAction(this.dataManager, this.options);
    });

    it('should remove all related byId data from dataManager', function () {
      this.dataManager.setStateForKey({
        byId: {
          [this.id]: {
            fetchDate: new Date(),
            data: {
              id: this.id,
              secret: true,
            },
          },
        },
      }, '/model');

      const state = this.dataManager.getStateForKey('/model');
      expect(state.byId[this.id].data.secret).toEqual(true);
      this.action({
        id: this.id,
      });
      const nextState = this.dataManager.getStateForKey('/model');
      expect(nextState.byId[this.id]).toEqual(undefined);
    });
  });

  describe('invalidateAllAction', function () {
    beforeEach(function () {
      this.dataManager = new DataManager();
      this.options = {
        path: '/model',
      };
      this.action = invalidateAllAction(this.dataManager, this.options);
    });

    it('should remove all state completely', function () {
      const byWhereData = {};
      this.dataManager.setStateForKey({
        byId: {
          myId: {
            fetchDate: new Date(),
            data: {
              id: this.id,
              secret: true,
            },
          },
        },
        byWhere: {
          '{}': {
            data: byWhereData,
          },
        },
      }, '/model');

      const state = this.dataManager.getStateForKey('/model');
      expect(state.byId.myId.data.secret).toEqual(true);
      this.action();
      const nextState = this.dataManager.getStateForKey('/model');
      expect(nextState).toEqual(undefined);
    });
  });
});
