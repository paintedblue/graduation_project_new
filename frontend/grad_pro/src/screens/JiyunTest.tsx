import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, TextInput} from 'react-native';

const JiyunTest = ({ route, navigation }) => {
    const { userId } = route.params;
    const [habit, setHabit] = useState(''); // 습관 상태
   
    const handleSaveHabit = async () => {
        console.log('버튼클릭');
        try {
            //const response = await fetch('http://192.168.0.106:3000/api/habbit', {
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
        <View style={styles.container}>
            <Text style={styles.question}>습관 입력해주세요</Text>
            <TextInput
                style={styles.input}
                placeholder="습관 입력 부분"
                value={habit}
                onChangeText={setHabit}
            />
            

            <TouchableOpacity style={styles.button} onPress={handleSaveHabit}>
                <Text style={styles.buttonText}>저장하기</Text>
            </TouchableOpacity>
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
    },
    input: {
        backgroundColor : 'yellow'
    }
  });
  
  export default JiyunTest;
  