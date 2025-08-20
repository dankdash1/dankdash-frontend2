import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CRMDashboard = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [partnerApplications, setPartnerApplications] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
    fetchPartnerApplications();
    fetchLeads();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Mock data for demo
      setCustomers([
        { id: 1, name: 'John Smith', email: 'john@email.com', phone: '555-0123', status: 'active', orders: 3, total_spent: 245.99 },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '555-0124', status: 'active', orders: 1, total_spent: 89.99 },
        { id: 3, name: 'Mike Chen', email: 'mike@email.com', phone: '555-0125', status: 'inactive', orders: 0, total_spent: 0 }
      ]);
    }
  };

  const fetchPartnerApplications = async () => {
    try {
      const response = await fetch('/api/partner-applications');
      if (response.ok) {
        const data = await response.json();
        setPartnerApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching partner applications:', error);
      // Mock data for demo
      setPartnerApplications([
        { id: 1, name: 'Alex Rodriguez', email: 'alex@email.com', phone: '555-0201', type: 'driver', status: 'pending', applied_date: '2024-08-20' },
        { id: 2, name: 'Maria Garcia', email: 'maria@email.com', phone: '555-0202', type: 'driver', status: 'approved', applied_date: '2024-08-19' },
        { id: 3, name: 'David Kim', email: 'david@email.com', phone: '555-0203', type: 'partner', status: 'under_review', applied_date: '2024-08-18' }
      ]);
    }
  };

  const fetchLeads = async () => {
    try {
      // Mock leads data - in real app this would come from forms, referrals, etc.
      setLeads([
        { id: 1, name: 'Jennifer Wilson', email: 'jen@email.com', source: 'Website Contact', status: 'new', interest: 'Bulk Orders', created_date: '2024-08-20' },
        { id: 2, name: 'Robert Brown', email: 'rob@email.com', source: 'Partner Referral', status: 'contacted', interest: 'Wholesale', created_date: '2024-08-19' },
        { id: 3, name: 'Lisa Davis', email: 'lisa@email.com', source: 'Social Media', status: 'qualified', interest: 'Delivery Service', created_date: '2024-08-18' }
      ]);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === 'new').length,
    partnerApplications: partnerApplications.length,
    pendingApplications: partnerApplications.filter(p => p.status === 'pending').length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.total_spent || 0), 0),
    avgOrderValue: customers.length > 0 ? customers.reduce((sum, c) => sum + (c.total_spent || 0), 0) / customers.reduce((sum, c) => sum + (c.orders || 0), 0) : 0
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'new': return 'bg-purple-100 text-purple-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CRM data...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">CRM & Customer Management</h1>
              <p className="text-gray-600">Manage customers, leads, and partner applications</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Add Customer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-purple-600 text-xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">New Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newLeads}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <span className="text-orange-600 text-xl">🆕</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Partner Apps</p>
                <p className="text-2xl font-bold text-gray-900">{stats.partnerApplications}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <span className="text-indigo-600 text-xl">🤝</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Apps</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(0)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-green-600 text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">${stats.avgOrderValue.toFixed(0)}</p>
              </div>
              <div className="bg-teal-100 p-3 rounded-lg">
                <span className="text-teal-600 text-xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customers */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Recent Customers</h3>
                <button className="text-green-600 text-sm font-medium hover:text-green-700">
                  View All →
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {customers.slice(0, 5).map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <span className="text-blue-600">👤</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${customer.total_spent?.toFixed(2) || '0.00'}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leads */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Recent Leads</h3>
                <button className="text-green-600 text-sm font-medium hover:text-green-700">
                  View All →
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <span className="text-purple-600">🎯</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-600">{lead.source}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{lead.interest}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Partner Applications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Partner Applications</h3>
                <button className="text-green-600 text-sm font-medium hover:text-green-700">
                  View All →
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {partnerApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <span className="text-indigo-600">🚚</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{application.name}</p>
                        <p className="text-sm text-gray-600">{application.type} application</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{application.applied_date}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
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

export default CRMDashboard;

