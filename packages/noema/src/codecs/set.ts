import {
  AnyCodec,
  Codec,
  createCodec,
  ErrorOf,
  InputOf,
  ResultOf,
  TypeOf,
} from "../Codec.js"
import { invalidSet, InvalidSet } from "../DecodeError.js"
import { SetMetadata } from "../Metadata.js"
import { failure, failures, Result, success } from "../Result.js"
import { identity, isSet } from "../utils.js"
import { NonEmptyArray } from "./nonEmptyArray.js"

export type SetCodec<C extends AnyCodec> = Codec<
  Set<InputOf<C>>,
  Set<TypeOf<C>>,
  ErrorOf<C> | InvalidSet,
  SetMetadata<C>
>

export const set = <C extends AnyCodec>(codec: C): SetCodec<C> => {
  const simple = codec.metadata.simple
  return createCodec(
    (val): Result<Set<TypeOf<C>>, ErrorOf<C> | InvalidSet> => {
      if (!isSet(val)) return failure(invalidSet(val))

      let ok = true
      const errors: ErrorOf<C>[] = []
      const set: Set<TypeOf<C>> = simple ? (val as Set<TypeOf<C>>) : new Set()

      for (const value of val) {
        const result = codec.decode(value) as ResultOf<C>
        if (!result.ok) {
          ok = false
          errors.push(...result.errors)
        } else if (!simple && ok) {
          set.add(result.value)
        }
      }

      return ok
        ? success(set)
        : failures(errors as unknown as NonEmptyArray<ErrorOf<C>>)
    },
    simple
      ? (identity as (value: Set<TypeOf<C>>) => Set<InputOf<C>>)
      : (set) => {
          const result = new Set<InputOf<C>>()
          for (const value of set) {
            result.add(codec.encode(value))
          }
          return result
        },
    { tag: "set", simple, codec }
  )
}