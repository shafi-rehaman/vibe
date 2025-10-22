import { describe, it, expect } from 'vitest'
import { PROJECT_TEMPLATES } from './constant'

describe('PROJECT_TEMPLATES', () => {
  it('should export an array of project templates', () => {
    expect(Array.isArray(PROJECT_TEMPLATES)).toBe(true)
    expect(PROJECT_TEMPLATES.length).toBeGreaterThan(0)
  })

  it('should have exactly 8 project templates', () => {
    expect(PROJECT_TEMPLATES).toHaveLength(8)
  })

  it('should have all templates with required properties', () => {
    PROJECT_TEMPLATES.forEach((template) => {
      expect(template).toHaveProperty('emoji')
      expect(template).toHaveProperty('title')
      expect(template).toHaveProperty('prompt')
    })
  })

  it('should have non-empty string values for all properties', () => {
    PROJECT_TEMPLATES.forEach((template) => {
      expect(typeof template.emoji).toBe('string')
      expect(template.emoji.length).toBeGreaterThan(0)
      
      expect(typeof template.title).toBe('string')
      expect(template.title.length).toBeGreaterThan(0)
      
      expect(typeof template.prompt).toBe('string')
      expect(template.prompt.length).toBeGreaterThan(0)
    })
  })

  it('should have unique titles', () => {
    const titles = PROJECT_TEMPLATES.map((t) => t.title)
    const uniqueTitles = new Set(titles)
    expect(uniqueTitles.size).toBe(titles.length)
  })

  it('should have unique emojis', () => {
    const emojis = PROJECT_TEMPLATES.map((t) => t.emoji)
    const uniqueEmojis = new Set(emojis)
    expect(uniqueEmojis.size).toBe(emojis.length)
  })

  it('should contain expected project types', () => {
    const titles = PROJECT_TEMPLATES.map((t) => t.title)
    expect(titles).toContain('Build a Netflix clone')
    expect(titles).toContain('Build an admin dashboard')
    expect(titles).toContain('Build a kanban board')
    expect(titles).toContain('Build a file manager')
    expect(titles).toContain('Build a YouTube clone')
    expect(titles).toContain('Build a store page')
    expect(titles).toContain('Build an Airbnb clone')
    expect(titles).toContain('Build a Spotify clone')
  })

  it('should have prompts that are longer than titles', () => {
    PROJECT_TEMPLATES.forEach((template) => {
      expect(template.prompt.length).toBeGreaterThan(template.title.length)
    })
  })

  describe('individual template validation', () => {
    it('Netflix clone should mention dark mode', () => {
      const netflix = PROJECT_TEMPLATES.find((t) => t.title === 'Build a Netflix clone')
      expect(netflix?.prompt.toLowerCase()).toContain('dark mode')
    })

    it('admin dashboard should mention sidebar and stats', () => {
      const dashboard = PROJECT_TEMPLATES.find((t) => t.title === 'Build an admin dashboard')
      expect(dashboard?.prompt.toLowerCase()).toContain('sidebar')
      expect(dashboard?.prompt.toLowerCase()).toContain('stat')
    })

    it('kanban board should mention drag-and-drop', () => {
      const kanban = PROJECT_TEMPLATES.find((t) => t.title === 'Build a kanban board')
      expect(kanban?.prompt.toLowerCase()).toContain('drag')
    })

    it('store page should mention cart', () => {
      const store = PROJECT_TEMPLATES.find((t) => t.title === 'Build a store page')
      expect(store?.prompt.toLowerCase()).toContain('cart')
    })
  })

  describe('prompt quality checks', () => {
    it('should have detailed prompts with at least 100 characters', () => {
      PROJECT_TEMPLATES.forEach((template) => {
        expect(template.prompt.length).toBeGreaterThanOrEqual(100)
      })
    })

    it('should have prompts that include implementation details', () => {
      PROJECT_TEMPLATES.forEach((template) => {
        const hasImplementationDetails = 
          /\b(build|create|with|using|support|focus)\b/i.test(template.prompt)
        expect(hasImplementationDetails).toBe(true)
      })
    })
  })
})