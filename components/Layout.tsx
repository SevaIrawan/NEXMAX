'use client'

import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import SubHeader from './SubHeader'

interface LayoutProps {
  children: React.ReactNode
  pageTitle?: string
  subHeaderTitle?: string
  customSubHeader?: React.ReactNode
  darkMode?: boolean
  onToggleDarkMode?: () => void
  onLogout?: () => void
  sidebarExpanded?: boolean
}

export default function Layout({ 
  children, 
  pageTitle = "NEXMAX Dashboard",
  subHeaderTitle,
  customSubHeader,
  darkMode = false,
  onToggleDarkMode = () => {},
  onLogout = () => {},
  sidebarExpanded = true
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(sidebarExpanded)

  return (
    <div className="main-container">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onLogout={onLogout}
        sidebarExpanded={sidebarExpanded}
      />
      
      <Header 
        pageTitle={pageTitle}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onLogout={onLogout}
      />
      
      <div className={`subheader ${!sidebarOpen ? 'collapsed' : ''}`}>
        {customSubHeader || <SubHeader title={subHeaderTitle || ' '} />}
      </div>
      
      <div className={`main-content ${!sidebarOpen ? 'collapsed' : ''}`}>
        {children}
      </div>
    </div>
  )
} 