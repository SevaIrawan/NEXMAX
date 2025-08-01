'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  darkMode?: boolean
  onToggleDarkMode?: () => void
  onLogout?: () => void
  sidebarExpanded?: boolean
}

export default function Sidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  darkMode = false, 
  onToggleDarkMode = () => {}, 
  onLogout = () => {},
  sidebarExpanded = true 
}: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [lastUpdate, setLastUpdate] = useState<string>('Loading...')
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(() => {
    fetchLastUpdate()
    // Auto refresh setiap 60 detik
    const interval = setInterval(fetchLastUpdate, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchLastUpdate = async () => {
    try {
      console.log('�� Sidebar - Fetching MAX(date) from master table member_report_monthly...')
      
      // Mengambil MAX(date) dari kolom master member_report_monthly
      const { data, error } = await supabase
        .from('member_report_monthly')
        .select('date')
        .order('date', { ascending: false })
        .limit(1)
      
      if (error) {
        console.error('❌ Sidebar - Error fetching MAX(date):', error)
        setIsConnected(false)
        return
      }

      if (data && data.length > 0) {
        const maxDate = data[0].date
        console.log('📅 Raw MAX(date) from master table:', maxDate)
        
        const dateParts = maxDate.split('/')
        const month = parseInt(dateParts[0])
        const day = parseInt(dateParts[1])
        const year = parseInt(dateParts[2])
        
        const date = new Date(year, month - 1, day)
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
        
        setLastUpdate(formattedDate)
        setIsConnected(true)
        console.log('✅ Sidebar - MAX(date) updated from master table:', formattedDate)
        console.log('📊 Master table member_report_monthly is the reference for LAST UPDATE')
      } else {
        console.log('⚠️ Sidebar - No data found in master table')
        setIsConnected(false)
      }
    } catch (error) {
      console.error('❌ Sidebar - Exception fetching MAX(date):', error)
      setIsConnected(false)
    }
  }

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: '📊'
    },
    {
      title: 'Strategic Executive',
      path: '/strategic-executive',
      icon: '🎯'
    },
    {
      title: 'BGO',
      path: '/bgo',
      icon: '📈'
    },
    {
      title: 'SR',
      path: '/sr',
      icon: '👥'
    },
    {
      title: 'XOO',
      path: '/xoo',
      icon: '⚡'
    },
    {
      title: 'OS',
      path: '/os',
      icon: '🔧'
    },
    {
      title: 'Business Flow',
      path: '/business-flow',
      icon: '🔄'
    },
    {
      title: 'Transaction',
      icon: '💳',
      submenu: [
        { title: 'Adjustment', path: '/transaction/adjustment' },
        { title: 'Deposit', path: '/transaction/deposit' },
        { title: 'Withdraw', path: '/transaction/withdraw' },
        { title: 'Exchange', path: '/transaction/exchange' },
        { title: 'Headcount', path: '/transaction/headcount' },
        { title: 'New Depositor', path: '/transaction/new-depositor' },
        { title: 'New Register', path: '/transaction/new-register' },
        { title: 'VIP Program', path: '/transaction/vip-program' }
      ]
    },
    {
      title: 'Supabase',
      path: '/connection-test',
      icon: '🔌'
    },
    {
      title: 'Users',
      path: '/users',
      icon: '👤'
    }
  ]

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const handleMenuClick = (path: string) => {
    router.push(path)
    setSidebarOpen(false)
  }

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  return (
    <div 
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: sidebarOpen ? '250px' : '80px',
        backgroundColor: '#1f2937',
        color: 'white',
        transition: 'width 0.3s ease',
        zIndex: 1000,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Logo Section */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #374151',
        display: 'flex',
        alignItems: 'center',
        justifyContent: sidebarOpen ? 'flex-start' : 'center',
        minHeight: '80px'
      }}>
        {sidebarOpen ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image
              src="/aset/images (1).jpg"
              alt="NEXMAX Logo"
              width={40}
              height={40}
              style={{ borderRadius: '8px' }}
            />
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '600',
              color: '#ffffff'
            }}>
              NEXMAX
            </span>
          </div>
        ) : (
          <Image
            src="/aset/images (1).jpg"
            alt="NEXMAX Logo"
            width={40}
            height={40}
            style={{ borderRadius: '8px' }}
          />
        )}
      </div>

      {/* Menu Items */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '16px 0'
      }}>
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.submenu ? (
              <div>
                <div
                  onClick={() => toggleSubmenu(item.title)}
                  style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarOpen ? 'space-between' : 'center',
                    backgroundColor: openSubmenu === item.title ? '#374151' : 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                    {sidebarOpen && (
                      <span style={{ fontSize: '14px' }}>{item.title}</span>
                    )}
                  </div>
                  {sidebarOpen && (
                    <span style={{ fontSize: '12px' }}>
                      {openSubmenu === item.title ? '▼' : '▶'}
                    </span>
                  )}
                </div>
                
                {openSubmenu === item.title && sidebarOpen && (
                  <div style={{ backgroundColor: '#111827' }}>
                    {item.submenu.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        onClick={() => handleMenuClick(subItem.path)}
                        style={{
                          padding: '8px 20px 8px 52px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          backgroundColor: pathname === subItem.path ? '#374151' : 'transparent',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        {subItem.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => handleMenuClick(item.path)}
                style={{
                  padding: '12px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: pathname === item.path ? '#374151' : 'transparent',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                {sidebarOpen && (
                  <span style={{ fontSize: '14px' }}>{item.title}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* LAST UPDATE Section */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #374151',
        backgroundColor: '#111827'
      }}>
        {sidebarOpen ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              LAST UPDATE
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: isConnected ? '#10b981' : '#ef4444',
              padding: '8px 12px',
              backgroundColor: isConnected ? '#065f46' : '#7f1d1d',
              borderRadius: '8px',
              border: `2px solid ${isConnected ? '#10b981' : '#ef4444'}`
            }}>
              {lastUpdate}
            </div>
            <div style={{
              fontSize: '10px',
              color: '#6b7280',
              marginTop: '4px'
            }}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '12px',
              color: isConnected ? '#10b981' : '#ef4444',
              fontWeight: '600'
            }}>
              {lastUpdate}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 