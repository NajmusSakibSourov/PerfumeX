// API functions for connecting to the backend

// Base URL for API requests
const API_URL = 'http://localhost:5000';

// Function to submit an order to the backend
async function submitOrder(orderData) {
  try {
    const response = await fetch(`${API_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit order');
    }
    
    return data;
  } catch (error) {
    console.error('Error submitting order:', error);
    throw error;
  }
}

// Function to get all orders (for admin)
async function getOrders() {
  try {
    const response = await fetch(`${API_URL}/orders`);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

// Export the API functions
const api = {
  submitOrder,
  getOrders,
};