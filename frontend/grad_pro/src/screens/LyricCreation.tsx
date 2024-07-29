import React, { useState, useEffect } from 'react';
import { Text, View, Alert, Image, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import VoiceUtil from '../utils/VoiceUtil';
import styles from '../styles/lyricCStyle';

const LyricCreation = ({ route, navigation }) => {
  const { userId } = route.params;
  const [isRecording, setIsRecording] = useState(true);
  const [isDoneRecording, setIsDoneRecording] = useState(true);
  const [onRecording, setOnRecording] = useState(false);
  const [answerCount, setAnswerCount] = useState(0);
  const [answer, setAnswer] = useState('');
  const fields = ["mainCharacter", "likeColor", "likeThing"];

  const speechTextList = ["지금부터 간단한 질문 몇가지를 할게요.\n내가 가장 좋아하는 동물을\n말해볼까요?", "좋아요!\n다음은 내가 가장 좋아하는 색깔을\n말해볼까요?", "잘했어요!\n다음은 내가 가장 좋아하는 것을\n말해볼까요?"];
  const confirmTextList = ["내가 좋아하는 동물은", "내가 좋아하는 색은", "내가 좋아하는 것은"];
  const guideTextList = ["글자를 누르면 읽어줘요!"];

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
      const response = await fetch('http://172.30.1.6:3000/api/preferences', {
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
        <View style={customStyles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image source={require('../assets/imgs/menu.png')} style={customStyles.menuImage} />
          </TouchableOpacity>
          <Text style={customStyles.titleText}>가사 만들기</Text>
        </View>
        {isRecording ? 
          <View style={styles.contentContainer}>
            <View style={styles.imageContainer}>
              <Text style={styles.QuestionText}>{speechTextList[answerCount]}</Text>
              <TouchableOpacity style={customStyles.speakerContainer}>
                <Image source={require('../assets/imgs/Voice.png')} style={customStyles.speakerImage} />
                <Text style={customStyles.speakerText}>{guideTextList[0]}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={customStyles.button} onPress={startSpeech}>
                <LinearGradient
                  colors={['#56CCF2', '#2F80ED']}
                  style={customStyles.gradient}
                >
                  <Text style={customStyles.buttonText}>{onRecording ? "말하는 중..." : "말하기"}</Text>
                </LinearGradient>
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
              <TouchableOpacity onPress={nextStep}>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the start (top)
    justifyContent: 'flex-start', // Justify content to the start (left)
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 10, // Add some horizontal padding to align menu properly
  },
  menuImage: {
    width: 30,
    height: 30,
    marginRight: 0, // Remove right margin
  },
  titleText: {
    fontFamily: 'Jua-Regular',
    fontSize: 34,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginLeft: 10, // Add margin to the left of the title
  },
  gradientButton: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    backdropFilter: 'blur(10px)', // Background blur (Note: This might not work on all devices and requires appropriate settings)
  },
  button: {
    marginVertical: 5, //버튼 상하 여백
    width: '80%', // 버튼의 너비를 부모요소의 80%로 설정
    alignSelf: 'center', //부모 컨테이너 안에서 버튼을 중앙에 정렬
  },
  gradient: {
    borderRadius: 5, // Rectangular shape with slight rounding
    paddingVertical: 5,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Jua-Regular',
    fontSize: 25, // Increased font size
    fontWeight: '400',
    lineHeight: 50,
    letterSpacing: -0.408,
    textAlign: 'center',
    color: 'white', // Text color set to white
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    paddingHorizontal: 20,
  },
  speakerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  speakerImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  speakerText: {
    fontFamily: 'Jua-Regular',
    fontSize: 16,
    color: 'white',
  },
});

export default LyricCreation;
