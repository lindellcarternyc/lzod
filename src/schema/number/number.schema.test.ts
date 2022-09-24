import { numberSchema } from './number.schema';

describe(numberSchema, () => {
  it('returns a schema', () => {
    const num = numberSchema();
    expect(typeof num.parse).toBe('function');
  });

  it('ensures a number was given', () => {
    const num = numberSchema();

    expect(num.parse(100)).toBe(100);

    expect(() => num.parse(null)).toThrow('REQUIRED');
  });

  it('uses custom error messages', () => {
    const required_number = numberSchema({
      required_error: 'NOPE',
      invalid_type_error: 'NAN',
    });

    expect(() => required_number.parse(null)).toThrow('NOPE');
    expect(() => required_number.parse(true)).toThrow('NAN');
  });

  // Other validators
  describe('gt:value', () => {
    it('ensures x > value', () => {
      const gt1 = numberSchema().gt(1);

      expect(gt1.parse(2)).toBe(2);

      expect(() => gt1.parse(1)).toThrow('Expected number > 1. Got 1.');
    });
  });

  describe('gte:value', () => {
    it('ensures x >= value', () => {
      const gte = numberSchema().gte(1);

      expect(gte.parse(1)).toBe(1);
      expect(() => gte.parse(0)).toThrow('Expected number >= 1. Got 0.');
    });
  });

  describe('min:value', () => {
    it('is an alias for #gte', () => {
      const min = numberSchema().min(1);

      expect(min.parse(1)).toBe(1);
      expect(() => min.parse(0)).toThrow('Expected number >= 1. Got 0.');
    });
  });

  describe('lt:value', () => {
    it('ensures x < value', () => {
      const lt = numberSchema().lt(10);

      expect(lt.parse(9)).toBe(9);

      expect(() => lt.parse(10)).toThrow('Expected number < 10. Got 10.');
    });
  });

  describe('lte:value', () => {
    it('ensures x <= value', () => {
      const lte = numberSchema().lte(10);

      expect(lte.parse(10)).toBe(10);

      expect(() => lte.parse(10.01)).toThrow(
        'Expected number <= 10. Got 10.01.'
      );
    });
  });

  describe('max:value', () => {
    it('is an alias for lte', () => {
      const max = numberSchema().max(10);

      expect(max.parse(10)).toBe(10);

      expect(() => max.parse(10.01)).toThrow(
        'Expected number <= 10. Got 10.01.'
      );
    });
  });

  describe('int', () => {
    it('ensures a value is an integer', () => {
      const ints = [-10, 0, 1, 5, 100.0];
      const int = numberSchema().int();

      for (const i of ints) {
        expect(int.parse(i)).toEqual(i);
      }

      expect(() => int.parse(0.1)).toThrow();
    });
  });

  describe('positive', () => {
    it('ensures a positive number', () => {
      const pos = numberSchema().positive();

      expect(pos.parse(100)).toBe(100);

      expect(() => pos.parse(0)).toThrow('Expected a positive number. Got 0.');
    });
  });
});
