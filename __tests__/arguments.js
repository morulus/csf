import { create } from '../src'

describe('arguments', () => {
  it('Top-level function should accept passed arguments', () => {
    const sequence = create(function(h, e, l, l2, o) {
      expect(h).toBe('h')
      expect(e).toBe('e')
      expect(l).toBe('l')
      expect(l2).toBe('l')
      expect(o).toBe('o')

      return function() {
        expect(arguments.length).toBe(0)
      }
    })

    return sequence('h', 'e', 'l', 'l', 'o');
  })

  it('Own arguments should override passed', () => {
    const sequence = create(function(h, e, l, l2, o) {
      expect(h).toBe('h')
      expect(e).toBe('e')
      expect(l).toBe('l')
      expect(l2).toBe('l')
      expect(o).toBe('o')

      return function() {
        expect(arguments.length).toBe(0)
      }
    }, {}, ['h', 'e', 'l', 'l', 'o'])

    return sequence('g', 'a', 'r', 'r', 'y');
  });
});
