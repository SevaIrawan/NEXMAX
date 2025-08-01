'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import SubHeader from '@/components/SubHeader'
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
        alert('Failed to add user')
      } else {
        console.log('✅ User added successfully:', data)
        setFormData({ username: '', password: '', role: 'user' })
        setShowModal(false)
        fetchUsers() // Refresh the list
      }
    } catch (error) {
      console.error('❌ Error adding user:', error)
      alert('Failed to add user')
    }
  }

  const handleEditUser = (userToEdit: User) => {
    setEditingUser({
      ...userToEdit,
      password: '' // Don't show current password
    })
    setShowEditModal(true)
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      console.log('✏️ Updating user:', editingUser)
      
      const updateData: any = {
        username: editingUser.username,
        role: editingUser.role
      }
      
      // Only update password if provided
      if (editingUser.password) {
        updateData.password = editingUser.password
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', editingUser.id)
        .select()

      if (error) {
        console.error('❌ Error updating user:', error)
        alert('Failed to update user')
      } else {
        console.log('✅ User updated successfully:', data)
        setShowEditModal(false)
        setEditingUser(null)
        fetchUsers() // Refresh the list
      }
    } catch (error) {
      console.error('❌ Error updating user:', error)
      alert('Failed to update user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      console.log('🗑️ Deleting user:', userId)
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) {
        console.error('❌ Error deleting user:', error)
        alert('Failed to delete user')
      } else {
        console.log('✅ User deleted successfully')
        fetchUsers() // Refresh the list
      }
    } catch (error) {
      console.error('❌ Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  const handleResetPassword = async (userId: string) => {
    if (!confirm('Are you sure you want to reset this user\'s password?')) return

    try {
      console.log('🔑 Resetting password for user:', userId)
      
      const { error } = await supabase
        .from('users')
        .update({ password: 'Reset123!' })
        .eq('id', userId)

      if (error) {
        console.error('❌ Error resetting password:', error)
        alert('Failed to reset password')
      } else {
        console.log('✅ Password reset successfully')
        alert('Password has been reset to: Reset123!')
        fetchUsers() // Refresh the list
      }
    } catch (error) {
      console.error('❌ Error resetting password:', error)
      alert('Failed to reset password')
    }
  }

  if (!user) {
    return null
  }

  return (
    <Layout
      user={user}
      darkMode={darkMode}
      sidebarExpanded={sidebarExpanded}
      setSidebarExpanded={setSidebarExpanded}
      onToggleDarkMode={handleToggleDarkMode}
      onLogout={handleLogout}
    >
      <SubHeader title="User Management" />
      
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Users List</h2>
          <button 
            onClick={() => setShowModal(true)}
            className="add-user-btn"
          >
            Add New User
          </button>
        </div>
        
        <div style={{ padding: '20px' }}>
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email || '-'}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleResetPassword(user.id)}
                          className="reset-btn"
                        >
                          Reset Password
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="delete-btn"
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

      <style jsx>{`
        .users-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        .users-table th,
        .users-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .users-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #374151;
        }

        .users-table tr:hover {
          background: #f9fafb;
        }

        .role-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .role-admin {
          background: #fee2e2;
          color: #dc2626;
        }

        .role-manager {
          background: #dbeafe;
          color: #2563eb;
        }

        .role-executive {
          background: #fef3c7;
          color: #d97706;
        }

        .role-operator {
          background: #d1fae5;
          color: #059669;
        }

        .role-user {
          background: #f3f4f6;
          color: #374151;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .edit-btn,
        .reset-btn,
        .delete-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-btn {
          background: #3b82f6;
          color: white;
        }

        .reset-btn {
          background: #f59e0b;
          color: white;
        }

        .delete-btn {
          background: #ef4444;
          color: white;
        }

        .edit-btn:hover {
          background: #2563eb;
        }

        .reset-btn:hover {
          background: #d97706;
        }

        .delete-btn:hover {
          background: #dc2626;
        }

        .add-user-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-user-btn:hover {
          background: #059669;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          padding: 24px;
          border-radius: 8px;
          width: 400px;
          max-width: 90vw;
        }

        .modal h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .modal input,
        .modal select {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .modal-actions button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .modal-actions button[type="submit"] {
          background: #10b981;
          color: white;
        }

        .modal-actions button[type="button"] {
          background: #6b7280;
          color: white;
        }
      `}</style>
    </Layout>
  )
} 