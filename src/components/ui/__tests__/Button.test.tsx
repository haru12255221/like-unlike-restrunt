import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../Button'

describe('Button', () => {
  it('renders with primary variant', () => {
    render(<Button variant="primary">テストボタン</Button>)
    const button = screen.getByRole('button', { name: 'テストボタン' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-brand-primary')
  })

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">セカンダリボタン</Button>)
    const button = screen.getByRole('button', { name: 'セカンダリボタン' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-transparent', 'text-brand-primary', 'border-brand-primary')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button variant="primary" onClick={handleClick}>クリック</Button>)
    
    const button = screen.getByRole('button', { name: 'クリック' })
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    const handleClick = jest.fn()
    render(<Button variant="primary" onClick={handleClick} disabled>無効ボタン</Button>)
    
    const button = screen.getByRole('button', { name: '無効ボタン' })
    expect(button).toBeDisabled()
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Button variant="primary" className="custom-class">カスタム</Button>)
    const button = screen.getByRole('button', { name: 'カスタム' })
    expect(button).toHaveClass('custom-class')
  })
})