'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { ordersApi } from '@/lib/api/orders';
import { productsApi } from '@/lib/api/products';
import { usersApi } from '@/lib/api/users';
import { Order, Product, User } from '@/types';
import { useAuthStore } from '@/store/authStore';

function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Order['status']>('PENDING');
  const [orderItems, setOrderItems] = useState<Array<{ productId: number; quantity: number }>>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('1');
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
    loadProducts();
    loadUsers();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productsApi.getAll();
      setProducts(data.filter((p) => p.quantity > 0)); // Only show products with stock
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const addOrderItem = () => {
    if (!selectedProduct) {
      setError('Please select a product');
      return;
    }

    const quantity = parseInt(selectedQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      setError('Please enter a valid quantity greater than 0');
      return;
    }

    const productId = parseInt(selectedProduct);
    const product = products.find((p) => p.id === productId);
    
    if (!product) {
      setError('Selected product not found');
      return;
    }

    if (product.quantity != null && quantity > product.quantity) {
      setError(`Only ${product.quantity} units available in stock`);
      return;
    }

    const existingIndex = orderItems.findIndex((item) => item.productId === productId);

    if (existingIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...orderItems];
      const newQuantity = updatedItems[existingIndex].quantity + quantity;
      if (product.quantity != null && newQuantity > product.quantity) {
        setError(`Cannot add more. Only ${product.quantity} units total available in stock`);
        return;
      }
      updatedItems[existingIndex].quantity = newQuantity;
      setOrderItems(updatedItems);
    } else {
      // Add new item
      setOrderItems([...orderItems, { productId, quantity }]);
    }
    setSelectedProduct('');
    setSelectedQuantity('1');
    setError('');
  };

  const removeOrderItem = (productId: number) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user?.id) {
      setError('User not found. Please log in again.');
      return;
    }

    if (orderItems.length === 0) {
      setError('Please add at least one product to the order');
      return;
    }

    setSubmitting(true);

    try {
      await ordersApi.create({
        userId: user.id,
        status: 'PENDING',
        orderItems: orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      setShowModal(false);
      setOrderItems([]);
      setSelectedProduct('');
      setSelectedQuantity('1');
      loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = async (orderId: number) => {
    try {
      const order = await ordersApi.getById(orderId);
      setSelectedOrder(order);
      setShowDetailsModal(true);
    } catch (err: any) {
      console.error('Failed to load order details:', err);
      alert('Failed to load order details');
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    setUpdating(true);
    setError('');

    try {
      await ordersApi.update(selectedOrder.id, { status: selectedStatus });
      setShowStatusModal(false);
      loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setUpdating(true);

    try {
      await ordersApi.update(orderId, { status: 'CANCELLED' });
      loadOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'][] => {
    switch (currentStatus) {
      case 'PENDING':
        return ['PAID', 'CANCELLED'];
      case 'PAID':
        return ['SHIPPED', 'CANCELLED'];
      case 'SHIPPED':
        return ['COMPLETED'];
      case 'COMPLETED':
        return [];
      case 'CANCELLED':
        return [];
      default:
        return [];
    }
  };

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setShowStatusModal(true);
    setError('');
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
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              New Order
            </button>
          </div>

          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setOrderItems([]);
              setSelectedProduct('');
              setSelectedQuantity('1');
              setError('');
            }}
            title="Create New Order"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Product to Order
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Stock: {product.quantity}) - ${product.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    placeholder="Qty"
                  />
                  <button
                    type="button"
                    onClick={addOrderItem}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {orderItems.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Items
                  </label>
                  <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                    {orderItems.map((item) => {
                      const product = products.find((p) => p.id === item.productId);
                      if (!product) return null;
                      return (
                        <div key={item.productId} className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{product.name || 'Unknown Product'}</p>
                            <p className="text-sm text-gray-500">
                              ${((product.price || 0)).toFixed(2)} × {item.quantity || 0} = $
                              {((product.price || 0) * (item.quantity || 0)).toFixed(2)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeOrderItem(item.productId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 text-right">
                    <p className="text-lg font-semibold">
                      Total: $
                      {orderItems
                        .reduce((sum, item) => {
                          const product = products.find((p) => p.id === item.productId);
                          return sum + (product && product.price != null ? (product.price || 0) * (item.quantity || 0) : 0);
                        }, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setOrderItems([]);
                    setSelectedProduct('');
                    setSelectedQuantity('1');
                    setError('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || orderItems.length === 0}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Order'}
                </button>
              </div>
            </form>
          </Modal>

          {/* Order Details Modal */}
          <Modal
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedOrder(null);
            }}
            title={`Order Details - ${selectedOrder?.orderNumber || ''}`}
            wide={true}
          >
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order Number</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedOrder.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedOrder.status === 'PAID'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedOrder.status === 'SHIPPED'
                          ? 'bg-purple-100 text-purple-800'
                          : selectedOrder.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer</p>
                    <p className="text-gray-900">{selectedOrder.userName || `User #${selectedOrder.userId}`}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${(selectedOrder.totalAmount || 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order Date</p>
                    <p className="text-gray-900">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {selectedOrder.payment && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Status</p>
                      <p className="text-gray-900">{selectedOrder.payment.status}</p>
                    </div>
                  )}
                </div>

                {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Order Items</p>
                    <div className="border rounded-lg divide-y">
                      {selectedOrder.orderItems.map((item) => (
                        <div key={item.id} className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{item.productName || 'Unknown Product'}</p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity || 0} × ${((item.unitPrice || 0)).toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ${((item.subtotal || 0)).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedOrder(null);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </Modal>

          {/* Update Status Modal */}
          <Modal
            isOpen={showStatusModal}
            onClose={() => {
              setShowStatusModal(false);
              setSelectedOrder(null);
              setError('');
            }}
            title={`Update Order Status - ${selectedOrder?.orderNumber || ''}`}
          >
            {selectedOrder && (
              <div className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Current Status</p>
                  <span
                    className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                      selectedOrder.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : selectedOrder.status === 'PAID'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedOrder.status === 'SHIPPED'
                        ? 'bg-purple-100 text-purple-800'
                        : selectedOrder.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status *
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as Order['status'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  >
                    <option value={selectedOrder.status}>Keep {selectedOrder.status}</option>
                    {getNextStatus(selectedOrder.status).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {getNextStatus(selectedOrder.status).length === 0
                      ? 'This order cannot be updated further'
                      : `Available transitions: ${getNextStatus(selectedOrder.status).join(', ')}`}
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowStatusModal(false);
                      setSelectedOrder(null);
                      setError('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updating || selectedStatus === selectedOrder.status || getNextStatus(selectedOrder.status).length === 0}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>
            )}
          </Modal>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.userName || `User #${order.userId}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'PAID'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'SHIPPED'
                              ? 'bg-purple-100 text-purple-800'
                              : order.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(order.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleViewDetails(order.id)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </button>
                          {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                            <>
                              <button
                                onClick={() => openStatusModal(order)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Update Status
                              </button>
                              {order.status !== 'CANCELLED' && (
                                <button
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="text-red-600 hover:text-red-900"
                                  disabled={updating}
                                >
                                  Cancel
                                </button>
                              )}
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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default OrdersPage;
