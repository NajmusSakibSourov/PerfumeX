// Main App component
const { useState, useEffect } = React;

// Sample perfume data
const perfumeData = [
  {
    id: 1,
    name: "Midnight Rose",
    description: "A seductive blend of rose, vanilla, and amber notes that lasts all day.",
    price: 89.99,
    image: "./images/Lancome-Tresor-Midnight-Rose-EDP-for-Women-Bottle.jpg"
  },
  {
    id: 2,
    name: "Ocean Breeze",
    description: "Fresh aquatic scent with hints of citrus and sea salt.",
    price: 75.50,
    image: "./images/Ocean Breeze.jpg"
  },
  {
    id: 3,
    name: "Velvet Oud",
    description: "Rich and exotic with notes of oud, sandalwood, and musk.",
    price: 120.00,
    image: "./images/velvet Oud.png"
  },
  {
    id: 4,
    name: "Citrus Sunshine",
    description: "Bright and energizing with lemon, bergamot, and orange blossom.",
    price: 65.99,
    image: "./images/Citrus Sunshine.png"
  },
  {
    id: 5,
    name: "Lavender Dreams",
    description: "Calming lavender blended with vanilla and chamomile.",
    price: 55.00,
    image: "./images/vicole-perfume-lavendar-dreams-6.jpg"
  },
  {
    id: 6,
    name: "Spiced Amber",
    description: "Warm and spicy with notes of amber, cinnamon, and clove.",
    price: 95.00,
    image: "./images/Spiced Amber.jpeg"
  }
];

