import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const App = () => {
  const [savedSongs, setSavedSongs] = useState([]);

  const handleStartPress = () => {
    Alert.alert("시작하기 버튼이 눌렸습니다!");
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
            <Text style={styles.speechBubbleText}>안녕하세요, 저는 차차에요!</Text>
            <Text style={styles.speechBubbleText}>꿈가락 마을에 온 걸 환영해요.</Text>
            <Text style={styles.speechBubbleText}>우리 함께 나만의 동요를 만들러 떠나볼까요?</Text>
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
          <TouchableOpacity style={[styles.button, styles.startButton]} onPress={handleStartPress}>
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

export default App;
