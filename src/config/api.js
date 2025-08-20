// API Configuration
const API_BASE_URL = 'https://5000-i38uoq3jl1k4hqk1zwz66-1a2afeeb.manusvm.computer';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    VERIFY_EMAIL: `${API_BASE_URL}/api/auth/verify-email`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
  },
  
  // Orders
  ORDERS: {
    CREATE: `${API_BASE_URL}/api/orders`,
    GET_ALL: `${API_BASE_URL}/api/orders`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/orders/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/api/orders/${id}/status`,
    ASSIGN_DRIVER: (id) => `${API_BASE_URL}/api/orders/${id}/assign-driver`,
  },
  
  // Customers
  CUSTOMERS: {
    GET_ALL: `${API_BASE_URL}/api/customers`,
    CREATE: `${API_BASE_URL}/api/customers`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/customers/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/customers/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/customers/${id}`,
    GET_ORDERS: (id) => `${API_BASE_URL}/api/customers/${id}/orders`,
    GET_DOCUMENTS: (id) => `${API_BASE_URL}/api/customers/${id}/documents`,
    UPLOAD_DOCUMENT: (id) => `${API_BASE_URL}/api/customers/${id}/documents`,
    ADD_ADDRESS: (id) => `${API_BASE_URL}/api/customers/${id}/addresses`,
    STATS: `${API_BASE_URL}/api/customers/stats`,
  },
  
  // Point of Sales
  POS: {
    CREATE_SALE: `${API_BASE_URL}/api/pos/sales`,
    GET_SALES: `${API_BASE_URL}/api/pos/sales`,
    GET_SALE: (id) => `${API_BASE_URL}/api/pos/sales/${id}`,
    CREATE_REFUND: `${API_BASE_URL}/api/pos/refunds`,
    STATS: `${API_BASE_URL}/api/pos/stats`,
    INVENTORY: `${API_BASE_URL}/api/pos/inventory`,
    ADJUST_INVENTORY: (id) => `${API_BASE_URL}/api/pos/inventory/${id}/adjust`,
  },
  
  // Dispatch
  DISPATCH: {
    AUTO_ASSIGN: (orderId) => `${API_BASE_URL}/api/dispatch/auto-assign/${orderId}`,
    AVAILABLE_DRIVERS: `${API_BASE_URL}/api/dispatch/available-drivers`,
    UPDATE_DRIVER_LOCATION: (id) => `${API_BASE_URL}/api/dispatch/driver-location/${id}`,
    UPDATE_DELIVERY_STATUS: (id) => `${API_BASE_URL}/api/dispatch/delivery-status/${id}`,
    STATS: `${API_BASE_URL}/api/dispatch/stats`,
  },
  
  // Partners
  PARTNERS: {
    SUBMIT_APPLICATION: `${API_BASE_URL}/api/partner-applications`,
    GET_APPLICATIONS: `${API_BASE_URL}/api/partner-applications`,
    GET_APPLICATION: (id) => `${API_BASE_URL}/api/partner-applications/${id}`,
    REVIEW_APPLICATION: (id) => `${API_BASE_URL}/api/partner-applications/${id}/review`,
    UPLOAD_DOCUMENT: (id) => `${API_BASE_URL}/api/partner-applications/${id}/documents`,
    VERIFY_DOCUMENT: (id) => `${API_BASE_URL}/api/partner-documents/${id}/verify`,
    GET_PARTNERS: `${API_BASE_URL}/api/partners`,
    UPDATE_PARTNER: (id) => `${API_BASE_URL}/api/partners/${id}`,
    STATS: `${API_BASE_URL}/api/partner-stats`,
  },
  
  // Delivery Partners
  DELIVERY_PARTNERS: {
    GET_ALL: `${API_BASE_URL}/api/delivery-partners`,
    CREATE: `${API_BASE_URL}/api/delivery-partners`,
  }
};

