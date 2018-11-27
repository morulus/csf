import csf, { fx } from "../../src";

describe('Fork', () => {
  it ('simple', () => {
    function someAsyncTask() {
      return new Promise((resolve) => {
        setTimeout(() => resolve(5), 10);
      })
    }

    return new csf(function *() {
      const forked = yield fx.fork(someAsyncTask);
      expect(typeof forked.then).toBe('function');
      return forked;
    })
      .then(result => {
        expect(result).toBe(5)
      })
  });
});
