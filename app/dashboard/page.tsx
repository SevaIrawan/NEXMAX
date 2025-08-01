'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'

interface DashboardData {
  totalDeposit: number
  totalWithdraw: number
  totalMembers: number
  totalTransactions: number
  lastUpdate: string
  tableStats: {
    [key: string]: number
  }
}

export default function Dashboard() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData>({
    totalDeposit: 0,
    totalWithdraw: 0,
    totalMembers: 0,
    totalTransactions: 0,
    lastUpdate: '',
    tableStats: {}
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchAllData()
    // Auto refresh setiap 30 detik
    const interval = setInterval(fetchAllData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAllData = async () => {
    try {
      console.log('🔄 Dashboard - Fetching ALL data from database (NO LIMIT)...')
      setLoading(true)
      setError('')

      // Semua table yang ada di database
      const allTables = [
        'member_report_monthly',
        'member_report_daily', 
        'deposit_monthly',
        'withdraw_monthly',
        'withdraw_daily',
        'new_depositor',
        'new_depositor_daily',
        'new_register',
        'adjusment_daily',
        'headcountdep',
        'exchange_rate',
        'users'
      ]

      const tableStats: { [key: string]: number } = {}
      let totalDeposit = 0
      let totalWithdraw = 0
      let totalMembers = 0
      let totalTransactions = 0
      let lastUpdate = ''

      // Fetch data dari semua table - SEMUA DATA TANPA LIMIT
      for (const tableName of allTables) {
        try {
          console.log(`🔄 Fetching ALL data from table: ${tableName} (NO LIMIT)`)
          
          // Mengambil SEMUA data tanpa limit
          const { data: tableData, error: tableError } = await supabase
            .from(tableName)
            .select('*')

          if (tableError) {
            console.log(`❌ Error fetching ${tableName}:`, tableError.message)
            tableStats[tableName] = 0
            continue
          }

          if (tableData && tableData.length > 0) {
            tableStats[tableName] = tableData.length
            console.log(`✅ ${tableName}: ${tableData.length.toLocaleString()} rows (REAL DATA)`)

            // Process data berdasarkan table
            if (tableName === 'member_report_monthly') {
              const depositSum = tableData.reduce((sum, item) => sum + (parseFloat(item.deposit_amount || '0') || 0), 0)
              const withdrawSum = tableData.reduce((sum, item) => sum + (parseFloat(item.withdraw_amount || '0') || 0), 0)
              const transactionSum = tableData.reduce((sum, item) => sum + (parseFloat(item.total_transactions || '0') || 0), 0)
              
              totalDeposit += depositSum
              totalWithdraw += withdrawSum
              totalTransactions += transactionSum
              totalMembers += tableData.length

              console.log(`📊 ${tableName} totals:`, {
                deposit: depositSum.toLocaleString(),
                withdraw: withdrawSum.toLocaleString(),
                transactions: transactionSum.toLocaleString(),
                members: tableData.length.toLocaleString()
              })

              // Get MAX(date) dari master table member_report_monthly
              const maxDateRecord = tableData.reduce((max, current) => {
                if (!max.date) return current
                if (!current.date) return max
                
                const maxDate = new Date(max.date.split('/').reverse().join('-'))
                const currentDate = new Date(current.date.split('/').reverse().join('-'))
                
                return currentDate > maxDate ? current : max
              })

              if (maxDateRecord.date) {
                lastUpdate = formatDate(maxDateRecord.date)
                console.log(`📅 MAX(date) from master table ${tableName}:`, lastUpdate)
                console.log('📊 Master table member_report_monthly is the reference for LAST UPDATE')
              }
            }

            if (tableName === 'deposit_monthly') {
              const depositSum = tableData.reduce((sum, item) => sum + (parseFloat(item.amount || '0') || 0), 0)
              totalDeposit += depositSum
              console.log(`💰 ${tableName} total deposit:`, depositSum.toLocaleString())
            }

            if (tableName === 'withdraw_monthly') {
              const withdrawSum = tableData.reduce((sum, item) => sum + (parseFloat(item.amount || '0') || 0), 0)
              totalWithdraw += withdrawSum
              console.log(`💸 ${tableName} total withdraw:`, withdrawSum.toLocaleString())
            }

            if (tableName === 'new_depositor' || tableName === 'new_register') {
              totalMembers += tableData.length
              console.log(`👥 ${tableName} members:`, tableData.length.toLocaleString())
            }

          } else {
            tableStats[tableName] = 0
            console.log(`⚠️ ${tableName}: No data`)
          }

        } catch (err) {
          console.error(`❌ Exception fetching ${tableName}:`, err)
          tableStats[tableName] = 0
        }
      }

      setData({
        totalDeposit,
        totalWithdraw,
        totalMembers,
        totalTransactions,
        lastUpdate,
        tableStats
      })

      console.log('✅ Dashboard data updated successfully - REAL DATA')
      console.log(`📊 Total Deposit: ${totalDeposit.toLocaleString()}`)
      console.log(`📊 Total Withdraw: ${totalWithdraw.toLocaleString()}`)
      console.log(`📊 Total Members: ${totalMembers.toLocaleString()}`)
      console.log(`📊 Total Transactions: ${totalTransactions.toLocaleString()}`)
      console.log(`📅 Last Update: ${lastUpdate}`)
      console.log('📋 Table Statistics (REAL):', tableStats)

    } catch (error) {
      console.error('❌ Dashboard error:', error)
      setError('Failed to connect to database')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const dateParts = dateString.split('/')
      const month = parseInt(dateParts[0])
      const day = parseInt(dateParts[1])
      const year = parseInt(dateParts[2])
      
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `RM ${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `RM ${(amount / 1000).toFixed(0)}K`
    }
    return `RM ${amount.toLocaleString()}`
  }

  const handleLogout = () => {
    localStorage.removeItem('darkMode')
    router.push('/login')
  }

  if (loading) {
    return (
      <Layout pageTitle="Dashboard">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          fontSize: '18px',
          color: '#6b7280'
        }}>
          🔄 Loading real database data...
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout pageTitle="Dashboard">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          gap: '16px'
        }}>
          <div style={{ fontSize: '18px', color: '#ef4444' }}>
            ❌ {error}
          </div>
          <button
            onClick={fetchAllData}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            🔄 Retry Connection
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout pageTitle="Dashboard">
      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '24px', color: '#1f2937' }}>
          Dashboard Overview - REAL DATA
        </h1>

        {/* KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '24px' }}>💰</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280', margin: 0 }}>
                Total Deposit
              </h3>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>
              {formatCurrency(data.totalDeposit)}
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '24px' }}>💸</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280', margin: 0 }}>
                Total Withdraw
              </h3>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444' }}>
              {formatCurrency(data.totalWithdraw)}
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '24px' }}>👥</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280', margin: 0 }}>
                Total Members
              </h3>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6' }}>
              {data.totalMembers.toLocaleString()}
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '24px' }}>📊</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280', margin: 0 }}>
                Total Transactions
              </h3>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>
              {data.totalTransactions.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Database Tables Status */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Database Tables - REAL DATA
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {Object.entries(data.tableStats).map(([tableName, count]) => (
              <div key={tableName} style={{
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#f9fafb'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                  {tableName}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: count > 0 ? '#10b981' : '#6b7280' }}>
                  {count.toLocaleString()} rows
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Status */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Database Connection Status
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#10b981'
            }} />
            <span style={{ fontSize: '16px', fontWeight: '500', color: '#10b981' }}>
              ✅ Connected to Supabase - REAL DATA
            </span>
          </div>

          {data.lastUpdate && (
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Last Update: </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                {data.lastUpdate}
              </span>
            </div>
          )}

          <div style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
            Auto-refresh every 30 seconds - REAL DATABASE CONNECTION
          </div>
        </div>
      </div>
    </Layout>
  )
} 