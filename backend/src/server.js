const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Routes import
const preferencesRoutes = require('./api/routes/preferencesRoutes');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/grad_pro').then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Middleware
app.use(cors());  // Enable CORS
app.use(bodyParser.json());  // Body parser for JSON formatted requests
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files

// API routes usage
app.get('/', (req, res) => {
  res.send('JEVAL');
});

app.use('/api/preferences', preferencesRoutes);  // preferencesRoutes 사용

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500). send('Something broke!');
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
