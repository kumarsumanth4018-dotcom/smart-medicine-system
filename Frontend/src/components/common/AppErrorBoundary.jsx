/**
 * Component: AppErrorBoundary
 *
 * Description:
 *   React class-based Error Boundary that catches unhandled JavaScript
 *   errors anywhere in the component tree and displays a professional
 *   500 error page instead of a blank screen.
 *
 * Usage:
 *   Wrap the entire application tree in main.jsx:
 *   <AppErrorBoundary>
 *     <App />
 *   </AppErrorBoundary>
 *
 * Backend readiness:
 *   - TODO: Send error details to POST /api/v1/logs/client-error
 */

import { Component } from 'react'
import ServerErrorPage from '../../pages/errors/ServerErrorPage'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // TODO: POST /api/v1/logs/client-error with error + info.componentStack
    if (import.meta.env.DEV) {
      console.error('[AppErrorBoundary] Caught error:', error, info)
    }
  }

  handleRetry() {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return <ServerErrorPage onRetry={() => this.handleRetry()} />
    }
    return this.props.children
  }
}

export default AppErrorBoundary
