const mongoose = require('mongoose');

const melodySchema = new mongoose.Schema({
    hummingFile: {
        type: String,  // 파일 경로 또는 URL
        required: true
    },
    processedFile: {
        type: String,  // 파일 경로 또는 URL
        required: true
    },
    melodyFile: {
        type: String,  // 파일 경로 또는 URL
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('melody', melodySchema);
