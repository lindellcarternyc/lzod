import { Schema, SchemaArgs } from '../../lzod.types';
import { BaseSchema } from '../base/base.schema';
import { enumSchema, EnumSchema } from '../enum/enum.schema';

type SchemaMap = Record<string, BaseSchema<unknown>>;

type Keys<R extends Record<string, unknown>> = keyof R;

class ObjectSchema<
  SMap extends Record<string, Schema<unknown>>
> extends BaseSchema<{
  [K in keyof SMap]: ReturnType<SMap[K]['parse']>;
}> {
  constructor(private readonly schema: SMap, args?: SchemaArgs) {
    super(v => typeof v === 'object' && Array.isArray(v) === false, args);
  }

  parse(value: unknown): { [K in keyof SMap]: ReturnType<SMap[K]['parse']> } {
    const objectValue = super.parse(value);

    const result = Object.keys(this.schema).reduce(
      (acc, key) => {
        return {
          ...acc,
          [key]: this.schema[key].parse(objectValue[key]),
        };
      },
      {} as {
        [K in keyof SMap]: ReturnType<SMap[K]['parse']>;
      }
    );

    return result;
  }

  get shape(): SMap {
    return {
      ...this.schema,
    };
  }

  keyof(): EnumSchema<Keys<SMap> & string> {
    const keys = Object.keys(this.schema) as ReadonlyArray<Keys<SMap> & string>;
    return enumSchema(keys);
  }

  extend<SMap2 extends SchemaMap>(schema: SMap2) {
    return new ObjectSchema({
      ...this.schema,
      ...schema,
    });
  }

  merge<SMap2 extends SchemaMap>(schema: ObjectSchema<SMap2>) {
    return this.extend(schema.schema);
  }
}

export const object = <SMap extends SchemaMap>(
  schema: SMap,
  args?: SchemaArgs
): ObjectSchema<SMap> => {
  return new ObjectSchema(schema, args);
};
