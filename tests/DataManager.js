import expect from 'expect';
import DataManager from '../src/DataManager';

describe('DataManager', function () {
  beforeEach(function () {
    this.dataManager = new DataManager();
  });

  it('#getInstance returns same instance', function () {
    expect(DataManager.getInstance()).toEqual(DataManager.getInstance());
  });

  it('#subscribe receives #dispatch', function () {
    const spy = expect.createSpy();
    this.dataManager.subscribe(spy);
    expect(spy.calls.length).toEqual(0);
    this.dataManager.dispatch();
    expect(spy.calls.length).toEqual(1);
  });

  it('#subscribe receives multiple #dispatch', function () {
    const spy = expect.createSpy();
    this.dataManager.subscribe(spy);
    expect(spy.calls.length).toEqual(0);
    this.dataManager.dispatch();
    this.dataManager.dispatch();
    this.dataManager.dispatch();
    expect(spy.calls.length).toEqual(3);
  });

  it('#unsubscribe removes subscription and does not receive multiple #dispatch', function () {
    const spy = expect.createSpy();
    this.dataManager.subscribe(spy);
    this.dataManager.unsubscribe(spy);
    this.dataManager.dispatch();
    this.dataManager.dispatch();
    this.dataManager.dispatch();
    expect(spy.calls.length).toEqual(0);
  });

  it('#unsubscribe removes when multiple subscribers are there', function () {
    const spyOne = expect.createSpy();
    const spyTwo = expect.createSpy();
    const spyThree = expect.createSpy();
    this.dataManager.subscribe(spyOne);
    this.dataManager.subscribe(spyTwo);
    this.dataManager.subscribe(spyThree);
    this.dataManager.unsubscribe(spyOne);
    this.dataManager.unsubscribe(spyThree);
    this.dataManager.dispatch();
    this.dataManager.dispatch();
    this.dataManager.dispatch();
    expect(spyOne.calls.length).toEqual(0);
    expect(spyTwo.calls.length).toEqual(3);
    expect(spyThree.calls.length).toEqual(0);
  });

  it('#getStateForKey gets undefined when no state', function () {
    expect(this.dataManager.getStateForKey('key')).toEqual(undefined);
  });

  it('#getStateForKey gets #setStateForKey item', function () {
    const value = {
      oh: 'me?',
    };
    this.dataManager.setStateForKey(value, 'key');
    expect(this.dataManager.getStateForKey('key')).toEqual(value);
  });

  it('#setStateForKey safe guards against same changes', function () {
    const spy = expect.createSpy();
    this.dataManager.subscribe(spy);
    const value = {
      oh: 'me?',
    };
    this.dataManager.setStateForKey(value, 'key');
    expect(spy.calls.length).toEqual(1);
    this.dataManager.setStateForKey(value, 'key');
    expect(spy.calls.length).toEqual(1);
    this.dataManager.setStateForKey('diff', 'key');
    expect(spy.calls.length).toEqual(2);
  });
});
