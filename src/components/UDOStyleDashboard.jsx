import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UDOStyleDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalCustomers: 0,
    totalProducts: 0
  });

  useEffect(() => {
    // Fetch dashboard statistics
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const modules = [
    {
      id: 'ecommerce',
      title: 'eCommerce',
      description: 'Manage your online store, orders, and customers',
      icon: '🛍️',
      color: 'bg-green-500',
      route: '/admin/ecommerce-hub',
      stats: `${stats.totalOrders} Orders`
    },
    {
      id: 'pos',
      title: 'Point of Sale',
      description: 'Process in-store sales and transactions',
      icon: '💳',
      color: 'bg-blue-500',
      route: '/admin/point-of-sale',
      stats: `$${stats.totalSales.toLocaleString()} Sales`
    },
    {
      id: 'inventory',
      title: 'Inventory',
      description: 'Track stock levels and product management',
      icon: '📦',
      color: 'bg-purple-500',
      route: '/admin/inventory-management',
      stats: `${stats.totalProducts} Products`
    },
    {
      id: 'customers',
      title: 'CRM & Customers',
      description: 'Customer relationship management and leads',
      icon: '👥',
      color: 'bg-orange-500',
      route: '/admin/crm-dashboard',
      stats: `${stats.totalCustomers} Customers`
    },
    {
      id: 'orders',
      title: 'Order Management',
      description: 'View and manage all orders and fulfillment',
      icon: '📋',
      color: 'bg-indigo-500',
      route: '/admin/order-management-hub',
      stats: 'All Orders'
    },
    {
      id: 'reporting',
      title: 'Reports & Analytics',
      description: 'Sales reports, analytics, and insights',
      icon: '📊',
      color: 'bg-teal-500',
      route: '/admin/reporting-hub',
      stats: 'Live Data'
    },
    {
      id: 'website',
      title: 'Website Management',
      description: 'Manage your website content and settings',
      icon: '🌐',
      color: 'bg-pink-500',
      route: '/admin/website-management',
      stats: 'Live Site'
    },
    {
      id: 'partners',
      title: 'Partners & Drivers',
      description: 'Manage delivery partners and driver applications',
      icon: '🚚',
      color: 'bg-yellow-500',
      route: '/admin/partner-management',
      stats: 'Active Partners'
    },
    {
      id: 'accounting',
      title: 'Accounting',
      description: 'Financial records, transactions, and reports',
      icon: '💰',
      color: 'bg-red-500',
      route: '/admin/accounting-hub',
      stats: 'Financial Data'
    },
    {
      id: 'settings',
      title: 'Configuration',
      description: 'System settings, users, and preferences',
      icon: '⚙️',
      color: 'bg-gray-500',
      route: '/admin/configuration',
      stats: 'System Config'
    },
    {
      id: 'compliance',
      title: 'Cannabis Compliance',
      description: 'Track compliance, licenses, and regulations',
      icon: '🏛️',
      color: 'bg-green-600',
      route: '/admin/compliance-dashboard',
      stats: 'Compliant'
    },
    {
      id: 'marketing',
      title: 'Marketing Automation',
      description: 'Email campaigns, promotions, and customer engagement',
      icon: '📧',
      color: 'bg-purple-600',
      route: '/admin/marketing-automation',
      stats: 'Active Campaigns'
    }
  ];

  const recentActivity = [
    { type: 'order', message: 'New order #ORD-2024-001 received', time: '2 minutes ago', icon: '📋' },
    { type: 'sale', message: 'POS sale completed - $45.99', time: '5 minutes ago', icon: '💳' },
    { type: 'customer', message: 'New customer registration', time: '12 minutes ago', icon: '👤' },
    { type: 'inventory', message: 'Low stock alert: Blue Dream', time: '18 minutes ago', icon: '⚠️' },
    { type: 'partner', message: 'Driver application submitted', time: '25 minutes ago', icon: '🚚' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DankDash Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your cannabis business.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                System Online
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white shadow-lg h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-900">DankDash</h2>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => navigate('/admin/dashboard')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg bg-green-50 text-green-700 font-medium"
              >
                <span>🏠</span>
                <span>Dashboard</span>
              </button>
              
              {modules.slice(0, 8).map((module) => (
                <button
                  key={module.id}
                  onClick={() => navigate(module.route)}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>{module.icon}</span>
                  <span className="text-sm">{module.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-blue-600 text-xl">📋</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalSales.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-green-600 text-xl">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <span className="text-purple-600 text-xl">👥</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <span className="text-orange-600 text-xl">📦</span>
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

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <span>{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm">{activity.message}</p>
                      <p className="text-gray-500 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UDOStyleDashboard;

