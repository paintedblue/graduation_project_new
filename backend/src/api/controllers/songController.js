const SongBase = require('../../models/songBase');
const Song = require('../../models/song');
const { v4: uuidv4 } = require('uuid'); // UUID로 songId 생성
const axios = require('axios'); // 외부 API 호출을 위해 사용
const { saveLog } = require('./logSaver'); 


// 동요 생성 (POST 요청)
exports.createSong = async (req, res) => {
    const { userId } = req.body;

    try {
        // userId로 SongBase 찾기
        const currentSongBase = await SongBase.findOne({ userId });

        if (!currentSongBase) {
            return res.status(404).json({ message: "해당 사용자의 곡을 찾을 수 없습니다." });
        }

        if (!currentSongBase.lyric || !currentSongBase.instrument) {
            return res.status(400).json({ message: "가사 또는 악기가 설정되지 않았습니다." });
        }

        // 외부 API에 보낼 데이터 준비
        const songData = {
            title: currentSongBase.title,
            lyric: currentSongBase.lyric,
            instrument: currentSongBase.instrument
        };

        // 외부 API 호출 (예: Suno API)
        

        // 외부 API로부터 생성된 동요 URL 받기
        const songLink = "example://Url";

        // 새로운 Song 저장
        const newSong = new Song({
            songId: uuidv4(), // 고유한 songId 생성
            userId: currentSongBase.userId,
            title: currentSongBase.title,
            lyric: currentSongBase.lyric,
            instrument: currentSongBase.instrument,
            songLink: songLink
        });

        // DB에 저장
        await newSong.save();

        // 로그 저장 (한국어 설명과 details 포함)
        await saveLog(userId, `'${newSong.title}' 제목의 동요를 생성했습니다.`, { songId: newSong.songId, songLink });


        res.status(200).json({ songId: newSong.songId, songLink });
    } catch (error) {
        console.error('동요 생성 중 오류 발생:', error);
        res.status(500).json({ message: '동요 생성 중 오류 발생', error: error.message });
    }
};


// 동요 정보 조회 (GET 요청)
exports.getSong = async (req, res) => {
    const { userId, songId } = req.params;

    try {
        // userId 및 songId로 Song 찾기
        const song = await Song.findOne({ userId, songId });

        if (!song) {
        return res.status(404).json({ message: "해당 동요를 찾을 수 없습니다." });
        }

        // 동요 정보 반환
        res.status(200).json({
            songId: song.songId,
            title: song.title,
            lyric: song.lyric,
            instrument: song.instrument,
            songLink: song.songLink
        });
    } catch (error) {
        console.error('동요 조회 중 오류 발생:', error);
        res.status(500).json({ message: '동요 조회 중 오류 발생', error: error.message });
    }
};

