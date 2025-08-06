import { render, screen } from '@testing-library/react'
import Container from '../Container'

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <div>コンテナ内容</div>
      </Container>
    )
    
    expect(screen.getByText('コンテナ内容')).toBeInTheDocument()
  })

  it('applies default classes', () => {
    render(
      <Container>
        <div>テスト内容</div>
      </Container>
    )
    
    const container = screen.getByText('テスト内容').parentElement
    expect(container).toHaveClass('max-w-sm', 'mx-auto', 'px-4')
  })

  it('applies custom className', () => {
    render(
      <Container className="custom-container">
        <div>カスタム内容</div>
      </Container>
    )
    
    const container = screen.getByText('カスタム内容').parentElement
    expect(container).toHaveClass('custom-container')
  })
})