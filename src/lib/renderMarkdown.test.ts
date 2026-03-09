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

  it("rejects javascript: protocol in links", () => {
    const result = renderMarkdown("[xss](javascript:alert(1))")
    expect(result).not.toContain("href")
    expect(result).toContain("[xss](javascript:alert(1))")
  })

  it("rejects data: protocol in links", () => {
    const result = renderMarkdown("[xss](data:text/html,<script>alert(1)</script>)")
    expect(result).not.toContain("href")
  })

  it("allows http:// links", () => {
    const result = renderMarkdown("[ok](http://example.com)")
    expect(result).toContain('href="http://example.com"')
  })

  it("escapes quotes in URLs", () => {
    const result = renderMarkdown('[link](https://example.com/a"b)')
    expect(result).toContain('href="https://example.com/a&quot;b"')
  })
})
