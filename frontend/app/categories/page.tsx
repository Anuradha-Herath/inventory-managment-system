'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { categoriesApi } from '@/lib/api/categories';
import { Category } from '@/types';

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Validate inputs
    if (!formData.name.trim()) {
      setError('Category name is required');
      setSubmitting(false);
      return;
    }

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      };

      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, categoryData);
      } else {
        await categoriesApi.create(categoryData);
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
      loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${editingCategory ? 'update' : 'create'} category`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    
    try {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'categories/page.tsx:66',message:'Attempting category delete',data:{categoryId:deletingCategory.id,categoryName:deletingCategory.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      await categoriesApi.delete(deletingCategory.id);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'categories/page.tsx:69',message:'Category delete succeeded',data:{categoryId:deletingCategory.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      setDeletingCategory(null);
      loadCategories();
    } catch (err: any) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'categories/page.tsx:74',message:'Category delete failed',data:{error:err.response?.data?.message||err.message,statusCode:err.response?.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      alert(err.response?.data?.message || 'Failed to delete category');
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add Category
            </button>
          </div>

          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingCategory(null);
              setFormData({ name: '', description: '' });
              setError('');
            }}
            title={editingCategory ? 'Edit Category' : 'Add New Category'}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ name: '', description: '' });
                    setError('');
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
                  {submitting ? (editingCategory ? 'Updating...' : 'Creating...') : (editingCategory ? 'Update Category' : 'Create Category')}
                </button>
              </div>
            </form>
          </Modal>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {category.description || 'No description'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingCategory(category)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation Modal */}
          {deletingCategory && (
            <Modal
              isOpen={!!deletingCategory}
              onClose={() => setDeletingCategory(null)}
              title="Delete Category"
            >
              <div className="space-y-4">
                <p className="text-gray-700">
                  Are you sure you want to delete <strong>{deletingCategory.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setDeletingCategory(null)}
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

export default CategoriesPage;
