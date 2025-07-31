import { createClient } from '@supabase/supabase-js'

// Hardcoded values untuk build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bbuxfnchflhtulainndm.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidXhmbmNoZmxodHVsYWlubmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDYzMjYsImV4cCI6MjA2OTQyMjMyNn0.AF6IiaeGB9-8FYZNKQsbnl5yZmSjBMj7Ag4eUunEbtc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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