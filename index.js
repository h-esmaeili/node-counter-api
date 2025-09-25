const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Counter API is running!',
    endpoints: {
      'POST /sum': 'Send a JSON array of numbers to get their sum'
    }
  });
});

app.post('/sum', (req, res) => {
  try {
    const { numbers } = req.body;
    
    // Validate input
    if (!Array.isArray(numbers)) {
      return res.status(400).json({
        error: 'Invalid input. Please send a JSON object with a "numbers" array.'
      });
    }
    
    // Check if all elements are numbers
    const allNumbers = numbers.every(num => typeof num === 'number' && !isNaN(num));
    if (!allNumbers) {
      return res.status(400).json({
        error: 'All elements in the numbers array must be valid numbers.'
      });
    }
    
    // Calculate sum
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    
    res.json({
      numbers: numbers,
      sum: sum,
      count: numbers.length
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}`);
  console.log(`📋 Test endpoint: POST http://localhost:${PORT}/sum`);
});

module.exports = app;
