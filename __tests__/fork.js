import csf from "../src";

describe('Payload', () => {
  it ('effects.payload inside the flow', () => {
    const subFlow = jest.fn(() => {
      return 1415;
    })

    const flow = jest.fn(function* () {
      const result = yield csf.fx.fork(subFlow);
      expect(typeof result).not.toBe(1415);
      expect(typeof result).toBe('object');
      expect(typeof result.then).toBe('function');
      return result;
    });

    const promise = csf.run(flow, [1, 2, 3]);

    return promise.then(result => expect(result).toBe(1415))
  });
});
