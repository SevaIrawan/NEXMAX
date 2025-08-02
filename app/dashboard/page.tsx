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
      <div className="kpi-grid">
        <div className="text-center" style={{ marginTop: '50px' }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚧 Coming Soon
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Main Dashboard sedang dalam pengembangan
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-blue-800">
              Fitur ini akan segera hadir.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
} 