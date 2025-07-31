'use client'

import { ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
  user: any
  darkMode: boolean
  sidebarExpanded: boolean
  setSidebarExpanded: (expanded: boolean) => void
  onToggleDarkMode: () => void
  onLogout: () => void
}

export default function Layout({
  children,
  user,
  darkMode,
  sidebarExpanded,
  setSidebarExpanded,
  onToggleDarkMode,
  onLogout
}: LayoutProps) {
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div className={`sidebar-container ${!sidebarExpanded ? 'collapsed' : ''}`}>
        <Sidebar user={user} onExpandedChange={setSidebarExpanded} />
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        {/* Header */}
        <div className="header-container">
          <Header
            user={user}
            darkMode={darkMode}
            onToggleDarkMode={onToggleDarkMode}
            onLogout={onLogout}
            sidebarExpanded={sidebarExpanded}
            setSidebarExpanded={setSidebarExpanded}
          />
        </div>

        {/* Content Area */}
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  )
} 