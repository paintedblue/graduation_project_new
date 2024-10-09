import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, TextInput, Alert, Image, StyleSheet } from "react-native";
import BaseStyles from "../styles/BaseStyles";
import Header from "../components/TabBarButtons";
import { ScrollView } from "react-native-gesture-handler";

const HabitScreen = ({route, navigation}) => {
    //개발용 더미 데이터!
    const exData = {"habits" :  [
        { "name": "편식", "selected": true },
        { "name": "늦잠", "selected": false },
        { "name": "책 읽기", "selected": false }
    ]};
    // 끝

    const { userId } = route.params;

    const [newHabit, setNewHabit] = useState(''); 
    const [habits, setHabits] = useState(exData.habits || []); // 초기값을 빈 배열로 설정
    const [popup, setpopup] = useState(false); 

    const maintitleText = "습관 입력하기";
    const subtitleText = "아이가 잘 해냈으면 하는 습관을 입력해주세요.\nex. 양치하기, 손씻기";

    // 첫 마운트 되었을 때 실행
    useEffect(() => {
        requestHabitList();
    }, []);

    const requestHabitList = async () => {
        console.log("서버) 습관 요청");
        try {
            const response = await fetch(`http://15.165.249.244:3000/api/habit/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`Network response was not ok`);
            }
            const data = await response.json();
            setHabits(data.habits || []); // 습관 목록이 없을 경우 빈 배열로 설정
        } catch (error) {
            console.error("Error during fetch operation:", error.message);
            Alert.alert("Error", error.message);
            setHabits([]); // 에러가 발생해도 빈 배열로 설정하여 렌더링 오류 방지
        }
    };

    const handleCustomHabitSubmit = async () => {
        if (newHabit.trim() === '') return;
        try {
            const response = await fetch('http://15.165.249.244:3000/api/habit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId.toString(), habitName: newHabit })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }
            const data = await response.json();
            console.log("Response data:", data);
            setHabits(data.habits || []); // 습관 목록이 없을 경우 빈 배열로 설정
        } catch (error) {
            console.error("Error during fetch operation:", error.message);
            Alert.alert("Error", error.message);
        } finally {
            setNewHabit('');
            setpopup(false);
        }
    };

    const handlerOpenPopUP = () => {
        setpopup(true);
    };

    const handlerClosePopUP = () => {
        setpopup(false);
    };

    const selectHabit = async(index) => {
        try {
            const response = await fetch('http://15.165.249.244:3000/api/habit/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId.toString(), habitName: habits[index].name })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }
            const data = await response.json();
            console.log("Response data:", data);
            setHabits(data.habits || []); // 습관 목록이 없을 경우 빈 배열로 설정
        } catch (error) {
            console.error("Error during fetch operation:", error.message);
            Alert.alert("Error", error.message);
        }
    };

    const handlerNext = async() => {
        if(habits.every(habit => habit.selected === false)){
            Alert.alert("습관을 하나 이상 체크해야 합니다.");
        }else{
            navigation.navigate('LyricSelectScreen',{userId});
        
        /*try {
            const response = await fetch('http://15.165.249.244:3000/api/preferences/reset', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId:userId.toString()})
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }
            const tempSelectedCategories = {
                likeFood: false,
                likeAnimalOrCharacter: false,
                likeColor: false,
            };
            navigation.navigate('LyricSelectScreen', {userId, tempSelectedCategories})
            } catch (error) {
            console.error("Error during fetch operation:", error.message);
            Alert.alert("Error", error.message);
            }
        }*/}
    }


    return (
        <View style={[BaseStyles.flexContainer, {backgroundColor: '#A5BEDF'}]}>
            <Header></Header>
            
            <View style={[BaseStyles.contentContainer]}>
                <View style={[BaseStyles.topContainer]}>
                    <Text style={[BaseStyles.mainText, styles.title]}>{maintitleText}</Text>
                    <Text style={[BaseStyles.mainText, styles.subtitle]}>{subtitleText}</Text>
                </View>
                <View style={[BaseStyles.middleContainer]}>
                    <TouchableOpacity style={[BaseStyles.button]} onPress={handlerOpenPopUP}>
                        <View style={[styles.habitBox]}>
                            <Text style={[BaseStyles.text, styles.addText]}>+</Text>
                        </View>
                    </TouchableOpacity>
                    <ScrollView style={[styles.scrollView]}>
                        {habits.map((habit, index) => (
                            <TouchableOpacity key={index} style={[BaseStyles.button]} onPress={() => selectHabit(index)}>
                                <View style={[styles.habitBox, habit.selected ? styles.selectBox:null]}>
                                    <Text style={[BaseStyles.text, {fontSize: 25, color:'#000'}]}>{habit.name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                
                <View style={[BaseStyles.bottomContainer, styles.bottomContainer]}>
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/imgs/backward.png')} style={styles.backButtonImage} />
                    </TouchableOpacity>
                    
                    {/* Next Button */}
                    <TouchableOpacity style={styles.backButton} onPress={handlerNext}>
                        <Image source={require('../assets/imgs/right_arrow.png')} style={styles.backButtonImage}></Image>
                    </TouchableOpacity>
                </View>
            </View>
            
            {popup ? 
            <View style={[styles.popupBg]}>
                <View style={[styles.popupWin]}>
                    <Text style={[BaseStyles.text, {fontSize:25}]}>습관 입력하기</Text>
                    <TextInput style={styles.inputField}
                    placeholder="습관을 입력하세요"
                    placeholderTextColor="#999"
                    value={newHabit}
                    onChangeText={setNewHabit}
                    autoFocus={true}
                    keyboardType="default"
                    returnKeyType="done"
                    />
                    <TouchableOpacity style={styles.completeButton} onPress={handleCustomHabitSubmit}>
                        <Text style={[BaseStyles.text, {color:'#000'}]}>완료</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={handlerClosePopUP}>
                        <Text style={[BaseStyles.text, {fontSize:30}]}>x</Text>
                    </TouchableOpacity>
                </View>
            </View>
            :
            <></>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        lineHeight:60,
    },
    subtitle: {
        fontSize: 18,
        lineHeight:30,

    },
    scrollView: {
        flex: 1,
    },
    habitBox: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 35,
        width: 250,
        height: 70,
        backgroundColor: '#FFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    addText: {
        fontSize: 35,
        color: "#000",
    },
    bottomContainer: {
        height: "15%",
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    popupBg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(150,150,150,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupWin: {
        borderRadius: 10,
        width: 300,
        height: 200,
        backgroundColor: '#0052D4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputField: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 5,
        width: '80%',
        marginVertical: 20,
    },
    completeButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 15,
    },
    selectBox: {
        backgroundColor: '#6E77FB'
    },
    backButton: {
        width: 90,
        height: 90,
    },
    backButtonImage: {
        width: 90,
        height: 90,
    }
});

export default HabitScreen;