import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import Page from './page'

vi.mock('@/modules/home/ui/components/project-form', () => ({
  ProjectForm: () => <div data-testid="project-form">ProjectForm</div>,
}))

vi.mock('@/modules/home/ui/components/project-list', () => ({
  ProjectList: () => <div data-testid="project-list">ProjectList</div>,
}))

describe('Home Page', () => {
  it('should render the page', () => {
    render(<Page />)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('should render the main heading', () => {
    render(<Page />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Build something with Vibe')
  })

  it('should render the subtitle', () => {
    render(<Page />)
    expect(screen.getByText('Create apps and websites Super Fast...')).toBeInTheDocument()
  })

  it('should render the logo image', () => {
    render(<Page />)
    const logo = screen.getByAltText('Vibe')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo.svg')
    expect(logo).toHaveAttribute('width', '50')
    expect(logo).toHaveAttribute('height', '50')
  })

  it('should have logo hidden on mobile', () => {
    render(<Page />)
    const logo = screen.getByAltText('Vibe')
    expect(logo).toHaveClass('hidden', 'md:block')
  })

  it('should render ProjectForm component', () => {
    render(<Page />)
    expect(screen.getByTestId('project-form')).toBeInTheDocument()
  })

  it('should render ProjectList component', () => {
    render(<Page />)
    expect(screen.getByTestId('project-list')).toBeInTheDocument()
  })

  it('should have proper layout structure', () => {
    const { container } = render(<Page />)
    const mainDiv = container.querySelector('.flex.flex-col.max-w-5xl')
    expect(mainDiv).toBeInTheDocument()
  })

  it('should have section with proper spacing', () => {
    const { container } = render(<Page />)
    const section = container.querySelector('section')
    expect(section).toHaveClass('space-y-6')
  })

  it('should have responsive text sizes', () => {
    render(<Page />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('text-2xl', 'md:text-5xl')
  })

  it('should render components in correct order', () => {
    const { container } = render(<Page />)
    const allContent = container.textContent || ''
    
    const headingIndex = allContent.indexOf('Build something with Vibe')
    const subtitleIndex = allContent.indexOf('Create apps and websites Super Fast')
    const formIndex = allContent.indexOf('ProjectForm')
    const listIndex = allContent.indexOf('ProjectList')
    
    expect(headingIndex).toBeLessThan(subtitleIndex)
    expect(subtitleIndex).toBeLessThan(formIndex)
    expect(formIndex).toBeLessThan(listIndex)
  })
})