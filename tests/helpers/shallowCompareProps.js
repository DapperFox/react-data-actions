import shallowCompareProps from '../../src/helpers/shallowCompareProps';
import expect from 'expect';

describe('shallowCompareProps', function () {
  it('should return true when props and values are identical strings', function () {
    expect(shallowCompareProps({
      a: 'hello',
      b: 'there',
    }, {
      a: 'hello',
      b: 'there',
    })).toEqual(true);
  });
  it('should return false when values are not identical strings', function () {
    expect(shallowCompareProps({
      a: 'hello',
      b: 'theres',
    }, {
      a: 'hello',
      b: 'there',
    })).toEqual(false);
  });
  it('should return false when values are not equal objects but not same reference', function () {
    expect(shallowCompareProps({
      a: 'hello',
      b: [],
    }, {
      a: 'hello',
      b: [],
    })).toEqual(false);
  });
  it('should return true when values are not equal objects and are same reference', function () {
    const x = {};
    expect(shallowCompareProps({
      a: 'hello',
      b: x,
    }, {
      a: 'hello',
      b: x,
    })).toEqual(true);
  });
  it('should return false when value is missing from first', function () {
    const x = {};
    expect(shallowCompareProps({
      a: 'hello',
      b: x,
    }, {
      a: 'hello',
      b: x,
      c: 1,
    })).toEqual(false);
  });
  it('should return false when value is missing from second', function () {
    const x = {};
    expect(shallowCompareProps({
      a: 'hello',
      b: x,
      c: 1,
    }, {
      a: 'hello',
      b: x,
    })).toEqual(false);
  });
});
