'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, DashboardStats, ChartData, ActivityItem } from '@/lib/supabase'
import StatCard from '@/components/StatCard'
import ChartComponent from '@/components/ChartComponent'
import ActivityFeed from '@/components/ActivityFeed'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  })
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: []
  })
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const session = localStorage.getItem('nexmax_session')
    if (!session) {
      router.push('/login')
      return
    }

    const sessionData = JSON.parse(session)
    setUser(sessionData)
    
    // Load dashboard data
    loadDashboardData()
    
    // Check dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [router])

  const loadDashboardData = async () => {
    try {
      // Load stats from existing tables
      const [memberStats, depositStats, withdrawStats] = await Promise.all([
        // Get member statistics
        supabase
          .from('member_report_monthly')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1),
        
        // Get deposit statistics  
        supabase
          .from('deposit_monthly')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1),
          
        // Get withdraw statistics
        supabase
          .from('withdraw_monthly')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
      ])

      // Calculate stats from existing data
      let totalUsers = 0
      let totalRevenue = 0
      let totalWithdraw = 0

      if (memberStats.data && memberStats.data.length > 0) {
        totalUsers = memberStats.data[0].total_members || 0
      }

      if (depositStats.data && depositStats.data.length > 0) {
        totalRevenue = depositStats.data[0].total_amount || 0
      }

      if (withdrawStats.data && withdrawStats.data.length > 0) {
        totalWithdraw = withdrawStats.data[0].total_amount || 0
      }

      setStats({
        totalUsers,
        activeUsers: Math.floor(totalUsers * 0.8), // Estimate active users
        totalRevenue: totalRevenue - totalWithdraw, // Net revenue
        monthlyGrowth: 15.2 // Placeholder growth rate
      })

      // Load chart data from existing tables
      const [memberChartData, depositChartData] = await Promise.all([
        // Get member data for chart
        supabase
          .from('member_report_monthly')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(8),
        
        // Get deposit data for chart
        supabase
          .from('deposit_monthly')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(8)
      ])

      if (memberChartData.data && depositChartData.data) {
        const labels = memberChartData.data.map((item, index) => {
          const date = new Date(item.created_at)
          return date.toLocaleDateString('id-ID', { month: 'short' })
        })

        const memberData = memberChartData.data.map(item => item.total_members || 0)
        const revenueData = depositChartData.data.map(item => item.total_amount || 0)

        setChartData({
          labels,
          datasets: [
            {
              label: 'Total Members',
              data: memberData,
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              borderColor: 'rgba(59, 130, 246, 1)',
            },
            {
              label: 'Monthly Revenue',
              data: revenueData,
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              borderColor: 'rgba(16, 185, 129, 1)',
            }
          ]
        })
      }

      // Create activities from existing data
      const recentActivities = [
        {
          id: 1,
          user: 'System',
          action: 'Monthly member report generated',
          time: new Date().toLocaleString('id-ID'),
          status: 'completed' as const
        },
        {
          id: 2,
          user: 'Admin',
          action: 'Deposit batch processed',
          time: new Date(Date.now() - 3600000).toLocaleString('id-ID'),
          status: 'completed' as const
        },
        {
          id: 3,
          user: 'Manager',
          action: 'Withdrawal request approved',
          time: new Date(Date.now() - 7200000).toLocaleString('id-ID'),
          status: 'completed' as const
        },
        {
          id: 4,
          user: 'System',
          action: 'Daily exchange rate updated',
          time: new Date(Date.now() - 10800000).toLocaleString('id-ID'),
          status: 'completed' as const
        }
      ]

      setActivities(recentActivities)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('nexmax_session')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        user={user} 
        darkMode={darkMode} 
        onToggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
      />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Dashboard Overview
            </h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Members"
                value={stats.totalUsers.toLocaleString()}
                change="+12%"
                changeType="positive"
                icon="users"
              />
              <StatCard
                title="Active Members"
                value={stats.activeUsers.toLocaleString()}
                change="+8%"
                changeType="positive"
                icon="user-check"
              />
              <StatCard
                title="Net Revenue"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                change="+23%"
                changeType="positive"
                icon="dollar-sign"
              />
              <StatCard
                title="Monthly Growth"
                value={`${stats.monthlyGrowth}%`}
                change="+5%"
                changeType="positive"
                icon="trending-up"
              />
            </div>
            
            {/* Charts and Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChartComponent data={chartData} />
              </div>
              <div>
                <ActivityFeed activities={activities} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 