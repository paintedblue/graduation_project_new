const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
  userId: {
    //type: mongoose.Schema.Types.ObjectId,
    type: String,
    //ref: 'userAuth',
    required: true
  },
  mainCharacter: {
    type: String
  },
  likeColor: {
    type: String
  },
  likeThing: {
    type: String
  },
  habit: [{  // 배열로 선언
    type: String
  }]
});

module.exports = mongoose.model('userInfo', userInfoSchema);

