// src/screens/LyricCreation.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, Alert, Image, TouchableOpacity, ImageBackground,StyleSheet  } from 'react-native';
import VoiceUtil from '../utils/VoiceUtil';

const LyricCreation = () => {
  const [isRecording, setIsRecording] = useState(true);
  const [onRecording, setOnRecording] = useState(false);
  const [answerCount, setAnswerCount] = useState(0);
  const [answer, setAnswer] = useState('');

  const speechTextList = ["지금부터 간단한 질문 몇가지를 할게요.\n내가 가장 좋아하는 동물을\n말해볼까요?", "좋아요!\n다음은 내가 가장 좋아하는 색깔을\n말해볼까요?", "잘했어요!\n다음은 내가 가장 좋아하는 것을\n말해볼까요?"]
  const confirmTextList = ["내가 좋아하는 동물은", "내가 좋아하는 색은", "내가 좋아하는 것은"]

  useEffect(() => {
    VoiceUtil.setSpeechResultCallback((results: string[]) => {
      setAnswer(results[0]);
      setIsRecording(false);
      setOnRecording(false);
    });

    VoiceUtil.setErrorCallback((e:any) => {
      setOnRecording(true);
    });

    return() => {
      VoiceUtil.destroyRecognizer();
    };
  }, []);

  const startSpeech = () => {
    if(!onRecording){
      VoiceUtil.startListening();
      setOnRecording(true);
    }
  }
  const reRecording = () => {
    setIsRecording(true);
  }
  const nextStep = () => {
    if(answerCount + 1 < speechTextList.length){
      setAnswerCount(answerCount + 1);
      setIsRecording(true);
      answerList.push(answer);
    }else{
      Alert.alert("끝났어 뭘 바래")
    }
  }


  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/imgs/forest_illustration.jpeg')}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.3 }}
      >
        {isRecording ? 
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
              <Text style={styles.QuestionText}>{speechTextList[answerCount]}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.startButton]} onPress={startSpeech}>
              <Text style={styles.buttonText}>{onRecording?"말하는 중...": "말하기"}</Text>
            </TouchableOpacity>
          </View>
        </View> 
        : 
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
              <Text style={styles.QuestionText}>{confirmTextList[answerCount]}</Text>
              <Text style={styles.QuestionText}>{answer}</Text>
              <Text style={styles.QuestionText}>맞나요?</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.rowContainer} onPress={reRecording}>
              <Image source={require('../assets/imgs/ReRecord.png')} style = {styles.rRImage} />
              <Text style={styles.reRecordingText}>다시 말할래요</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextContainer} onPress={nextStep}>
              <Image source={require('../assets/imgs/right_arrow.png')} style = {styles.nextImage} />
            </TouchableOpacity>
          </View>
        </View>
        }
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20, // 위아래 여백 추가
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 200, // 위로 더 이동
  },
  rRImage: {
    width: 50,
    height: 50,
  },
  nextImage: {
    width: 80,
    height: 80,
  },
  rowContainer:{
    flexDirection: 'row', 
    alignItems:'center',
    marginBottom: 80,
  },
  QuestionText: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Jua-Regular',
    fontSize: 25,
    lineHeight:50,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 40,
  },
  nextContainer: {
    width: '90%',
    alignItems:'flex-end',
    marginBottom: 40,
  },
  button: {
    marginVertical: 5,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '50%',
  },
  startButton: {
    backgroundColor: '#129F42',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Jua-Regular',
  },
  reRecordingText: {
    color: '#254A7B',
    fontSize: 25,
    fontFamily: 'Jua-Regular',
    marginLeft: 10,
  },
});

export default LyricCreation;
