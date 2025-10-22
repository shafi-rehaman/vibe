import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { ProjectForm } from './project-form'
import { mockUseTRPC } from '@/test/mocks/trpc'
import { useRouter } from 'next/navigation'

vi.mock('@/trpc/client', () => ({
  useTRPC: mockUseTRPC,
}))

describe('ProjectForm', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    } as any)
  })

  it('should render the form', () => {
    render(<ProjectForm />)
    expect(screen.getByPlaceholderText('What would you like to build today?')).toBeInTheDocument()
  })

  it('should render submit button', () => {
    render(<ProjectForm />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should render keyboard shortcut hint', () => {
    render(<ProjectForm />)
    expect(screen.getByText(/to submit/i)).toBeInTheDocument()
  })

  it('should render template buttons', () => {
    render(<ProjectForm />)
    expect(screen.getByText(/Build a Netflix clone/i)).toBeInTheDocument()
    expect(screen.getByText(/Build an admin dashboard/i)).toBeInTheDocument()
  })

  it('should have 8 template buttons', () => {
    render(<ProjectForm />)
    const templateButtons = screen.getAllByRole('button').filter(
      (btn) => btn.textContent?.includes('Build')
    )
    expect(templateButtons.length).toBe(8)
  })

  it('should allow text input in textarea', async () => {
    const user = userEvent.setup()
    render(<ProjectForm />)
    
    const textarea = screen.getByPlaceholderText('What would you like to build today?')
    await user.type(textarea, 'Build a todo app')
    
    expect(textarea).toHaveValue('Build a todo app')
  })

  it('should populate textarea when template button is clicked', async () => {
    const user = userEvent.setup()
    render(<ProjectForm />)
    
    const netflixButton = screen.getByText(/Build a Netflix clone/i)
    await user.click(netflixButton)
    
    const textarea = screen.getByPlaceholderText('What would you like to build today?')
    expect(textarea).toHaveValue(expect.stringContaining('Netflix-style'))
  })

  it('should have submit button disabled when form is empty', () => {
    render(<ProjectForm />)
    const submitButtons = screen.getAllByRole('button')
    const submitButton = submitButtons.find((btn) => 
      btn.querySelector('svg') && btn.classList.contains('size-8')
    )
    expect(submitButton).toBeDisabled()
  })

  it('should enable submit button when text is entered', async () => {
    const user = userEvent.setup()
    render(<ProjectForm />)
    
    const textarea = screen.getByPlaceholderText('What would you like to build today?')
    await user.type(textarea, 'Test input')
    
    await waitFor(() => {
      const submitButtons = screen.getAllByRole('button')
      const submitButton = submitButtons.find((btn) => 
        btn.querySelector('svg') && btn.classList.contains('size-8')
      )
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('should apply focus styles when textarea is focused', async () => {
    const user = userEvent.setup()
    const { container } = render(<ProjectForm />)
    
    const textarea = screen.getByPlaceholderText('What would you like to build today?')
    await user.click(textarea)
    
    const form = container.querySelector('form')
    expect(form).toHaveClass('shadow-xs')
  })

  it('should validate minimum length', async () => {
    const user = userEvent.setup()
    render(<ProjectForm />)
    
    const textarea = screen.getByPlaceholderText('What would you like to build today?')
    await user.clear(textarea)
    
    const submitButtons = screen.getAllByRole('button')
    const submitButton = submitButtons.find((btn) => 
      btn.querySelector('svg') && btn.classList.contains('size-8')
    )
    expect(submitButton).toBeDisabled()
  })

  it('should have proper styling classes', () => {
    const { container } = render(<ProjectForm />)
    const form = container.querySelector('form')
    
    expect(form).toHaveClass('relative', 'border', 'rounded-xl', 'bg-sidebar')
  })

  it('should render all 8 PROJECT_TEMPLATES', () => {
    render(<ProjectForm />)
    
    expect(screen.getByText(/Netflix clone/i)).toBeInTheDocument()
    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/kanban board/i)).toBeInTheDocument()
    expect(screen.getByText(/file manager/i)).toBeInTheDocument()
    expect(screen.getByText(/YouTube clone/i)).toBeInTheDocument()
    expect(screen.getByText(/store page/i)).toBeInTheDocument()
    expect(screen.getByText(/Airbnb clone/i)).toBeInTheDocument()
    expect(screen.getByText(/Spotify clone/i)).toBeInTheDocument()
  })

  it('should include emojis in template buttons', () => {
    render(<ProjectForm />)
    
    const netflixButton = screen.getByText(/Netflix clone/i)
    expect(netflixButton.textContent).toMatch(/🎬/)
  })

  it('should have template buttons hidden on mobile', () => {
    const { container } = render(<ProjectForm />)
    const templateContainer = container.querySelector('.hidden.md\\:flex')
    expect(templateContainer).toBeInTheDocument()
  })

  it('should support Cmd+Enter keyboard shortcut hint', () => {
    render(<ProjectForm />)
    const kbd = screen.getByText('⌘')
    expect(kbd).toBeInTheDocument()
  })

  describe('edge cases', () => {
    it('should handle rapid template clicks', async () => {
      const user = userEvent.setup()
      render(<ProjectForm />)
      
      const netflixButton = screen.getByText(/Netflix clone/i)
      const dashboardButton = screen.getByText(/admin dashboard/i)
      
      await user.click(netflixButton)
      await user.click(dashboardButton)
      
      const textarea = screen.getByPlaceholderText('What would you like to build today?')
      expect(textarea).toHaveValue(expect.stringContaining('admin dashboard'))
    })

    it('should handle special characters in input', async () => {
      const user = userEvent.setup()
      render(<ProjectForm />)
      
      const textarea = screen.getByPlaceholderText('What would you like to build today?')
      await user.type(textarea, 'Test <script>alert("xss")</script>')
      
      expect(textarea).toHaveValue('Test <script>alert("xss")</script>')
    })
  })

  describe('accessibility', () => {
    it('should have accessible form elements', () => {
      render(<ProjectForm />)
      const textarea = screen.getByPlaceholderText('What would you like to build today?')
      expect(textarea).toHaveAttribute('placeholder')
    })

    it('should have accessible buttons', () => {
      render(<ProjectForm />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })
})