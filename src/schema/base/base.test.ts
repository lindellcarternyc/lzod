import { BaseSchema } from './base.schema';

describe(BaseSchema, () => {
  it('creates a schema that requires a value', () => {
    const values = [0, false, [], {}, 1, true, { 1: 'a' }, [1]];
    const schema = new BaseSchema(() => true);

    for (const value of values) {
      expect(schema.parse(value)).toBe(value);
    }

    for (const nonVal of [null, undefined]) {
      expect(() => schema.parse(nonVal)).toThrow();
    }
  });
});
