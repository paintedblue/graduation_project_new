const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // 추가

router.post('/', authController.verifyToken, lyricController.generateLyric); // 인증 미들웨어 추가
router.get('/:userId', authController.verifyToken, lyricController.getLyric);  // 인증 미들웨어 추가

module.exports = router;
