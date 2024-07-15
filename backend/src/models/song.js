const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userInfo',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    lyricsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lyric',
        required: true
    },
    melodyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'melody',
        default: null
    },
    finalSong: {
        type: String,  // 파일 경로 또는 URL
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('song', songSchema);
