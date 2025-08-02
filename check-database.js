// Check semua data di table member_report_monthly
const { createClient } = require('@supabase/supabase-js')

// Updated Supabase configuration with correct API key
const supabaseUrl = 'https://bbuxfnchflhtulainndm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidXhmbmNoZmxodHVsYWlubmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDYzMjYsImV4cCI6MjA2OTQyMjMyNn0.AF6IiaeGB9-8FYZNKQsbnl5yZmSjBMj7Ag4eUunEbtc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAndAddDefaultUser() {
  try {
    console.log('🔍 Checking if users table exists and has data...')
    const { data: users, error } = await supabase
      .from('users')
      .select('*')

    if (error) {
      console.error('❌ Error accessing users table:', error)
      console.log('💡 Please make sure the users table exists in your Supabase database')
      return
    }

    console.log('✅ Users found in database:', users.length)
    console.log('📋 Available users:')
    users.forEach(user => {
      console.log(`   - ${user.username} (${user.role}) - Password: ${user.password}`)
    })

    // Check if manager user exists
    const managerExists = users.some(user => user.username === 'manager')
    if (!managerExists) {
      console.log('⚠️ Manager user not found. Adding manager user...')
      const { data: newManager, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            username: 'manager',
            password: 'Manager2024!@#',
            email: 'manager@nexmax.com',
            role: 'manager'
          }
        ])
        .select()

      if (insertError) {
        console.error('❌ Error adding manager user:', insertError)
      } else {
        console.log('✅ Manager user added successfully!')
        console.log('📋 Manager credentials:')
        console.log('   Username: manager')
        console.log('   Password: Manager2024!@#')
        console.log('   Email: manager@nexmax.com')
        console.log('   Role: manager')
      }
    } else {
      console.log('✅ Manager user already exists')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

checkAndAddDefaultUser() 