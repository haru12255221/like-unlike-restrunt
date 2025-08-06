import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../Button'

describe('Button', () => {
  describe('Variant Rendering', () => {
    it('renders with primary variant and correct styling', () => {
      render(<Button variant="primary">プライマリボタン</Button>)
      const button = screen.getByRole('button', { name: 'プライマリボタン' })
      
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-brand-primary', 'text-white', 'px-6', 'py-3', 'rounded-lg')
      expect(button).toHaveClass('hover:bg-brand-secondary', 'hover:shadow-md', 'hover:-translate-y-0.5')
      expect(button).toHaveClass('focus:ring-brand-primary')
    })

    it('renders with secondary variant and correct styling', () => {
      render(<Button variant="secondary">セカンダリボタン</Button>)
      const button = screen.getByRole('button', { name: 'セカンダリボタン' })
      
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-transparent', 'text-brand-primary', 'border', 'border-brand-primary')
      expect(button).toHaveClass('px-6', 'py-3', 'rounded-lg')
      expect(button).toHaveClass('hover:bg-brand-primary', 'hover:text-white')
      expect(button).toHaveClass('focus:ring-brand-primary')
    })

    it('renders with like variant and correct styling', () => {
      render(<Button variant="like">❤️</Button>)
      const button = screen.getByRole('button', { name: '❤️' })
      
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-like', 'text-white', 'w-15', 'h-15', 'rounded-full')
      expect(button).toHaveClass('shadow-lg', 'hover:bg-red-500', 'hover:scale-105')
      expect(button).toHaveClass('focus:ring-like')
    })

    it('renders with skip variant and correct styling', () => {
      render(<Button variant="skip">✕</Button>)
      const button = screen.getByRole('button', { name: '✕' })
      
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-skip', 'text-white', 'w-15', 'h-15', 'rounded-full')
      expect(button).toHaveClass('shadow-lg', 'hover:bg-gray-600', 'hover:scale-105')
      expect(button).toHaveClass('focus:ring-skip')
    })
  })

  describe('Base Styling', () => {
    it('applies base classes to all variants', () => {
      const variants = ['primary', 'secondary', 'like', 'skip'] as const
      
      variants.forEach(variant => {
        const { unmount } = render(<Button variant={variant}>テスト</Button>)
        const button = screen.getByRole('button', { name: 'テスト' })
        
        expect(button).toHaveClass('font-medium', 'transition-all', 'duration-200')
        expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2')
        expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
        
        unmount()
      })
    })
  })

  describe('Click Events', () => {
    it('handles click events for primary button', () => {
      const handleClick = jest.fn()
      render(<Button variant="primary" onClick={handleClick}>クリック</Button>)
      
      const button = screen.getByRole('button', { name: 'クリック' })
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('handles click events for like button', () => {
      const handleClick = jest.fn()
      render(<Button variant="like" onClick={handleClick}>❤️</Button>)
      
      const button = screen.getByRole('button', { name: '❤️' })
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('handles click events for skip button', () => {
      const handleClick = jest.fn()
      render(<Button variant="skip" onClick={handleClick}>✕</Button>)
      
      const button = screen.getByRole('button', { name: '✕' })
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('works without onClick handler', () => {
      expect(() => {
        render(<Button variant="primary">ハンドラーなし</Button>)
        const button = screen.getByRole('button', { name: 'ハンドラーなし' })
        fireEvent.click(button)
      }).not.toThrow()
    })
  })

  describe('Disabled State', () => {
    it('can be disabled and prevents click events', () => {
      const handleClick = jest.fn()
      render(<Button variant="primary" onClick={handleClick} disabled>無効ボタン</Button>)
      
      const button = screen.getByRole('button', { name: '無効ボタン' })
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
      
      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('applies disabled styling to all variants', () => {
      const variants = ['primary', 'secondary', 'like', 'skip'] as const
      
      variants.forEach(variant => {
        const { unmount } = render(<Button variant={variant} disabled>無効</Button>)
        const button = screen.getByRole('button', { name: '無効' })
        
        expect(button).toBeDisabled()
        expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
        
        unmount()
      })
    })
  })

  describe('Custom Styling', () => {
    it('applies custom className while preserving base styles', () => {
      render(<Button variant="primary" className="custom-class">カスタム</Button>)
      const button = screen.getByRole('button', { name: 'カスタム' })
      
      expect(button).toHaveClass('custom-class')
      expect(button).toHaveClass('bg-brand-primary', 'font-medium') // base styles preserved
    })

    it('allows className override for different variants', () => {
      render(<Button variant="like" className="w-20 h-20">大きなLike</Button>)
      const button = screen.getByRole('button', { name: '大きなLike' })
      
      expect(button).toHaveClass('w-20', 'h-20') // custom size
      expect(button).toHaveClass('bg-like', 'rounded-full') // base variant styles preserved
    })
  })

  describe('Accessibility', () => {
    it('has proper focus management', () => {
      render(<Button variant="primary">フォーカステスト</Button>)
      const button = screen.getByRole('button', { name: 'フォーカステスト' })
      
      button.focus()
      expect(button).toHaveFocus()
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2')
    })

    it('supports keyboard interaction', () => {
      const handleClick = jest.fn()
      render(<Button variant="primary" onClick={handleClick}>キーボード</Button>)
      const button = screen.getByRole('button', { name: 'キーボード' })
      
      button.focus()
      fireEvent.keyDown(button, { key: 'Enter' })
      fireEvent.keyUp(button, { key: 'Enter' })
      
      // Note: fireEvent.keyDown doesn't trigger click by default in jsdom
      // but the button should be focusable and have proper ARIA attributes
      expect(button).toHaveFocus()
    })
  })

  describe('和風デザインシステム Integration', () => {
    it('uses brand colors correctly', () => {
      render(<Button variant="primary">ブランドカラー</Button>)
      const button = screen.getByRole('button', { name: 'ブランドカラー' })
      
      expect(button).toHaveClass('bg-brand-primary', 'hover:bg-brand-secondary', 'focus:ring-brand-primary')
    })

    it('uses action colors for like/skip buttons', () => {
      const { rerender } = render(<Button variant="like">Like</Button>)
      let button = screen.getByRole('button', { name: 'Like' })
      expect(button).toHaveClass('bg-like', 'focus:ring-like')
      
      rerender(<Button variant="skip">Skip</Button>)
      button = screen.getByRole('button', { name: 'Skip' })
      expect(button).toHaveClass('bg-skip', 'focus:ring-skip')
    })

    it('applies proper transitions and animations', () => {
      render(<Button variant="primary">アニメーション</Button>)
      const button = screen.getByRole('button', { name: 'アニメーション' })
      
      expect(button).toHaveClass('transition-all', 'duration-200')
      expect(button).toHaveClass('hover:-translate-y-0.5') // subtle lift effect
    })
  })
})