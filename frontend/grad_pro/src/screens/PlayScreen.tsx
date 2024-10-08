import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, BackHandler } from 'react-native';
import BaseStyles from '../styles/BaseStyles';
import Header from '../components/TabBarButtons';
import SoundPlayer from 'react-native-sound-player';
import Slider from '@react-native-community/slider';
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
  };

  const { userId, requestData, type } = route.params || {};

  const [audioUrl, setAudioUrl] = useState(requestData ? requestData.id : exSongData.id);
  const [title, setTitle] = useState(requestData ? requestData.title : exSongData.title);
  const [lyric, setLyric] = useState(requestData ? requestData.lyric : exSongData.lyric);

  const maintitleText = '동요 재생';

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    if (requestData) {
      if (type === 'Gen') {
        setAudioUrl(`https://cdn.aimlapi.com/suno/audio/?item_id=${requestData.id}`);
      } else if (type === 'Play') {
        setAudioUrl(`https://cdn1.suno.ai/${requestData.id}.mp3`);
      }
      setTitle(requestData.title);
      setLyric(requestData.lyric);
    } else {
      setAudioUrl(`https://cdn.aimlapi.com/suno/audio/?item_id=${exSongData.id}`);
      setTitle(exSongData.title);
      setLyric(exSongData.lyric);
    }
  }, [requestData]);

  useEffect(() => {
    if (audioUrl) {
      SoundPlayer.loadUrl(audioUrl);
    }
  }, [audioUrl]);

  useEffect(() => {
    const backAction = () => {
      SoundPlayer.stop();
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const getAudioInfo = async () => {
    try {
      const info = await SoundPlayer.getInfo();
      setDuration(info.duration);
    } catch (e) {
      console.log('No song playing', e);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isSeeking && isPlaying) {
        try {
          const info = await SoundPlayer.getInfo();
          setCurrentTime(info.currentTime);
          setProgress(info.currentTime / info.duration);
        } catch (e) {
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isSeeking]);

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
          <View style={[styles.frameLyric]}>
            <ScrollView style={[styles.scrollView]}>
              <Text style={[BaseStyles.text, { color: '#000', fontSize: 25 }]}>{lyric}</Text>
            </ScrollView>
          </View>
        </View>
        <View style={[BaseStyles.bottomContainer, styles.bottomContainer]}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../assets/imgs/backward.png')} style={styles.backButtonImage} />
          </TouchableOpacity>
          {/* Play Button */}
            <TouchableOpacity style={styles.playButton} onPress={() => setIsPlaying(!isPlaying)}>
            <Image source={isPlaying ? require('../assets/imgs/playing.png') : require('../assets/imgs/play.png')} style={styles.playButtonImage}/>
        </TouchableOpacity>
        </View>
        {type === 'Play' && (
          <>
            <View style={styles.timeContainer}>
              <Text>{formatTime(currentTime)}</Text>
              <Text>{formatTime(duration)}</Text>
            </View>
            <Slider
              style={styles.slider}
              value={progress}
              minimumValue={0}
              maximumValue={1}
              onSlidingStart={() => setIsSeeking(true)}
              onSlidingComplete={(value) => {
                setIsSeeking(false);
                const newTime = value * duration;
                SoundPlayer.seek(newTime);
                setCurrentTime(newTime);
              }}
              onValueChange={(value) => setProgress(value)}
            />
          </>
        )}
        {type === 'Gen' && (
          <TouchableOpacity style={[BaseStyles.button]} onPress={handlerhome}>
            <Text style={[BaseStyles.text, { color: '#000', fontSize: 20 }]}> 홈으로 </Text>
          </TouchableOpacity>
        )}
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
});

export default LyricMakeScreen;
