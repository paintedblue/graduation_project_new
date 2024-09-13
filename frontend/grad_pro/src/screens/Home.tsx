import React, { useState } from "react";
import { Text, View, TouchableOpacity, ImageBackground, Image } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/MainStyle';

const Home = ({ navigation }) => {
    const [showButtons, setShowButtons] = useState(false);
    const [showInitialImage, setShowInitialImage] = useState(true);

    const userId = 1; // userId를 상수로 설정합니다.

    const handleScreenPress = () => {
        if (!showButtons) {
            setShowButtons(true);
            setShowInitialImage(false);
        }
    };

    const handleSavedSongsPress = () => {
        navigation.navigate('AdminScreen');
    };

    const handleHabitScreenPress = () => {
        navigation.navigate('HabitScreen', { userId });
    };

    const handleStartPress = () => {
        navigation.navigate('LyricSelectScreen', { userId }); // LyricCreation에서 LyricSelect로 변경
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.container} onPress={handleScreenPress}>
                <ImageBackground
                    source={require('../assets/imgs/mainpage1.png')}
                    style={styles.backgroundImage}
                >
                    <View style={styles.contentContainer}>
                        <View style={styles.imageContainer}>
                            {showInitialImage ? (
                                <Image
                                    source={require('../assets/imgs/title.png')}
                                    style={styles.titleImage}
                                />
                            ) : (
                                <Text style={styles.mainText}>
                                    {"새로운 음악 만들기\n모험을 떠나볼까요?"}
                                </Text>
                            )}
                        </View>
                        {showButtons && (
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={handleStartPress}>
                                    <LinearGradient
                                        colors={['#56CCF2', '#2F80ED']}
                                        style={styles.gradient}
                                    >
                                        <Text style={styles.buttonText}>저장된 노래</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={handleStartPress}>
                                    <LinearGradient
                                        colors={['#56CCF2', '#2F80ED']}
                                        style={styles.gradient}
                                    >
                                        <Text style={styles.buttonText}>시작하기</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        </View>
    );
};

export default Home;