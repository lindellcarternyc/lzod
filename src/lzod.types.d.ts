interface Schema<T> {
  parse: (value: unknown) => T;
}

interface SchemaArgs {
  required_error?: string;
  invalid_type_error?: string;
}

interface ParserArgs<Value> {
  value: Value;
  message?: string;
}

abstract class SchemaClass<T> implements Schema<T> {
  parse(_: unknown): T;
}

type SchemaBuilder<SchemaType, Arg = never> = Arg extends never
  ? (opts?: { message: string }) => SchemaClass<SchemaType>
  : (_: Arg, opts?: { message: string }) => SchemaClass<SchemaType>;
