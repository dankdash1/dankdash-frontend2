import React, { useState, useEffect } from 'react';

const FixedPointOfSale = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customer, setCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const [tax] = useState(8.75); // Tax rate

  // Customer form
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    idNumber: ''
  });

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/pos/products');
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback products if API fails
        setProducts([
          { id: 'SKU-001', name: 'Premium OG Kush', category: 'Flower', price: 35.00, stock: 250, thc: 22.5 },
          { id: 'SKU-002', name: 'Blue Dream', category: 'Flower', price: 32.00, stock: 90, thc: 21.3 },
          { id: 'SKU-003', name: 'Mixed Berry Gummies', category: 'Edibles', price: 25.00, stock: 880, thc: 10.0 },
          { id: 'SKU-004', name: 'OG Kush Shatter', category: 'Concentrates', price: 65.00, stock: 48, thc: 87.3 },
          { id: 'SKU-005', name: 'Glass Spoon Pipe', category: 'Accessories', price: 15.00, stock: 180, thc: 0.0 }
        ]);
      }
    };
    loadProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (tax / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  // Add customer
  const addCustomer = () => {
    if (!customerForm.name.trim()) {
      alert('Customer name is required');
      return;
    }

    const newCustomer = {
      id: Date.now(),
      name: customerForm.name,
      email: customerForm.email,
      phone: customerForm.phone,
      dateOfBirth: customerForm.dateOfBirth,
      address: customerForm.address,
      idNumber: customerForm.idNumber,
      idVerified: !!customerForm.idNumber
    };

    setCustomer(newCustomer);
    setShowCustomerModal(false);
    
    // Reset form
    setCustomerForm({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      idNumber: ''
    });

    alert('Customer added successfully!');
  };

  // Process sale
  const processSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (paymentMethod === 'cash' && cashReceived < calculateTotal()) {
      alert('Insufficient cash received');
      return;
    }

    try {
      const saleData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        customer: customer || {
          name: 'Walk-in Customer',
          email: '',
          phone: '',
          idVerified: true
        },
        payment: {
          method: paymentMethod,
          amountReceived: paymentMethod === 'cash' ? cashReceived : calculateTotal(),
          reference: ''
        },
        taxRate: tax,
        discountAmount: 0,
        cashier: 'POS User',
        location: 'Main Store'
      };

      const response = await fetch('/api/pos/sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(saleData)
      });

      const result = await response.json();

      if (result.success) {
        // Create transaction record
        const transaction = {
          id: result.sale_id,
          timestamp: new Date().toISOString(),
          items: cart,
          subtotal: calculateSubtotal(),
          tax: calculateTax(),
          total: result.total,
          paymentMethod: paymentMethod,
          customer: customer || { name: 'Walk-in Customer' },
          change: result.change || 0,
          integrations: result.integrations
        };

        setCurrentTransaction(transaction);
        setShowCheckoutModal(false);
        setShowReceiptModal(true);
        
        // Clear cart and reset
        setCart([]);
        setCustomer(null);
        setCashReceived(0);
        setPaymentMethod('cash');

        alert(`Sale completed! Sale ID: ${result.sale_id}`);
      } else {
        alert(`Sale failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Sale error:', error);
      alert('Sale failed: Network error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Point of Sale Terminal</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2">
            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search products or scan barcode..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Flower">Flower</option>
                <option value="Concentrates">Concentrates</option>
                <option value="Edibles">Edibles</option>
                <option value="Accessories">Accessories</option>
                <option value="Wellness">Wellness</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-4xl">🌿</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
                    <span className={`text-sm ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {product.stock} left
                    </span>
                  </div>
                  {product.thc > 0 && (
                    <p className="text-xs text-gray-500 mb-3">THC: {product.thc}%</p>
                  )}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Current Sale</h2>
            
            {/* Customer Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              {customer ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-medium text-green-800">{customer.name}</p>
                  {customer.email && <p className="text-sm text-green-600">{customer.email}</p>}
                  <button
                    onClick={() => setCustomer(null)}
                    className="text-sm text-red-600 hover:text-red-800 mt-1"
                  >
                    Remove Customer
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => setShowCustomerModal(true)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Customer
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Or continue as walk-in customer
                  </p>
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6 pt-4 border-t">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({tax}%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setShowCheckoutModal(true)}
              disabled={cart.length === 0}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              Checkout ${calculateTotal().toFixed(2)}
            </button>
          </div>
        </div>
      </div>

      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Customer</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  value={customerForm.dateOfBirth}
                  onChange={(e) => setCustomerForm({...customerForm, dateOfBirth: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Number</label>
                <input
                  type="text"
                  value={customerForm.idNumber}
                  onChange={(e) => setCustomerForm({...customerForm, idNumber: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Driver's license or ID number"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCustomerModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={addCustomer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    Cash
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    Credit/Debit Card
                  </label>
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cash Received</label>
                  <input
                    type="number"
                    step="0.01"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                  {cashReceived > 0 && (
                    <p className="mt-2 text-sm">
                      Change: <span className="font-bold">${Math.max(0, cashReceived - calculateTotal()).toFixed(2)}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={processSale}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && currentTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sale Complete!</h3>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">✓ Sale Completed</p>
                <p className="text-sm text-gray-600">Sale ID: {currentTransaction.id}</p>
              </div>
              
              <div className="border-t pt-3">
                <p><strong>Customer:</strong> {currentTransaction.customer.name}</p>
                <p><strong>Total:</strong> ${currentTransaction.total.toFixed(2)}</p>
                <p><strong>Payment:</strong> {currentTransaction.paymentMethod}</p>
                {currentTransaction.change > 0 && (
                  <p><strong>Change:</strong> ${currentTransaction.change.toFixed(2)}</p>
                )}
              </div>

              {currentTransaction.integrations && (
                <div className="border-t pt-3">
                  <p className="font-medium text-green-600">✓ All Systems Updated:</p>
                  <ul className="text-sm text-gray-600 ml-4">
                    <li>• POS Sale Recorded</li>
                    <li>• Inventory Updated</li>
                    <li>• Accounting Entries Created</li>
                    <li>• Order Management Updated</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedPointOfSale;

