import { NumberSchema, numberSchema } from '../number/number.schema';
import { StringSchema, stringSchema } from '../string/string.schema';
import { object } from './object.schema';

describe(object, () => {
  it('creates an object schema', () => {
    const dogSchema = object({
      name: stringSchema(),
      age: numberSchema(),
    });

    const dog = {
      name: 'fido',
      age: 12,
    };

    const actual = dogSchema.parse(dog);
    expect(actual).toEqual(dog);

    expect(() => dogSchema.parse({ name: 'dog' })).toThrow();
  });

  describe('shape', () => {
    it('provides access to underlying schema', () => {
      const userSchema = object({
        username: stringSchema(),
        pin: numberSchema(),
      });

      const { username, pin } = userSchema.shape;
      expect(username).toBeInstanceOf(StringSchema);
      expect(pin).toBeInstanceOf(NumberSchema);
    });
  });

  describe('keyof', () => {
    it('creates enum schema from the keys', () => {
      const userSchema = object({
        username: stringSchema(),
        password: stringSchema(),
      });

      const userKeySchema = userSchema.keyof();
      expect(userKeySchema.options).toEqual(['username', 'password']);
    });
  });

  describe('extend', () => {
    it('extends an existing schema with another object', () => {
      const userSchema = object({
        first: stringSchema(),
      });
      const withLast = userSchema.extend({
        last: stringSchema(),
      });

      const user = {
        first: 'lindell',
        last: 'carter',
      };

      expect(userSchema.parse(user)).toEqual({ first: 'lindell' });
      expect(withLast.parse(user)).toEqual(user);
    });
  });

  describe('merge', () => {
    it('merges 2 object schema', () => {
      const baseTeacher = object({
        students: object({
          id: stringSchema(),
        }),
      });

      const hasId = object({
        id: stringSchema(),
      });

      const Teacher = baseTeacher.merge(hasId);

      const teacher = {
        students: {
          id: 'a',
        },
        id: 'a',
      };

      expect(Teacher.parse(teacher)).toEqual(teacher);
    });
  });
});
