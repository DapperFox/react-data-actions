import expect from 'expect'
import isStateStale from '../../src/helpers/isStateStale';

describe('#isStateStale', () => {
  it('should be stale for no state', () => {
    expect(isStateStale()).toEqual(true);
  });
  
  it('should be stale no fetch time', () => {
    expect(isStateStale({})).toEqual(true);
  });

  
  it('should be stale old date', () => {
    expect(isStateStale({fetchDate: new Date(100)})).toEqual(true);
  });
  
  it('should be stale day old date by default', () => {
    expect(isStateStale({fetchDate: new Date(new Date().getTime() - (60000*61*24))})).toEqual(true);
  });

  
  it('should not be stale when options maxAge', () => {
    expect(isStateStale({
      fetchDate: new Date(new Date().getTime() - (1000))
    }, {maxAge: 500})).toEqual(true);
  });
  it('should be stale when date diff is bigger than options maxAge', () => {
    expect(isStateStale({
      fetchDate: new Date(new Date().getTime() - (1000))
    }, {maxAge: 1500})).toEqual(false);
  });
  it('should never be stale if there is a fetchDate and maxAge is -1', () => {
    expect(isStateStale({fetchDate: new Date(100)}, {
      maxAge: -1
    })).toEqual(false);
  });
});
