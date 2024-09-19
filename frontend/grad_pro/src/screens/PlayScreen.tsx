import React, {useState, useEffect} from "react";
import {Text, View, TouchableOpacity, TextInput, Image, StyleSheet, Button} from "react-native";
import BaseStyles from "../styles/BaseStyles"
import Header from "../components/TabBarButtons";
import SoundPlayer from 'react-native-sound-player'
import Slider from '@react-native-community/slider';

const LyricMakeScreen = ({route, navigation}) => {
    //개발용 더미 데이터!
    const exData = {
        "title" :  "예시 제목입니다~~",
        "lyric" : "예시 가사 입니다\n가사가 좀 길수도 있어서\n 반복을 좀 하겠습니다.\n예시 가사 입니다\n가사가 좀 길수도 있어서\n 반복을 좀 하겠습니다."
    }
    //끝

    const {userId, requestData, type} = route.params;
    const [audioUrl, setAudioUrl] = useState("https://cdn1.suno.ai/b75bae35-8041-4d42-a1b1-4e226a241206.mp3"); 
    const [title, setTitle] = useState(exData.title); 
    const [lyric, setLyric] = useState(exData.lyric); 

    const maintitleText = "동요 재생"

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    useEffect(() => {
        if(type === "Gen"){
            setAudioUrl("https://cdn1.suno.ai/{requestData.id}.mp3")
        }
        else if (type === "Play"){
            setAudioUrl("https://cdn.aimlapi.com/suno/audio/?item_id={requestData.id}")
        }
        setTitle(requestData.title);
        setLyric(requestData.lyric);
    },[]);

    // 음악 재생/일시정지
    const playPause = () => {
        if (isPlaying) {
        SoundPlayer.pause();
        setIsPlaying(false);
        } else {
        try {
            SoundPlayer.play();
            setIsPlaying(true);
            getAudioInfo(); // 재생과 동시에 정보 가져오기
        } catch (e) {
            console.log('Cannot play the file', e);
        }
        }
    };

    // 재생 정보 가져오기
    const getAudioInfo = async () => {
        try {
        const info = await SoundPlayer.getInfo();
        setDuration(info.duration);
        } catch (e) {
        console.log('No song playing', e);
        }
    };

    // 현재 재생 시간 업데이트
    useEffect(() => {
        const interval = setInterval(async () => {
        if (!isSeeking && isPlaying) {
            try {
            const info = await SoundPlayer.getInfo();
            setCurrentTime(info.currentTime);
            setProgress(info.currentTime / info.duration); // 진행도 계산
            } catch (e) {
            console.log(e);
            clearInterval(interval);
            }
        }
        }, 1000); // 1초마다 업데이트

        return () => clearInterval(interval);
    }, [isPlaying, isSeeking]);

    // 시간 형식 변환 (mm:ss)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    //첫 마운트 되었을 때 실행
    useEffect(() => {
        //setAudioUrl(requestData.audio_url);
        SoundPlayer.loadUrl(audioUrl);
        console.log(audioUrl);
    },[requestData]);

    return (
        <View style={[BaseStyles.flexContainer, {backgroundColor: '#A5BEDF'}]}>
            <Header></Header>
            <View style={[BaseStyles.contentContainer]}>
                    <View style={[BaseStyles.topContainer, {justifyContent:'center'}]}>
                        <Text style={[BaseStyles.mainText, styles.title]}>{maintitleText}</Text>
                        <View style={[styles.frameTitle]}>
                            <Text style={[BaseStyles.text, {color:'#000', fontSize:25}]}>{title}</Text>
                        </View>
                    </View>
                    <View style={[BaseStyles.middleContainer, {justifyContent:'flex-start'}]}>
                        <View style={[styles.frameLyric]}>
                            <Text style={[BaseStyles.text, {color:'#000', fontSize:25}]}>{lyric}</Text>
                        </View>
                        
                    </View>
                    <View style={[BaseStyles.bottomContainer]}>
                        {/* 현재 재생 시간 및 총 시간 */}
                        <View style={styles.timeContainer}>
                            <Text>{formatTime(currentTime)}</Text>
                            <Text>{formatTime(duration)}</Text>
                        </View>

                        {/* 진행도 바 */}
                        <Slider
                            style={styles.slider}
                            value={progress}
                            minimumValue={0}
                            maximumValue={1}
                            onSlidingStart={() => setIsSeeking(true)} // 슬라이더 조작 시작
                            onSlidingComplete={(value) => {
                            setIsSeeking(false); // 슬라이더 조작 종료
                            const newTime = value * duration;
                            SoundPlayer.seek(newTime);
                            setCurrentTime(newTime);
                            }}
                            onValueChange={(value) => setProgress(value)}
                        />

                        {/* 재생 및 일시정지 버튼 */}
                        {isPlaying ? 
                        <TouchableOpacity style={[BaseStyles.button]} onPress={playPause}>
                            <Image source={require('../assets/imgs/play.png')} style={[styles.nextButton]}></Image>
                        </TouchableOpacity>
                        : 
                        <>
                        <TouchableOpacity style={[BaseStyles.button]} onPress={playPause}>
                            <Image source={require('../assets/imgs/play.png')} style={[styles.nextButton]}></Image>
                        </TouchableOpacity>
                        </>}

                        </View>
                    
                </View>
                
        </View>
    )
};

const styles = StyleSheet.create({
    title:{
        fontSize: 35,
        lineHeight:90,
    },
    subtitle:{
        fontSize: 20,
        lineHeight:40,
    },
    scrollView:{
        flex:1,
    },
    frameTitle: {
        width: 230, // Increased the width of the frame
        position: 'relative',
        borderRadius: 10,
        backgroundColor: '#f7f7f7',
        height: 63,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row', // To position the text and checkmark in a row
    },
    frameLyric: {
        width: 300, // Increased the width of the frame
        position: 'relative',
        borderRadius: 10,
        backgroundColor: '#f7f7f7',
        height: "90%",
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row', // To position the text and checkmark in a row
    },
    categoryText: {
        width: 220,
        position: 'relative',
        fontSize: 21,
        letterSpacing: 2,
        lineHeight: 30,
        fontFamily: 'Jua-Regular',
        color: '#000',
        textAlign: 'center',
        height: 30,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 4,
    },

    nextButton:{
        width:90,
        height:90,
    },
    slider: {
        width: 300,
        height: 40,
        marginBottom: 0,
      },
      timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 300,
        marginBottom: 10,
      },
});

export default LyricMakeScreen;