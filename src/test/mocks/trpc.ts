import { vi } from 'vitest'

export const createMockTRPCClient = () => ({
  projects: {
    create: {
      mutationOptions: vi.fn((options: any) => ({
        mutationFn: vi.fn().mockResolvedValue({ id: 'test-project-id' }),
        ...options,
      })),
    },
    getMany: {
      queryOptions: vi.fn(() => ({
        queryKey: ['projects', 'getMany'],
        queryFn: vi.fn().mockResolvedValue([]),
      })),
    },
    getOne: {
      queryOptions: vi.fn((params: any) => ({
        queryKey: ['projects', 'getOne', params],
        queryFn: vi.fn().mockResolvedValue({
          id: params.id,
          name: 'Test Project',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      })),
    },
  },
  messages: {
    getMany: {
      queryOptions: vi.fn((params: any, options: any) => ({
        queryKey: ['messages', 'getMany', params],
        queryFn: vi.fn().mockResolvedValue([]),
        ...options,
      })),
    },
  },
})

export const mockUseTRPC = vi.fn(() => createMockTRPCClient())