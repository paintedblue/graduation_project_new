import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, BackHandler } from 'react-native';
import BaseStyles from '../styles/BaseStyles';
import Header from '../components/TabBarButtons';
import SoundPlayer from 'react-native-sound-player';
import { ScrollView } from 'react-native-gesture-handler';

const LyricMakeScreen = ({ route, navigation }) => {
  const exSongData = {
    __v: 0,
    _id: '1',
    created_at: '2024-09-20T08:35:38.081Z',
    id: '임의 id',
    instrument: 'Xylophone',
    lyric: '임시 가사입니다',
    songId: '2',
    title: '임시 제목입니다.',
    userId: '1',
    image_url: 'https://cdn.example.com/dummy-image.png' // 임시 이미지 URL
  };

  const { userId, requestData, type } = route.params || {};

  const [audioUrl, setAudioUrl] = useState(requestData ? requestData.id : exSongData.id);
  const [title, setTitle] = useState(requestData ? requestData.title : exSongData.title);
  const [lyric, setLyric] = useState(requestData ? requestData.lyric : exSongData.lyric);

  //////////////
  const [imageUrl, setImageUrl] = useState(requestData ? requestData.image_url : exSongData.image_url); // 이미지 URL 추가

  const maintitleText = '동요 재생';

  const [isPlaying, setIsPlaying] = useState(false);

  /////////////
  const [isLyricVisible, setIsLyricVisible] = useState(true); // 가사/이미지 토글 상태 추가

  useEffect(() => {
      if (type === 'Gen') {
        setMusic(`https://cdn.aimlapi.com/suno/audio/?item_id=${requestData.id}`);
      } else if (type === 'Play') {
        setMusic(`https://cdn1.suno.ai/${requestData.id}.mp3`);
      }
      setTitle(requestData.title);
      setLyric(requestData.lyric);
      ////////////////
      setImageUrl(requestData.image_url); // 이미지 URL 설정
    }, [requestData]);

    const setMusic = (url) => {
      setAudioUrl(url);
      SoundPlayer.loadUrl(url);
    };

  useEffect(() => {
    const backAction = () => {
      SoundPlayer.stop();
      return false;
  };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);


  const playPause = () => {
    if (isPlaying) {
      SoundPlayer.pause();
      setIsPlaying(false);
    } else {
      try {
        SoundPlayer.play();  // URL을 사용하여 음악 재생
        setIsPlaying(true);
      } catch (e) {
        console.log('Error playing the sound file', e);
      }
    }
  };
  
  //////////////////
  // 가사/이미지 토글 함수
  const toggleLyricImage = () => {
    setIsLyricVisible((prev) => !prev);
  };

  return (
    <View style={[BaseStyles.flexContainer, { backgroundColor: '#A5BEDF' }]}>
      <Header></Header>
      <View style={[BaseStyles.contentContainer]}>
        <View style={[BaseStyles.topContainer, { height: 'auto' }]}>
          <Text style={[BaseStyles.mainText, styles.title]}>{maintitleText}</Text>
        </View>
        <View style={[BaseStyles.middleContainer, { justifyContent: 'flex-start' }]}>
          <View style={[styles.frameTitle, { marginBottom: 20 }]}>
            <Text style={[BaseStyles.text, { color: '#000', fontSize: 25 }]}>{title}</Text>
          </View>

          {/* 가사/이미지 토글 버튼 */}
          <TouchableOpacity style={[styles.frameLyric]} onPress={toggleLyricImage}>
            {/* 가사 표시 */}
            {isLyricVisible ? (
              <ScrollView style={[styles.scrollView]}>
                <Text style={[BaseStyles.text, { color: '#000', fontSize: 25 }]}>{lyric}</Text>
              </ScrollView>
            ) : (
              // 이미지 표시
              <Image source={{ uri: imageUrl }} style={styles.songImage} resizeMode="contain" />
            )}
          </TouchableOpacity>

        </View>

        <View style={[BaseStyles.bottomContainer, styles.bottomContainer]}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../assets/imgs/backward.png')} style={styles.backButtonImage} />
          </TouchableOpacity>
          {/* Play Button */}
            <TouchableOpacity style={styles.playButton} onPress={playPause}>
            <Image source={isPlaying ? require('../assets/imgs/playing.png') : require('../assets/imgs/play.png')} style={styles.playButtonImage}/>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    lineHeight: 60,
  },
  scrollView: {
    flex: 1,
  },
  frameTitle: {
    width: 230,
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
    flexDirection: 'row',
  },
  frameLyric: {
    width: 300,
    position: 'relative',
    borderRadius: 10,
    backgroundColor: '#f7f7f7',
    flex: 1,
    paddingVertical: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
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
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  backButton: {
    width: 90,
    height: 90,
    marginRight: 60, // Reduce space between the buttons
  },
  backButtonImage: {
    width: 90,
    height: 90,
  },
  playButton: {
    alignItems: 'center', // Center the play button
  },
  playButtonImage: {
    width: 90,
    height: 90,
  },

  songImage: {
    width: 300,     // 이미지의 가로 크기
    height: 300,    // 이미지의 세로 크기
    borderRadius: 10,  // 이미지의 테두리 둥글게 만들기
    backgroundColor: '#f7f7f7', // 배경 색상 (이미지 로드 전 배경)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Android의 그림자 효과
  },
});

export default LyricMakeScreen;
