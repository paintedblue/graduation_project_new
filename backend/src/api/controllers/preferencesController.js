const UserPreferences = require('../../models/userPreferences');

// 헬스 체크용 컨트롤러
exports.getPreferences = async (req, res) => {
  res.status(200).send({ status: 'OK', message: '/api/preferences get으로 실행' });
};

// 사용자 선호도 저장용 컨트롤러
exports.savePreferences = async (req, res) => {
  try {
    const { userId } = req.body;
    const preferences = new UserPreferences({ userId });

    const result = await preferences.save();
    console.log('Success');
    res.status(201).json(preferences);
  } catch (error) {
    console.error('Error saving user preferences:', error);
    res.status(500).json({ message: 'Error saving user preferences', error });
  }
};
