import isPromise from 'is-promise'
import SequenceX from "../src";

describe('Payload', () => {
  it ('fx.payload inside the flow', () => {
    const subFlow = jest.fn(() => {
      return SequenceX.fx.payload(function keep() {
        return 1415;
      });
    })

    const flow = jest.fn(function* () {
      const result = yield subFlow;
      expect(typeof result).toBe('function');
      expect(result.name).toBe('keep');
      return result;
    });

    const promise = SequenceX.run(flow, [1, 2, 3]);

    expect(flow).toHaveBeenCalled();
    expect(subFlow).toHaveBeenCalled();

    return promise.then(result => expect(result).toBe(1415))
  });

  it('effect.payload for returnable values', () => {
    function subFlow() {
      return SequenceX.fx.payload(Promise.resolve(15))
    }

    function* flow() {
      const a = yield subFlow;
      expect(isPromise(a)).toBe(true)
      const b = yield a;
      expect(b).toBe(15)
    }

    return SequenceX.run(flow);
  });

  it('effect.payload for returnable values twice', () => {
    function subFlow() {
      return SequenceX.fx.payload(Promise.resolve(15))
    }

    function* flow() {
      const a = yield subFlow;
      expect(isPromise(a)).toBe(true)
      return SequenceX.fx.payload(a);
    }

    function* root() {
      const payload = yield flow;
      expect(isPromise(payload)).toBe(true)
    }

    return SequenceX.run(root)
  });

  it('proxy payloaded result', () => {
    function* c() {
      yield Promise.resolve(15)
      return SequenceX.fx.payload(Promise.resolve(1415))
    }

    function b() {
      return c();
    }

    function* a() {
      const result = yield b;
      expect(isPromise(result)).toBe(true)
    }

    return SequenceX.run(a)
  });
});
