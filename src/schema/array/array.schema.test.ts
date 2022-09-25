import { array } from './array.schema';
import { stringSchema } from '../string/string.schema';
import { NumberSchema, numberSchema } from '../number/number.schema';

describe(array, () => {
  it('creates a schema that ensures an array of objects that match a schema', () => {
    const strings = array(stringSchema());

    expect(strings.parse(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);

    expect(() => strings.parse([1])).toThrow();
  });

  describe('element', () => {
    it('provides access for the underlying element schema', () => {
      const nums = array(numberSchema());
      expect(nums.element).toBeInstanceOf(NumberSchema);
    });
  });

  describe('nonempty', () => {
    it('ensures an array is non empty', () => {
      const nums = array(numberSchema()).nonempty();
      expect(nums.parse([1])).toEqual([1]);
      expect(() => nums.parse([])).toThrow('empty');
    });
  });

  describe('min', () => {
    it('ensures array.length >= min', () => {
      const min5 = array(numberSchema()).min(5);
      expect(min5.parse([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
      expect(() => min5.parse([])).toThrow();
    });
  });

  describe('max', () => {
    it('ensures array.length <= min', () => {
      const max5 = array(numberSchema()).max(5);

      expect(max5.parse([])).toEqual([]);
      expect(() => max5.parse([1, 2, 3, 4, 5, 6])).toThrow();
    });
  });

  describe('length', () => {
    it('ensures array.length === length', () => {
      const one_num = array(numberSchema()).length(1);

      expect(one_num.parse([1])).toEqual([1]);
      expect(() => one_num.parse([])).toThrow();
    });
  });
});
