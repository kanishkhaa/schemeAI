require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport');
const authRoutes = require('./routes/auth');

// Explicitly load Passport configuration
try {
  require('./config/passport');
  console.log('Passport configuration loaded successfully');
} catch (err) {
  console.error('Failed to load Passport configuration:', err.message);
}

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Government Schemes API');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Error at ${req.method} ${req.url}:`, err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});