'use client'

// CENTRALIZED SUB HEADER - PROFESSIONAL SIZE
export default function SubHeader({ 
  title
}: { title: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      minHeight: '80px', // COMPACT HEIGHT - PROFESSIONAL
      padding: '20px 40px', // COMPACT PADDING - CLEAN
      backgroundColor: '#ffffff', // CLEAN WHITE
      borderBottom: '1px solid #e2e8f0', // THIN BORDER
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', // SUBTLE SHADOW
      position: 'relative'
    }}>
      <h2 style={{ 
        fontSize: '24px', // COMPACT FONT - CLEAN
        fontWeight: '600', // MEDIUM BOLD
        color: '#1f2937', // CLEAN COLOR
        margin: 0, 
        lineHeight: '1.2',
        letterSpacing: '-0.01em'
      }}>
        {title}
      </h2>
      
      {/* SLICERS WILL BE ADDED HERE WHEN CONTENT IS READY */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', // LARGER GAP
        alignItems: 'center', 
        height: '100%' 
      }}>
        {/* Empty for now - slicers will be imported and added when needed */}
      </div>
    </div>
  );
} 