const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');

router.post('/', habitController.saveHabit);  // POST 엔드포인트
router.get('/:userId', habitController.getHabit);  // GET 엔드포인트 추가

module.exports = router;
