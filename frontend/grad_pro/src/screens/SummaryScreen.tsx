import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';

const SummaryScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(true); // 로딩 상태 추가


  useEffect(() => {
    fetchLyrics();
  }, []);

  const fetchLyrics = async () => {
    setLoading(true); // 로딩 상태 시작
    try {
      const response = await fetch('http://192.168.0.106:3000/api/lyric', {
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
      
    } catch (error) {
      console.error("Error during fetch operation:", error.message);
      Alert.alert("Error", "Unable to fetch lyrics. Please try again.");
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const reCreating = () => {
    fetchLyrics();
  };

  const nextStep = () => {
    Alert.alert("응애");
    //navigation.navigate('NextScreen');
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View>
          <Text style={styles.loadingText}>가사가 만들어지고 있어요...</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View>
          <Text style={styles.lyricsText}>{lyrics}</Text>
          <TouchableOpacity style={styles.button} onPress={reCreating}>
            <Text style={styles.buttonText}>다시 만들어줘</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={nextStep}>
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lyricsText: {
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 24,
    color: 'black',
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

