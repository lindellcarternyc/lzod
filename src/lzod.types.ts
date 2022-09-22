export interface Schema<T> {
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

export type SchemaBuilder<SchemaType, Arg = null> = Arg extends null | undefined
  ? (opts?: { message: string }) => Schema<SchemaType>
  : (_: Arg, opts?: { message: string }) => Schema<SchemaType>;
