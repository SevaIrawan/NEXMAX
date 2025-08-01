import { createClient } from '@supabase/supabase-js'

// Supabase Configuration - Using hardcoded values for now
const supabaseUrl = 'https://bbuxfnchflhtulainndm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidXhmbmNoZmxodHVsYWlubmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDYzMjYsImV4cCI6MjA2OTQyMjMyNn0.AF6IiaeGB9-8FYZNKQsbnl5yZmSjBMj7Ag4eUunEbtc'

// Create Supabase client with better error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
    console.log('📡 URL:', supabaseUrl)
    console.log('🔑 Key exists:', !!supabaseAnonKey)
    
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