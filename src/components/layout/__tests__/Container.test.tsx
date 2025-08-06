import { render, screen } from '@testing-library/react'
import Container from '../Container'

describe('Container', () => {
  describe('Basic Functionality', () => {
    it('renders children correctly', () => {
      render(
        <Container>
          <div>コンテナ内容</div>
        </Container>
      )
      
      expect(screen.getByText('コンテナ内容')).toBeInTheDocument()
    })

    it('applies default classes (sm size, md padding)', () => {
      render(
        <Container>
          <div>デフォルト内容</div>
        </Container>
      )
      
      const container = screen.getByText('デフォルト内容').parentElement
      expect(container).toHaveClass('max-w-sm', 'mx-auto', 'px-4')
    })

    it('applies custom className while preserving base styles', () => {
      render(
        <Container className="custom-container">
          <div>カスタム内容</div>
        </Container>
      )
      
      const container = screen.getByText('カスタム内容').parentElement
      expect(container).toHaveClass('custom-container', 'max-w-sm', 'mx-auto', 'px-4')
    })
  })

  describe('Size Variants', () => {
    it('applies sm size correctly', () => {
      render(
        <Container size="sm">
          <div>小サイズ</div>
        </Container>
      )
      
      const container = screen.getByText('小サイズ').parentElement
      expect(container).toHaveClass('max-w-sm')
    })

    it('applies md size correctly', () => {
      render(
        <Container size="md">
          <div>中サイズ</div>
        </Container>
      )
      
      const container = screen.getByText('中サイズ').parentElement
      expect(container).toHaveClass('max-w-md')
    })

    it('applies lg size correctly', () => {
      render(
        <Container size="lg">
          <div>大サイズ</div>
        </Container>
      )
      
      const container = screen.getByText('大サイズ').parentElement
      expect(container).toHaveClass('max-w-lg')
    })

    it('applies full size correctly', () => {
      render(
        <Container size="full">
          <div>フルサイズ</div>
        </Container>
      )
      
      const container = screen.getByText('フルサイズ').parentElement
      expect(container).toHaveClass('max-w-full')
    })
  })

  describe('Padding Variants', () => {
    it('applies no padding when padding="none"', () => {
      render(
        <Container padding="none">
          <div>パディングなし</div>
        </Container>
      )
      
      const container = screen.getByText('パディングなし').parentElement
      expect(container).not.toHaveClass('px-2', 'px-4', 'px-6')
    })

    it('applies sm padding correctly', () => {
      render(
        <Container padding="sm">
          <div>小パディング</div>
        </Container>
      )
      
      const container = screen.getByText('小パディング').parentElement
      expect(container).toHaveClass('px-2')
    })

    it('applies md padding correctly (default)', () => {
      render(
        <Container padding="md">
          <div>中パディング</div>
        </Container>
      )
      
      const container = screen.getByText('中パディング').parentElement
      expect(container).toHaveClass('px-4')
    })

    it('applies lg padding correctly', () => {
      render(
        <Container padding="lg">
          <div>大パディング</div>
        </Container>
      )
      
      const container = screen.getByText('大パディング').parentElement
      expect(container).toHaveClass('px-6')
    })
  })

  describe('Combined Props', () => {
    it('combines size and padding props correctly', () => {
      render(
        <Container size="lg" padding="sm">
          <div>組み合わせテスト</div>
        </Container>
      )
      
      const container = screen.getByText('組み合わせテスト').parentElement
      expect(container).toHaveClass('max-w-lg', 'px-2', 'mx-auto')
    })

    it('combines all props with custom className', () => {
      render(
        <Container size="full" padding="lg" className="bg-red-500">
          <div>全組み合わせ</div>
        </Container>
      )
      
      const container = screen.getByText('全組み合わせ').parentElement
      expect(container).toHaveClass('max-w-full', 'px-6', 'mx-auto', 'bg-red-500')
    })
  })

  describe('Mobile-First Responsive Design', () => {
    it('uses mobile-first approach with sm as default', () => {
      render(
        <Container>
          <div>モバイルファースト</div>
        </Container>
      )
      
      const container = screen.getByText('モバイルファースト').parentElement
      expect(container).toHaveClass('max-w-sm') // Mobile-first default
    })

    it('maintains center alignment for all sizes', () => {
      const sizes = ['sm', 'md', 'lg', 'full'] as const
      
      sizes.forEach(size => {
        const { unmount } = render(
          <Container size={size}>
            <div>センター配置テスト</div>
          </Container>
        )
        
        const container = screen.getByText('センター配置テスト').parentElement
        expect(container).toHaveClass('mx-auto')
        
        unmount()
      })
    })
  })

  describe('Use Cases', () => {
    it('works well for card layouts (default sm)', () => {
      render(
        <Container>
          <div className="bg-white rounded-lg p-4">カードレイアウト</div>
        </Container>
      )
      
      const container = screen.getByText('カードレイアウト').closest('[class*="max-w-sm"]')
      expect(container).toBeInTheDocument()
    })

    it('works well for content areas (md size)', () => {
      render(
        <Container size="md" padding="lg">
          <div>コンテンツエリア</div>
        </Container>
      )
      
      const container = screen.getByText('コンテンツエリア').parentElement
      expect(container).toHaveClass('max-w-md', 'px-6')
    })

    it('works well for full-width sections', () => {
      render(
        <Container size="full" padding="none">
          <div>フルワイドセクション</div>
        </Container>
      )
      
      const container = screen.getByText('フルワイドセクション').parentElement
      expect(container).toHaveClass('max-w-full')
      expect(container).not.toHaveClass('px-2', 'px-4', 'px-6')
    })
  })
})