const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    songId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,  // SongBase의 userId
        required: true
    },
    title: {
        type: String,  // 동요 생성 시점의 제목
        required: true
    },
    lyric: {
        type: String,  // 동요 생성 시점의 가사
        required: false
    },
    instrument: {
        type: String,  // 동요 생성 시점의 악기
        required: false
    },
    id: {
        type: String,
        required: true
    },
    created_at : {
        type: Date,  // Suno API에서 받은 created_at 값
        required: true // Suno API로부터 항상 제공되므로 필수 필드로 설정
    }
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;