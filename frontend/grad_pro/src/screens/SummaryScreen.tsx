import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, Alert } from 'react-native';

const SummaryScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [lyrics, setLyrics] = useState('');
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`http://192.168.0.106:3000/api/preferences/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        setUserInfo(data);
        fetchLyrics(data); // 사용자 정보를 바탕으로 가사 요청
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch user info.");
    }
  };

  const fetchLyrics = async (userInfo) => {
    try {
      const response = await fetch('http://192.168.0.106:3000/api/lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLyrics(data.lyrics);
    } catch (error) {
      console.error("Error during fetch operation:", error.message);
      Alert.alert("Error", "Unable to fetch lyrics. Please try again.");
    }
  };

  const reCreating = () => {
    fetchLyrics(userInfo);
  };

  const nextStep = () => {
    Alert.alert("응애");
    //navigation.navigate('NextScreen');
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.backgroundImage}>
        <Text style={styles.lyricsText}>{lyrics}</Text>
        <TouchableOpacity style={styles.button} onPress={reCreating}>
          <Text style={styles.buttonText}>다시 만들어줘</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lyricsText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  }
});

export default SummaryScreen;

