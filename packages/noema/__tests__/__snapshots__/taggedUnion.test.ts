import { fromJson, literal, object, taggedUnion } from "../../src/index.js"
import { expectParseFailure, expectParseSuccess } from "../helpers.js"

const Plane = object({ type: literal("plane") })
const Car = object({ type: literal("car") })
const Vehicle = taggedUnion("type", ["plane", Plane], ["car", Car])

test("should parse valid values", () => {
  expectParseSuccess(Vehicle, { type: "car" })
  expectParseSuccess(Vehicle, { type: "plane" })
})

test("should fail to parse non-objects", () => {
  expectParseFailure(Vehicle, null)
})

test("should fail to parse objects without the proper tag", () => {
  expectParseFailure(Vehicle, { foo: "bar" })
})

test("should fail to parse objects where the tag does not match", () => {
  expectParseFailure(Vehicle, { type: "boat" })
})

test("should work with complex codecs", () => {
  const complex = taggedUnion("type", [
    "complex",
    object({ type: literal("complex"), n: fromJson.bigint }),
  ])

  expectParseSuccess(
    complex,
    { type: "complex", n: "1" },
    { type: "complex", n: 1n }
  )
})
