import React from 'react'

interface FlexCenterProps {
  children: React.ReactNode
  className?: string
  /** Flex direction */
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  /** Justify content alignment */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  /** Align items alignment */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  /** Gap between items */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /** Full height */
  fullHeight?: boolean
  /** Full width */
  fullWidth?: boolean
}

const FlexCenter: React.FC<FlexCenterProps> = ({ 
  children, 
  className = '',
  direction = 'row',
  justify = 'center',
  align = 'center',
  gap = 'none',
  fullHeight = false,
  fullWidth = false
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  }

  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  }

  const gapClasses = {
    none: '',
    sm: 'gap-2',    // 8px
    md: 'gap-4',    // 16px
    lg: 'gap-6',    // 24px
    xl: 'gap-8'     // 32px
  }

  const baseClasses = 'flex'
  const heightClass = fullHeight ? 'h-full' : ''
  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <div className={`
      ${baseClasses} 
      ${directionClasses[direction]} 
      ${justifyClasses[justify]} 
      ${alignClasses[align]} 
      ${gapClasses[gap]}
      ${heightClass}
      ${widthClass}
      ${className}
    `.trim().replace(/\s+/g, ' ')}>
      {children}
    </div>
  )
}

export default FlexCenter