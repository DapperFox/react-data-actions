import expect from 'expect';
import toQueryString from '../../src/helpers/toQueryString';

describe('toQueryString', function () {
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
  it('should encode multiple with ampersand between', function () {
    expect(toQueryString({
      hello: 'world',
      basic: 'params',
    })).toEqual('hello=world&basic=params');
  });
  it('should encode array with ampersand between', function () {
    expect(toQueryString({
      hello: ['world', 'earth', 'mars'],
    })).toEqual('hello[]=world&hello[]=earth&hello[]=mars');
  });
});
