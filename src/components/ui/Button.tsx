import React from 'react'

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'like' | 'skip'
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({ 
  variant, 
  children, 
  onClick, 
  className = '', 
  disabled = false 
}) => {
  const baseClasses = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-brand-primary text-white px-6 py-3 rounded-lg shadow-sm hover:bg-brand-secondary hover:shadow-md hover:-translate-y-0.5 focus:ring-brand-primary',
    secondary: 'bg-transparent text-brand-primary border border-brand-primary px-6 py-3 rounded-lg hover:bg-brand-primary hover:text-white focus:ring-brand-primary',
    like: 'bg-like text-white w-15 h-15 rounded-full shadow-lg hover:bg-red-500 hover:scale-105 focus:ring-like',
    skip: 'bg-skip text-white w-15 h-15 rounded-full shadow-lg hover:bg-gray-600 hover:scale-105 focus:ring-skip',
  }

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button