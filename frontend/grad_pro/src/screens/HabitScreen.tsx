import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TextInput, ImageBackground, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import styles from '../styles/habitStyle';

const HabitScreen = ({ route, navigation }) => {
  // Route parameters에서 userId를 추출
  const { userId } = route.params;
  
  // 상태 변수 선언
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

  // 기본 습관 선택 상태 토글 함수
  const toggleHabit = (habit) => {
    setHabits({
      ...habits,
      [habit]: !habits[habit],
    });
  };

  // 사용자 정의 습관 추가 함수
  const handleCustomHabitSubmit = () => {
    if (customHabit.trim() !== '') {
      setCustomHabits([...customHabits, { text: customHabit, checked: false }]);
      setCustomHabit('');
      setShowInput(false);
      Keyboard.dismiss();
    }
  };

  // 사용자 정의 습관 선택 상태 토글 함수
  const toggleCustomHabit = (index) => {
    const newCustomHabits = [...customHabits];
    newCustomHabits[index].checked = !newCustomHabits[index].checked;
    setCustomHabits(newCustomHabits);
  };

  // 습관 저장 함수
  const handleSaveHabit = async () => {
    const selectedHabits = Object.keys(habits).filter(key => habits[key]);
    const selectedCustomHabits = customHabits.filter(habit => habit.checked).map(habit => habit.text);
    const allSelectedHabits = selectedHabits.concat(selectedCustomHabits);

    console.log('습관 저장 버튼클릭');
    try {
      const response = await fetch('http://172.30.1.6:3000/api/habit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId, habit: allSelectedHabits })
      });
      
      console.log("Status Code:", response.status);
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      Alert.alert("Success", "습관이 성공적으로 저장되었습니다!", [
        { text: "OK", onPress: () => navigation.navigate('home') }
      ]);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  console.log("HabitScreen Loaded");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/imgs/subpage2.png')}
          style={styles.backgroundImage}
        >
          {showInput && (
            <TouchableOpacity style={styles.backButton} onPress={() => setShowInput(false)}>
              <Image source={require('../assets/imgs/backward.png')} style={styles.backIcon} />
            </TouchableOpacity>
          )}
          <View style={[styles.contentContainer, showInput && styles.contentContainerCentered]}>
            {!showInput && (
              <>
                <Image 
                  source={require('../assets/imgs/HabitTitle.png')}
                  style={customStyles.titleImage}
                />
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

const customStyles = StyleSheet.create({
  titleImage: {
    width: 200, // Adjust width as needed
    height: 50, // Adjust height as needed
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 20, // Add margin to move the image down
  },
});

export default HabitScreen;
