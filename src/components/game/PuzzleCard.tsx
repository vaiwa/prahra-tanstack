import { useState } from "react"
import { MediaRenderer } from "@/components/game/MediaRenderer"
import { renderMarkdown } from "@/lib/renderMarkdown"
import { validateAnswer } from "@/lib/validate-answer"
import type { Level } from "@/types/game"

type PuzzleCardProps = {
  level: Level
  revealedHintIndices: number[]
  onRevealHint: (hintIndex: number) => void
  onCorrectAnswer: () => void
  /** Allow manual unlock (GPS fallback) */
  onManualUnlock?: () => void
}

export const PuzzleCard = ({
  level,
  revealedHintIndices,
  onRevealHint,
  onCorrectAnswer,
  onManualUnlock,
}: PuzzleCardProps) => {
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [showHintConfirm, setShowHintConfirm] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim()) return

    const isCorrect = validateAnswer(answer, level.answer, level.answerType)

    if (isCorrect) {
      setFeedback("correct")
      setTimeout(() => onCorrectAnswer(), 800)
    } else {
      setFeedback("wrong")
      setTimeout(() => setFeedback(null), 2000)
    }
  }

  const handleRevealHint = (index: number) => {
    onRevealHint(index)
    setShowHintConfirm(null)
  }

  const nextHintIndex = revealedHintIndices.length
  const hasMoreHints = nextHintIndex < level.hints.length
  const nextHint = hasMoreHints ? level.hints[nextHintIndex] : null

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      {/* Level title */}
      <div>
        <h2 className="text-lg font-bold text-foreground">{level.name}</h2>
        <div
          className="text-sm text-muted-foreground mt-2 space-y-2 [&_strong]:font-bold [&_em]:italic"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: developer-authored game data, not user input
          dangerouslySetInnerHTML={{ __html: renderMarkdown(level.description) }}
        />
      </div>

      {/* Level media */}
      {level.media.length > 0 && <MediaRenderer media={level.media} />}

      {/* Revealed hints */}
      {revealedHintIndices.length > 0 && (
        <div className="space-y-2">
          {revealedHintIndices.map((hintIdx) => (
            <div key={hintIdx} className="rounded-md bg-yellow-500/10 border border-yellow-500/30 p-3">
              <p className="text-xs font-medium text-yellow-400 mb-1">💡 Nápověda {hintIdx + 1}</p>
              <p className="text-sm text-foreground">{level.hints[hintIdx].text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Answer input (for non-'none' types) */}
      {level.answerType !== "none" ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {level.answerType === "multi-choice" && Array.isArray(level.answer) ? (
            <div className="space-y-2">
              {level.answer.map((option, i) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: static options list
                  key={i}
                  type="button"
                  onClick={() => {
                    setAnswer(option)
                    const isCorrect = validateAnswer(option, level.answer, level.answerType)
                    if (isCorrect) {
                      setFeedback("correct")
                      setTimeout(() => onCorrectAnswer(), 800)
                    } else {
                      setFeedback("wrong")
                      setTimeout(() => setFeedback(null), 2000)
                    }
                  }}
                  className={`w-full text-left p-3 rounded-md border transition-colors ${
                    answer === option
                      ? feedback === "correct"
                        ? "border-green-500 bg-green-500/10"
                        : feedback === "wrong"
                          ? "border-red-500 bg-red-500/10"
                          : "border-primary"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Napiš odpověď..."
                autoComplete="off"
                className={`w-full rounded-md border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
                  feedback === "correct"
                    ? "border-green-500 ring-green-500"
                    : feedback === "wrong"
                      ? "border-red-500 ring-red-500"
                      : "border-input"
                }`}
              />
              <button
                type="submit"
                className="w-full rounded-md bg-primary text-primary-foreground py-2 px-4 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                disabled={!answer.trim() || feedback === "correct"}
              >
                {feedback === "correct"
                  ? "✅ Správně!"
                  : feedback === "wrong"
                    ? "❌ Špatně, zkus to znovu"
                    : "Zkontrolovat"}
              </button>
            </>
          )}
        </form>
      ) : (
        <button
          type="button"
          onClick={onCorrectAnswer}
          className="w-full rounded-md bg-primary text-primary-foreground py-2 px-4 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Pokračovat →
        </button>
      )}

      {/* Hint button */}
      <div className="flex gap-2">
        {hasMoreHints &&
          (showHintConfirm === nextHintIndex ? (
            <div className="flex-1 rounded-md bg-yellow-500/10 border border-yellow-500/30 p-3 space-y-2">
              <p className="text-sm text-yellow-400">
                Zobrazit nápovědu? Penalizace: <strong>+{Math.round((nextHint?.penaltySec ?? 0) / 60)} min</strong>
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleRevealHint(nextHintIndex)}
                  className="flex-1 rounded-md bg-yellow-500/20 text-yellow-400 py-1 text-sm font-medium hover:bg-yellow-500/30"
                >
                  Ano, ukaž nápovědu
                </button>
                <button
                  type="button"
                  onClick={() => setShowHintConfirm(null)}
                  className="flex-1 rounded-md bg-muted text-muted-foreground py-1 text-sm font-medium hover:bg-muted/80"
                >
                  Ne
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowHintConfirm(nextHintIndex)}
              className="flex-1 rounded-md border border-yellow-500/30 text-yellow-400 py-2 px-4 text-sm hover:bg-yellow-500/10 transition-colors"
            >
              💡 Nápověda ({revealedHintIndices.length + 1}/{level.hints.length})
            </button>
          ))}
        {/* Manual unlock (GPS fallback) */}
        {onManualUnlock && (
          <button
            type="button"
            onClick={onManualUnlock}
            className="rounded-md border border-muted text-muted-foreground py-2 px-3 text-xs hover:bg-muted/50 transition-colors"
          >
            GPS nefunguje
          </button>
        )}
      </div>
    </div>
  )
}
