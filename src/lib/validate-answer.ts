import type { AnswerType } from "@/types/game"

/**
 * Validate a player's answer against the correct answer.
 * Returns true if the answer is correct.
 */
export function validateAnswer(
  input: string,
  correctAnswer: string | string[],
  answerType: AnswerType,
): boolean {
  const trimmed = input.trim()

  switch (answerType) {
    case "exact": {
      if (Array.isArray(correctAnswer)) {
        return correctAnswer.some(
          (a) => a.toLowerCase() === trimmed.toLowerCase(),
        )
      }
      return correctAnswer.toLowerCase() === trimmed.toLowerCase()
    }

    case "regex": {
      const pattern = Array.isArray(correctAnswer)
        ? correctAnswer[0]
        : correctAnswer
      try {
        const regex = new RegExp(pattern, "i")
        return regex.test(trimmed)
      } catch {
        // Invalid regex — fall back to exact match
        return pattern.toLowerCase() === trimmed.toLowerCase()
      }
    }

    case "multi-choice": {
      if (Array.isArray(correctAnswer)) {
        // First item in the array is the correct answer
        return correctAnswer[0].toLowerCase() === trimmed.toLowerCase()
      }
      return correctAnswer.toLowerCase() === trimmed.toLowerCase()
    }

    case "qr-code": {
      // QR code value must match exactly
      const expected = Array.isArray(correctAnswer)
        ? correctAnswer[0]
        : correctAnswer
      return expected === trimmed
    }

    case "none":
      // No answer needed — always correct
      return true

    default:
      return false
  }
}
