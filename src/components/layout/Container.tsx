import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  /** Container size variant for different screen contexts */
  size?: 'sm' | 'md' | 'lg' | 'full'
  /** Padding variant */
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '', 
  size = 'sm',
  padding = 'md'
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',      // 384px - Mobile-first, perfect for cards
    md: 'max-w-md',      // 448px - Slightly wider for content
    lg: 'max-w-lg',      // 512px - Larger content areas
    full: 'max-w-full'   // Full width with responsive behavior
  }

  const paddingClasses = {
    none: '',
    sm: 'px-2',          // 8px horizontal padding
    md: 'px-4',          // 16px horizontal padding (default)
    lg: 'px-6'           // 24px horizontal padding
  }

  return (
    <div className={`${sizeClasses[size]} mx-auto ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  )
}

export default Container