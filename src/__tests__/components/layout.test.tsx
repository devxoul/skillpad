import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Sidebar } from '@/components/Sidebar'
import { MainContent } from '@/components/MainContent'

vi.mock('@tauri-apps/api/window', () => ({
  getCurrentWindow: () => ({
    theme: vi.fn().mockResolvedValue('light'),
    onThemeChanged: vi.fn().mockResolvedValue(() => {}),
  }),
}))

describe('Layout', () => {
  it('renders Layout component with Sidebar and MainContent', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    )

    expect(screen.getByText('Sidebar placeholder')).toBeInTheDocument()
  })

  it('renders home page content at root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout />
      </MemoryRouter>
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Welcome to Skillchang')).toBeInTheDocument()
  })

  it('renders global page at /global route', () => {
    render(
      <MemoryRouter initialEntries={['/global']}>
        <Layout />
      </MemoryRouter>
    )

    expect(screen.getByText('Global Skills')).toBeInTheDocument()
  })

  it('renders project page at /project/:id route', () => {
    render(
      <MemoryRouter initialEntries={['/project/123']}>
        <Layout />
      </MemoryRouter>
    )

    expect(screen.getByText('Project')).toBeInTheDocument()
  })
})

describe('Sidebar', () => {
  it('renders sidebar with placeholder text', () => {
    render(<Sidebar />)

    expect(screen.getByText('Sidebar placeholder')).toBeInTheDocument()
  })
})

describe('MainContent', () => {
  it('renders MainContent component', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <MainContent />
      </MemoryRouter>
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
