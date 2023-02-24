import { createSimpleCodec, SimpleCodec } from "../Codec.js"
import { BooleanMetadata } from "../Metadata.js"
import { InvalidBoolean } from "../DecodeError.js"
import { failure, success } from "../Result.js"

type BooleanCodec = SimpleCodec<boolean, InvalidBoolean, BooleanMetadata>

export const boolean: BooleanCodec = createSimpleCodec(
  (val) =>
    typeof val === "boolean"
      ? success(val)
      : failure({
          code: "invalid_boolean",
          actual: val,
          path: [],
        }),
  {
    tag: "boolean",
    simple: true,
  }
)
