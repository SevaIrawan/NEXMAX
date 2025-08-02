'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClearSessionPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear all session data
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('nexmax_session')
      localStorage.removeItem('darkMode')
      
      // Clear cookies
      document.cookie = 'user_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'username=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'user_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      
      console.log('✅ All session data cleared')
    } catch (error) {
      console.error('❌ Error clearing session:', error)
    }
    
    // Redirect to login
    router.push('/login')
  }, [router])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          animation: 'pulse 2s infinite'
        }}>
          🔄
        </div>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: '#ffd700'
        }}>
          Clearing Session...
        </h1>
        <p style={{
          fontSize: '1.1rem',
          opacity: 0.8
        }}>
          Redirecting to login page
        </p>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
} 