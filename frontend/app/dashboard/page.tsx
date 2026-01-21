'use client';

import { useEffect, useState, useCallback } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { productsApi } from '@/lib/api/products';
import { ordersApi } from '@/lib/api/orders';
import { usersApi } from '@/lib/api/users';
import { Product, Order, OrderStatus } from '@/types';
import Link from 'next/link';

function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [orderStatusBreakdown, setOrderStatusBreakdown] = useState<Record<OrderStatus, number>>({
    PENDING: 0,
    PAID: 0,
    SHIPPED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  });
  const isAdmin = user?.role === 'ADMIN';

  const loadStats = useCallback(async () => {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard/page.tsx:41',message:'loadStats entry',data:{isAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      // Use Promise.allSettled to handle partial failures gracefully
      const results = await Promise.allSettled([
        productsApi.getAll(),
        ordersApi.getAll(),
        isAdmin ? usersApi.getAll() : Promise.resolve([]),
      ]);
      
      const products = results[0].status === 'fulfilled' ? results[0].value : [];
      const orders = results[1].status === 'fulfilled' ? results[1].value : [];
      const users = results[2].status === 'fulfilled' ? results[2].value : [];
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard/page.tsx:52',message:'API calls completed',data:{productsStatus:results[0].status,ordersStatus:results[1].status,usersStatus:results[2].status,productsCount:products.length,ordersCount:orders.length,usersCount:users.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion

      // Calculate revenue from completed orders
      const revenue = orders
        .filter((o) => o.status === 'COMPLETED' && o.totalAmount != null)
        .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

      // Calculate today's statistics
      // Use UTC dates to avoid timezone issues
      const now = new Date();
      const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard/page.tsx:67',message:'Date comparison setup',data:{todayUTC:todayUTC.toISOString(),sampleOrderDate:orders[0]?.createdAt},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const todayOrders = orders.filter((o) => {
        if (!o.createdAt) return false;
        const orderDate = new Date(o.createdAt);
        if (isNaN(orderDate.getTime())) return false;
        return orderDate >= todayUTC;
      });
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard/page.tsx:62',message:'Today orders filtered',data:{todayOrdersCount:todayOrders.length,totalOrders:orders.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const todayRevenue = todayOrders
        .filter((o) => o.status === 'COMPLETED' && o.totalAmount != null)
        .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

      // Count pending orders
      const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;

      // Find low stock products (quantity <= 10)
      const lowStock = products.filter((p) => p != null && p.quantity != null && p.quantity <= 10);
      setLowStockItems(lowStock.slice(0, 5)); // Show top 5

      // Calculate order status breakdown
      const breakdown: Record<OrderStatus, number> = {
        PENDING: 0,
        PAID: 0,
        SHIPPED: 0,
        COMPLETED: 0,
        CANCELLED: 0,
      };
      orders.forEach((order) => {
        if (order.status && breakdown.hasOwnProperty(order.status)) {
          breakdown[order.status] = (breakdown[order.status] || 0) + 1;
        }
      });
      setOrderStatusBreakdown(breakdown);

      // Get recent orders (last 5)
      const recent = [...orders]
        .filter((o) => o.createdAt)
        .sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          if (isNaN(dateA) || isNaN(dateB)) return 0;
          return dateB - dateA;
        })
        .slice(0, 5);
      setRecentOrders(recent);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: revenue,
        todayOrders: todayOrders.length,
        todayRevenue,
        pendingOrders,
        lowStockProducts: lowStock.length,
      });
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard/page.tsx:129',message:'Error in loadStats',data:{error:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.error('Failed to load stats:', error);
      // Set default values on error to prevent UI crashes
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        todayOrders: 0,
        todayRevenue: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/8fb103c1-e5ee-40a7-ae59-48a560fae6ae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard/page.tsx:143',message:'useEffect triggered',data:{isAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    loadStats();
  }, [loadStats]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={() => {
                setLoading(true);
                loadStats();
              }}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalProducts}
                  </p>
                  {stats.lowStockProducts > 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      {stats.lowStockProducts} low stock
                    </p>
                  )}
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📦</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalOrders}
                  </p>
                  {stats.todayOrders > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      {stats.todayOrders} today
                    </p>
                  )}
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-2xl">🛒</span>
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : stats.totalUsers}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${loading ? '...' : stats.totalRevenue.toFixed(2)}
                  </p>
                  {stats.todayRevenue > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      ${stats.todayRevenue.toFixed(2)} today
                    </p>
                  )}
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {loading ? '...' : stats.pendingOrders}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
                  <p className="text-3xl font-bold text-red-600">
                    {loading ? '...' : stats.lowStockProducts}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <span className="text-2xl">⚠️</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                  <p className="text-3xl font-bold text-green-600">
                    {loading ? '...' : orderStatusBreakdown.COMPLETED}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <Link
                  href="/orders"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View All →
                </Link>
              </div>
              {loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-gray-600">No recent orders</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">
                          {order.userName || `User #${order.userId}`} •{' '}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status Breakdown</h2>
              {loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(orderStatusBreakdown).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            status as OrderStatus
                          )}`}
                        >
                          {status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 flex-1 ml-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              status === 'PENDING'
                                ? 'bg-yellow-500'
                                : status === 'PAID'
                                ? 'bg-blue-500'
                                : status === 'SHIPPED'
                                ? 'bg-purple-500'
                                : status === 'COMPLETED'
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                            style={{
                              width: `${
                                stats.totalOrders > 0
                                  ? (count / stats.totalOrders) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          {lowStockItems.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Low Stock Alerts</h2>
                <Link
                  href="/products"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View All →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Stock
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lowStockItems.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product.sku}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.quantity === 0
                                ? 'bg-red-100 text-red-800'
                                : product.quantity <= 5
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {product.quantity} units
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          ${product.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default Dashboard;
