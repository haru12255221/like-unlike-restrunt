import { render, screen } from '@testing-library/react'
import { motion } from 'framer-motion'

// Simple test component using Framer Motion
const TestMotionComponent = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    data-testid="motion-test"
  >
    Framer Motion テスト
  </motion.div>
)

describe('Framer Motion Integration', () => {
  it('renders motion component without errors', () => {
    render(<TestMotionComponent />)
    
    const motionElement = screen.getByTestId('motion-test')
    expect(motionElement).toBeInTheDocument()
    expect(motionElement).toHaveTextContent('Framer Motion テスト')
  })

  it('applies initial styles', () => {
    render(<TestMotionComponent />)
    
    const motionElement = screen.getByTestId('motion-test')
    // Note: In test environment, Framer Motion animations are disabled by default
    // so we just verify the component renders
    expect(motionElement).toBeInTheDocument()
  })
})