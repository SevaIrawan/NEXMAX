'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import SubHeader from '@/components/SubHeader'

export default function OsPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  // Mock user data - akan diganti dengan Supabase auth
  const user = {
    email: 'admin@nexmax.com',
    role: 'admin'
  }

  const handleToggleDarkMode = () => setDarkMode(!darkMode)
  const handleLogout = () => console.log('Logout clicked')

  return (
    <Layout
      pageTitle="OS"
      subHeaderTitle=""
    >
      {/* SUB HEADER - EMPTY FOR NOW */}
      <SubHeader title="OS" />

      {/* CONTENT - PROPERLY POSITIONED */}
      <div style={{ 
        padding: '40px',
        minHeight: 'calc(100vh - 185px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="coming-soon-card">
          <div className="icon-large">⚙️</div>
          <h1>OS</h1>
          <p>Operations System dashboard is currently under development.</p>
          <div className="features-list">
            <div className="feature-item">🔧 System Monitoring</div>
            <div className="feature-item">📊 Performance Analytics</div>
            <div className="feature-item">🎯 Operational KPIs</div>
            <div className="feature-item">📈 Efficiency Metrics</div>
          </div>
          <div className="status-badge">Coming Soon</div>
        </div>
      </div>

      <style jsx>{`
        .coming-soon-card {
          background: white;
          border-radius: 16px;
          padding: 60px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          width: 100%;
        }
        
        .icon-large {
          font-size: 5rem;
          margin-bottom: 32px;
          opacity: 0.8;
        }
        
        .coming-soon-card h1 {
          font-size: 2.5rem;
          margin: 0 0 20px 0;
          color: #1f2937;
          font-weight: 700;
        }
        
        .coming-soon-card p {
          font-size: 1.2rem;
          color: #6b7280;
          margin: 0 0 40px 0;
          line-height: 1.6;
        }
        
        .features-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 40px;
        }
        
        .feature-item {
          padding: 16px;
          background: #f8f9fa;
          border-radius: 12px;
          font-weight: 500;
          color: #374151;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }
        
        .feature-item:hover {
          background: #e0f2fe;
          border-color: #0ea5e9;
          transform: translateY(-2px);
        }
        
        .status-badge {
          display: inline-block;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 12px 32px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        
        @media (max-width: 768px) {
          .coming-soon-card {
            padding: 40px 20px;
            margin: 20px;
          }
          
          .features-list {
            grid-template-columns: 1fr;
          }
          
          .coming-soon-card h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </Layout>
  )
} 