// App Component
function App() {
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Add to cart function
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? {...item, quantity: item.quantity + 1} 
          : item
      ));
    } else {
      setCart([...cart, {...product, quantity: 1}]);
    }
  };
  
  // Remove from cart function
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };
  
  // Update quantity function
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item => 
      item.id === productId 
        ? {...item, quantity: newQuantity} 
        : item
    ));
  };
  
  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };
  
  // Submit order function
  const submitOrder = async (customerInfo) => {
    try {
      const order = {
        customer: customerInfo,
        items: cart,
        total: calculateTotal(),
        date: new Date().toISOString()
      };
      
      // Submit the order to the backend using the API
      try {
        // Import the API function from api.js
        const response = await api.submitOrder(order);
        console.log('Order submitted successfully:', response);
        
        // Clear cart and go to confirmation page
        setCart([]);
        setPage('confirmation');
      } catch (error) {
        console.error('Failed to submit order:', error);
        alert('Failed to submit order. Please try again.');
      }
    } catch (error) {
      console.error('Error in submit order function:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Render different pages based on state
  const renderPage = () => {
    switch(page) {
      case 'home':
        return <HomePage setPage={setPage} />;
      case 'products':
        return <ProductsPage products={perfumeData} addToCart={addToCart} setSelectedProduct={setSelectedProduct} setPage={setPage} />;
      case 'product':
        return <ProductDetailPage product={selectedProduct} addToCart={addToCart} setPage={setPage} />;
      case 'cart':
        return <CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} total={calculateTotal()} setPage={setPage} />;
      case 'checkout':
        return <CheckoutPage cart={cart} total={calculateTotal()} submitOrder={submitOrder} setPage={setPage} />;
      case 'confirmation':
        return <ConfirmationPage setPage={setPage} />;
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="app">
      <Header cart={cart} setPage={setPage} />
      <main className="container">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

// Header Component
function Header({ cart, setPage }) {
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <header>
      <div className="container header-content">
        <a href="#" className="logo" onClick={() => setPage('home')}>PerfumeX</a>
        <nav>
          <ul>
            <li><a href="#" onClick={() => setPage('home')}>Home</a></li>
            <li><a href="#" onClick={() => setPage('products')}>Products</a></li>
            <li>
              <a href="#" onClick={() => setPage('cart')}>
                Cart ({cartItemCount})
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

// Footer Component
function Footer() {
  return (
    <footer>
      <div className="container footer-content">
        <div className="footer-section">
          <h3>PerfumeX</h3>
          <p>Luxury perfumes for every occasion.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@perfumex.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; 2023 PerfumeX. All rights reserved.</p>
      </div>
    </footer>
  );
}

// Home Page Component
function HomePage({ setPage }) {
  return (
    <div>
      <section className="hero">
        <h1>Luxury Perfumes for Every Occasion</h1>
        <p>Discover our exclusive collection of premium fragrances crafted by master perfumers.</p>
        <button className="btn" onClick={() => setPage('products')}>Shop Now</button>
      </section>
      
      <section className="container featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {perfumeData.slice(0, 3).map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-description">{product.description}</p>
                <button 
                  className="btn" 
                  onClick={() => {
                    setPage('product');
                    setSelectedProduct(product);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <button className="btn" onClick={() => setPage('products')}>View All Products</button>
        </div>
      </section>
    </div>
  );
}

// Products Page Component
function ProductsPage({ products, addToCart, setSelectedProduct, setPage }) {
  return (
    <section className="products">
      <h1>Our Collection</h1>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p className="product-description">{product.description}</p>
              <div style={{display: 'flex', gap: '10px'}}>
                <button 
                  className="btn" 
                  onClick={() => {
                    setSelectedProduct(product);
                    setPage('product');
                  }}
                >
                  View Details
                </button>
                <button 
                  className="btn" 
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Product Detail Page Component
function ProductDetailPage({ product, addToCart, setPage }) {
  if (!product) {
    return <div>Product not found</div>;
  }
  
  return (
    <section className="product-detail">
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '2rem'}}>
        <div style={{flex: '1', minWidth: '300px'}}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{width: '100%', borderRadius: '8px'}}
          />
        </div>
        <div style={{flex: '1', minWidth: '300px'}}>
          <h1>{product.name}</h1>
          <p className="product-price" style={{fontSize: '1.5rem'}}>${product.price.toFixed(2)}</p>
          <p style={{margin: '1.5rem 0'}}>{product.description}</p>
          <button 
            className="btn" 
            onClick={() => addToCart(product)}
            style={{marginRight: '1rem'}}
          >
            Add to Cart
          </button>
          <button 
            className="btn" 
            onClick={() => setPage('products')}
          >
            Back to Products
          </button>
        </div>
      </div>
    </section>
  );
}

// Cart Page Component
function CartPage({ cart, updateQuantity, removeFromCart, total, setPage }) {
  if (cart.length === 0) {
    return (
      <section className="cart">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <button className="btn" onClick={() => setPage('products')}>Continue Shopping</button>
      </section>
    );
  }
  
  return (
    <section className="cart">
      <h1>Your Cart</h1>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} style={{maxWidth: '100%', maxHeight: '100%'}} />
              </div>
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="cart-item-quantity">
              <button 
                className="quantity-btn" 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                -
              </button>
              <input 
                type="number" 
                className="quantity-input" 
                value={item.quantity} 
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                min="1"
              />
              <button 
                className="quantity-btn" 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <div>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
              <button 
                className="cart-item-remove" 
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span>${total}</span>
        </div>
        <button 
          className="btn" 
          onClick={() => setPage('checkout')}
          style={{width: '100%'}}
        >
          Proceed to Checkout
        </button>
      </div>
    </section>
  );
}

// Checkout Page Component
function CheckoutPage({ cart, total, submitOrder, setPage }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    submitOrder(formData);
  };
  
  if (cart.length === 0) {
    return (
      <section>
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <button className="btn" onClick={() => setPage('products')}>Continue Shopping</button>
      </section>
    );
  }
  
  return (
    <section>
      <h1>Checkout</h1>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem'}}>
        <div style={{flex: '1', minWidth: '300px'}}>
          <h2>Order Summary</h2>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} style={{maxWidth: '100%', maxHeight: '100%'}} />
                  </div>
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
        
        <div style={{flex: '1', minWidth: '300px'}}>
          <h2>Shipping Information</h2>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="form-control" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="form-control" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                className="form-control" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                className="form-control" 
                value={formData.address} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input 
                type="text" 
                id="city" 
                name="city" 
                className="form-control" 
                value={formData.city} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code</label>
              <input 
                type="text" 
                id="zipCode" 
                name="zipCode" 
                className="form-control" 
                value={formData.zipCode} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input 
                type="text" 
                id="country" 
                name="country" 
                className="form-control" 
                value={formData.country} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Payment Method</label>
              <div>
                <input 
                  type="radio" 
                  id="cod" 
                  name="paymentMethod" 
                  value="cod" 
                  checked 
                  readOnly 
                />
                <label htmlFor="cod" style={{marginLeft: '0.5rem'}}>Cash on Delivery</label>
              </div>
            </div>
            
            <button type="submit" className="btn" style={{width: '100%', marginTop: '1rem'}}>
              Place Order
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// Order Confirmation Page
function ConfirmationPage({ setPage }) {
  return (
    <section style={{textAlign: 'center', padding: '3rem 0'}}>
      <h1>Order Confirmed!</h1>
      <p style={{fontSize: '1.2rem', margin: '2rem 0'}}>Thank you for your purchase. Your order has been received and will be processed shortly.</p>
      <button className="btn" onClick={() => setPage('home')}>Continue Shopping</button>
    </section>
  );
}