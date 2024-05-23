const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  userId : String
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
