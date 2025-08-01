// Check semua data di table member_report_monthly
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://bbuxfnchflhtulainndm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidXhmbmNoZmxodHVsYWlubmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDYzMjYsImV4cCI6MjA2OTQyMjMyNn0.AF6IiaeGB9-8FYZNKQsbnl5yZmSjBMj7Ag4eUunEbtc'

console.log('🔍 Checking ALL data in member_report_monthly table...')
console.log('📡 URL:', SUPABASE_URL)

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function checkAllData() {
  try {
    console.log('🔄 Fetching ALL records...')
    
    // Get ALL data from the table
    const { data, error } = await supabase
      .from('member_report_monthly')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) {
      console.error('❌ Failed to fetch data:', error)
      return
    }
    
    console.log('✅ Successfully fetched data!')
    console.log('📊 Total records:', data.length)
    console.log('📅 All dates in database:')
    
    data.forEach((record, index) => {
      console.log(`${index + 1}. Date: ${record.date}, ID: ${record.id || 'N/A'}`)
    })
    
    if (data.length > 0) {
      const latestDate = data[0].date
      console.log('\n🎯 LATEST DATE IN DATABASE:', latestDate)
      console.log('📅 This should be displayed as LAST UPDATE')
    } else {
      console.log('\n⚠️ No data found in table!')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkAllData() 