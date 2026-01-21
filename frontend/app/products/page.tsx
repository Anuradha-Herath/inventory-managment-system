'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import { suppliersApi } from '@/lib/api/suppliers';
import { Product, Category, Supplier } from '@/types';
import { useAuthStore } from '@/store/authStore';

function ProductsPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    sku: '',
    categoryId: '',
    imageUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadSuppliers();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadSuppliers = async () => {
    try {
      const data = await suppliersApi.getAll(true);
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to load suppliers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Validate inputs
    if (!formData.name.trim()) {
      setError('Product name is required');
      setSubmitting(false);
      return;
    }

    const price = parseFloat(formData.price);
    const quantity = parseInt(formData.quantity);
    const categoryId = parseInt(formData.categoryId);
    
    if (isNaN(price) || price < 0) {
      setError('Price must be a valid positive number');
      setSubmitting(false);
      return;
    }
    
    if (isNaN(quantity) || quantity < 0) {
      setError('Quantity must be a valid positive number');
      setSubmitting(false);
      return;
    }

    if (isNaN(categoryId) || categoryId <= 0) {
      setError('Please select a valid category');
      setSubmitting(false);
      return;
    }

    try {
      if (editingProduct) {
        await productsApi.update(editingProduct.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          price,
          quantity,
          sku: formData.sku.trim() || undefined,
          categoryId,
          imageUrl: formData.imageUrl.trim() || undefined,
        });
      } else {
        await productsApi.create({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          price,
          quantity,
          sku: formData.sku.trim() || undefined,
          categoryId,
          imageUrl: formData.imageUrl.trim() || undefined,
        });
      }
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${editingProduct ? 'update' : 'create'} product`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      sku: product.sku || '',
      categoryId: product.categoryId.toString(),
      imageUrl: product.imageUrl || '',
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    
    try {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'products/page.tsx:122',message:'Attempting product delete',data:{productId:deletingProduct.id,productName:deletingProduct.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      await productsApi.delete(deletingProduct.id);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'products/page.tsx:125',message:'Product delete succeeded',data:{productId:deletingProduct.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      setDeletingProduct(null);
      loadProducts();
    } catch (err: any) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'products/page.tsx:130',message:'Product delete failed',data:{error:err.response?.data?.message||err.message,statusCode:err.response?.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      sku: '',
      categoryId: '',
      imageUrl: '',
    });
    setError('');
    setEditingProduct(null);
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
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            {isAdmin && (
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Add Product
              </button>
            )}
          </div>

          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              resetForm();
              setError('');
            }}
            title={editingProduct ? 'Edit Product' : 'Add New Product'}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                />
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
                  {submitting ? (editingProduct ? 'Updating...' : 'Creating...') : (editingProduct ? 'Update Product' : 'Create Product')}
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
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(product.price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.quantity ?? 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {isAdmin ? (
                          <>
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-primary-600 hover:text-primary-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeletingProduct(product)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400">View Only</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation Modal */}
          {deletingProduct && (
            <Modal
              isOpen={!!deletingProduct}
              onClose={() => setDeletingProduct(null)}
              title="Delete Product"
            >
              <div className="space-y-4">
                <p className="text-gray-700">
                  Are you sure you want to delete <strong>{deletingProduct.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setDeletingProduct(null)}
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

export default ProductsPage;
