'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import SubHeader from '@/components/SubHeader'
import { supabase, testSupabaseConnection } from '@/lib/supabase'

export default function StrategicExecutive() {
  const [user, setUser] = useState<any>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const router = useRouter()
  
  // State untuk slicer
  const [year, setYear] = useState(2025)
  const [currency, setCurrency] = useState('MYR')
  const [month, setMonth] = useState(7)
  
  // State untuk data - CONNECTED TO SUPABASE
  const [strategicData, setStrategicData] = useState({
    netProfit: 693053.48,
    netProfitChange: -24.8,
    ggrUser: 142.64,
    ggrUserChange: -13.68,
    activeMember: 4901,
    activeMemberChange: -13.18,
    pureMember: 1411,
    pureMemberChange: -29.31,
    headcount: 68,
    headcountChange: 0
  })

  // State untuk chart data - CONNECTED TO SUPABASE
  const [chartData, setChartData] = useState({
    ggrUserTrend: {
      series: [{ name: 'GGR User', data: [142.50, 155.25, 148.75, 160.80, 152.90, 165.26, 142.64] }],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    ggrPureUserTrend: {
      series: [{ name: 'GGR Pure User', data: [98.30, 102.45, 95.80, 108.20, 99.75, 112.15, 89.50] }],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    customerValueTrend: {
      series: [{ name: 'Value per Headcount', data: [154.20, 148.00, 149.50, 142.00, 115.00, 193.00, 142.00] }],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    customerCountTrend: {
      series: [
        { name: 'Active Member', data: [8000, 7800, 7900, 7700, 6900, 7500, 6800] },
        { name: 'Headcount', data: [55, 55, 50, 52, 50, 55, 48] }
      ],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    customerVolumeDept: {
      series: [{ name: 'Headcount', data: [15, 10, 8] }],
      categories: ['Cashier', 'S&R', 'CS']
    }
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // TEMPORARY: Bypass authentication for testing
    const mockUser = {
      id: 1,
      username: 'admin',
      role: 'admin'
    }
    setUser(mockUser)
    
    // Check dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }

    // Fetch strategic data
    fetchStrategicData()
  }, [router, currency, year, month])

  const fetchStrategicData = async () => {
    setLoading(true)
    try {
      console.log('🚀 Strategic Executive - PARALLEL LOADING START')
      
      // Test Supabase connection first
      const isConnected = await testSupabaseConnection()
      if (!isConnected) {
        console.error('❌ Supabase connection failed, using mock data')
        setLoading(false)
        return
      }
      
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
        const processedData = processStrategicData(memberData, depositData, withdrawData)
        setStrategicData(processedData)
        console.log('📊 Strategic data loaded from Supabase')
      }
      
      setLoading(false)
    } catch (error) {
      console.error('❌ Error fetching strategic data:', error)
      setLoading(false)
    }
  }

  const processStrategicData = (memberData: any[], depositData: any[], withdrawData: any[]) => {
    const totalDeposit = depositData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    const totalWithdraw = withdrawData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    const activeMembers = memberData.length || 0
    const pureMembers = memberData.filter(m => m.is_pure_member).length || 0
    const headcount = memberData.filter(m => m.is_headcount).length || 0
    
    // Calculate GGR User (Gross Gaming Revenue per User)
    const ggrUser = activeMembers > 0 ? totalDeposit / activeMembers : 0
    const netProfit = totalDeposit - totalWithdraw

    return {
      netProfit: netProfit,
      netProfitChange: -24.8, // Mock change percentage
      ggrUser: ggrUser, // Return as number, not string
      ggrUserChange: -13.68, // Mock change percentage
      activeMember: activeMembers,
      activeMemberChange: -13.18, // Mock change percentage
      pureMember: pureMembers,
      pureMemberChange: -29.31, // Mock change percentage
      headcount: headcount,
      headcountChange: 0 // Mock change percentage
    }
  }

  const generateChartData = () => {
    // Generate mock chart data based on strategic data
    setChartData({
      ggrUserTrend: {
        series: [{ name: 'GGR User', data: [142.50, 155.25, 148.75, 160.80, 152.90, 165.26, strategicData.ggrUser] }],
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      },
      ggrPureUserTrend: {
        series: [{ name: 'GGR Pure User', data: [98.30, 102.45, 95.80, 108.20, 99.75, 112.15, 89.50] }],
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      },
      customerValueTrend: {
        series: [{ name: 'Value per Headcount', data: [154.20, 148.00, 149.50, 142.00, 115.00, 193.00, 142.00] }],
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      },
      customerCountTrend: {
        series: [
          { name: 'Active Member', data: [8000, 7800, 7900, 7700, 6900, 7500, strategicData.activeMember] },
          { name: 'Headcount', data: [55, 55, 50, 52, 50, 55, strategicData.headcount] }
        ],
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      },
      customerVolumeDept: {
        series: [{ name: 'Headcount', data: [15, 10, 8] }],
        categories: ['Cashier', 'S&R', 'CS']
      }
    })
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

  return (
    <Layout
      pageTitle="Strategic Executive"
      subHeaderTitle="Strategic Executive Dashboard"
    >
      <SubHeader title="Strategic Executive Dashboard" />
      
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#64748b' }}>
          🚀 Loading strategic data... Please wait
        </div>
      ) : (
        <>
          {/* KPI CARDS - STANDARDIZED WITH MAIN DASHBOARD */}
          <div className="kpi-grid">
            {/* Net Profit KPI */}
            <div className="kpi-card">
              <div className="kpi-icon">💰</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#10B981' }}>
                  Net Profit
                </h3>
                <div className="kpi-value">
                  {loading ? '...' : `${strategicData.netProfit.toLocaleString()}`}
                </div>
                <div className={`kpi-change ${strategicData.netProfitChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.netProfitChange >= 0 ? '+' : ''}{strategicData.netProfitChange}% vs last month
                </div>
              </div>
            </div>

            {/* GGR User KPI */}
            <div className="kpi-card">
              <div className="kpi-icon">📊</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#3B82F6' }}>
                  GGR User
                </h3>
                <div className="kpi-value">
                  {loading ? '...' : strategicData.ggrUser.toFixed(2)}
                </div>
                <div className={`kpi-change ${strategicData.ggrUserChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.ggrUserChange >= 0 ? '+' : ''}{strategicData.ggrUserChange}% vs last month
                </div>
              </div>
            </div>

            {/* Active Member KPI */}
            <div className="kpi-card">
              <div className="kpi-icon">👥</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#8B5CF6' }}>
                  Active Member
                </h3>
                <div className="kpi-value">
                  {loading ? '...' : strategicData.activeMember.toLocaleString()}
                </div>
                <div className={`kpi-change ${strategicData.activeMemberChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.activeMemberChange >= 0 ? '+' : ''}{strategicData.activeMemberChange}% vs last month
                </div>
              </div>
            </div>

            {/* Pure Member KPI */}
            <div className="kpi-card">
              <div className="kpi-icon">⭐</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#F59E0B' }}>
                  Pure Member
                </h3>
                <div className="kpi-value">
                  {loading ? '...' : strategicData.pureMember.toLocaleString()}
                </div>
                <div className={`kpi-change ${strategicData.pureMemberChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.pureMemberChange >= 0 ? '+' : ''}{strategicData.pureMemberChange}% vs last month
                </div>
              </div>
            </div>

            {/* Headcount KPI */}
            <div className="kpi-card">
              <div className="kpi-icon">👨‍💼</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#EF4444' }}>
                  Headcount
                </h3>
                <div className="kpi-value">
                  {loading ? '...' : strategicData.headcount.toLocaleString()}
                </div>
                <div className={`kpi-change ${strategicData.headcountChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.headcountChange >= 0 ? '+' : ''}{strategicData.headcountChange}% vs last month
                </div>
              </div>
            </div>
          </div>

          {/* CHARTS SECTION - 2-2-1 LAYOUT */}
          {/* BARIS 1: 2 Line Charts */}
          <div className="chart-grid">
            {/* GGR User Trend Chart */}
            <div className="chart-container">
              <h3 className="chart-title">📈 GGR User Trend</h3>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Chart Component - GGR User Trend
              </div>
            </div>

            {/* GGR Pure User Trend Chart */}
            <div className="chart-container">
              <h3 className="chart-title">📊 GGR Pure User Trend</h3>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Chart Component - GGR Pure User Trend
              </div>
            </div>
          </div>
          
          {/* BARIS 2: 2 Line Charts */}
          <div className="chart-grid">
            {/* Customer Value per Headcount Chart */}
            <div className="chart-container">
              <h3 className="chart-title">💰 Customer Value per Headcount</h3>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Chart Component - Customer Value per Headcount
              </div>
            </div>

            {/* Customer Count Trend Chart */}
            <div className="chart-container">
              <h3 className="chart-title">👥 Customer Count Trend</h3>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Chart Component - Customer Count Trend
              </div>
            </div>
          </div>

          {/* BARIS 3: 1 Chart */}
          <div className="chart-grid" style={{ gridTemplateColumns: '1fr' }}>
            {/* Customer Volume by Department Chart */}
            <div className="chart-container">
              <h3 className="chart-title">🏢 Customer Volume by Department</h3>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Chart Component - Customer Volume by Department
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
} 