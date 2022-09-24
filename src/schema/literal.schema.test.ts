import { literal } from './literal.schema';

describe(literal, () => {
  it('creates a schema for a literal primitive', () => {
    const twelve = literal(12);
    expect(twelve.parse(12)).toBe(12);
    expect(() => twelve.parse(11)).toThrow('Expected 12. Got 11.');
  });

  describe('value', () => {
    it('accesses the literal value provided', () => {
      const tuna = literal('tuna');
      expect(tuna.value).toBe('tuna');
    });
  });
});
