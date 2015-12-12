import expect from 'expect';
import buildCacheKeyFromOptions from '../../src/helpers/buildCacheKeyFromOptions';

describe('#buildCacheKeyFromOptions', () => {
  it('should provide key on empty', () => {
    expect(buildCacheKeyFromOptions()).toEqual('{}');
  });
  it('should provide unique key for nested item', () => {
    expect(buildCacheKeyFromOptions({hi:[1]})).toEqual('{"hi":[1]}');
  });
  it('should sort keys, so order doesnt matter', () => {
    expect(buildCacheKeyFromOptions({hi: 'dennis', itsMe: 'karma'}))
      .toEqual(buildCacheKeyFromOptions({itsMe: 'karma', hi: 'dennis'}));
  });
});
