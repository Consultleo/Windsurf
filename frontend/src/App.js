import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [fullscreenRequested, setFullscreenRequested] = useState(false);

  // Request fullscreen on first click
  const requestFullscreen = () => {
    if (fullscreenRequested) return;
    setFullscreenRequested(true);
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  const headerImg = "https://static.commerceplatform.services/images/grocery-store-displays.jpg";
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(() => setError('Could not fetch products'));
  }, []);

  return (
    <div
      className="App grocery-app-bg"
      onClick={requestFullscreen}
      style={{ minHeight: '100vh', minWidth: '100vw', cursor: fullscreenRequested ? 'default' : 'pointer' }}
    >
      {!fullscreenRequested && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', color: '#fff', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28
        }}>
          Click anywhere to enter immersive mode
        </div>
      )}
      <img src={headerImg} alt="Grocery Store" className="header-image" />
      <header className="grocery-header">
        <span role="img" aria-label="shop" style={{fontSize: '2rem', marginRight: 12}}>🛒</span>
        <span className="shop-title">FreshMarts Grocery Shop</span>
      </header>
      <div className="grocery-content">
        {error && <div className="error-msg">{error}</div>}
        <div className="table-container">
          <table className="product-table">
            <colgroup>
              <col style={{ width: '80%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
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
                    <td>{Number(product.price).toFixed(2)} €</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
