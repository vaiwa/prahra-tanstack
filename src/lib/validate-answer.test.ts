import { describe, expect, it } from "vitest"
import { validateAnswer } from "./validate-answer"

describe("validateAnswer", () => {
  describe("exact", () => {
    it("matches case-insensitively", () => {
      expect(validateAnswer("Prague", "prague", "exact")).toBe(true)
      expect(validateAnswer("PRAGUE", "prague", "exact")).toBe(true)
    })

    it("trims whitespace", () => {
      expect(validateAnswer("  prague  ", "prague", "exact")).toBe(true)
    })

    it("rejects wrong answers", () => {
      expect(validateAnswer("brno", "prague", "exact")).toBe(false)
    })

    it("accepts any of multiple correct answers", () => {
      expect(validateAnswer("12", ["12", "dvanáct"], "exact")).toBe(true)
      expect(validateAnswer("dvanáct", ["12", "dvanáct"], "exact")).toBe(true)
      expect(validateAnswer("13", ["12", "dvanáct"], "exact")).toBe(false)
    })
  })

  describe("regex", () => {
    it("matches regex pattern", () => {
      expect(validateAnswer("Brahe", "^[Bb]rahe$", "regex")).toBe(true)
      expect(validateAnswer("brahe", "^[Bb]rahe$", "regex")).toBe(true)
    })

    it("rejects non-matching input", () => {
      expect(validateAnswer("brahms", "^[Bb]rahe$", "regex")).toBe(false)
    })

    it("handles array (uses first element)", () => {
      expect(validateAnswer("brahe", ["^[Bb]rahe$"], "regex")).toBe(true)
    })
  })

  describe("multi-choice", () => {
    it("first option is correct", () => {
      expect(validateAnswer("Correct", ["Correct", "Wrong1", "Wrong2"], "multi-choice")).toBe(true)
    })

    it("other options are wrong", () => {
      expect(validateAnswer("Wrong1", ["Correct", "Wrong1", "Wrong2"], "multi-choice")).toBe(false)
    })
  })

  describe("qr-code", () => {
    it("matches exact value (case-sensitive)", () => {
      expect(validateAnswer("ABC123", "ABC123", "qr-code")).toBe(true)
      expect(validateAnswer("abc123", "ABC123", "qr-code")).toBe(false)
    })
  })

  describe("none", () => {
    it("always returns true", () => {
      expect(validateAnswer("", "", "none")).toBe(true)
      expect(validateAnswer("anything", "whatever", "none")).toBe(true)
    })
  })
})
