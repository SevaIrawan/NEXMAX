'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'

interface TableInfo {
  name: string
  count: number
  status: 'loading' | 'success' | 'error'
  error?: string
}

interface LogEntry {
  timestamp: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
}

export default function ConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [tables, setTables] = useState<TableInfo[]>([])
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [lastDataHash, setLastDataHash] = useState<string>('')

  // Semua table yang ada di database dengan title yang profesional
  const allTables = [
    { source: 'member_report_monthly', title: 'Member Report Monthly' },
    { source: 'member_report_daily', title: 'Member Report Daily' },
    { source: 'deposit_monthly', title: 'Deposit Monthly' },
    { source: 'deposit_daily', title: 'Deposit Daily' },
    { source: 'withdraw_monthly', title: 'Withdraw Monthly' },
    { source: 'withdraw_daily', title: 'Withdraw Daily' },
    { source: 'new_depositor', title: 'New Depositor' },
    { source: 'new_depositor_daily', title: 'New Depositor Daily' },
    { source: 'new_register', title: 'New Register' },
    { source: 'adjusment_daily', title: 'Adjustment Daily' },
    { source: 'headcountdep', title: 'Headcount Deposit' },
    { source: 'exchange_rate', title: 'Exchange Rate' },
    { source: 'users', title: 'Users' }
  ]

  useEffect(() => {
    addLog('🚀 Connection Test Page Loaded', 'info')
    addLog('🔗 Testing Supabase connection...', 'info')
    addLog('📡 URL: https://bbuxfnchflhtulainndm.supabase.co', 'info')
    addLog('🔑 Key: Configured', 'info')
    testConnection()
    // Auto check untuk perubahan database setiap 30 detik
    const interval = setInterval(checkForChanges, 30000)
    return () => clearInterval(interval)
  }, [])

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    setLogs(prev => [...prev.slice(-50), { timestamp, message, type }]) // Keep only last 50 logs
  }

  // Check untuk perubahan data di database - REAL TIME
  const checkForChanges = async () => {
    try {
      addLog('🔄 Checking for database changes...', 'info')
      
      // Ambil hash dari data terbaru untuk comparison - SIMPLIFIED QUERY
      const { data: latestData, error } = await supabase
        .from('member_report_monthly')
        .select('count')
        .limit(1)

      if (!error && latestData && latestData.length > 0) {
        const currentHash = JSON.stringify(latestData[0])
        
        if (currentHash !== lastDataHash) {
          addLog('🔄 Database changes detected! Auto-updating...', 'warning')
          setLastDataHash(currentHash)
          testConnection()
        } else {
          addLog('✅ No database changes detected', 'success')
        }
      }
    } catch (error) {
      addLog('❌ Error checking for changes', 'error')
    }
  }

  const testConnection = async (retryCount = 0) => {
    setLoading(true)
    addLog('🔄 Testing REAL Supabase connection (NO LIMIT)...', 'info')
    console.log('🔄 Testing REAL Supabase connection (NO LIMIT)...')

    try {
      addLog('📡 Attempting to connect to Supabase...', 'info')
      
      // Test basic connection - SIMPLIFIED QUERY
      const { data: testData, error: testError } = await supabase
        .from('member_report_monthly')
        .select('count')
        .limit(1)

      if (testError) {
        console.error('❌ Connection failed:', testError)
        addLog(`❌ Connection failed: ${testError.message}`, 'error')
        addLog(`❌ Error code: ${testError.code}`, 'error')
        addLog(`❌ Error details: ${testError.details}`, 'error')
        
        // Retry mechanism
        if (retryCount < 3) {
          addLog(`🔄 Retrying connection... (${retryCount + 1}/3)`, 'warning')
          setTimeout(() => testConnection(retryCount + 1), 2000)
          return
        }
        
        setConnectionStatus('error')
        setLoading(false)
        return
      }

      console.log('✅ Basic connection successful:', testData)
      addLog('✅ Basic connection successful', 'success')
      addLog(`✅ Test data received: ${JSON.stringify(testData)}`, 'success')
      setConnectionStatus('success')

      // Initialize tables array
      const initialTables = allTables.map(table => ({
        name: table.title,
        source: table.source,
        count: 0,
        status: 'loading' as const
      }))
      setTables(initialTables)

      // Test each table - SEMUA DATA TANPA LIMIT
      for (let index = 0; index < allTables.length; index++) {
        const tableInfo = allTables[index]
        try {
          console.log(`🔄 Testing table: ${tableInfo.source} (NO LIMIT)`)
          addLog(`🔄 Testing table: ${tableInfo.source} (NO LIMIT)`, 'info')
          
          // Mengambil SEMUA data tanpa limit - REAL DATA
          const { count, error } = await supabase
            .from(tableInfo.source)
            .select('*', { count: 'exact', head: true })

          if (error) {
            console.error(`❌ Error testing ${tableInfo.source}:`, error)
            addLog(`❌ Error testing ${tableInfo.source}: ${error.message}`, 'error')
            setTables(prev => prev.map((t, i) => 
              i === index ? { ...t, status: 'error', error: error.message } : t
            ))
          } else {
            console.log(`✅ ${tableInfo.source}: ${count?.toLocaleString() || 0} rows (REAL DATA)`)
            addLog(`✅ ${tableInfo.source}: ${count?.toLocaleString() || 0} rows (REAL DATA)`, 'success')
            setTables(prev => prev.map((t, i) => 
              i === index ? { ...t, count: count || 0, status: 'success' } : t
            ))
          }
        } catch (err) {
          console.error(`❌ Exception testing ${tableInfo.source}:`, err)
          addLog(`❌ Exception testing ${tableInfo.source}: Table not found`, 'error')
          setTables(prev => prev.map((t, i) => 
            i === index ? { ...t, status: 'error', error: 'Table not found' } : t
          ))
        }
      }

      // Get MAX(date) dari master table member_report_monthly - FIXED QUERY
      try {
        const { data: dateData, error: dateError } = await supabase
          .from('member_report_monthly')
          .select('date')
          .order('date', { ascending: false })
          .limit(1)

        if (!dateError && dateData && dateData.length > 0) {
          const maxDate = dateData[0].date
          console.log('📅 Raw MAX(date) from master table:', maxDate)
          addLog(`📅 Raw MAX(date) from master table: ${maxDate}`, 'info')
          
          // Parse date format MM/DD/YYYY
          const dateParts = maxDate.split('/')
          const month = parseInt(dateParts[0])
          const day = parseInt(dateParts[1])
          const year = parseInt(dateParts[2])
          
          const date = new Date(year, month - 1, day)
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
          
          setLastUpdate(formattedDate)
          console.log('✅ MAX(date) from master table:', formattedDate)
          addLog(`✅ MAX(date) from master table: ${formattedDate}`, 'success')
          addLog('📊 Master table member_report_monthly is the reference for LAST UPDATE', 'info')
        }
      } catch (dateErr) {
        console.error('❌ Error getting last update date:', dateErr)
        addLog('❌ Error getting last update date', 'error')
      }

    } catch (error) {
      console.error('❌ Connection test failed:', error)
      addLog(`❌ Connection test failed: ${error}`, 'error')
      
      // Retry mechanism for general errors
      if (retryCount < 3) {
        addLog(`🔄 Retrying connection... (${retryCount + 1}/3)`, 'warning')
        setTimeout(() => testConnection(retryCount + 1), 2000)
        return
      }
      
      setConnectionStatus('error')
    }

    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10b981'
      case 'error': return '#ef4444'
      case 'loading': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return '✅ Connected'
      case 'error': return '❌ Failed'
      case 'loading': return '🔄 Loading'
      default: return '❓ Unknown'
    }
  }

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success': return '#10b981'
      case 'error': return '#ef4444'
      case 'warning': return '#f59e0b'
      default: return '#3b82f6'
    }
  }

  const getTableIcon = (title: string) => {
    if (title.includes('Member')) return '👥'
    if (title.includes('Deposit')) return '💰'
    if (title.includes('Withdraw')) return '💸'
    if (title.includes('New')) return '🆕'
    if (title.includes('Register')) return '📝'
    if (title.includes('Adjustment')) return '⚖️'
    if (title.includes('Headcount')) return '📊'
    if (title.includes('Exchange')) return '💱'
    if (title.includes('Users')) return '👤'
    return '📋'
  }

  // Custom SubHeader component untuk Connection dan Last Update
  const ConnectionSubHeader = () => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      justifyContent: 'flex-start',
      width: '100%',
      padding: '0 24px',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(connectionStatus)
        }} />
        <span style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>
          {getStatusText(connectionStatus)}
        </span>
      </div>
      
      {lastUpdate && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '0px' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Last Update: </span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
            {lastUpdate}
          </span>
        </div>
      )}
    </div>
  )

  return (
    <Layout
      pageTitle="Supabase"
      subHeaderTitle=""
      customSubHeader={<ConnectionSubHeader />}
    >
      <div style={{ 
        padding: '16px',
        width: '100%',
        height: 'calc(100vh - 140px)', // Fixed height - 1 frame
        overflow: 'hidden' // No scroll
      }}>
        {/* Side by Side Layout: StatCards + Real Time Logs Chart */}
        <div style={{
          display: 'flex',
          gap: '16px',
          height: '100%', // Full height
          marginTop: '0px'
        }}>
          {/* StatCards (KPI Cards) - 3 COLUMNS LAYOUT */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            flex: '2',
            overflow: 'auto',
            height: '100%'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
              Database Tables - Supabase
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                🔄 Testing REAL database connection...
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                maxWidth: '100%',
                height: 'calc(100% - 50px)' // Remaining height after title
              }}>
                {tables.map((table, index) => (
                  <div key={index} style={{
                    backgroundColor: '#f8f9fa',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                    height: '120px', // Compact height
                    minHeight: '120px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: 0 }}>
                        <span style={{ fontSize: '16px', flexShrink: 0 }}>
                          {getTableIcon(table.name)}
                        </span>
                        <h3 style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: '#1f2937', 
                          margin: 0,
                          lineHeight: '1.2',
                          wordBreak: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {table.name}
                        </h3>
                      </div>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(table.status),
                        flexShrink: 0,
                        marginLeft: '8px'
                      }} />
                    </div>
                    
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: '700', 
                      color: table.status === 'success' ? '#10b981' : '#6b7280', 
                      marginBottom: '6px',
                      lineHeight: '1'
                    }}>
                      {table.count.toLocaleString()}
                    </div>
                    
                    <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '6px' }}>
                      {table.status === 'success' ? 'rows' : getStatusText(table.status)}
                    </div>
                    
                    {table.error && (
                      <div style={{ 
                        fontSize: '8px', 
                        color: '#ef4444', 
                        backgroundColor: '#fef2f2', 
                        padding: '4px 6px', 
                        borderRadius: '4px',
                        marginTop: 'auto'
                      }}>
                        Error: {table.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real Time Logs Chart - SIDE BY SIDE */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            flex: '1',
            overflow: 'auto',
            height: '100%'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
              Real Time Logs Chart
            </h2>

            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '6px',
              padding: '12px',
              height: 'calc(100% - 50px)',
              overflowY: 'auto',
              fontFamily: 'monospace',
              width: '100%'
            }}>
              {logs.length === 0 ? (
                <div style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>
                  No logs yet...
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '8px',
                    fontSize: '11px',
                    alignItems: 'flex-start'
                  }}>
                    <span style={{ 
                      color: '#6b7280', 
                      minWidth: '120px',
                      flexShrink: 0
                    }}>
                      {log.timestamp}
                    </span>
                    <span style={{ 
                      color: getLogColor(log.type),
                      flex: '1',
                      wordBreak: 'break-word'
                    }}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 