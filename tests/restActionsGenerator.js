import restActionsGenerator, {
  RestActionsGeneratorGenerator,
} from '../src/restActionsGenerator';
import expect from 'expect';

describe('restActionsGenerator', function () {
  it('should return instance of class RestActionsGeneratorGenerator', function () {
    const gen = restActionsGenerator({
    });
    expect(gen).toBeA(RestActionsGeneratorGenerator);
  });

  it('should memoize generated functions', function () {
    const gen = restActionsGenerator({});
    const indexAction = gen.indexAction();
    expect(indexAction).toBeA('function');
    const indexActionTwo = gen.indexAction();
    expect(indexAction).toEqual(indexActionTwo);
  });
});
