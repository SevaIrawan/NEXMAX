'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface SidebarProps {
  user?: any
  onExpandedChange?: (expanded: boolean) => void
}

export default function Sidebar({ user, onExpandedChange }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true) // DEFAULT EXPANDABLE
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null)
  const [lastUpdateDate, setLastUpdateDate] = useState<string>('')
  const router = useRouter()
  const pathname = usePathname()

  // Auto-expand submenu jika user berada di halaman submenu
  useEffect(() => {
    if (pathname.startsWith('/transaction')) {
      setExpandedSubmenu('transaction')
    }
  }, [pathname])

  // Notify parent component about expansion state changes
  useEffect(() => {
    if (onExpandedChange) {
      onExpandedChange(isExpanded)
    }
  }, [isExpanded, onExpandedChange])

  // Fetch MAX(DATE) dari table member_report_monthly
  useEffect(() => {
    const fetchLastUpdate = async () => {
      try {
        console.log('🔄 Fetching MAX(DATE) from member_report_monthly...')
        console.log('🔗 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('🔑 Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        
        // Test connection first
        const { data: testData, error: testError } = await supabase
          .from('member_report_monthly')
          .select('count')
          .limit(1)

        if (testError) {
          console.error('❌ Supabase connection test failed:', testError)
          return
        }
        
        console.log('✅ Supabase connection successful, table accessible')
        
        // Ambil MAX(DATE) dari kolom DATE
        const { data, error } = await supabase
          .from('member_report_monthly')
          .select('date')
          .order('date', { ascending: false })
          .limit(1)

        if (error) {
          console.error('❌ Error fetching MAX(DATE):', error)
          return
        }

        console.log('📊 Raw data from query:', data)

        if (data && data.length > 0) {
          const maxDate = data[0].date
          console.log('📅 Raw maxDate:', maxDate)
          
          if (maxDate) {
            const date = new Date(maxDate)
            const formattedDate = date.toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            })
            setLastUpdateDate(formattedDate)
            console.log('✅ MAX(DATE) set to:', formattedDate)
          } else {
            console.log('⚠️ No date found in data')
          }
        } else {
          console.log('⚠️ No data returned from query')
        }
      } catch (error) {
        console.error('❌ Error in fetchLastUpdate:', error)
      }
    }

    fetchLastUpdate()
  }, [])

  const formatLastUpdate = (timestamp: any) => {
    if (!timestamp) return `🔄 Data Updated: ${new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    })}`
    
    // If timestamp already contains the full formatted string, return as is
    if (typeof timestamp === 'string' && timestamp.includes('🔄 Data Updated:')) {
      return timestamp
    }
    
    // Otherwise format as date
    try {
      return `🔄 Data Updated: ${new Date(timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      })}`
    } catch (error) {
      return timestamp
    }
  }

  // Toggle submenu - hanya tutup jika user manual klik
  const toggleSubmenu = (menuKey: string) => {
    setExpandedSubmenu(current => current === menuKey ? null : menuKey)
  }

  const menuItems = [
    { 
      key: 'overview',
      icon: '📊', 
      label: 'Overview', 
      href: '/',
      isActive: pathname === '/'
    },
    { 
      key: 'strategic',
      icon: '🎯', 
      label: 'Strategic Executive', 
      href: '/strategic-executive',
      isActive: pathname === '/strategic-executive'
    },
    { 
      key: 'business',
      icon: '💼', 
      label: 'Business Flow', 
      href: '/business-flow',
      isActive: pathname === '/business-flow'
    },
    { 
      key: 'bgo',
      icon: '🚀', 
      label: 'BGO', 
      href: '/bgo',
      isActive: pathname === '/bgo'
    },
    { 
      key: 'sr',
      icon: '📋', 
      label: 'S&R', 
      href: '/sr',
      isActive: pathname === '/sr'
    },
    { 
      key: 'xoo',
      icon: '🔄', 
      label: 'XOO', 
      href: '/xoo',
      isActive: pathname === '/xoo'
    },
    { 
      key: 'os',
      icon: '⚙️', 
      label: 'OS', 
      href: '/os',
      isActive: pathname === '/os'
    },
    { 
      key: 'transaction',
      icon: '📈', 
      label: 'Transaction', 
      href: '#',
      isActive: pathname.startsWith('/transaction'),
      hasSubmenu: true,
      submenu: [
        { icon: '💳', label: 'Deposit', href: '/transaction/deposit' },
        { icon: '💸', label: 'Withdraw', href: '/transaction/withdraw' },
        { icon: '🔄', label: 'Adjustment', href: '/transaction/adjustment' },
        { icon: '💱', label: 'Exchange', href: '/transaction/exchange' },
        { icon: '👥', label: 'Headcount', href: '/transaction/headcount' },
        { icon: '👤', label: 'New Depositor', href: '/transaction/new-depositor' },
        { icon: '📝', label: 'New Register', href: '/transaction/new-register' },
        { icon: '👑', label: 'VIP Program', href: '/transaction/vip-program' }
      ]
    },
    { 
      key: 'users',
      icon: '👥', 
      label: 'User Management', 
      href: '/users',
      isActive: pathname === '/users'
    }
  ]

  return (
    <>
      <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {/* Professional Header Section */}
        <div className="header-section">
          <div className="logo-container">
            <div className="company-logo">
              <Image
                src="/aset/images (1).jpg"
                alt="NEXMAX Logo"
                width={45}
                height={45}
                className="logo-image"
              />
            </div>
            {isExpanded && (
              <div className="company-info">
                <div className="company-name">NEXMAX</div>
                <div className="company-subtitle">Dashboard</div>
              </div>
            )}
          </div>
          
          <button 
            className="collapse-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <span className="collapse-icon">
              {isExpanded ? '◀' : '▶'}
            </span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          <ul>
            {menuItems.map((item) => (
              <li key={item.key} className={item.isActive ? 'active' : ''}>
                {item.hasSubmenu ? (
                  <div>
                    <button 
                      className="menu-button"
                      onClick={() => toggleSubmenu(item.key)}
                    >
                      <span className="icon">{item.icon}</span>
                      {isExpanded && (
                        <>
                          <span className="label">{item.label}</span>
                          <span className={`arrow ${expandedSubmenu === item.key ? 'rotated' : ''}`}>
                            ▶
                          </span>
                        </>
                      )}
                    </button>
                    
                    {expandedSubmenu === item.key && isExpanded && (
                      <div className="submenu-container">
                        <ul className="submenu">
                          {item.submenu?.map((subItem, index) => (
                            <li key={index}>
                              <a 
                                href={subItem.href}
                                className={pathname === subItem.href ? 'active' : ''}
                              >
                                <span className="sub-icon">{subItem.icon}</span>
                                <span className="sub-label">{subItem.label}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <a 
                    href={item.href}
                    className="menu-link"
                    data-tooltip={!isExpanded ? item.label : undefined}
                  >
                    <span className="icon">{item.icon}</span>
                    {isExpanded && <span className="label">{item.label}</span>}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Last Update Section */}
        <div className="last-update-section">
          <div className="last-update-item" data-tooltip="Last Update">
            {isExpanded && (
              <div className="update-content">
                <span className="update-text-single">
                  {lastUpdateDate ? `UPDATE: ${lastUpdateDate}` : '🔄 Loading...'}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Add global style to adjust main content based on sidebar state */}
      <style jsx global>{`
        .main-content {
          margin-left: ${isExpanded ? '250px' : '75px'} !important;
          transition: margin-left 0.3s ease;
        }
      `}</style>

      <style jsx>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          background: linear-gradient(180deg, #1a1d29 0%, #2d3142 100%);
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          z-index: 999;
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: 0;
          border: none;
          outline: none;
          border-right: none;
          border-top: none;
          border-bottom: none;
          overflow: hidden;
        }

        .sidebar.collapsed {
          width: 90px;
        }

        .sidebar.expanded {
          width: 250px;
        }

        /* Professional Header Section - EXACT HEIGHT MATCH */
        .header-section {
          padding: 20px 15px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          height: 85px;
          box-sizing: border-box;
          margin: 0;
          background: transparent;
          border-left: none;
          border-right: none;
          border-top: none;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .company-logo {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border: 2px solid #fbbf24;
          box-shadow: 0 0 8px rgba(251, 191, 36, 0.3);
        }

        .logo-text {
          color: #1f2937;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .logo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .company-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .company-name {
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .company-subtitle {
          color: #94a3b8;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .collapse-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #94a3b8;
        }

        .collapse-btn:hover {
          background: rgba(255,255,255,0.2);
          color: white;
        }

        .collapse-icon {
          font-size: 0.8rem;
          transition: transform 0.2s ease;
        }

        /* Navigation Menu */
        .nav-menu {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 20px 0;
          margin: 0;
        }

        .nav-menu ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-menu li {
          margin-bottom: 4px;
        }

        .menu-link, .menu-button {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 20px;
          color: #cbd5e1;
          text-decoration: none;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 0;
        }

        .menu-link:hover, .menu-button:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .nav-menu .active > .menu-link,
        .nav-menu .active > .menu-button {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
        }

        .icon {
          font-size: 1.2rem;
          width: 35px;
          text-align: center;
          flex-shrink: 0;
        }

        .label {
          margin-left: 12px;
          flex: 1;
          text-align: left;
          font-weight: 500;
        }

        .arrow {
          margin-left: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .arrow.rotated {
          transform: rotate(90deg);
        }

        /* Submenu Container dengan SCROLL */
        .submenu-container {
          background: rgba(0,0,0,0.2);
          border-left: 2px solid #667eea;
          margin-left: 20px;
          margin-top: 4px;
          margin-bottom: 8px;
          max-height: 250px;
          overflow-y: auto;
          overflow-x: hidden;
          border-radius: 0 8px 8px 0;
          padding: 8px 0;
        }

        /* Submenu */
        .submenu {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .submenu li {
          margin-bottom: 2px;
        }

        .submenu a {
          display: flex;
          align-items: center;
          padding: 10px 20px;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          border-radius: 0 6px 6px 0;
          margin: 0 4px;
        }

        .submenu a:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .submenu a.active {
          background: rgba(102, 126, 234, 0.3);
          color: white;
          font-weight: 500;
        }

        .sub-icon {
          width: 20px;
          text-align: center;
          color: #667eea;
          margin-right: 8px;
          font-size: 0.9rem;
        }

        .sub-label {
          flex: 1;
        }

        /* 
        date Section */
        .last-update-section {
          padding: 16px 10px;
          border-top: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.2);
          margin-top: auto;
        }

        .last-update-item {
          position: relative;
          overflow: hidden;
          border-radius: 5px;
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          border: 2px solid #f59e0b;
          padding: 12px 16px;
        }

        .last-update-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .update-content {
          display: flex;
          align-items: center;
          flex: 1;
          width: 100%;
        }

        .update-text-single {
          color: #ffffff;
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.4;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: 0.3px;
          width: 100%;
          text-align: center;
        }

        /* Scrollbar untuk Main Menu */
        .nav-menu::-webkit-scrollbar {
          width: 4px;
        }

        .nav-menu::-webkit-scrollbar-track {
          background: transparent;
        }

        .nav-menu::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
        }

        /* Scrollbar untuk SUBMENU */
        .submenu-container::-webkit-scrollbar {
          width: 4px;
        }

        .submenu-container::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }

        .submenu-container::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.5);
          border-radius: 2px;
        }

        .submenu-container::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.7);
        }

        /* Tooltip for collapsed state */
        .sidebar.collapsed .menu-link,
        .sidebar.collapsed .menu-button,
        .sidebar.collapsed .last-update-item {
          position: relative;
        }

        .sidebar.collapsed .menu-link:hover::after,
        .sidebar.collapsed .menu-button:hover::after,
        .sidebar.collapsed .last-update-item:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          left: 75px;
          top: 50%;
          transform: translateY(-50%);
          background: #1f2937;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          white-space: nowrap;
          z-index: 1002;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
      `}</style>
    </>
  )
} 