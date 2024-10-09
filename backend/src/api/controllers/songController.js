const SongBase = require('../../models/songBase');
const Song = require('../../models/song');
const { v4: uuidv4 } = require('uuid'); // UUID로 songId 생성
const { saveLog } = require('./logSaver'); 
require('dotenv').config({ path: '../../../.env' }); 


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

        // 이미지 생성을 위한 프롬프트 준비
        const imagePrompt = `
        너는 동요의 표지를 만드는 일러스트레이터야.
        '${currentSongBase.title}'라는 제목의 동요에 맞는 이미지를 만들어.
        가사 '${currentSongBase.lyric}'을 반영한 일러스트레이션이 필요해.
        이미지에 글자는 넣지 말고 그림만 그려.
        이미지는 어린이에게 적합하고, 즐겁고 친근감 있는 분위기를 가져야 해.
        `;
        
        // 동요와 이미지 생성을 동시에 시작
        const [songApiResponse, imageApiResponse] = await Promise.all([
            fetch('https://api.aimlapi.com/generate/custom-mode', {
                method: 'POST',
                headers: {
                    "Authorization": 'Bearer 955d6b2cb9594b61a07ba1c31b132381',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(songData)
            }),
            fetch('https://api.aimlapi.com/images/generations', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer 955d6b2cb9594b61a07ba1c31b132381'
                },
                body: JSON.stringify({
                    "prompt": imagePrompt.trim(),  // 프롬프트 문자열을 보내기
                    "model": "dall-e-3"
                }),
            })
        ]);

        // // 응답 상태 확인 및 JSON 파싱
        // if (!songApiResponse.ok) {
        //     console.error('동요 생성 API 오류:', songApiResponse.status, songApiResponse.statusText);
        //     return res.status(500).json({ message: '동요 생성 API 호출에 실패했습니다.' });
        // }

        // if (!imageApiResponse.ok) {
        //     console.error('이미지 생성 API 오류:', imageApiResponse.status, imageApiResponse.statusText);
        //     return res.status(500).json({ message: '이미지 생성 API 호출에 실패했습니다.' });
        // }

        const songDataResponse = await songApiResponse.json();
        const imageDataResponse = await imageApiResponse.json();


        // 응답에서 첫 번째 동요와 이미지 URL 추출
        const firstSong = songDataResponse[0];
        const imageUrl = imageDataResponse.data[0].url;
        
        // 콘솔에 API 응답 로깅
        console.log("동요 생성 API 응답:", firstSong);
        console.log("이미지 생성 API 응답:", imageUrl);

        // 새로운 Song 저장
        const newSong = new Song({
            songId: uuidv4(), // 고유한 songId 생성
            userId: currentSongBase.userId,
            created_at: firstSong.created_at, // 생성된 시간
            id: firstSong.id, // 외부 API에서 반환된 ID
            lyric: currentSongBase.lyric, // 가사
            title: currentSongBase.title, // 제목
            instrument: currentSongBase.instrument, // 악기 정보
            image_url: imageUrl
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
            return res.status(200).json({
                message: "동요를 찾을 수 없습니다." ,
                songs: []
            });
        }

        // 동요 정보 리스트 반환
        const songList = songs.map(song => ({
            songId: song.songId,
            userId: song.userId,
            created_at: song.created_at,
            id: song.id,
            lyric: song.lyric,
            title: song.title,
            image_url: song.image_url
        }));

        res.status(200).json({
            message: "동요를 찾았습니다.",
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
