const { callGPTApi, createGPTPrompt } = require('../gptAPI/gptFunctions');
const song = require('../../models/song');

exports.generateLyric = async (req, res) => {
    const { userId } = req.body;
    
    try {
        let preferences = await userInfo.findOne({ userId: userId });
        if (!preferences) {
            return res.status(404).json({ message: "User not found" });
        }
        const prompt = createGPTPrompt(preferences);
        console.log("prompt : " + prompt);

        const lyrics = await callGPTApi(prompt);
        console.log("gptResponse : " + lyrics);

        // 사용자의 song 문서 찾기 또는 새로 생성
        let userSong = await song.findOne({ userId: userId });
        if (!userSong) {
            userSong = new song({ userId, lyrics: lyrics }); // 새 song 생성, 가사 배열 초기화
        } else {
            userSong.lyrics.push(lyrics);  // 기존 song에 가사 추가
        }

        // DB에 저장
        await userSong.save();

        res.json({ lyrics });
    } catch (error) {
        console.error('Error generating lyrics:', error);
        res.status(500).send(error.message);
    }
};


exports.getLyric = async (req, res) => {
    try {
        const { userId } = req.params;
        const userSong = await song.findOne({ userId: userId });
        if (!userSone) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(userSone);
        } catch (error) {
        res.status(500).json({ message: "Error getting preferences", error });
    }
};

