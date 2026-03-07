import { describe, expect, it } from "vitest"
import { renderMarkdown } from "./renderMarkdown"

describe("renderMarkdown", () => {
  it("wraps plain text in <p>", () => {
    expect(renderMarkdown("hello")).toBe("<p>hello</p>")
  })

  it("renders **bold**", () => {
    expect(renderMarkdown("**bold**")).toBe("<p><strong>bold</strong></p>")
  })

  it("renders *italic*", () => {
    expect(renderMarkdown("*italic*")).toBe("<p><em>italic</em></p>")
  })

  it("renders bold and italic together", () => {
    expect(renderMarkdown("**bold** and *italic*")).toBe("<p><strong>bold</strong> and <em>italic</em></p>")
  })

  it("renders [link](url)", () => {
    const result = renderMarkdown("[click](https://example.com)")
    expect(result).toContain('href="https://example.com"')
    expect(result).toContain(">click</a>")
    expect(result).toContain('target="_blank"')
  })

  it("splits paragraphs on double newline", () => {
    const result = renderMarkdown("first\n\nsecond")
    expect(result).toBe("<p>first</p><p>second</p>")
  })

  it("converts single newline to <br />", () => {
    const result = renderMarkdown("line1\nline2")
    expect(result).toBe("<p>line1<br />line2</p>")
  })

  it("handles empty string", () => {
    expect(renderMarkdown("")).toBe("<p></p>")
  })
})
