import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Card from '../Card'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onError, onLoad, className, priority, ...props }: any) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={onError}
        onLoad={onLoad}
        data-testid="card-image"
        data-priority={priority ? 'true' : 'false'}
        {...props}
      />
    )
  }
})

describe('Card', () => {
  describe('Variant Rendering', () => {
    it('renders with swipe variant and correct styling', () => {
      render(
        <Card variant="swipe">
          <div>スワイプカード内容</div>
        </Card>
      )
      
      const card = screen.getByText('スワイプカード内容').parentElement
      expect(card).toHaveClass('w-80', 'h-96', 'shadow-xl')
      expect(card).toHaveClass('hover:shadow-card-hover', 'hover:-translate-y-1')
      expect(card).toHaveClass('bg-white', 'rounded-2xl', 'overflow-hidden')
    })

    it('renders with list variant and correct styling', () => {
      render(
        <Card variant="list">
          <div>リストカード内容</div>
        </Card>
      )
      
      const card = screen.getByText('リストカード内容').parentElement
      expect(card).toHaveClass('shadow-card', 'p-4', 'mb-4')
      expect(card).toHaveClass('hover:shadow-card-hover', 'hover:-translate-y-0.5')
      expect(card).toHaveClass('bg-white', 'rounded-2xl', 'overflow-hidden')
    })
  })

  describe('Image Display', () => {
    it('renders image with swipe variant dimensions', () => {
      render(
        <Card 
          variant="swipe" 
          imageUrl="/test-image.jpg" 
          imageAlt="テスト画像"
        />
      )
      
      const image = screen.getByTestId('card-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/test-image.jpg')
      expect(image).toHaveAttribute('alt', 'テスト画像')
      expect(image).toHaveClass('w-full', 'h-64', 'object-cover')
    })

    it('renders image with list variant dimensions', () => {
      render(
        <Card 
          variant="list" 
          imageUrl="/test-image.jpg" 
          imageAlt="テスト画像"
        />
      )
      
      const image = screen.getByTestId('card-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveClass('w-full', 'h-32', 'object-cover')
    })

    it('does not render image when imageUrl is not provided', () => {
      render(<Card variant="swipe" title="タイトルのみ" />)
      
      const image = screen.queryByTestId('card-image')
      expect(image).not.toBeInTheDocument()
    })
  })

  describe('Image Fallback Processing', () => {
    it('shows loading state initially when image is provided', () => {
      render(
        <Card 
          variant="swipe" 
          imageUrl="/test-image.jpg" 
          imageAlt="テスト画像"
        />
      )
      
      expect(screen.getByText('読み込み中...')).toBeInTheDocument()
      expect(screen.getByText('⏳')).toBeInTheDocument()
    })

    it('shows error fallback when image fails to load', async () => {
      render(
        <Card 
          variant="swipe" 
          imageUrl="/invalid-image.jpg" 
          imageAlt="無効な画像"
        />
      )
      
      const image = screen.getByTestId('card-image')
      fireEvent.error(image)
      
      await waitFor(() => {
        expect(screen.getByText('画像を読み込めません')).toBeInTheDocument()
        expect(screen.getByText('🏪')).toBeInTheDocument()
      })
    })

    it('hides loading state when image loads successfully', async () => {
      render(
        <Card 
          variant="swipe" 
          imageUrl="/valid-image.jpg" 
          imageAlt="有効な画像"
        />
      )
      
      const image = screen.getByTestId('card-image')
      fireEvent.load(image)
      
      await waitFor(() => {
        expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument()
      })
    })

    it('shows appropriate error fallback for different variants', async () => {
      // Test swipe variant
      const { rerender } = render(
        <Card 
          variant="swipe" 
          imageUrl="/invalid-image.jpg" 
          imageAlt="無効な画像"
        />
      )
      
      let image = screen.getByTestId('card-image')
      fireEvent.error(image)
      
      await waitFor(() => {
        const errorContainer = screen.getByText('画像を読み込めません').parentElement?.parentElement
        expect(errorContainer).toHaveClass('h-64') // swipe variant height
      })

      // Test list variant
      rerender(
        <Card 
          variant="list" 
          imageUrl="/invalid-image2.jpg" 
          imageAlt="無効な画像2"
        />
      )
      
      await waitFor(() => {
        const errorContainer = screen.getByText('画像を読み込めません').parentElement?.parentElement
        expect(errorContainer).toHaveClass('h-32') // list variant height
      })
    })
  })

  describe('Content Display', () => {
    it('renders title and subtitle for swipe variant', () => {
      render(
        <Card 
          variant="swipe" 
          title="店舗名" 
          subtitle="素敵な一言ストーリー"
        />
      )
      
      const title = screen.getByText('店舗名')
      const subtitle = screen.getByText('素敵な一言ストーリー')
      
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('text-lg', 'mb-2')
      expect(subtitle).toBeInTheDocument()
      expect(subtitle).toHaveClass('text-sm', 'leading-relaxed')
    })

    it('renders title and subtitle for list variant', () => {
      render(
        <Card 
          variant="list" 
          title="店舗名" 
          subtitle="素敵な一言ストーリー"
        />
      )
      
      const title = screen.getByText('店舗名')
      const subtitle = screen.getByText('素敵な一言ストーリー')
      
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('text-base', 'mb-1')
      expect(subtitle).toBeInTheDocument()
      expect(subtitle).toHaveClass('text-sm')
    })

    it('renders only title when subtitle is not provided', () => {
      render(<Card variant="swipe" title="店舗名のみ" />)
      
      expect(screen.getByText('店舗名のみ')).toBeInTheDocument()
    })

    it('renders only subtitle when title is not provided', () => {
      render(<Card variant="swipe" subtitle="ストーリーのみ" />)
      
      expect(screen.getByText('ストーリーのみ')).toBeInTheDocument()
    })

    it('prioritizes children over title/subtitle props', () => {
      render(
        <Card variant="swipe" title="無視されるタイトル" subtitle="無視されるサブタイトル">
          <div>カスタムコンテンツ</div>
        </Card>
      )
      
      expect(screen.getByText('カスタムコンテンツ')).toBeInTheDocument()
      expect(screen.queryByText('無視されるタイトル')).not.toBeInTheDocument()
      expect(screen.queryByText('無視されるサブタイトル')).not.toBeInTheDocument()
    })
  })

  describe('Click Events', () => {
    it('handles click events', () => {
      const handleClick = jest.fn()
      render(
        <Card variant="swipe" onClick={handleClick}>
          <div>クリック可能カード</div>
        </Card>
      )
      
      const card = screen.getByText('クリック可能カード').parentElement
      fireEvent.click(card!)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('works without onClick handler', () => {
      expect(() => {
        render(
          <Card variant="swipe">
            <div>クリックハンドラーなし</div>
          </Card>
        )
        const card = screen.getByText('クリックハンドラーなし').parentElement
        fireEvent.click(card!)
      }).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('adds proper ARIA attributes when clickable', () => {
      const handleClick = jest.fn()
      render(
        <Card variant="swipe" onClick={handleClick} title="クリック可能カード" />
      )
      
      const card = screen.getByRole('button')
      expect(card).toBeInTheDocument()
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('does not add ARIA attributes when not clickable', () => {
      render(<Card variant="swipe" title="クリック不可カード" />)
      
      const card = screen.getByText('クリック不可カード').closest('div')
      expect(card).not.toHaveAttribute('role')
      expect(card).not.toHaveAttribute('tabIndex')
    })

    it('handles keyboard events when clickable', () => {
      const handleClick = jest.fn()
      render(
        <Card variant="swipe" onClick={handleClick} title="キーボード操作" />
      )
      
      const card = screen.getByRole('button')
      
      fireEvent.keyDown(card, { key: 'Enter' })
      expect(handleClick).toHaveBeenCalledTimes(1)
      
      fireEvent.keyDown(card, { key: ' ' })
      expect(handleClick).toHaveBeenCalledTimes(2)
      
      fireEvent.keyDown(card, { key: 'Escape' })
      expect(handleClick).toHaveBeenCalledTimes(2) // Should not trigger
    })
  })

  describe('Custom Styling', () => {
    it('applies custom className while preserving base styles', () => {
      render(
        <Card variant="swipe" className="custom-card">
          <div>カスタムスタイル</div>
        </Card>
      )
      
      const card = screen.getByText('カスタムスタイル').parentElement
      expect(card).toHaveClass('custom-card')
      expect(card).toHaveClass('bg-white', 'rounded-2xl') // base styles preserved
    })
  })

  describe('Integration with Shop Data', () => {
    it('renders complete shop card with image, title, and story', async () => {
      render(
        <Card 
          variant="swipe"
          imageUrl="/shops/test-shop.jpg"
          imageAlt="テスト店舗"
          title="素敵なカフェ"
          subtitle="心温まるコーヒーと手作りケーキが自慢のお店です"
        />
      )
      
      expect(screen.getByTestId('card-image')).toBeInTheDocument()
      expect(screen.getByText('素敵なカフェ')).toBeInTheDocument()
      expect(screen.getByText('心温まるコーヒーと手作りケーキが自慢のお店です')).toBeInTheDocument()
    })

    it('handles shop data with missing image gracefully', () => {
      render(
        <Card 
          variant="list"
          title="画像なし店舗"
          subtitle="画像がない場合でも正常に表示されます"
        />
      )
      
      expect(screen.queryByTestId('card-image')).not.toBeInTheDocument()
      expect(screen.getByText('画像なし店舗')).toBeInTheDocument()
      expect(screen.getByText('画像がない場合でも正常に表示されます')).toBeInTheDocument()
    })
  })

  describe('和風デザインシステム Integration', () => {
    it('uses design system colors and shadows', () => {
      render(<Card variant="swipe" title="デザインシステム" />)
      
      // Get the outermost card container
      const cardContainer = screen.getByText('デザインシステム').closest('[class*="bg-white"]')
      expect(cardContainer).toHaveClass('bg-white', 'shadow-xl', 'hover:shadow-card-hover')
    })

    it('applies proper transitions', () => {
      render(<Card variant="list" title="アニメーション" />)
      
      // Get the outermost card container
      const cardContainer = screen.getByText('アニメーション').closest('[class*="transition-all"]')
      expect(cardContainer).toHaveClass('transition-all', 'duration-300')
    })
  })
})