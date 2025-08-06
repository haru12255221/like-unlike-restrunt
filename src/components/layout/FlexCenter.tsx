import React from 'react'

interface FlexCenterProps {
  children: React.ReactNode
  className?: string
}

const FlexCenter: React.FC<FlexCenterProps> = ({ children, className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    {children}
  </div>
)

export default FlexCenter