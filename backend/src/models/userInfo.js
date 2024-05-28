const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
  userId: {
    //type: mongoose.Schema.Types.ObjectId,
    //ref: 'user',
    type: String,
    required: true
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
  habit: [{  // 배열로 선언
    type: String,
    required: false
  }]
});

module.exports = mongoose.model('userInfo', userInfoSchema);

