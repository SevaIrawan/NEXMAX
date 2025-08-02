'use client'

interface SubHeaderProps {
  title: string
}

export default function SubHeader({ title }: SubHeaderProps) {
  // Don't render h2 if title is empty or just whitespace
  if (!title || title.trim() === '') {
    return (
      <div className="subheader">
        {/* Empty sub header - just for layout structure */}
      </div>
    )
  }

  return (
    <div className="subheader">
      <h2>
        {title}
      </h2>
    </div>
  )
} 