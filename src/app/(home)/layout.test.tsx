import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import Layout from './layout'

describe('Layout', () => {
  it('should render children', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should render main container with correct structure', () => {
    const { container } = render(
      <Layout>
        <div>Test</div>
      </Layout>
    )
    
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('flex', 'flex-col', 'min-h-screen', 'max-h-screen')
  })

  it('should render background pattern div', () => {
    const { container } = render(
      <Layout>
        <div>Test</div>
      </Layout>
    )
    
    const background = container.querySelector('.absolute.inset-0.-z-10')
    expect(background).toBeInTheDocument()
    expect(background).toHaveClass('bg-background')
  })

  it('should have proper content container classes', () => {
    const { container } = render(
      <Layout>
        <div>Test</div>
      </Layout>
    )
    
    const contentDiv = container.querySelector('.flex-1.flex.flex-col')
    expect(contentDiv).toBeInTheDocument()
    expect(contentDiv).toHaveClass('px-4', 'pb-4')
  })

  it('should handle multiple children', () => {
    render(
      <Layout>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </Layout>
    )
    
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
    expect(screen.getByText('Child 3')).toBeInTheDocument()
  })

  it('should handle empty children', () => {
    const { container } = render(<Layout>{null}</Layout>)
    
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
  })

  it('should maintain proper z-index stacking', () => {
    const { container } = render(
      <Layout>
        <div>Content</div>
      </Layout>
    )
    
    const background = container.querySelector('.-z-10')
    expect(background).toBeInTheDocument()
  })
})