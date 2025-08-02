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
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchLastUpdate()
    // Auto refresh setiap 30 detik
    const interval = setInterval(fetchLastUpdate, 30000)
    return () => clearInterval(interval)
  }, [])

  // Auto show sub menu ketika user berada di halaman sub menu
  useEffect(() => {
    if (pathname.startsWith('/transaction/')) {
      setOpenSubmenu('Transaction')
    }
  }, [pathname])

  const fetchLastUpdate = async () => {
    try {
      setIsLoading(true)
      console.log('🔧 Sidebar - Fetching MAX(date) from member_report_monthly...')
      
      // Mengambil MAX(date) dari kolom member_report_monthly
      const { data, error } = await supabase
        .from('member_report_monthly')
        .select('date')
        .order('date', { ascending: false })
        .limit(1)
      
      if (error) {
        console.error('❌ Sidebar - Error fetching MAX(date):', error)
        setIsConnected(false)
        setLastUpdate('Error')
        setIsLoading(false)
        return
      }

      if (data && data.length > 0) {
        const maxDate = data[0].date
        console.log('📅 Raw MAX(date) from database:', maxDate)
        
        // Handle different date formats
        let date: Date | null = null
        
        if (typeof maxDate === 'string') {
          // Try different date formats
          const formats = [
            // yyyy-mm-dd (ISO format)
            /^(\d{4})-(\d{1,2})-(\d{1,2})$/, 
            // yyyy/mm/dd
            /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, 
            // dd/mm/yyyy
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, 
            // mm/dd/yyyy
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
          ]
          
          for (const format of formats) {
            const match = maxDate.match(format)
            if (match) {
              const [, first, second, third] = match
              
              // Determine format based on first number
              if (parseInt(first) > 31) {
                // yyyy-mm-dd or yyyy/mm/dd
                date = new Date(parseInt(first), parseInt(second) - 1, parseInt(third))
              } else if (parseInt(third) > 31) {
                // dd/mm/yyyy or mm/dd/yyyy - assume dd/mm/yyyy
                date = new Date(parseInt(third), parseInt(second) - 1, parseInt(first))
              }
              
              if (date && !isNaN(date.getTime())) {
                break
              }
            }
          }
        } else if (maxDate instanceof Date) {
          date = maxDate
        }
        
        if (date && !isNaN(date.getTime())) {
          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
          
          setLastUpdate(formattedDate)
          setIsConnected(true)
          setIsLoading(false)
          console.log('✅ Sidebar - MAX(date) updated:', formattedDate)
        } else {
          console.error('❌ Sidebar - Invalid date format:', maxDate)
          setLastUpdate('Invalid Date')
          setIsConnected(false)
          setIsLoading(false)
        }
      } else {
        console.log('⚠️ Sidebar - No data found in member_report_monthly')
        setLastUpdate('No Data')
        setIsConnected(false)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('❌ Sidebar - Exception fetching MAX(date):', error)
      setLastUpdate('Error')
      setIsConnected(false)
      setIsLoading(false)
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
      title: 'Business Flow',
      path: '/business-flow',
      icon: '🔄'
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

  const toggleSubmenu = (title: string) => {
    // Jika user klik menu yang sama, toggle (buka/tutup) submenu
    if (openSubmenu === title) {
      // User ingin hide submenu
      setOpenSubmenu(null)
    } else {
      // Jika user klik menu lain, buka submenu baru dan tutup yang lama
      setOpenSubmenu(title)
    }
  }

  const handleMenuClick = (path: string) => {
    // Cek apakah path ini adalah sub menu dari Transaction
    const isSubmenuPath = path.startsWith('/transaction/')
    
    if (isSubmenuPath) {
      // Jika user klik sub menu, tetap buka sub menu Transaction
      setOpenSubmenu('Transaction')
    } else {
      // Jika user klik menu lain (bukan sub menu), tutup sub menu
      setOpenSubmenu(null)
    }
    
    router.push(path)
  }

  return (
    <div 
      className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}
      style={{ backgroundColor: '#1f2937' }} // Dark blue background
    >
      {/* Logo Section with Circular Gold Border */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #374151', // Darker border for dark blue
        display: 'flex',
        alignItems: 'center',
        justifyContent: sidebarOpen ? 'flex-start' : 'center',
        minHeight: '80px',
        flexShrink: 0, // Prevent logo section from shrinking
        backgroundColor: '#1f2937' // Dark blue background
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '3px solid #FFD700',
            padding: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1f2937' // Dark blue background
          }}>
            <Image
              src="/aset/images (1).jpg"
              alt="NEXMAX Logo"
              width={44}
              height={44}
              style={{ 
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          </div>
          {sidebarOpen && (
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '600',
              color: '#ffffff'
            }}>
              NEXMAX
            </span>
          )}
        </div>
      </div>

      {/* Menu Items - NO SCROLL */}
      <div style={{
        flex: 1,
        overflow: 'hidden', // NO SCROLL for main menu
        padding: '16px 0',
        backgroundColor: '#1f2937' // Dark blue background
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
                    backgroundColor: openSubmenu === item.title ? '#374151' : 'transparent', // Darker blue for active
                    transition: 'background-color 0.2s ease',
                    color: '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                    {sidebarOpen && (
                      <span style={{ fontSize: '14px', color: '#ffffff' }}>{item.title}</span>
                    )}
                  </div>
                  {sidebarOpen && (
                    <span style={{ fontSize: '12px', color: '#ffffff' }}>
                      {openSubmenu === item.title ? '▼' : '▶'}
                    </span>
                  )}
                </div>
                
                {openSubmenu === item.title && sidebarOpen && (
                  <div style={{ 
                    backgroundColor: '#1f2937', // DARK BLUE background for submenu (same as sidebar)
                    maxHeight: '200px', // Fixed height for submenu
                    overflowY: 'auto', // SCROLL ONLY FOR SUBMENU
                    overflowX: 'hidden',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#4a5568 #1f2937' // Dark gray scrollbar on dark blue
                  }}
                  className="sidebar-submenu"
                >
                    {item.submenu.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        onClick={() => handleMenuClick(subItem.path)}
                        style={{
                          padding: '8px 20px 8px 52px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          backgroundColor: pathname === subItem.path ? '#374151' : 'transparent', // Darker blue for active submenu item
                          transition: 'background-color 0.2s ease',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        {/* White Bullet Point */}
                        <span style={{
                          width: '4px',
                          height: '4px',
                          backgroundColor: '#ffffff',
                          borderRadius: '50%',
                          flexShrink: 0
                        }}></span>
                        <span>{subItem.title}</span>
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
                  backgroundColor: pathname === item.path ? '#374151' : 'transparent', // Darker blue for active
                  transition: 'background-color 0.2s ease',
                  color: '#ffffff'
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                {sidebarOpen && (
                  <span style={{ fontSize: '14px', color: '#ffffff' }}>{item.title}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* LAST UPDATE Section with Enhanced Loading Animation */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #374151', // Darker border for dark blue
        backgroundColor: '#1f2937', // DARK BLUE background for update section
        flexShrink: 0 // Prevent last update section from shrinking
      }}>
        {sidebarOpen ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffffff',
              padding: '8px 12px',
              backgroundColor: '#1f2937', // DARK BLUE background
              borderRadius: '8px',
              border: `2px solid #FFD700`,
              marginBottom: '4px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #FFD700',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span style={{ color: '#ffffff', fontSize: '12px' }}>Loading Update...</span>
                </div>
              ) : (
                <>
                  <span style={{ color: '#ffffff' }}>Update: </span>
                  <span style={{ color: '#ffffff' }}>{lastUpdate}</span>
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '10px',
              color: '#ffffff',
              fontWeight: '600',
              padding: '4px 8px',
              backgroundColor: '#1f2937', // DARK BLUE background
              borderRadius: '4px',
              border: `1px solid #FFD700`,
              position: 'relative',
              overflow: 'hidden',
              minHeight: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    border: '1px solid #FFD700',
                    borderTop: '1px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span style={{ color: '#ffffff', fontSize: '8px' }}>Loading...</span>
                </div>
              ) : (
                <>
                  <span style={{ color: '#ffffff' }}>Update: </span>
                  <span style={{ color: '#ffffff' }}>{lastUpdate}</span>
                </>
              )}
            </div>
          </div>
        )}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
} 