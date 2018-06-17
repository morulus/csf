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
});
