const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferencesController');

router.post('/', preferencesController.savePreferences);  // POST 엔드포인트
router.get('/:userId', preferencesController.getPreferences);  // GET 엔드포인트 추가

module.exports = router;
