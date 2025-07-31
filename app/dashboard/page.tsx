'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import SubHeader from '@/components/SubHeader'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const router = useRouter()

  // State untuk slicer
  const [year, setYear] = useState(2025)
  const [currency, setCurrency] = useState('MYR')
  const [month, setMonth] = useState(7)
  
  // State untuk data
  const [dashboardData, setDashboardData] = useState({
    depositAmount: 0,
    withdrawAmount: 0,
    grossProfit: 0,
    netProfit: 0,
    newDepositor: 0,
    activeMember: 0
  })

  const [loading, setLoading] = useState(false)

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

    // Fetch dashboard data
    fetchDashboardData()
  }, [router, currency, year, month])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      console.log('🚀 Main Dashboard - PARALLEL LOADING START')
      
      // Fetch data from Supabase tables
      const { data: memberData, error: memberError } = await supabase
        .from('member_report_monthly')
        .select('*')
        .eq('year', year)
        .eq('month', month)

      const { data: depositData, error: depositError } = await supabase
        .from('deposit_monthly')
        .select('*')
        .eq('year', year)
        .eq('month', month)

      const { data: withdrawData, error: withdrawError } = await supabase
        .from('withdraw_monthly')
        .select('*')
        .eq('year', year)
        .eq('month', month)

      if (memberError) console.error('❌ Error fetching member data:', memberError)
      if (depositError) console.error('❌ Error fetching deposit data:', depositError)
      if (withdrawError) console.error('❌ Error fetching withdraw data:', withdrawError)

      // Process data
      if (memberData && depositData && withdrawData) {
        const totalDeposit = depositData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
        const totalWithdraw = withdrawData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
        const activeMembers = memberData.length || 0
        const newDepositors = memberData.filter(m => m.is_new_depositor).length || 0

        setDashboardData({
          depositAmount: totalDeposit,
          withdrawAmount: totalWithdraw,
          grossProfit: totalDeposit,
          netProfit: totalDeposit - totalWithdraw,
          newDepositor: newDepositors,
          activeMember: activeMembers
        })
        console.log('📊 Dashboard data loaded from Supabase')
      }
      
      setLoading(false)
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

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

  // Statistics data
  const statData = [
    {
      title: 'Deposit Amount',
      value: `RM ${dashboardData.depositAmount.toLocaleString()}`,
      icon: '💳',
      color: 'blue'
    },
    {
      title: 'Withdraw Amount',
      value: `RM ${dashboardData.withdrawAmount.toLocaleString()}`,
      icon: '💸',
      color: 'red'
    },
    {
      title: 'Gross Profit',
      value: `RM ${dashboardData.grossProfit.toLocaleString()}`,
      icon: '🔥',
      color: 'orange'
    },
    {
      title: 'Net Profit',
      value: `RM ${dashboardData.netProfit.toLocaleString()}`,
      icon: '💰',
      color: 'green'
    },
    {
      title: 'New Depositor',
      value: dashboardData.newDepositor.toString(),
      icon: '👤',
      color: 'purple'
    },
    {
      title: 'Active Member',
      value: dashboardData.activeMember.toString(),
      icon: '👥',
      color: 'blue'
    }
  ]

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
        title="Performance Overview"
        year={year}
        setYear={setYear}
        currency={currency}
        setCurrency={setCurrency}
        month={month}
        setMonth={setMonth}
      />
      
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#64748b' }}>
          🚀 Loading dashboard data... Please wait
        </div>
      ) : (
        <>
          {/* KPI Cards Grid */}
          <div className="kpi-grid">
            {statData.map((stat, i) => (
              <div key={i} className="kpi-card">
                <div className="kpi-icon">{stat.icon}</div>
                <div className="kpi-content">
                  <h3 className="kpi-title" style={{ color: stat.color === 'green' ? '#10B981' : stat.color === 'blue' ? '#3B82F6' : stat.color === 'purple' ? '#8B5CF6' : stat.color === 'orange' ? '#F59E0B' : '#EF4444' }}>
                    {stat.title}
                  </h3>
                  <div className="kpi-value">
                    {stat.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="chart-grid">
            <div className="chart-container">
              <h3 className="chart-title">📊 Retention vs Churn Rate Over Time</h3>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Chart Component - Retention vs Churn Rate
              </div>
            </div>
            <div className="chart-container">
              <h3 className="chart-title">💰 Customer Lifetime Value vs Purchase Frequency</h3>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Chart Component - CLV vs Purchase Frequency
              </div>
            </div>
          </div>

          {/* Line Charts Section */}
          <div className="chart-grid">
            <div className="chart-container">
              <h3 className="chart-title">📈 Growth vs Profitability Analysis</h3>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Chart Component - Growth vs Profitability Analysis
              </div>
            </div>
            <div className="chart-container">
              <h3 className="chart-title">💰 Operational Efficiency Trend</h3>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Chart Component - Operational Efficiency Trend
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
} 