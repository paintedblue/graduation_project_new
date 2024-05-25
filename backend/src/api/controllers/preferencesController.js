const userInfo = require('../../models/userInfo');

// 사용자 선호 데이터를 저장하는 컨트롤러
exports.savePreferences = async (req, res) => {
  try {
    const { userId, field, value } = req.body;
    const characterToSave = value.slice(0, 1);  // 문자열에서 첫 글자를 추출
    
    
    let preferences = await userInfo.findOne({ userId: userId });
    if (!preferences) {
      preferences = new userInfo({ userId: userId });
    }
    preferences[field] = characterToSave;
    await preferences.save();

    res.status(201).json({ value: preferences[field] });
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
