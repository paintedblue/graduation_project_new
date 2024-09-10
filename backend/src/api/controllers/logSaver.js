const Log = require('../../models/log');

const saveLog = async (userId, action, details = {}) => {
    try {
        await Log.create({
        userId,
        action,
        details
        });
        console.log(`로그 저장 완료: ${action}`);
    } catch (error) {
        console.error('로그 저장 중 오류 발생:', error);
    }
};

module.exports = {
    saveLog
};
