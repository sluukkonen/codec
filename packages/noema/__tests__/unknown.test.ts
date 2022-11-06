import { unknown } from "../src/index.js"
import { expectParseSuccess } from "./helpers.js"

describe("unknown", () => {
  test("should parse any value", () => {
    expectParseSuccess(unknown, "")
    expectParseSuccess(unknown, 1)
    expectParseSuccess(unknown, null)
  })
})
