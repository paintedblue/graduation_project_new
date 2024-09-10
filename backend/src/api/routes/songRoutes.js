const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

// 동요 생성 (POST 요청)
router.post('/', songController.createSong);

// 동요 정보 조회 (GET 요청)
router.get('/:userId/:songId', songController.getSong);

module.exports = router;