const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true, // 이 필드가 고유해야 함을 명시
    required: true // 이 필드는 필수
  },
  mainCharacter: {
    type: String,
    required: false // 선택적 필드
  },
  likeColor: {
    type: String,
    required: false // 선택적 필드
  },
  likeThing: {
    type: String,
    required: false // 선택적 필드
  },
  habit: {
    type: String,
    require: false // 선택적 필드
  }
});

module.exports = mongoose.model('userInfo', userInfoSchema);
