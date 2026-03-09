/**
 * Lightweight Markdown renderer for game descriptions.
 * Data is authored by developers (not user input), so dangerouslySetInnerHTML is safe.
 * Supports: **bold**, *italic*, [link](url), \n\n paragraphs, \n line breaks.
 */
export const renderMarkdown = (text: string): string => {
  return text
    .split("\n\n")
    .map((paragraph) => {
      const html = paragraph
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, (_, text, url) => {
          const safeUrl = url.replace(/"/g, "&quot;")
          return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="underline text-primary hover:text-primary/80">${text}</a>`
        })
        .replace(/\n/g, "<br />")
      return `<p>${html}</p>`
    })
    .join("")
}
