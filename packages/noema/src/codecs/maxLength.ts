import {
  Codec,
  createCodec,
  ErrorOf,
  InputOf,
  IsSimple,
  Metadata,
  ResultOf,
  TypeOf,
} from "../Codec.js"
import { tooLong, TooLong } from "../DecodeError.js"
import { failure } from "../Result.js"
import { HasLength } from "../types.js"
import { hasLength } from "../utils.js"

interface MaxLengthMetadataa<C extends Codec<HasLength, any>> extends Metadata {
  readonly tag: "maxLength"
  readonly simple: IsSimple<C>
  readonly maxLength: number
  readonly codec: C
}

export type MaxLengthCodec<C extends Codec<HasLength, any>> = Codec<
  InputOf<C>,
  TypeOf<C>,
  ErrorOf<C> | TooLong,
  MaxLengthMetadataa<C>
>

export const maxLength = <C extends Codec<HasLength, any>>(
  codec: C,
  maxLength: number
): MaxLengthCodec<C> =>
  createCodec(
    (val) =>
      hasLength(val) && val.length > maxLength
        ? failure(tooLong(val, maxLength))
        : (codec.decode(val) as ResultOf<C>),
    codec.encode as (value: TypeOf<C>) => InputOf<C>,
    { tag: "maxLength", simple: codec.meta.simple, codec, maxLength }
  )
