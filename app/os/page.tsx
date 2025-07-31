'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import SubHeader from '@/components/SubHeader'

export default function OsPage() {
  const [user, setUser] = useState<any>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const router = useRouter()

  const [year, setYear] = useState(2025)
  const [currency, setCurrency] = useState('USD')
  const [month, setMonth] = useState(1)

  useEffect(() => {
    // Check authentication
    const session = localStorage.getItem('nexmax_session')
    if (!session) {
      router.push('/login')
      return
    }

    const sessionData = JSON.parse(session)
    setUser(sessionData)
    
    // Check dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [router])

  const handleLogout = () => {
    try {
      localStorage.removeItem('nexmax_session')
      document.cookie = 'user_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'username=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'user_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    } catch (error) {
      console.error('Logout error:', error)
    }
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

  if (!user) {
    return null
  }

  return (
    <Layout
      user={user}
      darkMode={darkMode}
      sidebarExpanded={sidebarExpanded}
      setSidebarExpanded={setSidebarExpanded}
      onToggleDarkMode={handleToggleDarkMode}
      onLogout={handleLogout}
    >
      <SubHeader 
        title="OS Dashboard"
        year={year}
        setYear={setYear}
        currency={currency}
        setCurrency={setCurrency}
        month={month}
        setMonth={setMonth}
      />
      
      <div className="text-center" style={{ marginTop: '50px' }}>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🚧 Coming Soon
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          OS Dashboard sedang dalam pengembangan
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-blue-800">
            Fitur ini akan segera hadir dengan dashboard OS yang lengkap.
          </p>
        </div>
      </div>
    </Layout>
  )
} 