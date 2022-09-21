interface Schema<T> {
  parse: (value: unknown) => T;
}

export interface SchemaArgs {
  required_error?: string;
  invalid_type_error?: string;
}

export interface ParserArgs<Value> {
  value: Value;
  message?: string;
}

export abstract class SchemaClass<T> implements Schema<T> {
  abstract parse(_: unknown): T;
}

export type SchemaBuilder<SchemaType, Arg = never> = Arg extends never
  ? (opts?: { message: string }) => SchemaClass<SchemaType>
  : (_: Arg, opts?: { message: string }) => SchemaClass<SchemaType>;
