import type { ErrorInfo, ReactNode } from "react"
import { Component } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Prahra] Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center space-y-2">
          <p className="text-lg">⚠️</p>
          <p className="text-sm font-medium text-red-400">Něco se pokazilo</p>
          <p className="text-xs text-muted-foreground">
            {this.state.error?.message}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-xs text-primary underline hover:text-primary/80"
          >
            Zkusit znovu
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
