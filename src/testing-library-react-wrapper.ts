// Wrapper for @testing-library/react that provides a working screen

import { getQueriesForElement } from '@testing-library/dom'
import * as rtl from '@testing-library/react'

// Re-export everything from @testing-library/react except screen
export const { render, fireEvent, waitFor, cleanup, act } = rtl

// Create a working screen object using the document.body
// This bypasses the broken screen that was created at import time
const createWorkingScreen = () => {
  if (typeof document === 'undefined' || !document.body) {
    // If document.body is not available, return the broken screen
    return rtl.screen
  }

  // Create a new screen object using getQueriesForElement
  const queries = getQueriesForElement(document.body)
  return {
    ...queries,
    debug: rtl.screen.debug,
    logTestingPlaygroundURL: rtl.screen.logTestingPlaygroundURL,
  }
}

// Export screen as a getter that creates a working version
Object.defineProperty(exports, 'screen', {
  get() {
    return createWorkingScreen()
  },
  configurable: true,
})
