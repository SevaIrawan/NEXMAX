'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if already logged in
    const session = localStorage.getItem('nexmax_session')
    if (session) {
      router.push('/dashboard')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isLogin) {
        // Login dengan Supabase
        console.log('Attempting login with Supabase...')
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .single()

        if (error) {
          console.log('Login error:', error)
          setMessage('Username atau password salah')
        } else if (data) {
          console.log('Login successful:', data)
          
          // Create session
          const sessionData = {
            id: data.id,
            username: data.username,
            role: data.role,
            timestamp: new Date().toISOString()
          }
          localStorage.setItem('nexmax_session', JSON.stringify(sessionData))
          router.push('/dashboard')
        } else {
          setMessage('Username atau password salah')
        }
      } else {
        // Registration dengan Supabase
        console.log('Attempting registration with Supabase...')
        
        const { data, error } = await supabase
          .from('users')
          .insert([
            {
              username,
              password, // In production, hash this password
              role: 'user'
            }
          ])
          .select()

        if (error) {
          console.log('Registration error:', error)
          if (error.code === '23505') {
            setMessage('Username sudah digunakan')
          } else {
            setMessage('Error saat registrasi: ' + error.message)
          }
        } else {
          console.log('Registration successful:', data)
          setMessage('Registrasi berhasil! Silakan login.')
          setIsLogin(true)
          setUsername('')
          setPassword('')
        }
      }
    } catch (error) {
      console.log('System error:', error)
      setMessage('Terjadi kesalahan sistem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            NexMax Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isLogin ? 'Masuk ke dashboard' : 'Daftar akun baru'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white pr-10"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-md text-sm ${
                message.includes('berhasil') || message.includes('success')
                  ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                  : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : (isLogin ? 'Masuk' : 'Daftar')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setMessage('')
                setUsername('')
                setPassword('')
              }}
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
            </button>
          </div>

          {/* Debug info */}
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Debug Info:</strong><br/>
              Username: admin<br/>
              Password: Admin123!<br/>
              Status: Connected to Supabase
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 