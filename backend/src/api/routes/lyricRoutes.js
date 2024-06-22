const express = require('express');
const router = express.Router();
const lyricController = require('../controllers/lyricController');

router.post('/', lyricController.generateLyric);
router.get('/:userId', lyricController.getLyric);  // GET 엔드포인트 추가

module.exports = router;
