import SequenceX, { fx } from "../../src";

describe('Reduce', () => {
  it ('with promise', () => {
    function increaser(memo, value) {
      return Promise.resolve(value + memo)
    }

    const a = [4, 8, 15, 16, 23, 42]

    return new SequenceX(function () {
      return fx.reduce(a, increaser);
    })
      .then(result => {
        expect(result).toBe(108)
      })
  });

  it ('indexes', () => {
    function getIndexes(memo, value, index) {
      return memo.concat([index])
    }

    const a = ['A', 'B', 'C']

    return new SequenceX(function () {
      return fx.reduce(a, getIndexes, []);
    })
      .then(result => {
        expect(result).toMatchObject([0, 1, 2])
      })
  });
});
