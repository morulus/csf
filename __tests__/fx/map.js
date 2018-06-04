import SequenceX, { fx } from "../../src";

describe('Map', () => {
  it ('common', () => {
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
});
