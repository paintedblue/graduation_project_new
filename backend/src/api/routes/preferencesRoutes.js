const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferencesController');

router.post('/', authController.verifyToken, preferencesController.savePreferences);  // POST 엔드포인트
router.get('/:userId', authController.verifyToken, preferencesController.getPreferences);  // GET 엔드포인트 추가

module.exports = router;
