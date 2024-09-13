import React, { useState, useEffect } from 'react';
import { Text, View, Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import VoiceUtil from '../utils/VoiceUtil';
import TabBarButtons from '../components/TabBarButtons';  // Your TabBar component

const Frame = ({ categoryText }) => {
  return (
    <View style={styles.frameDiv}>
      {/* Category text with emoji */}
      <Text style={styles.categoryText}>{categoryText} 🍗</Text>
    </View>
  );
};

const getCategoryLabel = (category) => {
  const categoryLabels = {
    likeFood: "내가 좋아하는 음식",
    likeAnimal: "내가 좋아하는 동물",
    likeColor: "내가 좋아하는 색깔",
    likeCharacter: "내가 좋아하는 캐릭터"
  };
  return categoryLabels[category] || "내가 좋아하는 카테고리";
};

const LyricCreation = ({ route, navigation }) => {
  const { userId, category } = route.params;
  const [isRecording, setIsRecording] = useState(true);
  const [isDoneRecording, setIsDoneRecording] = useState(true);
  const [onRecording, setOnRecording] = useState(false);
  const [answerCount, setAnswerCount] = useState(0);
  const [answer, setAnswer] = useState('');

  // Common prompt for all categories
  const commonSpeechText = ["마이크 버튼을 누르고 내가 좋아하는\n음식을 말해보세요."];

  useEffect(() => {
    VoiceUtil.setSpeechResultCallback((results) => {
      setAnswer(results[0]);
      setIsDoneRecording(false);
      setOnRecording(false);
    });

    VoiceUtil.setErrorCallback((error) => {
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
    try {
      const response = await fetch('http://15.165.249.244:3000/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId:"1", field:"likeFood", value: answer })
      });
      console.log(category);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      console.log("Response data:", data);
      setAnswer(data.keyword);
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
    if (answerCount + 1 < commonSpeechText.length) {
      setAnswerCount(answerCount + 1);
      setIsRecording(true);
    } else {
      navigation.navigate('SummaryScreen', { userId: userId });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#A5BEDF' }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.appTitle}>꿈가락</Text>
      </View>

      {/* TabBar */}
      <View style={styles.tabBarContainer}>
        <TabBarButtons />
      </View>

      {/* Selected Category Frame */}
      <View style={styles.contentContainer}>

        <View style={styles.TopContainer}>
        <View style={styles.row}>
          <Frame categoryText={getCategoryLabel(category)} />

          {/* Text "은 뭘까?" placed next to the frame */}
          {isRecording ?
          <Text style={styles.outsideFrameText}>은 뭘까?</Text>
          :
          <></>
          }
        </View>
        </View>


        <View style={styles.MiddleContainer}>
        {isRecording ? 
          <View style={styles.imageContainer}>
            {/* Recording Image */}
            {onRecording ? 
            <Image source={require('../assets/imgs/recording.png')} style={styles.recordImage} />
            :
              <TouchableOpacity onPress={startSpeech}>
              <Image source={require('../assets/imgs/record.png')} style={styles.recordImage} />
            </TouchableOpacity>
            }
            {/* Common Speech Text below the recording image */}
            <Text style={styles.subtitle}>{commonSpeechText[answerCount]}</Text>
          </View>
          : 
          <View style={styles.imageContainer}>
              <View style={styles.AnswerText}> 
                <Text style={styles.categoryText}>{"'"+answer+"'"}</Text>
              </View>

              
                <TouchableOpacity style={styles.row} onPress={reRecording}>
                  <Image source={require('../assets/imgs/ReRecord.png')} style={styles.rRImage} />
                  <Text style={styles.reRecordingText}>다시 말할래요</Text>
                </TouchableOpacity>
          </View>
        }
        
        {/* Custom Texts */}
        {isRecording ? 
        <View style={styles.customTextContainer}>
          <Text style={styles.customText}>내가 좋아하는 건 치킨!</Text>
          <Text style={styles.customText}>나는 치킨이 좋아</Text>
        </View>
        :
        <></>  
        }
        </View>
        {/* Right Arrow at the bottom */}
        <View style={styles.BottomContainer}>
          
          {isRecording ? <></>:
          <TouchableOpacity onPress={nextStep}>
            <Image source={require('../assets/imgs/right_arrow.png')} style={styles.arrowImage} />
          </TouchableOpacity>
          }
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  tabBarContainer: {
    marginBottom: 0, // Adjusted if needed to move content upwards
  },
  appTitle: {
    width: 200,
    position: 'relative',
    fontSize: 25,
    letterSpacing: -0.41,
    lineHeight: 50,
    fontFamily: 'Jua-Regular',
    backgroundColor: 'transparent',
    background: 'linear-gradient(90deg, #f7f0ac, #acf7f0 50%, #f0acf7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    display: 'inline-block',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',

  },
  TopContainer:{
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  MiddleContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BottomContainer:{
    height: '30%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  title: {
    fontFamily: "Jua-Regular",
    fontSize: 35,
    fontWeight: "400",
    lineHeight: 50,
    letterSpacing: -0.408,
    textAlign: "center",
    color: "white",
    backgroundColor: "transparent",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontFamily: "Jua-Regular",
    fontSize: 20,
    fontWeight: "200",
    lineHeight: 40,
    letterSpacing: -0.408,
    textAlign: "center",
    color: "white",
    backgroundColor: "transparent",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    paddingVertical: 10,
  },
  frameDiv: {
    width: 'auto', // Dynamic width based on text
    borderRadius: 10,
    backgroundColor: '#f7f7f7',
    height: 63,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryText: {
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 30,
    fontFamily: 'Jua-Regular',
    color: '#000',
    textAlign: 'center',
    marginVertical: 0,
  },
  outsideFrameText: {
    fontSize: 21,
    letterSpacing: 2,
    lineHeight: 30,
    fontFamily: 'Jua-Regular',
    color: '#fff',
    textAlign: 'center',
    marginLeft: 10,  // Space between the frame and the "은 뭘까?" text
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordImage: {
    width: 150,  // Increased width
    height: 150,  // Increased height
  },
  rRImage: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  reRecordingText: {
    fontSize: 18,
    fontFamily: 'Jua-Regular',
  },
  nextImage: {
    width: 50,
    height: 50,
  },
  customTextContainer: {
    width: 341,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customText: {
    fontSize: 18,
    letterSpacing: -0.2,
    lineHeight: 30,
    fontFamily: 'Jua-Regular',
    color: 'rgba(83, 83, 83, 0.5)',
    textAlign: 'center',
    marginVertical: 0,
  },
  
  arrowImage: {
    width: 70,  // Increased size
    height: 70, // Increased size
    margin:20
  },
  AnswerText: { //임시 적으로 만들어 놓은 확인 창
    backgroundColor: '#F5F5DC',
    borderRadius: 20,
    height: 300,
    width:300,
    margin:10,
    alignItems: 'center',
    justifyContent: 'flex-end',
  }
});

export default LyricCreation;
