import { ParserArgs, SchemaArgs, SchemaBuilder } from '../../lzod.types';
import { BaseSchema } from '../base/base.schema';

const isNumber = (x: unknown): x is number =>
  typeof x === 'number' && !isNaN(x);

export class NumberSchema extends BaseSchema<number> {
  #gt?: ParserArgs<number>;
  #gte?: ParserArgs<number>;

  #lt?: ParserArgs<number>;
  #lte?: ParserArgs<number>;

  #int: ParserArgs<boolean> = {
    value: false,
  };

  #positive: ParserArgs<boolean> = {
    value: false,
  };

  #nonnegative: ParserArgs<boolean> = {
    value: false,
  };

  #negative: ParserArgs<boolean> = {
    value: false,
  };

  #nonpositive: ParserArgs<boolean> = {
    value: false,
  };

  constructor(args?: SchemaArgs) {
    super(isNumber, args);
  }

  parse(value: unknown): number {
    const numValue = super.parse(value);

    if (this.#gt && numValue <= this.#gt.value) {
      const message =
        this.#gt.message ??
        `Expected number > ${this.#gt.value}. Got ${numValue}.`;
      throw new Error(message);
    }

    if (this.#gte && numValue < this.#gte.value) {
      const message =
        this.#gte.message ??
        `Expected number >= ${this.#gte.value}. Got ${numValue}.`;
      throw new Error(message);
    }

    if (this.#lt && numValue >= this.#lt.value) {
      const message =
        this.#lt.message ??
        `Expected number < ${this.#lt.value}. Got ${numValue}.`;
      throw new Error(message);
    }

    if (this.#lte && numValue > this.#lte.value) {
      const message =
        this.#lte.message ??
        `Expected number <= ${this.#lte.value}. Got ${numValue}.`;
      throw new Error(message);
    }

    if (this.#int.value === true && Math.floor(numValue) !== numValue) {
      const message = this.#int.message ?? 'Expected an integer.';
      throw new Error(message);
    }

    if (this.#positive.value === true && numValue <= 0) {
      const message =
        this.#positive.message ??
        `Expected a positive number. Got ${numValue}.`;
      throw new Error(message);
    }

    if (this.#nonnegative.value === true && numValue < 0) {
      const message =
        this.#nonnegative.message ??
        `Expected a non-negative number. Got ${numValue}.`;
      throw new Error(message);
    }

    if (this.#negative.value === true && numValue >= 0) {
      const message =
        this.#negative.message ??
        `Expected a negative number. Got ${numValue}.`;

      throw new Error(message);
    }

    if (this.#nonpositive.value === true && numValue > 0) {
      const message =
        this.#nonpositive.message ??
        `Expected a non-positive number. Got ${numValue}.`;

      throw new Error(message);
    }

    return numValue;
  }

  gt: SchemaBuilder<number, number> = (value, opts) => {
    this.#gt = {
      value,
      ...opts,
    };
    return this;
  };

  gte: SchemaBuilder<number, number> = (value, opts) => {
    this.#gte = {
      value,
      ...opts,
    };
    return this;
  };

  min = this.gte;

  lt: SchemaBuilder<number, number> = (value, opts) => {
    this.#lt = {
      value,
      ...opts,
    };

    return this;
  };

  lte: SchemaBuilder<number, number> = (value, opts) => {
    this.#lte = {
      value,
      ...opts,
    };

    return this;
  };

  max = this.lte;

  int: SchemaBuilder<number> = opts => {
    this.#int = {
      value: true,
      ...opts,
    };

    return this;
  };

  positive: SchemaBuilder<number> = opts => {
    this.#positive = {
      value: true,
      ...opts,
    };

    return this;
  };

  nonnegative: SchemaBuilder<number> = opts => {
    this.#nonnegative = {
      value: true,
      ...opts,
    };
    return this;
  };

  negative: SchemaBuilder<number> = opts => {
    this.#negative = {
      value: true,
      ...opts,
    };

    return this;
  };

  nonpositive: SchemaBuilder<number> = opts => {
    this.#nonpositive = {
      value: true,
      ...opts,
    };

    return this;
  };
}

export const numberSchema = (args?: SchemaArgs) => {
  return new NumberSchema(args);
};
