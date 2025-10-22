import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import { MessagesContainer } from './messages-container'
import { QueryClient } from '@tanstack/react-query'
import { mockUseTRPC } from '@/test/mocks/trpc'

vi.mock('./message-card', () => ({
  MessageCard: ({ content, role }: any) => (
    <div data-testid="message-card" data-role={role}>
      {content}
    </div>
  ),
}))

vi.mock('./messsage-form', () => ({
  MessageForm: () => <div data-testid="message-form">MessageForm</div>,
}))

vi.mock('./message-loading', () => ({
  MessageLoading: () => <div data-testid="message-loading">Loading...</div>,
}))

vi.mock('@/trpc/client', () => ({
  useTRPC: mockUseTRPC,
}))

describe('MessagesContainer', () => {
  let queryClient: QueryClient
  const mockSetActiveFragment = vi.fn()

  const mockFragment = {
    id: 'fragment-1',
    messageId: 'msg-1',
    sandboxUrl: 'https://example.com',
    title: 'Test Fragment',
    files: {},
    createdAt: new Date(),
    updateAt: new Date(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, refetchInterval: false },
      },
    })
  })

  it('should render message form', async () => {
    const mockMessages: any[] = []
    queryClient.setQueryData(['messages', 'getMany', { projectId: 'test-project' }], mockMessages)

    render(
      <MessagesContainer
        projectId="test-project"
        activeFragment={null}
        setActiveFragment={mockSetActiveFragment}
      />,
      { queryClient }
    )

    await waitFor(() => {
      expect(screen.getByTestId('message-form')).toBeInTheDocument()
    })
  })

  it('should render messages', async () => {
    const mockMessages = [
      {
        id: 'msg-1',
        content: 'Hello',
        role: 'USER',
        type: 'RESULT',
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: 'test-project',
        fragment: null,
      },
      {
        id: 'msg-2',
        content: 'Hi there',
        role: 'ASSISTANT',
        type: 'RESULT',
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: 'test-project',
        fragment: null,
      },
    ]

    queryClient.setQueryData(['messages', 'getMany', { projectId: 'test-project' }], mockMessages)

    render(
      <MessagesContainer
        projectId="test-project"
        activeFragment={null}
        setActiveFragment={mockSetActiveFragment}
      />,
      { queryClient }
    )

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('Hi there')).toBeInTheDocument()
    })
  })

  it('should show loading indicator when last message is from user', async () => {
    const mockMessages = [
      {
        id: 'msg-1',
        content: 'User message',
        role: 'USER',
        type: 'RESULT',
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: 'test-project',
        fragment: null,
      },
    ]

    queryClient.setQueryData(['messages', 'getMany', { projectId: 'test-project' }], mockMessages)

    render(
      <MessagesContainer
        projectId="test-project"
        activeFragment={null}
        setActiveFragment={mockSetActiveFragment}
      />,
      { queryClient }
    )

    await waitFor(() => {
      expect(screen.getByTestId('message-loading')).toBeInTheDocument()
    })
  })

  it('should not show loading indicator when last message is from assistant', async () => {
    const mockMessages = [
      {
        id: 'msg-1',
        content: 'Assistant message',
        role: 'ASSISTANT',
        type: 'RESULT',
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: 'test-project',
        fragment: null,
      },
    ]

    queryClient.setQueryData(['messages', 'getMany', { projectId: 'test-project' }], mockMessages)

    render(
      <MessagesContainer
        projectId="test-project"
        activeFragment={null}
        setActiveFragment={mockSetActiveFragment}
      />,
      { queryClient }
    )

    await waitFor(() => {
      expect(screen.queryByTestId('message-loading')).not.toBeInTheDocument()
    })
  })

  it('should set active fragment when last assistant message has fragment', async () => {
    const mockMessages = [
      {
        id: 'msg-1',
        content: 'Assistant message',
        role: 'ASSISTANT',
        type: 'RESULT',
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: 'test-project',
        fragment: mockFragment,
      },
    ]

    queryClient.setQueryData(['messages', 'getMany', { projectId: 'test-project' }], mockMessages)

    render(
      <MessagesContainer
        projectId="test-project"
        activeFragment={null}
        setActiveFragment={mockSetActiveFragment}
      />,
      { queryClient }
    )

    await waitFor(() => {
      expect(mockSetActiveFragment).toHaveBeenCalledWith(mockFragment)
    })
  })

  it('should only set active fragment once per message using ref', async () => {
    const mockMessages = [
      {
        id: 'msg-1',
        content: 'Assistant message',
        role: 'ASSISTANT',
        type: 'RESULT',
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: 'test-project',
        fragment: mockFragment,
      },
    ]

    queryClient.setQueryData(['messages', 'getMany', { projectId: 'test-project' }], mockMessages)

    const { rerender } = render(
      <MessagesContainer
        projectId="test-project"
        activeFragment={null}
        setActiveFragment={mockSetActiveFragment}
      />,
      { queryClient }
    )

    await waitFor(() => {
      expect(mockSetActiveFragment).toHaveBeenCalledTimes(1)
    })

    rerender(
      <MessagesContainer
        projectId="test-project"
        activeFragment={mockFragment}
        setActiveFragment={mockSetActiveFragment}
      />
    )

    expect(mockSetActiveFragment).toHaveBeenCalledTimes(1)
  })

  it('should update active fragment when new assistant message arrives', async () => {
    const mockMessages1 = [
      {
        id: 'msg-1',
        content: 'First',
        role: 'ASSISTANT',
        type: 'RESULT',
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: 'test-project',
        fragment: mockFragment,
      },
    ]

    const newFragment = {
      ...mockFragment,
      id: 'fragment-2',
      messageId: 'msg-2',
      title: 'New Fragment',
    }

    const mockMessages2 = [
      ...mockMessages1,
      {
        id: 'msg-2',
        content: 'Second',
        role: 'ASSISTANT',
        type: 'RESULT',
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: 'test-project',
        fragment: newFragment,
      },
    ]

    queryClient.setQueryData(['messages', 'getMany', { projectId: 'test-project' }], mockMessages1)

    const { rerender } = render(
      <MessagesContainer
        projectId="test-project"
        activeFragment={null}
        setActiveFragment={mockSetActiveFragment}
      />,
      { queryClient }
    )

    await waitFor(() => {
      expect(mockSetActiveFragment).toHaveBeenCalledWith(mockFragment)
    })

    queryClient.setQueryData(['messages', 'getMany', { projectId: 'test-project' }], mockMessages2)

    rerender(
      <MessagesContainer
        projectId="test-project"
        activeFragment={mockFragment}
        setActiveFragment={mockSetActiveFragment}
      />
    )

    await waitFor(() => {
      expect(mockSetActiveFragment).toHaveBeenCalledWith(newFragment)
    })
  })

  it('should not set active fragment if last assistant message has no fragment', async () => {
    const mockMessages = [
      {
        id: 'msg-1',
        content: 'Assistant without fragment',
        role: 'ASSISTANT',
        type: 'RESULT',
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: 'test-project',
        fragment: null,
      },
    ]

    queryClient.setQueryData(['messages', 'getMany', { projectId: 'test-project' }], mockMessages)

    render(
      <MessagesContainer
        projectId="test-project"
        activeFragment={null}
        setActiveFragment={mockSetActiveFragment}
      />,
      { queryClient }
    )

    await waitFor(() => {
      expect(screen.getByText('Assistant without fragment')).toBeInTheDocument()
    })

    expect(mockSetActiveFragment).not.toHaveBeenCalled()
  })

  it('should use findLast to get the most recent assistant message', async () => {
    const oldFragment = { ...mockFragment, id: 'old-fragment' }
    const newFragment = { ...mockFragment, id: 'new-fragment' }

    const mockMessages = [
      {
        id: 'msg-1',
        content: 'First assistant',
        role: 'ASSISTANT',
        type: 'RESULT',
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: 'test-project',
        fragment: oldFragment,
      },
      {
        id: 'msg-2',
        content: 'User message',
        role: 'USER',
        type: 'RESULT',
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: 'test-project',
        fragment: null,
      },
      {
        id: 'msg-3',
        content: 'Latest assistant',
        role: 'ASSISTANT',
        type: 'RESULT',
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: 'test-project',
        fragment: newFragment,
      },
    ]

    queryClient.setQueryData(['messages', 'getMany', { projectId: 'test-project' }], mockMessages)

    render(
      <MessagesContainer
        projectId="test-project"
        activeFragment={null}
        setActiveFragment={mockSetActiveFragment}
      />,
      { queryClient }
    )

    await waitFor(() => {
      expect(mockSetActiveFragment).toHaveBeenCalledWith(newFragment)
    })
  })

  it('should have scrollable container', () => {
    const { container } = render(
      <MessagesContainer
        projectId="test-project"
        activeFragment={null}
        setActiveFragment={mockSetActiveFragment}
      />,
      { queryClient }
    )

    const scrollContainer = container.querySelector('.overflow-y-auto')
    expect(scrollContainer).toBeInTheDocument()
  })

  it('should have gradient overlay at bottom', () => {
    const { container } = render(
      <MessagesContainer
        projectId="test-project"
        activeFragment={null}
        setActiveFragment={mockSetActiveFragment}
      />,
      { queryClient }
    )

    const gradient = container.querySelector('.bg-gradient-to-b')
    expect(gradient).toBeInTheDocument()
  })

  describe('edge cases', () => {
    it('should handle empty messages array', async () => {
      queryClient.setQueryData(['messages', 'getMany', { projectId: 'test-project' }], [])

      render(
        <MessagesContainer
          projectId="test-project"
          activeFragment={null}
          setActiveFragment={mockSetActiveFragment}
        />,
        { queryClient }
      )

      await waitFor(() => {
        expect(screen.getByTestId('message-form')).toBeInTheDocument()
      })

      expect(mockSetActiveFragment).not.toHaveBeenCalled()
    })

    it('should handle only user messages', async () => {
      const mockMessages = [
        {
          id: 'msg-1',
          content: 'User 1',
          role: 'USER',
          type: 'RESULT',
          createdAt: new Date(),
          updatedAt: new Date(),
          projectId: 'test-project',
          fragment: null,
        },
        {
          id: 'msg-2',
          content: 'User 2',
          role: 'USER',
          type: 'RESULT',
          createdAt: new Date(),
          updatedAt: new Date(),
          projectId: 'test-project',
          fragment: null,
        },
      ]

      queryClient.setQueryData(['messages', 'getMany', { projectId: 'test-project' }], mockMessages)

      render(
        <MessagesContainer
          projectId="test-project"
          activeFragment={null}
          setActiveFragment={mockSetActiveFragment}
        />,
        { queryClient }
      )

      await waitFor(() => {
        expect(screen.getByTestId('message-loading')).toBeInTheDocument()
      })

      expect(mockSetActiveFragment).not.toHaveBeenCalled()
    })
  })
})