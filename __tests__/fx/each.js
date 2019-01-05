import csf, { fx } from "../../src";

describe('Map', () => {
  it ('Sync', () => {
    const a = [1, 2, 3]
    const nextA = [];
    return new csf(function () {
      let interations = 0;
      return fx.each(a, function(value, index, all) {
        expect(value).toBe(a[interations])
        expect(index).toBe(interations)
        expect(all).toBe(a)
        interations++;
        nextA.push(value);
      })
    })
      .then(result => {
        expect(nextA).toMatchObject(a)
      })
  });

  it ('Async', () => {
    const a = [1, 2, 3]
    const nextA = [];
    return new csf(function () {
      let interations = 0;
      return fx.each(a, function(value, index, all) {
        return new Promise(function(resolve) {
          expect(value).toBe(a[interations])
          expect(index).toBe(interations)
          expect(all).toBe(a)
          interations++;
          nextA.push(value);
          resolve();
        })
      })
    })
      .then(result => {
        expect(nextA).toMatchObject(a)
      })
  });

  it ('Yield', () => {
    const a = [1, 2, 3]
    const nextA = [];
    return new csf(function () {
      let interations = 0;
      return fx.each(a, function *(value, index, all) {
        yield "Skip";
        yield new Promise(function(resolve) {
          expect(value).toBe(a[interations])
          expect(index).toBe(interations)
          expect(all).toBe(a)
          interations++;
          nextA.push(value);
          resolve();
        })
      })
    })
      .then(result => {
        expect(nextA).toMatchObject(a)
      })
  });

  it ('Cancel', () => {
    const a = [1, 2, 3]
    const nextA = [];
    return new csf(function () {
      let interations = 0;
      return fx.each(a, function(value, index, all) {
        expect(value).toBe(a[interations])
        expect(index).toBe(interations)
        expect(all).toBe(a)
        interations++;
        nextA.push(value);
        return false;
      })
    })
      .then(result => {
        expect(nextA).not.toMatchObject(a)
        expect(nextA.length).toBe(1)
      })
  });

  it ('Cancel by outside', () => {
    const a = [1, 2, 3]
    const nextA = [];
    let interations = 0;
    return new csf(function *() {
      const eachFlow = fx.each(a, function *(value, index, all) {
        yield fx.pause(50);
        interations++;
      })
      yield fx.fork(eachFlow);
      /* Wait 120ms and cancel each */
      yield fx.pause(120);
      csf.cancel(eachFlow)
    })
      .then(result => {
        expect(interations).toBe(2)
      })
  });
});
