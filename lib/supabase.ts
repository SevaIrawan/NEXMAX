import { createClient } from '@supabase/supabase-js'

// Direct Supabase configuration - bypassing .env.local issues
const SUPABASE_URL = 'https://bbuxfnchflhtulainndm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidXhmbmNoZmxodHVsYWlubmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDYzMjYsImV4cCI6MjA2OTQyMjMyNn0.AF6IiaeGB9-8FYZNKQsbnl5yZmSjBMj7Ag4eUunEbtc'

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    console.log('🔗 Testing Supabase connection...')
    console.log('📡 URL:', SUPABASE_URL)
    console.log('🔑 Key exists:', !!SUPABASE_ANON_KEY)
    
    // Test basic connection
    const { data, error } = await supabase
      .from('member_report_monthly')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection failed:', error)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    return true
    
  } catch (error) {
    console.error('❌ Supabase connection error:', error)
    return false
  }
}

// Get last update date function
export const getLastUpdateDate = async () => {
  try {
    console.log('📅 Fetching last update date...')
    
    const { data, error } = await supabase
      .from('member_report_monthly')
      .select('date')
      .order('date', { ascending: false })
      .limit(1)
    
    if (error) {
      console.error('❌ Failed to fetch last update date:', error)
      return null
    }
    
    if (data && data.length > 0) {
      const lastDate = data[0].date
      console.log('✅ Last update date found:', lastDate)
      return lastDate
    }
    
    console.log('⚠️ No data found in member_report_monthly table')
    return null
    
  } catch (error) {
    console.error('❌ Error fetching last update date:', error)
    return null
  }
}

// Types for dashboard data
export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  monthlyGrowth: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

export interface ActivityItem {
  id: number
  user: string
  action: string
  time: string
  status: 'completed' | 'pending' | 'failed'
} 