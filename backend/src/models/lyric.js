const mongoose = require('mongoose');

const lyricSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('lyric', lyricSchema);