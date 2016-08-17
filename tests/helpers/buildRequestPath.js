import expect from 'expect';
import buildRequestPath from '../../src/helpers/buildRequestPath';

describe('#buildRequestPath', function () {
  it('should return basic path with path key', () => {
    expect(buildRequestPath({path: 'hello'})).toEqual('hello');
  });
  
  it('should return basic path with url key', () => {
    expect(buildRequestPath({url: 'http://google.hello'})).toEqual('http://google.hello');
  });

  it('should replace attributes in path prefixed with colon', () => {
    expect(buildRequestPath({path: 'hello/:there', there: 13})).toEqual('hello/13');
  });

  it('should replace attributes in path prefixed with colon', () => {
    expect(buildRequestPath({path: 'hello/:there_friend', there_friend: 13})).toEqual('hello/13');
  });
  
  it('should replace attributes in nested resource', () => {
    expect(buildRequestPath({path: 'hello/:there_friend/goodie', there_friend: 13})).toEqual('hello/13/goodie');
  });

  it('should append slash and add model to path when supplied id', () => {
    expect(buildRequestPath({path: 'hello'}, 13)).toEqual('hello/13');
  });

  it('should not append modelId if match was found in path regex', () => {
    expect(buildRequestPath({path: 'hello/:id/request'}, 13)).toEqual('hello/13/request');
  });

  it('should not append modelId if match was found in path regex with extension', () => {
    expect(buildRequestPath({path: 'hello/:id/request.json', extension: 'json'}, 13)).toEqual('hello/13/request.json');
  });
  
  it('should not append modelId if match was found in path regex with idAttribute', () => {
    expect(buildRequestPath({path: 'hello/:guid/request', idAttribute: 'guid' }, 13)).toEqual('hello/13/request');
  });

  it('should append slash and add model to path when supplied id with nested attribute', () => {
    expect(buildRequestPath({path: 'hello/:nest/children', nest: 15}, 13)).toEqual('hello/15/children/13');
  });

  it('should append extension given if provided', () => {
    expect(buildRequestPath({path: 'hello', extension: 'json'})).toEqual('hello.json');
  });
  
  it('should append extension given if provided with model id', () => {
    expect(buildRequestPath({path: 'hello', extension: 'json'}, 14)).toEqual('hello/14.json');
  });

  it('should not append extension given if extension exists on path ', () => {
    expect(buildRequestPath({path: 'hello.json', extension: 'json'})).toEqual('hello.json');
  });
});
