import { SchemaArgs } from '../../lzod.types';
import { BaseSchema } from '../base/base.schema';

type StringArrayTypes<Values extends Readonly<string[]>> = Values[number];

const stringArrayTypes = (values: Readonly<string[]>): string => {
  return values.join(' | ');
};

type Enum<Values extends string> = { [K in Values]: K };

export class EnumSchema<Value extends string> extends BaseSchema<
  StringArrayTypes<Value[]>
> {
  readonly enum: Enum<StringArrayTypes<Value[]>>;

  constructor(
    private readonly values: ReadonlyArray<Value>,
    args?: SchemaArgs
  ) {
    super(v => typeof v === 'string', {
      required_error: args?.required_error,
      invalid_type_error: args?.invalid_type_error ?? 'Expected a string.',
    });

    this.enum = values.reduce((acc, cur) => {
      return {
        ...acc,
        [cur]: cur,
      };
    }, {} as Enum<Value>);
  }

  parse(value: unknown): StringArrayTypes<Value[]> {
    const stringValue = super.parse(value);

    if (this.values.includes(stringValue)) return stringValue;

    throw new Error(
      `Expected one of ${stringArrayTypes(this.values)}. Got ${value}.`
    );
  }

  get options(): Value[] {
    return [...this.values];
  }
}

export const enumSchema = <Value extends string>(
  values: ReadonlyArray<Value>,
  args?: SchemaArgs
): EnumSchema<Value> => {
  return new EnumSchema(values, args);
};
