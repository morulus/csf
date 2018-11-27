import csf, { fx } from "../../src";

describe('Map', () => {
  it ('with promise', () => {
    function increaser(value) {
      return Promise.resolve(value + 1)
    }

    const a = [1, 2, 3]

    return new csf(function () {
      return fx.map(a, increaser);
    })
      .then(result => {
        expect(result).toMatchObject([2, 3, 4])
      })
  });

  it ('with generator', () => {
    function* increaser(value) {
      yield Promise.resolve(value + 1)
    }

    const a = [1, 2, 3]

    return new csf(function () {
      return fx.map(a, increaser);
    })
      .then(result => {
        expect(result).toMatchObject([2, 3, 4])
      })
  });

  it ('keys of arrays', () => {
    function* selectKey(value, key) {
      yield key
    }

    const a = ['a', 'b', 'c']

    return new csf(function () {
      return fx.map(a, selectKey);
    })
      .then(result => {
        expect(result).toMatchObject([0, 1, 2])
      })
  });

  it ('keys of objects', () => {
    function* selectKey(value, key) {
      yield key
    }

    const a = {
      a: 1,
      b: 2,
      c: 3
    }

    return new csf(function () {
      return fx.map(a, selectKey);
    })
      .then(result => {
        expect(result).toMatchObject({
          a: 'a',
          b: 'b',
          c: 'c'
        })
      })
  });
});

describe('Map and context', function() {
  it('Context must be accessable', () => {
    const context = {};

    const a = [1];

    return csf.apply(function () {
      return fx.map(a, function *() {
        const localContext = yield fx.getContext();
        expect(localContext).toBe(context);
      });
    }, context)
  });

});
