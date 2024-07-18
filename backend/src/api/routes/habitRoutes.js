const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const authController = require('../controllers/authController');

router.post('/', authController.verifyToken, habitController.saveHabit);  // POST 엔드포인트
router.get('/:userId', authController.verifyToken, habitController.getHabit);  // GET 엔드포인트 추가

module.exports = router;
