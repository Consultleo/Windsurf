import './App.css';
import React, { useState, useEffect } from 'react';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [productError, setProductError] = useState('');

  // Fetch products after login
  useEffect(() => {
    if (loggedIn) {
      fetch('http://localhost:4000/products', {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(setProducts)
        .catch(() => setProductError('Could not fetch products'));
    }
  }, [loggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      setLoggedIn(true);
      setUsername('');
      setPassword('');
    } catch {
      setLoginError('Invalid username or password');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductError('');
    if (!name || !price || isNaN(price)) {
      setProductError('Please enter a valid name and price.');
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, price: Number(price) })
      });
      if (!res.ok) throw new Error('Failed to add product');
      const newProduct = await res.json();
      setProducts(products => [...products, newProduct]);
      setName('');
      setPrice('');
    } catch {
      setProductError('Failed to add product');
    }
  };

  const handleLogout = async () => {
    await fetch('http://localhost:4000/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setLoggedIn(false);
    setProducts([]);
  };

  return (
    <div className="App grocery-app-bg">
      <header className="grocery-header">
        <span role="img" aria-label="admin" style={{fontSize: '2rem', marginRight: 12}}>🔑</span>
        <span className="shop-title">Admin Panel - FreshMart</span>
      </header>
      <div className="grocery-content">
        {!loggedIn ? (
          <form onSubmit={handleLogin} className="product-form" style={{flexDirection:'column', gap:16}}>
            <input
              type="text"
              placeholder="Admin Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="input"
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input"
            />
            <button type="submit" className="add-btn">Login</button>
            {loginError && <div className="error-msg">{loginError}</div>}
          </form>
        ) : (
          <>
            <button onClick={handleLogout} className="add-btn" style={{float:'right',marginBottom:8,background:'#b71c1c',fontWeight:400}}>Logout</button>
            <form onSubmit={handleAddProduct} className="product-form">
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input"
              />
              <input
                type="number"
                placeholder="Price (€)"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="input"
                step="0.01"
                min="0"
              />
              <button type="submit" className="add-btn">Add Product</button>
            </form>
            {productError && <div className="error-msg">{productError}</div>}
            <div className="table-container">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan="2" className="empty-row">No products yet</td></tr>
                  ) : (
                    products.map(product => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td style={{textAlign: 'right'}}>{Number(product.price).toFixed(2)} €</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
