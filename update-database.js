// Update database ke Jul 28
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://bbuxfnchflhtulainndm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidXhmbmNoZmxodHVsYWlubmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDYzMjYsImV4cCI6MjA2OTQyMjMyNn0.AF6IiaeGB9-8FYZNKQsbnl5yZmSjBMj7Ag4eUunEbtc'

console.log('🔄 Updating database to Jul 28...')

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function updateDatabase() {
  try {
    console.log('🔄 Adding new record with Jul 28...')
    
    // Add new record with Jul 28 date
    const { data, error } = await supabase
      .from('member_report_monthly')
      .insert([
        { 
          date: '7/28/2025',
          // Add other required fields if needed
        }
      ])
    
    if (error) {
      console.error('❌ Failed to update database:', error)
      return
    }
    
    console.log('✅ Successfully added Jul 28 record!')
    console.log('📊 New record:', data)
    
    // Check the latest date again
    console.log('🔄 Checking latest date...')
    const { data: latestData, error: latestError } = await supabase
      .from('member_report_monthly')
      .select('date')
      .order('date', { ascending: false })
      .limit(1)
    
    if (latestError) {
      console.error('❌ Failed to check latest date:', latestError)
      return
    }
    
    console.log('✅ Latest date in database:', latestData[0].date)
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

updateDatabase() 