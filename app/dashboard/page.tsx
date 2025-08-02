'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import SubHeader from '@/components/SubHeader'
import { validateSession, cleanupSession } from '@/utils/sessionCleanup'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const [year, setYear] = useState(2025)
  const [currency, setCurrency] = useState('USD')
  const [month, setMonth] = useState(1)

  useEffect(() => {
    // Check authentication using utility function
    const sessionData = validateSession()
    if (!sessionData) {
      router.push('/login')
      return
    }

    setUser(sessionData)
    
    // Check dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
    
    setLoading(false)
  }, []) // Remove router from dependency to prevent re-runs

  const handleLogout = () => {
    cleanupSession()
    router.push('/login')
  }

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1d29 0%, #2d3142 50%, #1a1d29 100%)',
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
            ⚡
          </div>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '1rem',
            color: '#ffd700'
          }}>
            NEXMAX Dashboard
          </h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.8
          }}>
            Loading...
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

  if (!user) {
    return null
  }

  return (
    <Layout
      pageTitle="Dashboard"
      subHeaderTitle=""
    >
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)',
        padding: '40px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        {/* Professional Coming Soon Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '48px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Diamond Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            color: 'white',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
          }}>
            💎
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 16px 0',
            letterSpacing: '-0.025em'
          }}>
            Dashboard
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: '0 0 32px 0',
            lineHeight: '1.6'
          }}>
            Comprehensive analytics and performance monitoring dashboard is currently under development.
          </p>

          {/* Feature Boxes Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>📊</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Analytics</span>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>📈</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Performance</span>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>🎯</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Monitoring</span>
            </div>
            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>📋</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Reports</span>
            </div>
          </div>

          {/* Coming Soon Button */}
          <button style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.3s ease'
          }}>
            Coming Soon
          </button>
        </div>

        {/* Slicers Note */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          fontSize: '12px',
          color: '#9ca3af',
          fontStyle: 'italic'
        }}>
          Slicers will be configured when page is developed
        </div>
      </div>
    </Layout>
  )
} 