import React, { useState, useEffect } from "react";
import { Text, View, Alert, StyleSheet } from "react-native";
import { BallIndicator } from 'react-native-indicators';
import BaseStyles from "../styles/BaseStyles";
import Header from "../components/TabBarButtons";

const LoadingScreen = ({ route, navigation }) => {
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
  };
  const exLyricData = {
    "lyric": "임시 가사 입니다",
    "title": "임시 제목입니다"
  };
  const { userId, type } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  const [songData, setSongData] = useState(exSongData);
  const [lyricData, setLyricData] = useState(exLyricData);

  const [mainText, setMainText] = useState("");
  const [centerMessage, setCenterMessage] = useState("");

  useEffect(() => {
    if (type === "Lyric") {
      setMainText("가사 생성중");
      setCenterMessage("조금만 기다리면 멋진 가사가\n짜잔~ 하고 나타날 거예요! 🚀");
      requestMakeLyric();
    } else if (type === "Music") {
      setMainText("동요 생성중");
      setCenterMessage("조금만 기다리면 멋진 동요가\n짜잔~ 하고 나타날 거예요! 🚀");
      requestMakeMusic();
    }
  }, []);

  const requestMakeLyric = async () => {
    console.log("서버) 가사 생성 요청...");
    setIsLoading(true);
    try {
      const response = await fetch('http://15.165.249.244:3000/api/lyric', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId.toString() })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      setIsLoading(false);
      navigation.replace('LyricMakeScreen', { userId, requestData: data });
    } catch (error) {
      console.error("Error during fetch operation:", error.message);
      Alert.alert("Error", error.message);
      navigation.goBack();
    }
  };

  const requestMakeMusic = async () => {
    console.log("서버) 동요 생성 요청...");
    setIsLoading(true);
    try {
      const response = await fetch('http://15.165.249.244:3000/api/song', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: userId.toString() })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      setIsLoading(false);
      const requestData = data.song;
      const type = "Gen";
      navigation.replace('PlayScreen', { userId, requestData, type });
    } catch (error) {
      console.error("Error during fetch operation:", error.message);
      Alert.alert("Error", error.message);
      navigation.goBack();
    }
  };

  return (
    <View style={[BaseStyles.flexContainer, { backgroundColor: '#A5BEDF', flex: 1 }]}>
      <Header />
      <View style={styles.topContainer}>
        <Text style={[BaseStyles.mainText, styles.title]}>{mainText}</Text>
      </View>
      <View style={[BaseStyles.contentContainer, styles.centerContainer]}>
        <View style={styles.indicatorContainer}>
          <BallIndicator style={styles.ballIndicator} size={40} color="#FFFFFF" />
          <Text style={[BaseStyles.mainText, styles.centerMessage]}>{centerMessage}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center',
  },
  indicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballIndicator: {
    position:'absolute',
    top : -80,
  },
  title: {
    fontSize: 30,
    lineHeight: 60,
  },
  centerMessage: {
    fontSize: 24,
  },
});

export default LoadingScreen;
