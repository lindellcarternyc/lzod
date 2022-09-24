import { Schema, SchemaArgs, TypeCheck } from '../../lzod.types';

export class BaseSchema<Value> implements Schema<Value> {
  private readonly required_error: string;
  private readonly invalid_type_error: string;
  private readonly typeCheck: TypeCheck;

  constructor(
    typeCheck: TypeCheck,
    { required_error, invalid_type_error }: SchemaArgs = {}
  ) {
    this.required_error = required_error ?? 'REQUIRED';
    this.invalid_type_error = invalid_type_error ?? 'INVALID TYPE';
    this.typeCheck = typeCheck;
  }

  parse(value: unknown): Value {
    if (value === null || value === undefined) {
      throw new Error(this.required_error);
    }

    if (!this.typeCheck(value)) {
      throw new Error(this.invalid_type_error);
    }

    // Assume it's correct type because of above
    return value as Value;
  }
}
