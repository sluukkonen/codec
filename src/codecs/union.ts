import { ValidationContext } from "../ValidationContext.js"
import { SimpleCodec } from "../SimpleCodec.js"

type UnionInputs<T extends readonly unknown[]> = T extends readonly [
  SimpleCodec<infer I>,
  ...infer Rest
]
  ? I | UnionInputs<Rest>
  : T extends []
  ? never
  : T extends readonly SimpleCodec<infer I>[]
  ? I
  : never

class UnionCodec<
  C extends readonly SimpleCodec<any>[] | []
> extends SimpleCodec<UnionInputs<C>> {
  constructor(readonly members: C) {
    super((value, ctx) => {
      const innerCtx = new ValidationContext(ctx.path)

      for (let i = 0; i < members.length; i++) {
        const codec = members[i]
        const result = codec.validate(value, innerCtx)
        if (result.ok) return ctx.success(result.value)
      }

      return ctx.failure({
        code: "invalid_union",
        message: "Invalid union",
        value,
        issues: innerCtx.issues,
      })
    })
  }
}

export const union = <C extends readonly SimpleCodec<any>[] | []>(
  codecs: C
): UnionCodec<C> => new UnionCodec(codecs)
