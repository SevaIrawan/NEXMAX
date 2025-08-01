'use client'

import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

interface HeaderProps {
  pageTitle?: string
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  darkMode?: boolean
  onToggleDarkMode?: () => void
  onLogout?: () => void
}

export default function Header({
  pageTitle,
  sidebarOpen,
  setSidebarOpen,
  darkMode = false,
  onToggleDarkMode = () => {},
  onLogout = () => {}
}: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const getPageTitle = () => {
    if (pageTitle) return pageTitle
    
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard'
      case '/users':
        return 'User Management'
      case '/strategic-executive':
        return 'Strategic Executive'
      case '/business-flow':
        return 'Business Flow'
      case '/bgo':
        return 'BGO'
      case '/sr':
        return 'SR'
      case '/xoo':
        return 'XOO'
      case '/os':
        return 'OS'
      case '/transaction/deposit':
        return 'Deposit'
      case '/transaction/withdraw':
        return 'Withdraw'
      case '/transaction/exchange':
        return 'Exchange'
      case '/transaction/headcount':
        return 'Headcount'
      case '/transaction/new-register':
        return 'New Register'
      case '/transaction/new-depositor':
        return 'New Depositor'
      case '/transaction/adjustment':
        return 'Adjustment'
      case '/transaction/vip-program':
        return 'VIP Program'
      default:
        return 'Dashboard'
    }
  }

  const handleLogout = async () => {
    try {
      console.log('🔄 Starting logout...')
      localStorage.removeItem('nexmax_session')
      document.cookie = 'user_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'username=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'user_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      console.log('🍪 Cookies cleared manually')
    } catch (error) {
      console.error('❌ Logout error:', error)
    }
    console.log('🔄 Redirecting to login...')
    router.push('/login')
  }

  return (
    <header className={`header ${!sidebarOpen ? 'collapsed' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              marginRight: '16px',
              color: '#6b7280'
            }}
          >
            ☰
          </button>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#ffffff',
            margin: 0
          }}>
            {getPageTitle()}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>👋</span>
            <span style={{ fontSize: '14px', color: '#ffffff' }}>
              Welcome, <strong>admin</strong>
            </span>
          </div>

          {/* Malaysian Flag */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/aset/malaysia-flag-png-41827.png"
              alt="Malaysia Flag"
              width={24}
              height={16}
              style={{ borderRadius: '2px' }}
            />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
} 