import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity} from 'react-native';

const ViewDataScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answer, setAnswer] = useState('');
  const questions = ["주인공은 누구인가요?", "좋아하는 색깔은 무엇인가요?", "좋아하는 것은 무엇인가요?"];
  const fields = ["mainCharacter", "likeColor", "likeThing"];
  const [answers, setAnswers] = useState({ mainCharacter: '', likeColor: '', likeThing: '' });
  const views = ["주인공은", "좋아하는 색깔은", "좋아하는 것은"];
  const simulatedAnswers = ["나가 아니라 공룡","노란색이랑 빨간색","똥똥똥똥 쿠키쿠키쿠키쿠키"]; // 예시로 텍스트

  const handleRecordAnswer = async () => {
    console.log("handleRecordAnswer called");
    try {
        console.log("Sending request to server...");
        const response = await fetch('http://192.168.0.40:3000/api/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, field: fields[index], value: simulatedAnswers[index] })
        });

        if (!response.ok) {
            const errorText = await response.text();  // 서버에서 보낸 에러 메시지를 읽습니다.
            console.error("Server response not OK:", errorText);
            throw new Error(`Network response was not ok: ${errorText}`);
        }

        const data = await response.json();
        console.log("Response data:", data);
        setAnswer(data.value);
        setAnswers(prev => ({ ...prev, [fields[index]]: data.value }));
        setShowAnswer(true);
    } catch (error) {
        console.error("Error during fetch operation:", error.message);
        Alert.alert("Error", error.message);
    }
  };  

  const handleNext = async () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setShowAnswer(false);
      setAnswer('');
    } else {
      try {
        const response = await fetch(`http://192.168.0.40:3000/api/preferences/${userId}`);
        if (!response.ok) throw new Error('Network response was not ok.');

        const data = await response.json();
        navigation.navigate('summaryScreen', { answers: data });
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    }
  };

  const handleRetry = () => {
    setShowAnswer(false);
    setAnswer('');
  };

  return (
    <View style={styles.container}>
        {!showAnswer ? (
          <>
            <Text style={styles.question}>{questions[index]}</Text>
            <TouchableOpacity style={styles.button} onPress={handleRecordAnswer}>
              <Text style={styles.buttonText}>말하기</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.question}>{views[index]} <Text style={styles.answer}>{answer}</Text> 맞나요?</Text>
            <TouchableOpacity style={styles.button} onPress={handleRetry}>
                <Text style={styles.buttonText}>다시 말하기</Text>
              </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>다음</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  answer: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  }
});

export default ViewDataScreen;
