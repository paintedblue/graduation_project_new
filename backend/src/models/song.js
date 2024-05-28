const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userInfo',
        required: true
    },
    lyrics: {
        type: String,
        required: true
    },
    melody: {
        type: String,
        required: false, // 멜로디 파일의 GCS URL
        validate: {
        validator: function(v) {
            return /^(http|https):\/\/storage.googleapis.com\/[^ "]+$/.test(v); // GCS URL 유효성 검사
        },
        message: props => `${props.value} is not a valid Google Cloud Storage URL!`
        }
    }
}, {
    timestamps: true  
});

module.exports = mongoose.model('song', songSchema);
