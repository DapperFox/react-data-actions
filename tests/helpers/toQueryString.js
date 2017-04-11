import expect from 'expect';
import toQueryString from '../../src/helpers/toQueryString';

describe('#toQueryString', function () {
  it('should encode nothing to an empty string', function () {
    expect(toQueryString()).toEqual('');
  });
  it('should encode numbers params', function () {
    expect(toQueryString({
      hello: 1,
    })).toEqual('hello=1');
  });
  it('should encode string params', function () {
    expect(toQueryString({
      hello: 'world',
    })).toEqual('hello=world');
  });
  it('should encode multiple with ampersand between sorted', function () {
    expect(toQueryString({
      basic: 'params',
      hello: 'world',
    })).toEqual('basic=params&hello=world');
  });
  it('should encode array with ampersand between', function () {
    expect(toQueryString({
      hello: ['world', 'earth', 'mars'],
    })).toEqual('hello%5B%5D=world&hello%5B%5D=earth&hello%5B%5D=mars');
  });
  it('should encode objects with brackets and keys in the bracket', function () {
    expect(toQueryString({
      encode: 'objects',
      hello: {
        world: true,
        nested: {
          cat: 'dog',
        },
      },
    })).toEqual('encode=objects&hello%5Bworld%5D=true&hello%5Bnested%5D%5Bcat%5D=dog');
  });
  it('should encode objects with weird characters', function () {
    expect(toQueryString({
      'my cat': 'my dog',
    })).toEqual('my%20cat=my%20dog');
  });
});
