import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ECommerceHub = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    onlineOrders: 0,
    revenue: 0,
    conversionRate: 0,
    abandonedCarts: 0,
    visitors: 0,
    pageViews: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchECommerceStats();
    fetchRecentOrders();
  }, []);

  const fetchECommerceStats = async () => {
    try {
      const response = await fetch('/api/ecommerce/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching ecommerce stats:', error);
      // Mock data for demo
      setStats({
        onlineOrders: 156,
        revenue: 12450,
        conversionRate: 3.2,
        abandonedCarts: 23,
        visitors: 1247,
        pageViews: 3891
      });
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setRecentOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    }
  };

  const modules = [
    {
      id: 'orders',
      title: 'Orders',
      description: 'View and manage all online orders',
      icon: '📋',
      color: 'bg-blue-500',
      route: '/admin/order-management-hub',
      stats: `${stats.onlineOrders} Orders`
    },
    {
      id: 'products',
      title: 'Products',
      description: 'Manage your product catalog',
      icon: '🌿',
      color: 'bg-green-500',
      route: '/admin/product-management',
      stats: 'Catalog'
    },
    {
      id: 'customers',
      title: 'Customers',
      description: 'Customer accounts and profiles',
      icon: '👥',
      color: 'bg-purple-500',
      route: '/admin/customer-management',
      stats: 'Database'
    },
    {
      id: 'abandoned',
      title: 'Abandoned Carts',
      description: 'Recover abandoned shopping carts',
      icon: '🛒',
      color: 'bg-orange-500',
      route: '/admin/abandoned-carts',
      stats: `${stats.abandonedCarts} Carts`
    },
    {
      id: 'analytics',
      title: 'Web Analytics',
      description: 'Website traffic and conversion data',
      icon: '📊',
      color: 'bg-indigo-500',
      route: '/admin/web-analytics',
      stats: `${stats.visitors} Visitors`
    },
    {
      id: 'promotions',
      title: 'Promotions',
      description: 'Discounts, coupons, and special offers',
      icon: '🎯',
      color: 'bg-pink-500',
      route: '/admin/promotions',
      stats: 'Active Deals'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button 
                onClick={() => navigate('/admin/dashboard')}
                className="text-green-600 hover:text-green-700 text-sm mb-2"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">eCommerce Hub</h1>
              <p className="text-gray-600">Manage your online store and digital sales</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Store Online
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Online Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.onlineOrders}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-blue-600 text-xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-green-600 text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-purple-600 text-xl">📈</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Abandoned Carts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.abandonedCarts}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <span className="text-orange-600 text-xl">🛒</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.visitors.toLocaleString()}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <span className="text-indigo-600 text-xl">👁️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pageViews.toLocaleString()}</p>
              </div>
              <div className="bg-pink-100 p-3 rounded-lg">
                <span className="text-pink-600 text-xl">📄</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => navigate(module.route)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${module.color} p-3 rounded-lg`}>
                  <span className="text-white text-2xl">{module.icon}</span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {module.stats}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>
              <button className="text-green-600 text-sm font-medium hover:text-green-700">
                Open Module →
              </button>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Online Orders</h3>
              <button 
                onClick={() => navigate('/admin/order-management-hub')}
                className="text-green-600 text-sm font-medium hover:text-green-700"
              >
                View All Orders →
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.slice(0, 5).map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <span className="text-green-600">📋</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.id || `ORD-${index + 1}`}</p>
                        <p className="text-sm text-gray-600">{order.customer_name || 'Customer'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${order.total || '0.00'}</p>
                      <p className="text-sm text-gray-600">{order.status || 'Pending'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-100 p-4 rounded-lg inline-block mb-4">
                  <span className="text-gray-400 text-3xl">📋</span>
                </div>
                <p className="text-gray-600">No recent orders found</p>
                <p className="text-sm text-gray-500">Orders will appear here once customers start purchasing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECommerceHub;

