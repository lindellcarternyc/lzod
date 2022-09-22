import { ParserArgs, SchemaArgs, SchemaBuilder } from '../../lzod.types';
import { BaseSchema } from '../base/base.schema';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const isString = (x: unknown): x is string => typeof x === 'string';

export class StringSchema extends BaseSchema<string> {
  private minLength?: ParserArgs<number>;

  private maxLength?: ParserArgs<number>;

  private valueLength?: ParserArgs<number>;

  private isEmail: ParserArgs<boolean> = {
    value: false,
  };

  private valueStarts?: ParserArgs<string>;

  private valueEnds?: ParserArgs<string>;

  constructor(args: SchemaArgs = {}) {
    super(isString, args);
  }

  parse = (value: unknown): string => {
    const stringValue = super.parse(value);

    if (
      this.minLength !== undefined &&
      this.minLength.value > stringValue.length
    ) {
      if (this.minLength.message) throw new Error(this.minLength.message);
      throw new Error(
        `Expected length >= ${this.minLength.value}. Got ${stringValue.length}.`
      );
    }

    if (
      this.maxLength !== undefined &&
      this.maxLength.value < stringValue.length
    ) {
      if (this.maxLength.message) throw new Error(this.maxLength.message);
      throw new Error(
        `Expected length <= ${this.maxLength}. Got ${stringValue.length}.`
      );
    }

    if (
      this.valueLength !== undefined &&
      this.valueLength.value !== stringValue.length
    ) {
      if (this.valueLength.message) throw new Error(this.valueLength.message);
      throw new Error(
        `Expected length === ${this.valueLength}. Got ${stringValue.length}.`
      );
    }

    if (this.isEmail.value && EMAIL_REGEX.test(stringValue) === false) {
      if (this.isEmail.message) throw new Error(this.isEmail.message);
      throw new Error('Expected a valid email address.');
    }

    if (
      this.valueStarts !== undefined &&
      stringValue.startsWith(this.valueStarts.value) === false
    ) {
      if (this.valueStarts.message) throw new Error(this.valueStarts.message);
      throw new Error(
        `Expected value to start with '${this.valueStarts.value}'.`
      );
    }

    if (
      this.valueEnds !== undefined &&
      stringValue.endsWith(this.valueEnds.value) === false
    ) {
      if (this.valueEnds.message) throw new Error(this.valueEnds.message);
      throw new Error(`Expected value to end with '${this.valueEnds.value}'.`);
    }

    return stringValue;
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
