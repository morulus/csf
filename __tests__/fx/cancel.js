const Csf = require('csf')

describe('Cancel', () => {
  it('Forked each', () => {
    let iterations = 0;
    return new Csf(function *() {
      const a = [1, 2, 3, 4, 5]
      const each = Csf.fx.each(a, function *(val) {
        yield Csf.fx.pause(50);
        iterations++;
      })
      yield Csf.fx.fork(each);
      yield Csf.fx.pause(120)
      Csf.cancel(each);
      yield Csf.fx.pause(120)
    })
      .then(() => {
        expect(iterations).toBe(3);
      })
  })
})
