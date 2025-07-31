'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import SubHeader from '@/components/SubHeader'
import { supabase } from '@/lib/supabase'

export default function StrategicExecutive() {
  const [user, setUser] = useState<any>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const router = useRouter()
  
  // State untuk slicer
  const [year, setYear] = useState('2025')
  const [currency, setCurrency] = useState('MYR')
  const [month, setMonth] = useState('July')
  
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

    // Fetch strategic data
    fetchStrategicData()
  }, [router, currency, year, month])

  const fetchStrategicData = async () => {
    setLoading(true)
    try {
      console.log('🚀 Strategic Executive - PARALLEL LOADING START')
      
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

      // Process data and update state
      if (memberData && depositData && withdrawData) {
        const processedData = processStrategicData(memberData, depositData, withdrawData)
        setStrategicData(processedData)
        console.log('📊 Strategic KPI data loaded from Supabase')
      }

      // Generate chart data
      const chartData = generateChartData()
      setChartData(chartData)
      console.log('📈 Strategic chart data generated')
      
      console.log('✅ Strategic Executive - PARALLEL LOADING COMPLETED')
    } catch (error) {
      console.error('❌ Error fetching strategic data:', error)
    }
    setLoading(false)
  }

  const processStrategicData = (memberData: any[], depositData: any[], withdrawData: any[]) => {
    // Calculate strategic metrics from Supabase data
    const totalDeposit = depositData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    const totalWithdraw = withdrawData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    const activeMembers = memberData.length || 0
    const pureMembers = memberData.filter(m => m.is_pure_member).length || 0
    const headcount = memberData.filter(m => m.is_active).length || 0

    const netProfit = totalDeposit - totalWithdraw
    const ggrUser = activeMembers > 0 ? netProfit / activeMembers : 0

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
      headcountChange: 0
    }
  }

  const generateChartData = () => {
    // Generate mock chart data based on current filters
    return {
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

  return (
    <div className="app-layout">
      <Sidebar 
        user={user} 
        onExpandedChange={setSidebarExpanded}
      />
      
      <div className={`main-content ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Header 
          user={user}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onLogout={handleLogout}
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
        />

        <SubHeader 
          title="Strategic Executive Dashboard"
          year={Number(year)}
          setYear={(value) => setYear(value.toString())}
          currency={currency}
          setCurrency={setCurrency}
          month={month === 'January' ? 1 : month === 'February' ? 2 : month === 'March' ? 3 : month === 'April' ? 4 : month === 'May' ? 5 : month === 'June' ? 6 : month === 'July' ? 7 : month === 'August' ? 8 : month === 'September' ? 9 : month === 'October' ? 10 : month === 'November' ? 11 : 12}
          setMonth={(value) => {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            setMonth(months[value - 1])
          }}
        />

        <main className="scrollable-content">
          <div className="dashboard-content">
          
          {/* KPI CARDS - STANDARDIZED WITH MAIN DASHBOARD */}
          <div className="kpi-grid-improved">
            {/* Net Profit KPI */}
            <div className="kpi-card-improved">
              <div className="kpi-icon">💰</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#10B981' }}>
                  Net Profit
                </h3>
                <div className="kpi-value" style={{ color: '#000000' }}>
                  {loading ? '...' : `${strategicData.netProfit.toLocaleString()}`}
                </div>
                <div className={`kpi-change ${strategicData.netProfitChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.netProfitChange >= 0 ? '+' : ''}{strategicData.netProfitChange}% vs last month
                </div>
              </div>
            </div>

            {/* GGR User KPI */}
            <div className="kpi-card-improved">
              <div className="kpi-icon">📊</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#3B82F6' }}>
                  GGR User
                </h3>
                <div className="kpi-value" style={{ color: '#000000' }}>
                  {loading ? '...' : strategicData.ggrUser.toFixed(2)}
                </div>
                <div className={`kpi-change ${strategicData.ggrUserChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.ggrUserChange >= 0 ? '+' : ''}{strategicData.ggrUserChange}% vs last month
                </div>
              </div>
            </div>

            {/* Active Member KPI */}
            <div className="kpi-card-improved">
              <div className="kpi-icon">👥</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#8B5CF6' }}>
                  Active Member
                </h3>
                <div className="kpi-value" style={{ color: '#000000' }}>
                  {loading ? '...' : strategicData.activeMember.toLocaleString()}
                </div>
                <div className={`kpi-change ${strategicData.activeMemberChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.activeMemberChange >= 0 ? '+' : ''}{strategicData.activeMemberChange}% vs last month
                </div>
              </div>
            </div>

            {/* Pure Member KPI */}
            <div className="kpi-card-improved">
              <div className="kpi-icon">⭐</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#F59E0B' }}>
                  Pure Member
                </h3>
                <div className="kpi-value" style={{ color: '#000000' }}>
                  {loading ? '...' : strategicData.pureMember.toLocaleString()}
                </div>
                <div className={`kpi-change ${strategicData.pureMemberChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.pureMemberChange >= 0 ? '+' : ''}{strategicData.pureMemberChange}% vs last month
                </div>
              </div>
            </div>

            {/* Headcount KPI */}
            <div className="kpi-card-improved">
              <div className="kpi-icon">👤</div>
              <div className="kpi-content">
                <h3 className="kpi-title" style={{ color: '#EF4444' }}>
                  Headcount
                </h3>
                <div className="kpi-value" style={{ color: '#000000' }}>
                  {loading ? '...' : strategicData.headcount}
                </div>
                <div className={`kpi-change ${strategicData.headcountChange >= 0 ? 'positive' : 'negative'}`}>
                  {strategicData.headcountChange >= 0 ? '+' : ''}{strategicData.headcountChange}% vs last month
                </div>
              </div>
            </div>
          </div>

          {/* CHARTS SECTION - 2-2-1 LAYOUT */}
          {/* BARIS 1: 2 Line Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', width: '100%', maxWidth: '100%' }}>
            {/* GGR User Trend Chart */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#1f2937'
              }}>
                GGR User Trend
              </h3>
              {loading ? (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Loading...
                </div>
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  Chart Component - GGR User Trend
                </div>
              )}
            </div>

            {/* GGR Pure User Trend Chart */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#1f2937'
              }}>
                GGR Pure User Trend
              </h3>
              {loading ? (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Loading...
                </div>
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  Chart Component - GGR Pure User Trend
                </div>
              )}
            </div>
          </div>

          {/* BARIS 2: 2 Line Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', width: '100%', maxWidth: '100%' }}>
            {/* Customer Value per Headcount Chart */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#1f2937'
              }}>
                Customer Value per Headcount
              </h3>
              {loading ? (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Loading...
                </div>
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  Chart Component - Customer Value per Headcount
                </div>
              )}
            </div>

            {/* Customer Count vs Headcount Chart */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#1f2937'
              }}>
                Customer Count vs Headcount
              </h3>
              {loading ? (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Loading...
                </div>
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  Chart Component - Customer Count vs Headcount
                </div>
              )}
            </div>
          </div>

          {/* BARIS 3: 1 Bar Chart (Full Width) */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: '#1f2937'
            }}>
              Customer Volume by Department
            </h3>
            {loading ? (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading...
              </div>
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Chart Component - Customer Volume by Department
              </div>
            )}
          </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        /* STANDARDIZED KPI CARD STYLES - SAME AS MAIN DASHBOARD */
        .kpi-grid-improved {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        @media (max-width: 1200px) {
          .kpi-grid-improved {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .kpi-grid-improved {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .kpi-grid-improved {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }

        .kpi-card-improved {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .kpi-card-improved:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
        }

        .kpi-icon {
          font-size: 1.2rem;
          position: absolute;
          top: 10px;
          right: 18px;
          opacity: 0.8;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-content {
          flex: 1;
        }

        .kpi-title {
          font-size: 1rem;
          font-weight: 600;
          color: #64748b;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1.3;
          padding-right: 45px;
          display: flex;
          align-items: center;
        }

        .kpi-value {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          line-height: 1.2;
          word-break: break-word;
        }

        .kpi-change {
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .kpi-change.positive {
          color: #10B981;
        }

        .kpi-change.negative {
          color: #EF4444;
        }

        .kpi-change.positive::before {
          content: "↗";
          font-size: 1rem;
        }

        .kpi-change.negative::before {
          content: "↘";
          font-size: 1rem;
        }
      `}</style>
    </div>
  )
} 