// API utility functions
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('dankdash_token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Specific API functions
export const AuthAPI = {
  register: (userData) => apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getProfile: () => apiRequest(API_ENDPOINTS.AUTH.PROFILE),
  
  updateProfile: (profileData) => apiRequest(API_ENDPOINTS.AUTH.PROFILE, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
};

export const OrderAPI = {
  create: (orderData) => apiRequest(API_ENDPOINTS.ORDERS.CREATE, {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`${API_ENDPOINTS.ORDERS.GET_ALL}?${params}`);
  },
  
  getById: (id) => apiRequest(API_ENDPOINTS.ORDERS.GET_BY_ID(id)),
  
  updateStatus: (id, statusData) => apiRequest(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), {
    method: 'PUT',
    body: JSON.stringify(statusData),
  }),
  
  assignDriver: (orderId, partnerId) => apiRequest(API_ENDPOINTS.ORDERS.ASSIGN_DRIVER(orderId), {
    method: 'POST',
    body: JSON.stringify({ partner_id: partnerId }),
  }),
};

export const CustomerAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`${API_ENDPOINTS.CUSTOMERS.GET_ALL}?${params}`);
  },
  
  create: (customerData) => apiRequest(API_ENDPOINTS.CUSTOMERS.CREATE, {
    method: 'POST',
    body: JSON.stringify(customerData),
  }),
  
  getById: (id) => apiRequest(API_ENDPOINTS.CUSTOMERS.GET_BY_ID(id)),
  
  update: (id, customerData) => apiRequest(API_ENDPOINTS.CUSTOMERS.UPDATE(id), {
    method: 'PUT',
    body: JSON.stringify(customerData),
  }),
  
  delete: (id) => apiRequest(API_ENDPOINTS.CUSTOMERS.DELETE(id), {
    method: 'DELETE',
  }),
  
  getStats: () => apiRequest(API_ENDPOINTS.CUSTOMERS.STATS),
};

export const POSAPI = {
  createSale: (saleData) => apiRequest(API_ENDPOINTS.POS.CREATE_SALE, {
    method: 'POST',
    body: JSON.stringify(saleData),
  }),
  
  getSales: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`${API_ENDPOINTS.POS.GET_SALES}?${params}`);
  },
  
  getStats: () => apiRequest(API_ENDPOINTS.POS.STATS),
  
  getInventory: () => apiRequest(API_ENDPOINTS.POS.INVENTORY),
  
  adjustInventory: (itemId, adjustment, reason) => apiRequest(API_ENDPOINTS.POS.ADJUST_INVENTORY(itemId), {
    method: 'POST',
    body: JSON.stringify({ adjustment, reason }),
  }),
};

export const DispatchAPI = {
  autoAssign: (orderId) => apiRequest(API_ENDPOINTS.DISPATCH.AUTO_ASSIGN(orderId), {
    method: 'POST',
  }),
  
  getAvailableDrivers: () => apiRequest(API_ENDPOINTS.DISPATCH.AVAILABLE_DRIVERS),
  
  updateDriverLocation: (driverId, location) => apiRequest(API_ENDPOINTS.DISPATCH.UPDATE_DRIVER_LOCATION(driverId), {
    method: 'PUT',
    body: JSON.stringify(location),
  }),
  
  updateDeliveryStatus: (deliveryId, statusData) => apiRequest(API_ENDPOINTS.DISPATCH.UPDATE_DELIVERY_STATUS(deliveryId), {
    method: 'PUT',
    body: JSON.stringify(statusData),
  }),
  
  getStats: () => apiRequest(API_ENDPOINTS.DISPATCH.STATS),
};

export const PartnerAPI = {
  submitApplication: (applicationData) => apiRequest(API_ENDPOINTS.PARTNERS.SUBMIT_APPLICATION, {
    method: 'POST',
    body: JSON.stringify(applicationData),
  }),
  
  getApplications: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`${API_ENDPOINTS.PARTNERS.GET_APPLICATIONS}?${params}`);
  },
  
  reviewApplication: (id, reviewData) => apiRequest(API_ENDPOINTS.PARTNERS.REVIEW_APPLICATION(id), {
    method: 'PUT',
    body: JSON.stringify(reviewData),
  }),
  
  getPartners: () => apiRequest(API_ENDPOINTS.PARTNERS.GET_PARTNERS),
  
  getStats: () => apiRequest(API_ENDPOINTS.PARTNERS.STATS),
};

export default {
  AuthAPI,
  OrderAPI,
  CustomerAPI,
  POSAPI,
  DispatchAPI,
  PartnerAPI,
};

