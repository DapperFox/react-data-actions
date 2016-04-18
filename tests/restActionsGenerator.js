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

  it('should have rest actions generated', function () {
    const gen = restActionsGenerator({});
    expect(gen.indexAction()).toBeA('function');
    expect(gen.showAction()).toBeA('function');
    expect(gen.createAction()).toBeA('function');
    expect(gen.patchAction()).toBeA('function');
    expect(gen.updateAction()).toBeA('function');
    expect(gen.updateIndexAction()).toBeA('function');
    expect(gen.appendIndexAction()).toBeA('function');
    expect(gen.invalidateShowAction()).toBeA('function');
    expect(gen.invalidateIndexAction()).toBeA('function');
    expect(gen.invalidateAllAction()).toBeA('function');
  });
});
