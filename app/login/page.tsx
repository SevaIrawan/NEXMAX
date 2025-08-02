'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'

// Supabase configuration with correct API key
const supabaseUrl = 'https://bbuxfnchflhtulainndm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidXhmbmNoZmxodHVsYWlubmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDYzMjYsImV4cCI6MjA2OTQyMjMyNn0.AF6IiaeGB9-8FYZNKQsbnl5yZmSjBMj7Ag4eUunEbtc'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authLoading, setAuthLoading] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const user = localStorage.getItem('nexmax_session')
        if (user) {
          try {
            JSON.parse(user) // Validate JSON
            router.push('/dashboard')
          } catch (error) {
            console.error('Invalid session data:', error)
            localStorage.removeItem('nexmax_session')
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()
  }, []) // Remove router from dependency to prevent re-runs

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Query users table to check credentials
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single()

      if (error || !users) {
        setError('Invalid username or password')
        setLoading(false)
        return
      }

      // Store user data in localStorage
      localStorage.setItem('nexmax_session', JSON.stringify({
        id: users.id,
        username: users.username,
        role: users.role,
        email: users.email
      }))

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)

    } catch (err) {
      console.error('Login error:', err)
      setError('Connection error. Please try again.')
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid #fbbf24',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 20px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <form onSubmit={handleSubmit}>
          {/* Logo Section */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '3px solid #fbbf24',
              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)',
              position: 'relative'
            }}>
              <Image
                src="/aset/images (1).jpg"
                alt="NEXMAX Logo"
                width={50}
                height={50}
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
          
          <h2 style={{
            textAlign: 'center',
            marginBottom: '8px',
            color: '#0f766e',
            fontWeight: '600',
            fontSize: '24px'
          }}>Welcome Back</h2>
          
          <p style={{
            textAlign: 'center',
            color: '#6b7280',
            marginBottom: '30px',
            fontSize: '14px'
          }}>Sign in to your account</p>

          {error && (
            <div style={{
              background: '#ef4444',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{
                position: 'absolute',
                left: '12px',
                color: '#0f766e',
                fontSize: '18px'
              }}>
                👤
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                autoComplete="off"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 45px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.8)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{
                position: 'absolute',
                left: '12px',
                color: '#0f766e',
                fontSize: '18px'
              }}>
                🔒
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="off"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 45px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.8)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              color: '#0f766e',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  marginRight: '8px',
                  accentColor: '#0f766e'
                }}
              />
              Remember me
            </label>
            <a href="#" style={{
              color: '#0f766e',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center'
            }}>
              📧 Forget Password
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #0f766e, #134e4a)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Signing In...' : 'Login'}
          </button>

          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(15, 118, 110, 0.1)',
            borderRadius: '8px',
            borderLeft: '4px solid #0f766e'
          }}>
            <p style={{
              margin: '0 0 12px 0',
              fontWeight: '600',
              color: '#0f766e',
              fontSize: '14px'
            }}>
              Demo Credentials:
            </p>
            <div style={{
              marginBottom: '8px',
              fontSize: '13px',
              color: '#6b7280'
            }}>
              <strong style={{ color: '#0f766e' }}>Admin:</strong> admin / Admin123!
            </div>
            <div style={{
              fontSize: '13px',
              color: '#6b7280'
            }}>
              <strong style={{ color: '#0f766e' }}>Manager:</strong> manager / Manager2024!@#
            </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  )
} 