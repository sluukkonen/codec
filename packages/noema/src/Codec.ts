import { ParseError } from "./ParseError.js"
import { Result } from "./Result.js"
import { Metadata, SimpleMetadata } from "./Metadata.js"
import { identity } from "./utils.js"
import { DecodeError } from "./DecodeError.js"

export interface Codec<
  I,
  T = I,
  E extends DecodeError = DecodeError,
  M extends Metadata = Metadata
> {
  decode(value: unknown): Result<T, E>
  encode(value: T): I
  metadata: M
  unsafeDecode(value: unknown): T
  validate(value: unknown, path: string): Result<T, E>
}

export type AnyCodec = Codec<any>

export type InputOf<C extends AnyCodec> = C extends Codec<infer I> ? I : never
export type TypeOf<C extends AnyCodec> = C extends Codec<any, infer T>
  ? T
  : never
export type ErrorOf<C extends AnyCodec> = C extends Codec<any, any, infer E>
  ? E
  : never
export type ResultOf<C extends AnyCodec> = Result<TypeOf<C>, ErrorOf<C>>

export type SimpleCodec<
  T,
  E extends DecodeError = DecodeError,
  M extends SimpleMetadata = SimpleMetadata
> = Codec<T, T, E, M>
export type AnySimpleCodec = SimpleCodec<any>

export function createCodec<I, T, E extends DecodeError>(
  validate: (value: unknown, path: string) => Result<T, E>,
  encode: (value: T) => I
): Codec<I, T, E>
export function createCodec<I, T, E extends DecodeError, M extends Metadata>(
  validate: (value: unknown, path: string) => Result<T, E>,
  encode: (value: T) => I,
  metadata: M
): Codec<I, T, E, M>
export function createCodec<I, T, E extends DecodeError>(
  validate: (value: unknown, path: string) => Result<T, E>,
  encode: (value: T) => I,
  metadata: Metadata = { tag: "unknown", simple: false }
): Codec<I, T, E> {
  const decode = (value: unknown) => validate(value, "")
  const unsafeDecode = (value: unknown) => {
    const result = decode(value)
    if (result.ok) return result.value
    else throw new ParseError("", result.errors)
  }
  return {
    decode,
    encode,
    metadata,
    unsafeDecode,
    validate,
  }
}

export function createSimpleCodec<T, E extends DecodeError>(
  validate: (value: unknown, path: string) => Result<T, E>
): SimpleCodec<T, E>
export function createSimpleCodec<
  T,
  E extends DecodeError,
  M extends SimpleMetadata
>(
  validate: (value: unknown, path: string) => Result<T, E>,
  metadata: M
): SimpleCodec<T, E, M>
export function createSimpleCodec<T, E extends DecodeError>(
  validate: (value: unknown, path: string) => Result<T, E>,
  metadata: SimpleMetadata = { tag: "unknown", simple: true }
): SimpleCodec<T, E> {
  return createCodec(validate, identity, metadata)
}
