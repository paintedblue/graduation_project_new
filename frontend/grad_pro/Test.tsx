import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Voice from '@wdragon/react-native-voice';;

const Test = () => {
  const [savedSongs, setSavedSongs] = useState([]);

  const [isRecord, setIsRecord] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const buttonLabel = isRecord ? 'Stop' : 'Start';
  const voiceLabel = text
    ? text
    : isRecord
    ? 'Say something...'
    : 'press Start button';

    const _onSpeechStart = () => {
      console.log('onSpeechStart');
      setText('');
    };
    const _onSpeechEnd = () => {
      console.log('onSpeechEnd');
    };
    const _onSpeechResults = (event) => {
      console.log('onSpeechResults');
      setText(event.value[0]);
    };
    const _onSpeechError = (event) => {
      console.log('_onSpeechError');
      console.log(event.error);
    };
  
    const _onRecordVoice = () => {

      Voice.start('ko-KR');
      setIsRecord(!isRecord);
    };
  
    useEffect(() => {
      Voice.onSpeechStart = _onSpeechStart;
      Voice.onSpeechEnd = _onSpeechEnd;
      Voice.onSpeechResults = _onSpeechResults;
      Voice.onSpeechError = _onSpeechError;
  
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, []);
  const handleStartPress = () => {
    Alert.alert("테스트 시작하기 버튼이 눌렸습니다!");
  };

  const handleSavedSongsPress = () => {
    fetch('http://localhost:3000/api/saved-songs')
      .then(response => response.json())
      .then(data => {
        setSavedSongs(data);
        Alert.alert("저장된 노래를 불러왔습니다!");
      })
      .catch(error => {
        Alert.alert("노래를 불러오는 중 오류가 발생했습니다.", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechBubbleText}>{voiceLabel}</Text>
            <Text style={styles.speechBubbleText}>위에서는 상태 및 인식한 문자 출력</Text>
          </View>
          <Image
            source={require('./chacha.jpg')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.savedSongsButton]} onPress={handleSavedSongsPress}>
            <Text style={styles.buttonText}>저장된 노래 듣기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.startButton]} onPress={_onRecordVoice}>
            <Text style={styles.buttonText}>시작하기</Text>
          </TouchableOpacity>
        </View>
        {savedSongs.length > 0 && (
          <View style={styles.songsList}>
            {savedSongs.map(song => (
              <Text key={song.id} style={styles.songText}>{song.title} by {song.artist}</Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  speechBubble: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    width: '80%',
    alignItems: 'center',
  },
  speechBubbleText: {
    color: '#000',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  button: {
    marginVertical: 5,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  startButton: {
    backgroundColor: '#FF7777',
  },
  savedSongsButton: {
    backgroundColor: '#3E68FA',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  songsList: {
    marginTop: 20,
    alignItems: 'center',
  },
  songText: {
    fontSize: 16,
    color: '#000',
  },
});

export default Test;
