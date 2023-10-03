export type Primitive = string | number | bigint | boolean | undefined | null

export type Ordered = number | bigint | string | Date

export type HasLength = string | any[]

export type TypeName =
  | "array"
  | "bigint"
  | "boolean"
  | "date"
  | "error"
  | "function"
  | "map"
  | "null"
  | "number"
  | "object"
  | "promise"
  | "regexp"
  | "set"
  | "string"
  | "symbol"
  | "undefined"

export type EnumLike = Record<string, Primitive>
