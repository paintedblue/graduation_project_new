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
        required: true
    },
    instrument: {
        type: String,  // 동요 생성 시점의 악기
        required: true
    },
    songLink: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;