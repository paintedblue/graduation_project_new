const mongoose = require('mongoose'); 
const { callGPTApi, createGPTPrompt } = require('../gptAPI/gptFunctions');
const SongBase = require('../../models/songBase');
const UserInfo = require('../../models/userInfo');
const { saveLog } = require('./logSaver'); 


exports.generateLyric = async (req, res) => {
    let { userId } = req.body;

    try {
        let preferences = await UserInfo.findOne({ userId: userId });
        console.log(preferences);
        if (!preferences) {
            return res.status(404).json({ message: "User not found" });
        };
        const gptResponse = await callGPTApi(preferences);
        console.log("gptResponse : " + gptResponse);

        let title, lyric;

        // JSON 형식인지 확인
        try {
            const parsedResponse = JSON.parse(gptResponse);
            title = parsedResponse.title;
            lyric = parsedResponse.lyric;
        } catch (e) {
            console.error('Response is not JSON, parsing manually');
            // JSON 형식이 아닌 경우 정규 표현식을 사용해 title과 lyric 추출
            const titleMatch = gptResponse.match(/"title"\s*:\s*"([^"]+)"/s);
            const lyricMatch = gptResponse.match(/"lyric"\s*:\s*"(.*?)"/s); 

            if (!titleMatch || !lyricMatch) {
                console.error('Invalid response format', { titleMatch, lyricMatch });
                throw new Error('Invalid response format');
            }

            title = titleMatch[1].trim();
            lyric = lyricMatch[1].trim().replace(/\\n/g, '\n').replace(/\./g, '\n');
        }


        console.log("title : " + title);
        console.log("lyric : " + lyric);

        // 사용자의 SongBase 문서 찾기 또는 새로 생성
        let songBase = await SongBase.findOne({ userId });
        if (!songBase) {
            // 새 SongBase 생성
            songBase = new SongBase({ userId, title, lyric });
        } else {
            // 기존 SongBase 업데이트
            songBase.title = title;
            songBase.lyric = lyric;
        }

        // DB에 저장
        await songBase.save();

        // 로그 저장 (한국어 설명과 details 포함)
        await saveLog(userId, `'${title}' 제목의 가사를 생성했습니다.`, { title, lyric });

        res.json({ title: songBase.title, lyric: songBase.lyric });

    } catch (error) {
        console.error('Error generating lyrics:', error);
        res.status(500).send(error.message);
    }
};


exports.getLyric = async (req, res) => {
    try {
        const { userId } = req.params;

        // 사용자의 SongBase 문서 찾기
        const userSong = await SongBase.findOne({ userId });
        if (!userSong) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(userSong);
    } catch (error) {
        console.error('Error getting lyrics:', error);
        res.status(500).json({ message: "Error getting lyrics", error });
    }
};
