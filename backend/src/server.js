const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // 환경 변수 사용을 위해 dotenv 모듈 사용
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

// Routes import
const preferencesRoutes = require('./api/routes/preferencesRoutes');
const habitRoutes = require('./api/routes/habitRoutes');
const lyricRoutes = require('./api/routes/lyricRoutes');
const instruRoutes = require('./api/routes/instruRoutes');
const songRoutes = require('./api/routes/songRoutes');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://jiyun:jiyun123@15.165.249.244:27017/grad_pro', {
  authSource: "admin"  // 인증을 사용하는 데이터베이스 이름
}).then(() => {
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
app.use('/api/habit', habitRoutes);
app.use('/api/lyric', lyricRoutes); 
app.use('/api/instrument', instruRoutes); 
app.use('/api/song', songRoutes); 

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
