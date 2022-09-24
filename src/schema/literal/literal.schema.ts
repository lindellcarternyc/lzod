import { SchemaArgs } from '../../lzod.types';
import { BaseSchema } from '../base/base.schema';

type Primitive = string | boolean | number;

class Literal<Value extends Primitive> extends BaseSchema<Value> {
  constructor(private readonly literal: Value, args?: SchemaArgs) {
    super(() => true, args);
  }

  parse(value: unknown): Value {
    if (super.parse(value) !== this.literal) {
      throw new Error(`Expected ${this.literal}. Got ${value}.`);
    }

    return value as Value;
  }

  get value(): Value {
    return this.literal;
  }
}

export const literal = <Value extends Primitive>(
  value: Value,
  args?: SchemaArgs
): Literal<Value> => {
  return new Literal(value, args);
};
