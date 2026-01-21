'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { usersApi } from '@/lib/api/users';
import { User, Role } from '@/types';
import { useAuthStore } from '@/store/authStore';

function UsersPage() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'STAFF' as Role,
    active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Validate password for new users
    if (!editingUser && (!formData.password || formData.password.trim() === '')) {
      setError('Password is required for new users');
      setSubmitting(false);
      return;
    }

    try {
      const userData: any = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        role: formData.role,
        active: formData.active,
      };

      // Only include password if creating new user or if provided (non-empty)
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'users/page.tsx:61',message:'Password handling check',data:{editingUser:!!editingUser,passwordLength:formData.password.length,passwordEmpty:formData.password==='',passwordTrimmed:formData.password.trim()===''},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      if (!editingUser || (formData.password && formData.password.trim() !== '')) {
        userData.password = formData.password.trim();
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'users/page.tsx:64',message:'Password included in userData',data:{passwordIncluded:true,passwordLength:userData.password?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
      }

      if (editingUser) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'users/page.tsx:67',message:'Updating user',data:{userId:editingUser.id,userDataKeys:Object.keys(userData)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        await usersApi.update(editingUser.id, userData);
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'users/page.tsx:69',message:'Creating user',data:{userDataKeys:Object.keys(userData)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        await usersApi.create(userData);
      }
      setShowModal(false);
      setEditingUser(null);
      resetForm();
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${editingUser ? 'update' : 'create'} user`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: '',
      role: user.role,
      active: user.active,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    
    try {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'users/page.tsx:99',message:'Attempting user delete',data:{userId:deletingUser.id,username:deletingUser.username},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      await usersApi.delete(deletingUser.id);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'users/page.tsx:102',message:'User delete succeeded',data:{userId:deletingUser.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      setDeletingUser(null);
      loadUsers();
    } catch (err: any) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'users/page.tsx:107',message:'User delete failed',data:{error:err.response?.data?.message||err.message,statusCode:err.response?.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await usersApi.update(user.id, { active: !user.active });
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'STAFF',
      active: true,
    });
    setError('');
    setEditingUser(null);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div>Loading...</div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add User
            </button>
          </div>

          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              resetForm();
              setError('');
            }}
            title={editingUser ? 'Edit User' : 'Add New User'}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingUser ? '(leave empty to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  >
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.active ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {submitting ? (editingUser ? 'Updating...' : 'Creating...') : (editingUser ? 'Update User' : 'Create User')}
                </button>
              </div>
            </form>
          </Modal>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Edit
                          </button>
                          {currentUser?.id !== user.id && (
                            <>
                              <button
                                onClick={() => handleToggleActive(user)}
                                className={`${
                                  user.active
                                    ? 'text-orange-600 hover:text-orange-900'
                                    : 'text-green-600 hover:text-green-900'
                                }`}
                              >
                                {user.active ? 'Disable' : 'Enable'}
                              </button>
                              <button
                                onClick={() => setDeletingUser(user)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation Modal */}
          {deletingUser && (
            <Modal
              isOpen={!!deletingUser}
              onClose={() => setDeletingUser(null)}
              title="Delete User"
            >
              <div className="space-y-4">
                <p className="text-gray-700">
                  Are you sure you want to delete <strong>{deletingUser.username}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setDeletingUser(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default UsersPage;
