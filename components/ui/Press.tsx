'use client'
import { useState, type ReactNode, type CSSProperties, type MouseEvent } from 'react'

interface PressProps {
  onClick?: (e: MouseEvent) => void
  children: ReactNode
  style?: CSSProperties
  scale?: number
  className?: string
}

export function Press({ onClick, children, style, scale = 0.97, className }: PressProps) {
  const [down, setDown] = useState(false)
  return (
    <div
      onClick={onClick}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      className={className}
      style={{
        cursor: 'pointer',
        transition: 'transform .12s ease',
        transform: down ? `scale(${scale})` : 'none',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
