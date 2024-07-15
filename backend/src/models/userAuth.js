const mongoose = require('mongoose');

const userAuthSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
    });

    // 비밀번호를 해시하여 저장하기 위한 미들웨어
    userAuthSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

const userAuth = mongoose.model('userAuth', userAuthSchema);

module.exports = userAuth;