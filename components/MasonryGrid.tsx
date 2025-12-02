'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface MasonryGridProps {
  children: React.ReactNode[]
  className?: string
  columnClassName?: string
}

export function MasonryGrid({ children, className, columnClassName }: MasonryGridProps) {
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1280) setColumns(5)
      else if (window.innerWidth >= 1024) setColumns(4)
      else if (window.innerWidth >= 768) setColumns(3)
      else if (window.innerWidth >= 640) setColumns(2)
      else setColumns(1)
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  // Distribute children into columns
  const columnWrapper: React.ReactNode[][] = Array.from({ length: columns }, () => [])
  
  React.Children.forEach(children, (child, index) => {
    if (React.isValidElement(child)) {
      columnWrapper[index % columns].push(child)
    }
  })

  return (
    <div className={cn("flex gap-6", className)}>
      {columnWrapper.map((col, index) => (
        <div key={index} className={cn("flex flex-col gap-6 flex-1", columnClassName)}>
          {col}
        </div>
      ))}
    </div>
  )
}
