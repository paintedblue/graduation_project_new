const userInfo = require('../../models/userInfo');

exports.saveHabit = async (req, res) => {
  try {
    const { userId, habit} = req.body;
    
    let user = await userInfo.findOne({ userId: userId });
    if (!user) {
        user = new userInfo({ userId: userId });
    }
    user["habit"] = habit;
    await user.save();

    res.status(201).json({ value: habit });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    res.status(500).json({ message: 'Error saving user preferences', error });
  }
};


exports.getHabit = async (req, res) => { 
    try {
      const { userId } = req.params;
      const user = await userInfo.findOne({ userId: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user.habit);
    } catch (error) {
      res.status(500).json({ message: "Error getting preferences", error });
    }
  };
