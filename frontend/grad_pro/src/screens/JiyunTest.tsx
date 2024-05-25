import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, TextInput, ImageBackground, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const JiyunTest = ({ route, navigation }) => {
  const { userId } = route.params || {};
  const [habit, setHabit] = useState(''); // 습관 상태
  const [habits, setHabits] = useState({
    washHands: false,
    brushTeeth: false,
    tidyUp: false,
    eatAtTable: false,
  });
  const [customHabit, setCustomHabit] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [customHabits, setCustomHabits] = useState([]);

  const toggleHabit = (habit) => {
    setHabits({
      ...habits,
      [habit]: !habits[habit],
    });
  };

  const handleCustomHabitSubmit = () => {
    if (customHabit.trim() !== '') {
      setCustomHabits([...customHabits, { text: customHabit, checked: false }]);
      setCustomHabit('');
      setShowInput(false);
      Keyboard.dismiss();
    }
  };

  const toggleCustomHabit = (index) => {
    const newCustomHabits = [...customHabits];
    newCustomHabits[index].checked = !newCustomHabits[index].checked;
    setCustomHabits(newCustomHabits);
  };

  const handleSaveHabit = async () => {
    console.log('버튼클릭');
    try {
      const response = await fetch('http://192.168.62.68:3000/api/habbit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId, habit: habit })
      });
      
      console.log("Status Code:", response.status);
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      Alert.alert("Success", "습관이 성공적으로 저장되었습니다!");
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/imgs/forest_illustration.jpeg')}
          style={styles.backgroundImage}
          imageStyle={{ opacity: 0.3 }}
        >
          {showInput && (
            <TouchableOpacity style={styles.backButton} onPress={() => setShowInput(false)}>
              <Image source={require('../assets/imgs/backward.png')} style={styles.backIcon} />
            </TouchableOpacity>
          )}
          <View style={[styles.contentContainer, showInput && styles.contentContainerCentered]}>
            {!showInput && (
              <>
                <Text style={styles.title}>습관 개선 입력창</Text>
                <Text style={styles.subtitle}>아이가 개선했으면 하는{'\n'}생활 습관이 있나요?</Text>
              </>
            )}
            <View style={[styles.buttonContainer, showInput && styles.buttonContainerCentered]}>
              {!showInput && (
                <>
                  <TouchableOpacity style={styles.button} onPress={() => toggleHabit('washHands')}>
                    <CheckBox value={habits.washHands} onValueChange={() => toggleHabit('washHands')} />
                    <Text style={styles.buttonText}>손 씻기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => toggleHabit('brushTeeth')}>
                    <CheckBox value={habits.brushTeeth} onValueChange={() => toggleHabit('brushTeeth')} />
                    <Text style={styles.buttonText}>양치하기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => toggleHabit('tidyUp')}>
                    <CheckBox value={habits.tidyUp} onValueChange={() => toggleHabit('tidyUp')} />
                    <Text style={styles.buttonText}>이불 정리하기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => toggleHabit('eatAtTable')}>
                    <CheckBox value={habits.eatAtTable} onValueChange={() => toggleHabit('eatAtTable')} />
                    <Text style={styles.buttonText}>앉아서 밥 먹기</Text>
                  </TouchableOpacity>
                  {customHabits.map((habit, index) => (
                    <TouchableOpacity key={index} style={styles.button} onPress={() => toggleCustomHabit(index)}>
                      <CheckBox value={habit.checked} onValueChange={() => toggleCustomHabit(index)} />
                      <Text style={styles.buttonText}>{habit.text}</Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
              {showInput ? (
                <>
                  <TextInput
                    style={[styles.input, styles.button]}
                    placeholder="습관을 입력하세요"
                    placeholderTextColor="#999"
                    value={customHabit}
                    onChangeText={setCustomHabit}
                    onSubmitEditing={handleCustomHabitSubmit}
                    autoFocus={true}
                    keyboardType="default"
                    returnKeyType="done"
                  />
                  <TouchableOpacity style={styles.completeButton} onPress={handleCustomHabitSubmit}>
                    <Text style={styles.buttonText}>완료</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.button} onPress={() => setShowInput(true)}>
                  <Text style={styles.buttonText}>직접 입력</Text>
                </TouchableOpacity>
              )}
            </View>
            {!showInput && (
              <TouchableOpacity style={styles.completeButton} onPress={handleSaveHabit}>
                <Text style={styles.buttonText}>선택 완료</Text>
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
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
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  contentContainerCentered: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 35,
    marginTop: 40, // 상단 여백 추가
    fontFamily: 'Jua-Regular',
  },
  subtitle: {
    fontSize: 25,
    marginTop: 40, // 상단 여백 추가
    marginBottom: 40,
    fontFamily: 'Jua-Regular',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center', // 중간에 위치하도록 설정
    width: '70%',
  },
  buttonContainerCentered: {
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 20,
    fontFamily: 'Jua-Regular',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  completeButton: {
    backgroundColor: '#129F42',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
});

export default JiyunTest;
