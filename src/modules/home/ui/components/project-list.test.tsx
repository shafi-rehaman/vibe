import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import { ProjectList } from './project-list'
import { QueryClient } from '@tanstack/react-query'
import { mockUseTRPC } from '@/test/mocks/trpc'

vi.mock('@/trpc/client', () => ({
  useTRPC: mockUseTRPC,
}))

describe('ProjectList', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
  })

  it('should render the heading', () => {
    render(<ProjectList />, { queryClient })
    expect(screen.getByText('Saved Vibes')).toBeInTheDocument()
  })

  it('should show "No project found" when projects array is empty', async () => {
    queryClient.setQueryData(['projects', 'getMany'], [])
    
    render(<ProjectList />, { queryClient })
    
    await waitFor(() => {
      expect(screen.getByText('No project found')).toBeInTheDocument()
    })
  })

  it('should render project cards when projects exist', async () => {
    const mockProjects = [
      {
        id: '1',
        name: 'Test Project 1',
        updatedAt: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        name: 'Test Project 2',
        updatedAt: new Date('2024-01-02'),
        createdAt: new Date('2024-01-02'),
      },
    ]

    queryClient.setQueryData(['projects', 'getMany'], mockProjects)
    
    render(<ProjectList />, { queryClient })
    
    await waitFor(() => {
      expect(screen.getByText('Test Project 1')).toBeInTheDocument()
      expect(screen.getByText('Test Project 2')).toBeInTheDocument()
    })
  })

  it('should render logos for each project', async () => {
    const mockProjects = [
      {
        id: '1',
        name: 'Test Project',
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ]

    queryClient.setQueryData(['projects', 'getMany'], mockProjects)
    
    render(<ProjectList />, { queryClient })
    
    await waitFor(() => {
      const logos = screen.getAllByAltText('Vibe')
      expect(logos.length).toBeGreaterThan(0)
    })
  })

  it('should render links to project pages', async () => {
    const mockProjects = [
      {
        id: 'project-123',
        name: 'Test Project',
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ]

    queryClient.setQueryData(['projects', 'getMany'], mockProjects)
    
    render(<ProjectList />, { queryClient })
    
    await waitFor(() => {
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/projects/project-123')
    })
  })

  it('should display relative time for each project', async () => {
    const mockProjects = [
      {
        id: '1',
        name: 'Recent Project',
        updatedAt: new Date(Date.now() - 1000 * 60 * 5),
        createdAt: new Date(),
      },
    ]

    queryClient.setQueryData(['projects', 'getMany'], mockProjects)
    
    render(<ProjectList />, { queryClient })
    
    await waitFor(() => {
      expect(screen.getByText(/ago$/)).toBeInTheDocument()
    })
  })

  it('should use formatDistanceToNow with addSuffix', async () => {
    const mockProjects = [
      {
        id: '1',
        name: 'Test',
        updatedAt: new Date(Date.now() - 1000 * 60 * 60),
        createdAt: new Date(),
      },
    ]

    queryClient.setQueryData(['projects', 'getMany'], mockProjects)
    
    render(<ProjectList />, { queryClient })
    
    await waitFor(() => {
      const timeText = screen.getByText(/hour ago/)
      expect(timeText).toBeInTheDocument()
    })
  })

  it('should have grid layout for projects', async () => {
    const mockProjects = [
      { id: '1', name: 'P1', updatedAt: new Date(), createdAt: new Date() },
      { id: '2', name: 'P2', updatedAt: new Date(), createdAt: new Date() },
    ]

    queryClient.setQueryData(['projects', 'getMany'], mockProjects)
    
    const { container } = render(<ProjectList />, { queryClient })
    
    await waitFor(() => {
      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-3')
    })
  })

  it('should truncate long project names', async () => {
    const mockProjects = [
      {
        id: '1',
        name: 'Very Long Project Name That Should Be Truncated',
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ]

    queryClient.setQueryData(['projects', 'getMany'], mockProjects)
    
    const { container } = render(<ProjectList />, { queryClient })
    
    await waitFor(() => {
      const nameElement = container.querySelector('.truncate')
      expect(nameElement).toBeInTheDocument()
    })
  })

  it('should render multiple projects correctly', async () => {
    const mockProjects = Array.from({ length: 6 }, (_, i) => ({
      id: `project-${i}`,
      name: `Project ${i + 1}`,
      updatedAt: new Date(Date.now() - i * 1000 * 60 * 60),
      createdAt: new Date(),
    }))

    queryClient.setQueryData(['projects', 'getMany'], mockProjects)
    
    render(<ProjectList />, { queryClient })
    
    await waitFor(() => {
      mockProjects.forEach((project) => {
        expect(screen.getByText(project.name)).toBeInTheDocument()
      })
    })
  })

  it('should have rounded corners on container', () => {
    const { container } = render(<ProjectList />, { queryClient })
    const mainDiv = container.querySelector('.rounded-xl')
    expect(mainDiv).toBeInTheDocument()
  })

  it('should use correct logo dimensions', async () => {
    const mockProjects = [
      { id: '1', name: 'Test', updatedAt: new Date(), createdAt: new Date() },
    ]

    queryClient.setQueryData(['projects', 'getMany'], mockProjects)
    
    render(<ProjectList />, { queryClient })
    
    await waitFor(() => {
      const logo = screen.getByAltText('Vibe')
      expect(logo).toHaveAttribute('height', '32')
      expect(logo).toHaveAttribute('width', '32')
    })
  })

  describe('edge cases', () => {
    it('should handle undefined projects gracefully', () => {
      queryClient.setQueryData(['projects', 'getMany'], undefined)
      
      render(<ProjectList />, { queryClient })
      
      expect(screen.getByText('Saved Vibes')).toBeInTheDocument()
    })

    it('should handle project with very old date', async () => {
      const mockProjects = [
        {
          id: '1',
          name: 'Old Project',
          updatedAt: new Date('2020-01-01'),
          createdAt: new Date('2020-01-01'),
        },
      ]

      queryClient.setQueryData(['projects', 'getMany'], mockProjects)
      
      render(<ProjectList />, { queryClient })
      
      await waitFor(() => {
        expect(screen.getByText(/years ago/)).toBeInTheDocument()
      })
    })
  })

  describe('accessibility', () => {
    it('should have semantic HTML structure', () => {
      render(<ProjectList />, { queryClient })
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Saved Vibes')
    })

    it('should have accessible links', async () => {
      const mockProjects = [
        { id: '1', name: 'Test', updatedAt: new Date(), createdAt: new Date() },
      ]

      queryClient.setQueryData(['projects', 'getMany'], mockProjects)
      
      render(<ProjectList />, { queryClient })
      
      await waitFor(() => {
        const links = screen.getAllByRole('link')
        expect(links.length).toBeGreaterThan(0)
      })
    })

    it('should have alt text for all images', async () => {
      const mockProjects = [
        { id: '1', name: 'Test', updatedAt: new Date(), createdAt: new Date() },
        { id: '2', name: 'Test 2', updatedAt: new Date(), createdAt: new Date() },
      ]

      queryClient.setQueryData(['projects', 'getMany'], mockProjects)
      
      render(<ProjectList />, { queryClient })
      
      await waitFor(() => {
        const images = screen.getAllByAltText('Vibe')
        expect(images).toHaveLength(2)
      })
    })
  })
})