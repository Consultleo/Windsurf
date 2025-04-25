const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();

// Trust the first proxy (required for secure cookies on Render)
app.set('trust proxy', 0); // Set to 0 for local development
const PORT = 4000;

app.use(cors({
  origin: [
    'http://localhost:3000', // shop frontend (local)
    'http://localhost:3001', // admin frontend (local)
    'https://freshmart-shop-frontend.windsurf.build', // shop frontend (production)
    'https://freshmart-admin-panel.windsurf.build' // admin frontend (production)
  ],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'groceryshop_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,      // set to false for localhost (HTTP)
    sameSite: 'lax'     // 'lax' is best for localhost
  }
}));

// Simple in-memory product store
let products = [];

// Simple admin credentials (for demo)
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'pass123';

// Auth middleware
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.isAdmin = true;
    return res.json({ success: true });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// Get all products
app.get('/products', (req, res) => {
  res.json(products);
});

// Add a new product (admin only)
app.post('/products', requireAdmin, (req, res) => {
  const { name, price } = req.body;
  if (!name || typeof price !== 'number') {
    return res.status(400).json({ error: 'Name and price (number) required' });
  }
  const product = { id: Date.now(), name, price };
  products.push(product);
  res.status(201).json(product);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
