const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB 연결 
mongoose.connect('mongodb://localhost:27017/grad_pro', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Hello World from Backend!');
});

ㅊapp.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
