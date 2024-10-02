const SongBase = require('../../models/songBase');
const Song = require('../../models/song');
const { v4: uuidv4 } = require('uuid'); // UUID로 songId 생성
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
        // nursery rhyme
        // 외부 API에 보낼 데이터 준비
        const songData = {
            prompt: `[Verse] ${currentSongBase.lyric}`,
            tags: `nursery rhyme, children song, ${currentSongBase.instrument} accompaniment, only the first verse, a short song`, // 예: 'children song, piano'
            title: currentSongBase.title,
            make_instrumental: false,
            wait_audio: true
        };
        
        // 외부 API 호출 (예: Suno API)
        const response = await fetch('https://api.aimlapi.com/generate/custom-mode', {
            method: 'POST',
            headers: {
                "Authorization": 'Bearer 955d6b2cb9594b61a07ba1c31b132381',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(songData)
        });

        const data = await response.json(); 
        console.log(data);
        // 첫 번째 응답 객체만 사용
        const firstSong = data[0];

        // 새로운 Song 저장
        const newSong = new Song({
            songId: uuidv4(), // 고유한 songId 생성
            userId: currentSongBase.userId,
            created_at: firstSong.created_at, // 생성된 시간
            id: firstSong.id, // 외부 API에서 반환된 ID
            lyric: currentSongBase.lyric, // 가사
            title: currentSongBase.title, // 제목
            instrument: currentSongBase.instrument // 악기 정보
        });

        // DB에 저장
        await newSong.save();

        // 로그 저장 (한국어 설명과 details 포함)
        await saveLog(userId, `'${newSong.title}' 제목의 동요를 생성했습니다.`, { songId: newSong.songId, id: newSong.id });

        res.status(200).json({ song: newSong.toObject() });

    } catch (error) {
        console.error('동요 생성 중 오류 발생:', error);
        res.status(500).json({ message: '동요 생성 중 오류 발생', error: error.message });
    }
};


// 동요 정보 조회 (GET 요청)
exports.getSong = async (req, res) => {
    const { userId} = req.params;

    try {
        // userId로 해당 유저의 모든 동요 조회
        const songs = await Song.find({ userId });

        if (songs.length === 0) {
            return res.status(404).json({ message: "해당 유저의 동요를 찾을 수 없습니다." });
        }

        // 동요 정보 리스트 반환
        const songList = songs.map(song => ({
            songId: song.songId,
            userId: song.userId,
            created_at: song.created_at,
            id: song.id,
            lyric: song.lyric,
            title: song.title,
        }));

        res.status(200).json({
            message: "유저의 동요를 찾았습니다.",
            songs: songList
        });

    } catch (error) {
        console.error('동요 조회 중 오류 발생:', error);
        res.status(500).json({
            message: '동요 조회 중 오류 발생',
            error: error.message
        });
    }
};

// 동요 삭제 (DELETE 요청)
exports.deleteSong = async (req, res) => {
    const { songId } = req.body; // songId를 URL에서 받아옴

    try {
        // songId로 해당 동요 찾기
        const song = await Song.findOne({ songId });

        if (!song) {
            return res.status(404).json({ message: "해당 동요를 찾을 수 없습니다." });
        }

        // 동요 삭제
        await Song.deleteOne({ songId });

        // 로그 저장 (삭제된 동요 제목 포함)
        await saveLog(song.userId, `'${song.title}' 제목의 동요가 삭제되었습니다.`, { songId: song.songId, id: song.id });

        res.status(200).json({ message: "동요가 성공적으로 삭제되었습니다." });

    } catch (error) {
        console.error('동요 삭제 중 오류 발생:', error);
        res.status(500).json({
            message: '동요 삭제 중 오류 발생',
            error: error.message
        });
    }
};
