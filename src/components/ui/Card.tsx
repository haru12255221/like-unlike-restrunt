import React, { useState } from 'react'
import Image from 'next/image'

interface CardProps {
  variant: 'swipe' | 'list'
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  // Shop-specific props for image display
  imageUrl?: string
  imageAlt?: string
  title?: string
  subtitle?: string
}

const Card: React.FC<CardProps> = ({ 
  variant, 
  children, 
  className = '', 
  onClick,
  imageUrl,
  imageAlt = '',
  title,
  subtitle
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const baseClasses = 'bg-white rounded-2xl overflow-hidden transition-all duration-300'
  
  const variantClasses = {
    swipe: 'w-80 h-96 shadow-xl hover:shadow-card-hover hover:-translate-y-1 cursor-pointer',
    list: 'shadow-card p-4 mb-4 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const renderImage = () => {
    if (!imageUrl) return null

    const imageClasses = variant === 'swipe' 
      ? 'w-full h-64 object-cover' 
      : 'w-full h-32 object-cover'

    if (imageError) {
      return (
        <div className={`${imageClasses} bg-neutral-100 flex items-center justify-center`}>
          <div className="text-center text-neutral-400">
            <div className="text-2xl mb-2">🏪</div>
            <div className="text-sm">画像を読み込めません</div>
          </div>
        </div>
      )
    }

    return (
      <div className="relative">
        {imageLoading && (
          <div className={`${imageClasses} bg-neutral-100 flex items-center justify-center absolute inset-0 z-10`}>
            <div className="text-center text-neutral-400">
              <div className="animate-spin text-2xl mb-2">⏳</div>
              <div className="text-sm">読み込み中...</div>
            </div>
          </div>
        )}
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={variant === 'swipe' ? 320 : 400}
          height={variant === 'swipe' ? 256 : 128}
          className={imageClasses}
          onError={handleImageError}
          onLoad={handleImageLoad}
          priority={variant === 'swipe'} // Prioritize swipe card images
        />
      </div>
    )
  }

  const renderContent = () => {
    if (children) {
      return children
    }

    if (title || subtitle) {
      return (
        <div className={variant === 'swipe' ? 'p-4' : 'mt-3'}>
          {title && (
            <h3 className={`font-medium text-neutral-800 ${
              variant === 'swipe' ? 'text-lg mb-2' : 'text-base mb-1'
            }`}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className={`text-neutral-600 ${
              variant === 'swipe' ? 'text-sm leading-relaxed' : 'text-sm'
            }`}>
              {subtitle}
            </p>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {renderImage()}
      {renderContent()}
    </div>
  )
}

export default Card