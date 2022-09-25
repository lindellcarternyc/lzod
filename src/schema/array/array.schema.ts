import { Infer, ParserArgs, SchemaArgs, SchemaBuilder } from '../../lzod.types';
import { BaseSchema } from '../base/base.schema';

type NonEmptyArray<T> = [T, ...T[]];

export class ArraySchema<
  SchemaType extends BaseSchema<unknown>
> extends BaseSchema<Array<Infer<SchemaType>>> {
  #min?: ParserArgs<number>;
  #max?: ParserArgs<number>;
  #length?: ParserArgs<number>;

  constructor(
    private readonly schema: SchemaType,
    private readonly args?: SchemaArgs
  ) {
    super(v => Array.isArray(v), args);
  }

  parse(value: unknown): Infer<SchemaType>[] {
    const arrayValue = super.parse(value);

    if (this.#min && arrayValue.length < this.#min.value) {
      const message =
        this.#min.message ?? `Expected at least ${this.#min.value} elements.`;

      throw new Error(message);
    }

    if (this.#max && arrayValue.length > this.#max.value) {
      const message =
        this.#max.message ?? `Expected fewer than ${this.#max.value}.`;
      throw new Error(message);
    }

    if (this.#length && arrayValue.length !== this.#length.value) {
      const message =
        this.#length.message ?? `Expected ${this.#length.value} elements.`;
      throw new Error(message);
    }

    const result: Infer<SchemaType>[] = [];

    for (const val of arrayValue) {
      const nextVal = this.schema.parse(val) as Infer<SchemaType>;
      result.push(nextVal);
    }

    return result;
  }

  get element(): SchemaType {
    return this.schema;
  }

  nonempty(): NonEmptyArraySchema<SchemaType> {
    return new NonEmptyArraySchema(this.schema, this.args);
  }

  min = (value: number, opts?: { message: string }) => {
    this.#min = {
      value,
      ...opts,
    };

    return this;
  };

  max: SchemaBuilder<Infer<this>[], number> = (value, opts) => {
    this.#max = {
      value,
      ...opts,
    };
    return this;
  };

  length: SchemaBuilder<Infer<this>[], number> = (value, opts) => {
    this.#length = {
      value,
      ...opts,
    };

    return this;
  };
}

class NonEmptyArraySchema<
  SchemaType extends BaseSchema<unknown>
> extends ArraySchema<SchemaType> {
  parse(value: unknown): [Infer<SchemaType>, ...Infer<SchemaType>[]] {
    const values = super.parse(value);

    if (values.length === 0) {
      throw new Error('Array cannot be empty.');
    }

    return values as NonEmptyArray<Infer<SchemaType>>;
  }
}
export const array = <SchemaType extends BaseSchema<unknown>>(
  schema: SchemaType,
  args?: SchemaArgs
): ArraySchema<SchemaType> => {
  return new ArraySchema(schema, args);
};
