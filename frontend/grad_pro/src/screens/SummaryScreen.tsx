import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ImageBackground, Keyboard, TouchableWithoutFeedback } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LyricsBox from './LyricsBox'; // Import the new LyricsBox component
import styles from '../styles/habitStyle'; // Import existing styles

const SummaryScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [lyrics, setLyrics] = useState('');
  const [title, setTitle] = useState(''); // Add state for title
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchLyrics();
  }, []);

  const fetchLyrics = async () => {
    setLoading(true); // Start loading state
    try {
      const response = await fetch('http://172.30.1.6:3000/api/lyric', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId.toString() })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      const formattedLyrics = data.lyrics.replace(/[,\.]/g, '\n');
      setLyrics(formattedLyrics);
      setTitle(data.title); // Set the title
      
    } catch (error) {
      console.error("Error during fetch operation:", error.message);
      Alert.alert("Error", "Unable to fetch lyrics. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  const reCreating = () => {
    fetchLyrics();
  };

  const nextStep = () => {
    navigation.navigate('RecordScreen', { userId: userId });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/imgs/subpage2.png')}
          style={customStyles.backgroundImage}
        >
          {!loading && <Text style={customStyles.titleText}>가사가 완성됐어요!</Text>}
          {loading ? (
            <View style={customStyles.contentContainer}>
              <Text style={customStyles.loadingText}>가사가 만들어지고 있어요...</Text>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <View style={customStyles.contentContainer}>
              <Text style={customStyles.songTitle}>{title}</Text>
              <LyricsBox lyrics={lyrics} />
              <TouchableOpacity style={customStyles.button} onPress={reCreating}>
                <LinearGradient
                  colors={['#56CCF2', '#2F80ED']}
                  style={customStyles.gradient}
                >
                  <Text style={customStyles.buttonText}>다시 만들기</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={customStyles.button} onPress={nextStep}>
                <LinearGradient
                  colors={['#56CCF2', '#2F80ED']}
                  style={customStyles.gradient}
                >
                  <Text style={customStyles.buttonText}>멜로디 만들러 가기</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const customStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  titleText: {
    fontFamily: 'Jua-Regular',
    fontSize: 28, // Adjusted font size
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  songTitle: {
    fontFamily: 'Jua-Regular',
    fontSize: 24, // Adjusted font size
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontFamily: 'Jua-Regular',
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
    padding: 20,
  },
  button: {
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
  },
  gradient: {
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Jua-Regular',
    color: 'white',
    fontSize: 22,
  },
});

export default SummaryScreen;
