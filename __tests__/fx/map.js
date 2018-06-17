import SequenceX, { fx } from "../../src";

describe('Map', () => {
  it ('with promise', () => {
    function increaser(value) {
      return Promise.resolve(value + 1)
    }

    const a = [1, 2, 3]

    return new SequenceX(function () {
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

    return new SequenceX(function () {
      return fx.map(a, increaser);
    })
      .then(result => {
        expect(result).toMatchObject([2, 3, 4])
      })
  });
});
