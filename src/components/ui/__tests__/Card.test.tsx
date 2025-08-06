import { render, screen, fireEvent } from '@testing-library/react'
import Card from '../Card'

describe('Card', () => {
  it('renders with swipe variant', () => {
    render(
      <Card variant="swipe">
        <div>スワイプカード内容</div>
      </Card>
    )
    
    const card = screen.getByText('スワイプカード内容').parentElement
    expect(card).toHaveClass('w-75', 'h-96', 'shadow-xl')
  })

  it('renders with list variant', () => {
    render(
      <Card variant="list">
        <div>リストカード内容</div>
      </Card>
    )
    
    const card = screen.getByText('リストカード内容').parentElement
    expect(card).toHaveClass('shadow-card', 'p-4', 'mb-4')
  })

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

  it('applies custom className', () => {
    render(
      <Card variant="swipe" className="custom-card">
        <div>カスタムカード</div>
      </Card>
    )
    
    const card = screen.getByText('カスタムカード').parentElement
    expect(card).toHaveClass('custom-card')
  })
})