import React from 'react'

interface CardProps {
  variant: 'swipe' | 'list'
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({ variant, children, className = '', onClick }) => {
  const baseClasses = 'bg-white rounded-2xl overflow-hidden transition-all duration-300'
  
  const variantClasses = {
    swipe: 'w-75 h-96 shadow-xl hover:shadow-card-hover hover:-translate-y-1 cursor-pointer',
    list: 'shadow-card p-4 mb-4 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card