'use client'

interface SubHeaderProps {
  title: string
}

export default function SubHeader({ title }: SubHeaderProps) {
  return (
    <div className="subheader">
      <h2 style={{ 
        fontSize: '18px', 
        fontWeight: '600', 
        color: '#1f2937',
        margin: 0
      }}>
        {title}
      </h2>
    </div>
  )
} 