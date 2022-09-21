import { stringSchema } from './string.schema';

describe(stringSchema, () => {
  it('creates a schema object', () => {
    const schema = stringSchema();
    expect(schema).toHaveProperty('parse');
    expect(typeof schema.parse).toBe('function');
  });

  describe('string parsing', () => {
    const s = stringSchema();

    it('returns the provided string', () => {
      expect(s.parse('TEST')).toBe('TEST');
    });

    it('throws an error if another type if provided', () => {
      const NOT_STRINGS = [1, true, [], {}, null, undefined];

      for (const notString of NOT_STRINGS) {
        expect(() => {
          s.parse(notString);
        }).toThrow();
      }
    });

    describe('custom string errors', () => {
      it('throws custom errors when provided', () => {
        const s = stringSchema({
          required_error: 'NO VALUE',
          invalid_type_error: 'WRONG TYPE',
        });

        expect(() => s.parse(null)).toThrow('NO VALUE');
        expect(() => s.parse(123)).toThrow('WRONG TYPE');
      });
    });
  });

  describe('min', () => {
    it('creates a schema that ensures string.length >= min', () => {
      const s = stringSchema().min(5);
      expect(s.parse('hello')).toBe('hello');
      expect(() => s.parse('a')).toThrow();
    });

    it('accepts a custom error message', () => {
      const s = stringSchema().min(1, { message: 'TOO SHORT' });
      expect(() => s.parse('')).toThrow('TOO SHORT');
    });
  });

  describe('max', () => {
    it('creats a schema that ensures string.length <= max length', () => {
      const s = stringSchema().max(5);
      expect(s.parse('')).toBe('');
      expect(() => s.parse('012345')).toThrow();
    });

    it('accepts a custom error message', () => {
      const s = stringSchema().max(2, { message: 'TOO LONG' });
      expect(() => s.parse('123')).toThrow('TOO LONG');
    });
  });

  describe('length', () => {
    it('ensures the string.length === length', () => {
      const s = stringSchema().length(2);
      expect(s.parse('ab')).toBe('ab');
      expect(() => s.parse('')).toThrow();
    });

    it('accepts a custom error message', () => {
      const s = stringSchema().length(1, { message: 'NOT ONE' });
      expect(() => s.parse('123')).toThrow('NOT ONE');
    });
  });
});