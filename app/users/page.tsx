'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  username: string
  password: string
  email?: string
  role: string
  created_at?: string
}

export default function UsersPage() {
  const [user, setUser] = useState<any>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
  })
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const session = localStorage.getItem('nexmax_session')
    if (!session) {
      router.push('/login')
      return
    }

    const sessionData = JSON.parse(session)
    setUser(sessionData)
    
    // Check dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }

    // Fetch users after authentication
    fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    try {
      console.log('🔍 Fetching users from Supabase...')
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching users:', error)
        // Fallback to mock data if Supabase fails
        const mockUsers: User[] = [
          { id: '1', username: 'admin', password: 'Admin123!', email: 'admin@nexmax.com', role: 'admin' }
        ]
        setUsers(mockUsers)
      } else {
        console.log('✅ Users loaded from Supabase:', data)
        setUsers(data || [])
      }
      
      setLoading(false)
    } catch (error) {
      console.error('❌ Error fetching users:', error)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('nexmax_session')
      document.cookie = 'user_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'username=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'user_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    } catch (error) {
      console.error('Logout error:', error)
    }
    router.push('/login')
  }

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log('➕ Adding new user:', formData)
      
      const { data, error } = await supabase
        .from('users')
        .insert([{
          username: formData.username,
          password: formData.password,
          role: formData.role
        }])
        .select()

      if (error) {
        console.error('❌ Error adding user:', error)
        alert('Error adding user: ' + error.message)
      } else {
        console.log('✅ User added successfully:', data)
        setFormData({ username: '', password: '', role: 'user' })
        setShowModal(false)
        fetchUsers() // Refresh the list
        alert('User created successfully!')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleEditUser = (userToEdit: User) => {
    setEditingUser({
      id: userToEdit.id,
      username: userToEdit.username,
      email: userToEdit.email || '',
      password: userToEdit.password,
      role: userToEdit.role
    })
    setShowEditModal(true)
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      console.log('✏️ Updating user:', editingUser)
      
      const { data, error } = await supabase
        .from('users')
        .update({
          username: editingUser.username,
          password: editingUser.password,
          role: editingUser.role
        })
        .eq('id', editingUser.id)
        .select()

      if (error) {
        console.error('❌ Error updating user:', error)
        alert('Error updating user: ' + error.message)
      } else {
        console.log('✅ User updated successfully:', data)
        setEditingUser(null)
        setShowEditModal(false)
        fetchUsers() // Refresh the list
        alert('User updated successfully!')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      console.log('🗑️ Deleting user:', userId)
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) {
        console.error('❌ Error deleting user:', error)
        alert('Error deleting user: ' + error.message)
      } else {
        console.log('✅ User deleted successfully')
        fetchUsers() // Refresh the list
        alert('User deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleResetPassword = async (userId: string) => {
    const newPassword = prompt('Enter new password:')
    if (!newPassword) return

    try {
      console.log('🔐 Resetting password for user:', userId)
      
      const { data, error } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('id', userId)
        .select()

      if (error) {
        console.error('❌ Error resetting password:', error)
        alert('Error resetting password: ' + error.message)
      } else {
        console.log('✅ Password reset successfully:', data)
        fetchUsers() // Refresh the list
        alert('Password reset successfully!')
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      alert('Network error. Please try again.')
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        darkMode={darkMode} 
        onToggleDarkMode={handleToggleDarkMode} 
        onLogout={handleLogout}
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
      />
      
      <div className="flex" style={{ marginTop: '70px' }}>
        <Sidebar user={user} onExpandedChange={setSidebarExpanded} />
        
        <main className="flex-1">
          {/* SUB HEADER - STANDARD SIZE */}
          <div style={{
            position: 'fixed',
            top: '70px',
            left: sidebarExpanded ? '280px' : '75px',
            right: '0',
            minHeight: '80px',
            background: 'white',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '15px 48px',
            zIndex: 1000,
            transition: 'left 0.3s ease',
            overflow: 'hidden'
          }}>
            <div style={{ 
              margin: 0, 
              fontSize: '1.5rem', 
              fontWeight: '700',
              color: '#1e293b'
            }}>
              User Management
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              alignItems: 'center' 
            }}>
              <button 
                onClick={() => setShowModal(true)}
                className="add-user-btn"
              >
                Add New User
              </button>
            </div>
          </div>

          <div style={{ marginTop: '150px', padding: '24px' }}>
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.password}</td>
                        <td>{user.email || 'N/A'}</td>
                        <td>
                          <span className={`role-badge ${user.role.toLowerCase()}`}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="btn-edit"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleResetPassword(user.id)}
                              className="btn-reset"
                            >
                              Reset
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="btn-delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add User Modal */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Add New User</h3>
                <form onSubmit={handleAddUser}>
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="executive">Executive</option>
                    <option value="operator">Operator</option>
                  </select>
                  <div className="modal-actions">
                    <button type="submit">Add User</button>
                    <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {showEditModal && editingUser && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Edit User</h3>
                <form onSubmit={handleUpdateUser}>
                  <input
                    type="text"
                    placeholder="Username"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={editingUser.email || ''}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                    required
                  />
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="executive">Executive</option>
                    <option value="operator">Operator</option>
                  </select>
                  <div className="modal-actions">
                    <button type="submit">Update User</button>
                    <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .add-user-btn {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }
        
        .add-user-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        
        .modal {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 400px;
          max-width: 90vw;
        }
        
        .modal h3 {
          margin: 0 0 20px 0;
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .modal input, .modal select {
          width: 100%;
          padding: 12px;
          margin: 8px 0;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          box-sizing: border-box;
        }
        
        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        
        .modal-actions button {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
        }
        
        .modal-actions button[type="submit"] {
          background: #10b981;
          color: white;
        }
        
        .modal-actions button[type="button"] {
          background: #6b7280;
          color: white;
        }
        
        .users-table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .users-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .users-table th {
          background: #f8f9fa;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .users-table td {
          padding: 15px;
          border-bottom: 1px solid #f3f4f6;
          color: #374151;
        }
        
        .users-table tr:hover {
          background: #f9fafb;
        }
        
        .role-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .role-badge.admin {
          background: #fecaca;
          color: #dc2626;
        }
        
        .role-badge.manager {
          background: #fef3c7;
          color: #d97706;
        }
        
        .role-badge.executive {
          background: #fef3c7;
          color: #d97706;
        }
        
        .role-badge.operator {
          background: #d1fae5;
          color: #059669;
        }
        
        .role-badge.user {
          background: #d1fae5;
          color: #059669;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        .action-buttons button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .btn-edit {
          background: #10b981;
          color: white;
        }
        
        .btn-reset {
          background: #3b82f6;
          color: white;
        }
        
        .btn-delete {
          background: #ef4444;
          color: white;
        }
        
        .action-buttons button:hover {
          opacity: 0.8;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  )
} 