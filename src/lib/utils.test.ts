import { describe, it, expect } from 'vitest'
import { cn, convertFilesToTreeItems } from './utils'

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('text-red-500', 'bg-blue-500')
    expect(result).toContain('text-red-500')
    expect(result).toContain('bg-blue-500')
  })

  it('should handle conditional classes', () => {
    const result = cn('base-class', true && 'active-class', false && 'inactive-class')
    expect(result).toContain('base-class')
    expect(result).toContain('active-class')
    expect(result).not.toContain('inactive-class')
  })

  it('should merge tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4')
  })
})

describe('convertFilesToTreeItems', () => {
  it('should convert flat files to tree structure', () => {
    const files = {
      'README.md': 'content',
      'src/index.ts': 'content',
    }

    const result = convertFilesToTreeItems(files)
    expect(result).toEqual([['src', 'index.ts'], 'README.md'])
  })

  it('should handle nested directories', () => {
    const files = {
      'src/components/Button.tsx': 'content',
      'src/components/Input.tsx': 'content',
    }

    const result = convertFilesToTreeItems(files)
    expect(result).toEqual([['src', ['components', 'Button.tsx', 'Input.tsx']]])
  })

  it('should handle empty files object', () => {
    const result = convertFilesToTreeItems({})
    expect(result).toEqual([])
  })

  it('should sort files alphabetically', () => {
    const files = {
      'z.ts': 'content',
      'a.ts': 'content',
      'm.ts': 'content',
    }

    const result = convertFilesToTreeItems(files)
    expect(result).toEqual(['a.ts', 'm.ts', 'z.ts'])
  })

  it('should handle deep nesting', () => {
    const files = {
      'src/a/b/c/d/file.ts': 'content',
    }

    const result = convertFilesToTreeItems(files)
    expect(result).toEqual([['src', ['a', ['b', ['c', ['d', 'file.ts']]]]]])
  })

  it('should handle mixed file and folder structures', () => {
    const files = {
      'README.md': 'content',
      'package.json': 'content',
      'src/index.ts': 'content',
      'src/types.ts': 'content',
      'tests/unit.test.ts': 'content',
    }

    const result = convertFilesToTreeItems(files)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toContain('README.md')
    expect(result).toContain('package.json')
  })
})