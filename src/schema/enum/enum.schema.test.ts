import { enumSchema } from './enum.schema';

describe(enumSchema, () => {
  const FISH = ['Salmon', 'Tuna', 'Trout'] as const;

  it('creates a schema that accepts on of const string[]', () => {
    const fish = enumSchema(FISH);

    expect(fish.parse('Salmon')).toBe('Salmon');

    expect(() => fish.parse('hello')).toThrow(
      'Expected one of Salmon | Tuna | Trout. Got hello.'
    );
  });

  describe('enum', () => {
    it('provides access to enum members', () => {
      const fish = enumSchema(FISH);

      expect(fish.enum).toEqual({
        Salmon: 'Salmon',
        Tuna: 'Tuna',
        Trout: 'Trout',
      });
    });
  });

  describe('options', () => {
    it('provides access to the original array', () => {
      const fish = enumSchema(FISH);
      expect(fish.options).toEqual(FISH);
    });
  });
});
