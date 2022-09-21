interface Schema<T> {
  parse: (value: unknown) => T;
}

interface StringSchemaArgs {
  required_error?: string;
  invalid_type_error?: string;
}

interface ParserArgs<Value> {
  value: Value;
  message?: string;
}

export class StringSchema implements Schema<string> {
  private minLength?: ParserArgs<number>;

  private maxLength?: ParserArgs<number>;

  private valueLength?: ParserArgs<number>;

  private required_error?: string;
  private invalid_type_errpr?: string;

  constructor({ required_error, invalid_type_error }: StringSchemaArgs = {}) {
    this.required_error = required_error;
    this.invalid_type_errpr = invalid_type_error;
  }

  parse(value: unknown): string {
    if (value === null || value === undefined) {
      if (this.required_error) throw new Error(this.required_error);
      throw new Error(`This value is required. Got ${value}`);
    }

    if (typeof value !== 'string') {
      if (this.invalid_type_errpr) throw new Error(this.invalid_type_errpr);
      throw new Error(`Expected string. Got '${typeof value}'`);
    }

    if (this.minLength !== undefined && this.minLength.value > value.length) {
      if (this.minLength.message) throw new Error(this.minLength.message);
      throw new Error(
        `Expected length >= ${this.minLength.value}. Got ${value.length}.`
      );
    }

    if (this.maxLength !== undefined && this.maxLength.value < value.length) {
      if (this.maxLength.message) throw new Error(this.maxLength.message);
      throw new Error(
        `Expected length <= ${this.maxLength}. Got ${value.length}.`
      );
    }

    if (
      this.valueLength !== undefined &&
      this.valueLength.value !== value.length
    ) {
      if (this.valueLength.message) throw new Error(this.valueLength.message);
      throw new Error(
        `Expected length === ${this.valueLength}. Got ${value.length}.`
      );
    }

    return value;
  }

  min(minLength: number, opts?: { message: string }): this {
    this.minLength = {
      value: minLength,
      ...opts,
    };
    return this;
  }

  max(maxLength: number, opts?: { message: string }): this {
    this.maxLength = {
      value: maxLength,
      ...opts,
    };
    return this;
  }

  length(valueLength: number, opts?: { message: string }): this {
    this.valueLength = {
      value: valueLength,
      ...opts,
    };
    return this;
  }
}

export const stringSchema = (args: StringSchemaArgs = {}): StringSchema => {
  return new StringSchema(args);
};
