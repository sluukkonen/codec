import { ErrorOf } from "../dist/index.js"
import { AnyCodec, InputOf, NoemaError, TypeOf } from "../src/index.js"

export const expectParseSuccess = function <C extends AnyCodec>(
  codec: C,
  value: InputOf<C>,
  result?: TypeOf<C>
) {
  const expected = arguments.length === 3 ? result : value
  const decoded = codec.unsafeDecode(value)
  expect(decoded).toEqual(expected)
  expect(codec.encode(decoded)).toEqual(value)
}

export const expectParseFailure = <C extends AnyCodec>(
  codec: C,
  value: unknown,
  errors: readonly ErrorOf<C>[]
) => {
  const result = codec.decode(value)

  expect(result.ok).toBe(false)
  if (!result.ok) {
    expect(result.errors).toEqual(errors)
    expect(() => codec.unsafeDecode(value)).toThrow(new NoemaError("", errors))
  }
}
