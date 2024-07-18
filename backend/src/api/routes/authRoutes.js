const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);  // 회원가입
router.post('/login', authController.login);  // 로그인
router.post('/logout', authController.logout);  // 로그아웃

module.exports = router;
