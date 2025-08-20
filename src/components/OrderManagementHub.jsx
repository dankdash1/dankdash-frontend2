import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderManagementHub = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [posTransactions, setPosTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllOrders();
    fetchPosTransactions();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchPosTransactions = async () => {
    try {
      const response = await fetch('/api/pos/transactions');
      if (response.ok) {
        const data = await response.json();
        setPosTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching POS transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine orders and POS transactions
  const allTransactions = [
    ...orders.map(order => ({
      ...order,
      type: 'online',
      source: 'Website',
      payment_method: 'Card'
    })),
    ...posTransactions.map(transaction => ({
      ...transaction,
      type: 'pos',
      source: 'POS Terminal',
      customer_name: transaction.customer?.name || 'Walk-in Customer',
      customer_email: transaction.customer?.email || '',
      status: transaction.status || 'completed'
    }))
  ];

  // Filter transactions
  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'online' && transaction.type === 'online') ||
                         (filter === 'pos' && transaction.type === 'pos') ||
                         (filter === 'pending' && transaction.status === 'pending') ||
                         (filter === 'completed' && transaction.status === 'completed');
    
    const matchesSearch = !searchTerm || 
                         transaction.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: allTransactions.length,
    online: allTransactions.filter(t => t.type === 'online').length,
    pos: allTransactions.filter(t => t.type === 'pos').length,
    pending: allTransactions.filter(t => t.status === 'pending').length,
    completed: allTransactions.filter(t => t.status === 'completed').length,
    revenue: allTransactions.reduce((sum, t) => sum + (t.total || 0), 0)
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (type) => {
    return type === 'online' ? '🌐' : '💳';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600">View and manage all orders from online store and POS system</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Refresh Orders
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-blue-600 text-xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Online Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.online}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-green-600 text-xl">🌐</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">POS Sales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pos}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-purple-600 text-xl">💳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.revenue.toFixed(2)}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <span className="text-indigo-600 text-xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Orders', count: stats.total },
                  { key: 'online', label: 'Online', count: stats.online },
                  { key: 'pos', label: 'POS', count: stats.pos },
                  { key: 'pending', label: 'Pending', count: stats.pending },
                  { key: 'completed', label: 'Completed', count: stats.completed }
                ].map(filterOption => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterOption.key
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filterOption.label} ({filterOption.count})
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-900">
              {filter === 'all' ? 'All Orders' : 
               filter === 'online' ? 'Online Orders' :
               filter === 'pos' ? 'POS Sales' :
               filter === 'pending' ? 'Pending Orders' :
               filter === 'completed' ? 'Completed Orders' : 'Orders'}
            </h3>
          </div>
          
          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction, index) => (
                    <tr key={transaction.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">{getSourceIcon(transaction.type)}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {transaction.id || `${transaction.type.toUpperCase()}-${index + 1}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.customer_name || 'Unknown Customer'}
                          </div>
                          {transaction.customer_email && (
                            <div className="text-sm text-gray-500">{transaction.customer_email}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{transaction.source}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          ${transaction.total?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {transaction.paymentMethod || transaction.payment_method || 'Card'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status || 'Completed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.timestamp ? new Date(transaction.timestamp).toLocaleDateString() :
                         transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() :
                         'Today'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-green-600 hover:text-green-900 mr-3">View</button>
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="bg-gray-100 p-4 rounded-lg inline-block mb-4">
                <span className="text-gray-400 text-3xl">📋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No orders match your search criteria.' : 'No orders have been placed yet.'}
              </p>
              {!searchTerm && (
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/admin/point-of-sale')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mr-3"
                  >
                    Create POS Sale
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Visit Store
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagementHub;

