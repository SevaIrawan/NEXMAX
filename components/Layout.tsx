'use client'

import { useState } from 'react'
import { ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
  pageTitle?: string
  showSubHeader?: boolean
  subHeaderContent?: ReactNode
  className?: string
  user?: any
  darkMode?: boolean
  sidebarExpanded?: boolean
  setSidebarExpanded?: (expanded: boolean) => void
  onToggleDarkMode?: () => void
  onLogout?: () => void
}

// CENTRALIZED LAYOUT - PROFESSIONAL SIZES
export default function Layout({ 
  children, 
  pageTitle = "NEXMAX Dashboard", 
  showSubHeader = false,
  subHeaderContent = null,
  className = "",
  user,
  darkMode = false,
  sidebarExpanded = true,
  setSidebarExpanded,
  onToggleDarkMode = () => {},
  onLogout = () => {}
}: LayoutProps) {
  
  // PROFESSIONAL SIZES - COMPACT AND CLEAN
  const HEADER_HEIGHT = '80px';
  const SUBHEADER_HEIGHT = '80px'; // COMPACT SUBHEADER - CLEAN
  const SIDEBAR_WIDTH = '250px'; // COMPACT SIDEBAR - CLEAN
  const SIDEBAR_COLLAPSED_WIDTH = '90px';

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: '#f8f9fa',
      overflow: 'hidden' // PREVENT BODY SCROLL
    }}>
      {/* SIDEBAR - FIXED POSITION, NO SCROLL */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: sidebarExpanded ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
        zIndex: 1000,
        transition: 'width 0.3s ease',
        overflow: 'hidden' // NO SCROLL IN SIDEBAR
      }}>
        <Sidebar 
          user={user} 
          onExpandedChange={setSidebarExpanded}
        />
      </div>
      
      {/* MAIN CONTENT AREA - FLEXIBLE WIDTH */}
      <div style={{ 
        flex: 1,
        marginLeft: sidebarExpanded ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
        transition: 'margin-left 0.3s ease',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden' // PREVENT MAIN AREA SCROLL
      }}>
        
        {/* HEADER - FIXED POSITION, NO SCROLL */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: sidebarExpanded ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
          right: 0,
          height: HEADER_HEIGHT,
          zIndex: 900,
          transition: 'left 0.3s ease',
          overflow: 'hidden' // NO SCROLL IN HEADER
        }}>
          <Header 
            user={user}
            darkMode={darkMode}
            onToggleDarkMode={onToggleDarkMode}
            onLogout={onLogout}
            sidebarExpanded={sidebarExpanded}
            setSidebarExpanded={setSidebarExpanded}
          />
        </div>
        
        {/* SUBHEADER - FIXED POSITION, NO SCROLL */}
        {showSubHeader && (
          <div style={{
            position: 'fixed',
            top: HEADER_HEIGHT,
            left: sidebarExpanded ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
            right: 0,
            height: SUBHEADER_HEIGHT,
            backgroundColor: '#ffffff',
            borderBottom: '2px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            zIndex: 800,
            transition: 'left 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            padding: '0 48px',
            fontSize: '16px',
            overflow: 'hidden' // NO SCROLL IN SUBHEADER
          }}>
            {subHeaderContent}
          </div>
        )}
        
        {/* MAIN CONTENT - COMPACT & CLEAN */}
        <div 
          className={`main-content ${className}`}
          style={{
            marginTop: showSubHeader ? `calc(${HEADER_HEIGHT} + ${SUBHEADER_HEIGHT})` : HEADER_HEIGHT,
            padding: '24px 32px', // COMPACT PADDING - CLEAN
            height: showSubHeader ? 
              `calc(100vh - ${HEADER_HEIGHT} - ${SUBHEADER_HEIGHT})` : 
              `calc(100vh - ${HEADER_HEIGHT})`,
            transition: 'margin-top 0.3s ease',
            overflow: 'auto', // ONLY THIS AREA CAN SCROLL
            backgroundColor: '#f8fafc', // CLEAN BACKGROUND
            width: '100%',
            position: 'relative'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
} 