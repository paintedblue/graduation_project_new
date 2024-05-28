import React, { useEffect } from "react";
import { Text, View, Alert, Image, TouchableOpacity, ImageBackground } from "react-native";
import styles from '../styles/MainStyle';

const Home = ({ route, navigation }) => {
    let id = 1;

    useEffect(() => {

    }, []);

    const handleSavedSongsPress = () => {
        navigation.navigate('adminScreen');
    }


    const handleHabitScreenPress = () => {
        navigation.navigate('HabitScreen', {userId : id});
    }


    const handleStartPress = () => {
        navigation.navigate('LyricCreation', {userId : id});
    };

    
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/imgs/forest_illustration.jpeg')}
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.4 }}
            >
                <View style={styles.contentContainer}>
                    <View style={styles.imageContainer}>
                        <View style={styles.speechBubble}>
                            <Text style={styles.speechBubbleText}>안녕하세요, 저는 차차에요!</Text>
                            <Text style={styles.speechBubbleText}>꿈가락 마을에 온 걸 환영해요.</Text>
                            <Text style={styles.speechBubbleText}>우리 함께 나만의 동요를 만들러 떠나볼까요?</Text>
                        </View>
                        <Image
                            source={require('../assets/imgs/chacha.jpg')}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        {/* <TouchableOpacity style={[styles.button, styles.savedSongsButton]} onPress={handleSavedSongsPress}>
                            <Text style={styles.buttonText}>저장된 노래 듣기</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={[styles.button, styles.startButton]} onPress={handleStartPress}>
                            <Text style={styles.buttonText}>시작하기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.startButton]} onPress={handleHabitScreenPress}>
                            <Text style={styles.buttonText}>습관 개선 입력창</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default Home;
