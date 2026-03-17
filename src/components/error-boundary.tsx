import { Component, type ReactNode } from 'react'

import { defaultLocale, getTranslations, LocaleContext } from '@/lib/i18n'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  static override contextType = LocaleContext
  declare context: React.ContextType<typeof LocaleContext>

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const t = getTranslations(this.context?.locale ?? defaultLocale)

      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-red-600">{t.error_boundary_title}</h1>
            <p className="mb-4 text-muted-foreground">{this.state.error?.message || t.error_boundary_message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
            >
              {t.error_boundary_reload}
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
