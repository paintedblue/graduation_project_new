import React, {useState, useEffect} from "react";
import {Text, View, TouchableOpacity, TextInput, Image, StyleSheet, BackHandler} from "react-native";
import BaseStyles from "../styles/BaseStyles"
import Header from "../components/TabBarButtons";
import SoundPlayer from 'react-native-sound-player';
import Slider from '@react-native-community/slider';
import { ScrollView } from "react-native-gesture-handler";

const LyricMakeScreen = ({route, navigation}) => {
    //개발용 더미 데이터!
    const exSongData = {
        "__v": 0, 
        "_id": "1", 
        "created_at": "2024-09-20T08:35:38.081Z", 
        "id": "임의 id", 
        "instrument": "Xylophone", 
        "lyric": "임시 가사입니다", 
        "songId": "2", 
        "title": "임시 제목입니다.", 
        "userId": "1"
    }
    //끝

    const {userId, requestData, type} = route.params;
    const [audioUrl, setAudioUrl] = useState(exSongData.id); 
    const [title, setTitle] = useState(exSongData.title); 
    const [lyric, setLyric] = useState(exSongData.lyric); 

    const maintitleText = "동요 재생"

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    useEffect(() => {
        console.log(requestData);
        console.log(type);
        if(type == "Gen"){
            setAudioUrl(`https://cdn.aimlapi.com/suno/audio/?item_id=${requestData.id}`);
        }
        else if (type == 'Play'){
            setAudioUrl(`https://cdn1.suno.ai/${requestData.id}.mp3`);
        }
        setTitle(requestData.title);
        setLyric(requestData.lyric);
        console.log("변경 시킴");
    },[requestData]);

    useEffect(() => {
        console.log(audioUrl);
        SoundPlayer.loadUrl(audioUrl);
    },[audioUrl]);

    useEffect(() => {
        const backAction = () => {
          // 오디오 중지
          SoundPlayer.stop(); // 또는 SoundPlayer.pause()
          return false; // 기본 뒤로가기 동작도 실행되게 함
        };
    
        // 뒤로가기 버튼 이벤트 등록
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
    
        // 컴포넌트가 unmount되면 이벤트 해제
        return () => backHandler.remove();
      }, []);

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

    const handlerhome = () => {
        if (navigation.canGoBack()) {
            SoundPlayer.stop();
            navigation.popToTop();
        }
    };
    return (
        <View style={[BaseStyles.flexContainer, {backgroundColor: '#A5BEDF'}]}>
            <Header></Header>
            <View style={[BaseStyles.contentContainer]}>
                    <View style={[BaseStyles.topContainer, {height:'auto'}]}>
                        <Text style={[BaseStyles.mainText, styles.title]}>{maintitleText}</Text>
                    </View>
                    <View style={[BaseStyles.middleContainer, {justifyContent:'flex-start'}]}>
                        <View style={[styles.frameTitle,{marginBottom:20}]}>
                            <Text style={[BaseStyles.text, {color:'#000', fontSize:25}]}>{title}</Text>
                        </View>
                        <View style={[styles.frameLyric]}>
                            <ScrollView style={[styles.scrollView]}>
                                <Text style={[BaseStyles.text, {color:'#000', fontSize:25}]}>{lyric}</Text>
                            </ScrollView>
                        </View>
                        
                    </View>
                    <View style={[BaseStyles.bottomContainer, {height:'auto'}]}>
                        {/* 현재 재생 시간 및 총 시간 */}
                        {type == 'Play'?
                        
                        <View style={styles.timeContainer}>
                            <Text>{formatTime(currentTime)}</Text>
                            <Text>{formatTime(duration)}</Text>
                        </View>
                        :
                        <></>
                        }
                        {/* 진행도 바 */}

                        {type == 'Play'?
                        
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
                        :
                        <></>
                        }
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
                        {type == 'Gen' ?
                        <TouchableOpacity style={[BaseStyles.button]} onPress={handlerhome}>
                            <Text style={[BaseStyles.text, {color:'#000', fontSize:20}]}> 홈으로 </Text>
                        </TouchableOpacity>
                        :
                        <></>
                        }
                        </View>
                    
                </View>
                
        </View>
    )
};

const styles = StyleSheet.create({
    title:{
        fontSize: 30,
        lineHeight:60,
    },
    subtitle:{
        fontSize: 18,
        lineHeight:30,
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
        flex:1,
        paddingVertical:40,
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
        marginVertical: 10,
      },
});

export default LyricMakeScreen;