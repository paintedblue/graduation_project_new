const userInfo = require('../../models/userInfo');
const { createExtractPrompt, extractKeyword, createGPTPrompt, callGPTApi } = require('../gptAPI/gptFunctions');
require('dotenv').config({ path: '../../../.env' }); // 환경 변수 사용을 위해 dotenv 모듈 사용

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/grad_pro").then(() => {
  console.log("MongoDB connected successfully!");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});


// 사용자 선호 데이터를 저장하는 컨트롤러
exports.savePreferences = async (req, res) => {
  console.log("선호도 fetch 받음");
  const { userId, field, value, count } = req.body;
  try {
    //const characterToSave = value.slice(0, 1);  // 문자열에서 첫 글자를 추출

    const prompt = createExtractPrompt(value);
    console.log("prompt : " + prompt);
    const gptResponse = await extractKeyword(prompt);
    console.log("gptResponse : " + gptResponse);

    let preferences = await userInfo.findOne({ userId: userId });
    if (!preferences) {
      preferences = new userInfo({ userId: userId });
    }
    preferences[field] = gptResponse;
    await preferences.save();

    res.status(201).json( preferences[field] );
  } catch (error) {
    console.error('Error saving user preferences:', error);
    res.status(500).json({ message: 'Error saving user preferences', error });
  }
};

// 사용자 선호 데이터 및 유저 데이터를 가져오는 컨트롤러
exports.getPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await userInfo.findOne({ userId: userId });
    if (!preferences) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(preferences);
  } catch (error) {
    res.status(500).json({ message: "Error getting preferences", error });
  }
};
