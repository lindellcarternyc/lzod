import {
  SchemaClass,
  ParserArgs,
  SchemaArgs,
  SchemaBuilder,
} from '../../lzod.types';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export class StringSchema extends SchemaClass<string> {
  private minLength?: ParserArgs<number>;

  private maxLength?: ParserArgs<number>;

  private valueLength?: ParserArgs<number>;

  private isEmail: ParserArgs<boolean> = {
    value: false,
  };

  private valueStarts?: ParserArgs<string>;

  private valueEnds?: ParserArgs<string>;

  private required_error?: string;
  private invalid_type_errpr?: string;

  constructor({ required_error, invalid_type_error }: SchemaArgs = {}) {
    super();
    this.required_error = required_error;
    this.invalid_type_errpr = invalid_type_error;
  }

  parse = (value: unknown): string => {
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

    if (this.isEmail.value && EMAIL_REGEX.test(value) === false) {
      if (this.isEmail.message) throw new Error(this.isEmail.message);
      throw new Error(`Expected a valid email address.`);
    }

    if (
      this.valueStarts !== undefined &&
      value.startsWith(this.valueStarts.value) === false
    ) {
      if (this.valueStarts.message) throw new Error(this.valueStarts.message);
      throw new Error(
        `Expected value to start with '${this.valueStarts.value}'.`
      );
    }

    if (
      this.valueEnds !== undefined &&
      value.endsWith(this.valueEnds.value) === false
    ) {
      if (this.valueEnds.message) throw new Error(this.valueEnds.message);
      throw new Error(`Expected value to end with '${this.valueEnds.value}'.`);
    }

    return value;
  };

  min: SchemaBuilder<string, number> = (minLength, opts): this => {
    this.minLength = {
      value: minLength,
      ...opts,
    };
    return this;
  };

  max: SchemaBuilder<string, number> = (maxLength, opts): this => {
    this.maxLength = {
      value: maxLength,
      ...opts,
    };
    return this;
  };

  length: SchemaBuilder<string, number> = (valueLength, opts): this => {
    this.valueLength = {
      value: valueLength,
      ...opts,
    };
    return this;
  };

  email: SchemaBuilder<string> = (opts): this => {
    this.isEmail = {
      value: true,
      ...opts,
    };
    return this;
  };

  startsWith: SchemaBuilder<string, string> = (head, opts): this => {
    this.valueStarts = {
      value: head,
      ...opts,
    };
    return this;
  };

  endsWith: SchemaBuilder<string, string> = (tail, opts): this => {
    this.valueEnds = {
      value: tail,
      ...opts,
    };
    return this;
  };
}

export const stringSchema = (args: SchemaArgs = {}): StringSchema => {
  return new StringSchema(args);
};
