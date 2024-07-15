const mongoose = require('mongoose'); 
const { callGPTApi, createGPTPrompt } = require('../gptAPI/gptFunctions');
const song = require('../../models/song');
const lyric = require('../../models/lyric');
const userInfo = require('../../models/userInfo'); 


exports.generateLyric = async (req, res) => {
    let { userId } = req.body;

    if (typeof userId === 'number') {
        userId = userId.toString();
    }
    
    try {
        let preferences = await userInfo.findOne({ userId: userId });
        if (!preferences) {
            return res.status(404).json({ message: "User not found" });
        }
        const prompt = createGPTPrompt(preferences);
    
        const gptResponse = await callGPTApi(prompt);
        console.log("gptResponse : " + gptResponse);

        let title, lyrics;

        // JSON 형식인지 확인
        try {
            const parsedResponse = JSON.parse(gptResponse);
            title = parsedResponse.title;
            lyrics = parsedResponse.lyric;
        } catch (e) {
            console.error('Response is not JSON, parsing manually');
            // JSON 형식이 아닌 경우 정규 표현식을 사용해 title과 lyric 추출
            const titleMatch = gptResponse.match(/"title"\s*:\s*"([^"]+)"/s);
            const lyricMatch = gptResponse.match(/"lyric"\s*:\s*"(.*?)"\s*\n}/s);

            if (!titleMatch || !lyricMatch) {
                console.error('Invalid response format', { titleMatch, lyricMatch });
                throw new Error('Invalid response format');
            }

            title = titleMatch[1].trim();
            lyrics = lyricMatch[1].trim().replace(/\\n/g, '\n').replace(/\./g, '\n');
        }


        console.log("title : " + title);
        console.log("lyrics : " + lyrics);

        // 새로운 가사 문서 생성
        const newLyric = new lyric({ text: lyrics });
        await newLyric.save();

        // 사용자의 song 문서 찾기 또는 새로 생성
        let userSong = await song.findOne({ userId: userId });
        if (!userSong) {
            userSong = new Song({ userId, title, lyricsId: newLyric._id }); // 새 song 생성
        } else {
            userSong.title = title;
            userSong.lyricsId = newLyric._id;  // 기존 song 업데이트
        }

        // DB에 저장
        await userSong.save();

        res.json({ title: userSong.title, lyrics: userSong.lyrics });

    } catch (error) {
        console.error('Error generating lyrics:', error);
        res.status(500).send(error.message);
    }
};


exports.getLyric = async (req, res) => {
    try {
        const { userId } = req.params;
        const userSong = await song.findOne({ userId: userId }).populate('lyricsId');
        if (!userSong) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(userSong);
        } catch (error) {
        res.status(500).json({ message: "Error getting preferences", error });
    }
};

