import React, { useState, useEffect } from 'react';
import { Text, View, Alert, Image, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import VoiceUtil from '../utils/VoiceUtil';
import styles from '../styles/lyricCStyle';

const LyricCreation = ({ route, navigation }) => {
  const { userId } = route.params;
  const [isRecording, setIsRecording] = useState(true);
  const [isDoneRecording, setIsDoneRecording ] = useState(true);
  const [onRecording, setOnRecording] = useState(false);
  const [answerCount, setAnswerCount] = useState(0);
  const [answer, setAnswer] = useState('');
  const fields = ["mainCharacter", "likeColor", "likeThing"];

  const speechTextList = ["지금부터 간단한 질문 몇가지를 할게요.\n내가 가장 좋아하는 동물을\n말해볼까요?", "좋아요!\n다음은 내가 가장 좋아하는 색깔을\n말해볼까요?", "잘했어요!\n다음은 내가 가장 좋아하는 것을\n말해볼까요?"];
  const confirmTextList = ["내가 좋아하는 동물은", "내가 좋아하는 색은", "내가 좋아하는 것은"];

  useEffect(() => {
    VoiceUtil.setSpeechResultCallback((results: string[]) => {
      setAnswer(results[0]);
      setIsDoneRecording(false);
      setOnRecording(false);
    });

    VoiceUtil.setErrorCallback((error: any) => {
      Alert.alert("인식하지 못했습니다. 다시 입력해주세요.");
      setOnRecording(false);
    });

    return () => {
      VoiceUtil.destroyRecognizer();
    };
  }, []);

  useEffect(() => {
    if (!isDoneRecording) {
      sendPreferenceToServer();
      setIsDoneRecording(true);
    }
  }, [answerCount, isDoneRecording]);

  const sendPreferenceToServer = async () => {
    console.log("Sending request to server...");
    console.log("field: ", fields[answerCount]);
    try {
      const response = await fetch(`http://192.168.0.29:3000/api/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, field: fields[answerCount], value: answer, answerCount })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      setAnswer(data);
      setIsRecording(false);
    } catch (error) {
      console.error("Error during fetch operation:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  const startSpeech = () => {
    if (!onRecording) {
      VoiceUtil.startListening();
      setOnRecording(true);
    } else {
      VoiceUtil.stopListening();
      setOnRecording(false);
    }
  };

  const reRecording = () => {
    setIsRecording(true);
  };

  const nextStep = () => {
    if (answerCount + 1 < speechTextList.length) {
      setAnswerCount(answerCount + 1);
      setIsRecording(true);
    } else {
      navigation.navigate('SummaryScreen', { userId: userId });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/imgs/subpage2.png')}
        style={styles.backgroundImage}
      >
        <Text style={customStyles.titleText}>가사 만들기</Text>
        {isRecording ? 
          <View style={styles.contentContainer}>
            <View style={styles.imageContainer}>
                <Text style={styles.QuestionText}>{speechTextList[answerCount]}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.startButton]} onPress={startSpeech}>
                <Text style={styles.buttonText}>{onRecording ? "말하는 중..." : "말하기"}</Text>
              </TouchableOpacity>
            </View>
          </View> 
          : 
          <View style={styles.contentContainer}>
            <View style={styles.imageContainer}>
                <Text style={styles.QuestionText}>{confirmTextList[answerCount]}</Text>
                <Text style={styles.AnswerText}>{answer}</Text>
                <Text style={styles.QuestionText}>맞나요?</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.rowContainer} onPress={reRecording}>
                <Image source={require('../assets/imgs/ReRecord.png')} style={styles.rRImage} />
                <Text style={styles.reRecordingText}>다시 말할래요</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextContainer} onPress={nextStep}>
                <Image source={require('../assets/imgs/right_arrow.png')} style={styles.nextImage} />
              </TouchableOpacity>
            </View>
          </View>
        }
      </ImageBackground>
    </View>
  );
};

const customStyles = StyleSheet.create({
  titleText: {
    fontFamily: 'Jua-Regular',
    fontSize: 34,
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
});

export default LyricCreation;
