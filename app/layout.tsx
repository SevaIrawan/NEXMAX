import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NexMax Dashboard',
  description: 'Interactive Dashboard with Username-based Authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div style={{ 
          display: 'flex', 
          minHeight: '100vh', 
          backgroundColor: '#f8f9fa' 
        }}>
          {children}
        </div>
      </body>
    </html>
  )
} 