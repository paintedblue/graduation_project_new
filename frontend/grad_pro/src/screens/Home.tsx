import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, ImageBackground, StyleSheet, Image } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/MainStyle';

const Home = ({ route, navigation }) => {
    const [showButtons, setShowButtons] = useState(false);
    const [showInitialImage, setShowInitialImage] = useState(true);

    let id = 1;

    useEffect(() => {

    }, []);

    const handleScreenPress = () => {
        if (!showButtons) {
            setShowButtons(true);
            setShowInitialImage(false);
        }
    }

    const handleSavedSongsPress = () => {
        navigation.navigate('AdminScreen');
    }

    const handleHabitScreenPress = () => {
        navigation.navigate('HabitScreen', { userId: id });
    }

    const handleStartPress = () => {
        navigation.navigate('LyricCreation', { userId: id });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.container} onPress={handleScreenPress}>
                <ImageBackground
                    source={require('../assets/imgs/mainpage1.png')}
                    style={styles.backgroundImage}
                >
                    <View style={styles.contentContainer}>
                        <View style={customStyles.imageContainer}>
                            {showInitialImage ? (
                                <Image
                                    source={require('/Users/changyoung/Desktop/myproject/grad_project/frontend/grad_pro/src/assets/imgs/title.png')}
                                    style={customStyles.titleImage}
                                />
                            ) : (
                                <Text style={customStyles.newText}>새로운 음악 만들기 모험을 떠나볼까요?</Text>
                            )}
                        </View>
                        {showButtons && (
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={customStyles.button} onPress={handleStartPress}>
                                    <LinearGradient
                                        colors={['#56CCF2', '#2F80ED']}
                                        style={customStyles.gradient}
                                    >
                                        <Text style={styles.buttonText}>시작하기</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity style={customStyles.button} onPress={handleHabitScreenPress}>
                                    <LinearGradient
                                        colors={['#56CCF2', '#2F80ED']}
                                        style={customStyles.gradient}
                                    >
                                        <Text style={styles.buttonText}>습관 개선 입력창</Text>
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

const customStyles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    titleImage: {
        width: 331, // Adjust width according to your need
        height: 140, // Adjust height according to your need
        resizeMode: 'contain', // Ensure the image scales correctly
    },
    newText: {
        fontFamily: 'Jua-Regular',
        fontSize: 35, // Increased font size
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
    button: {
        marginVertical: 10,
        width: '80%', // Adjust width according to your need
        alignSelf: 'center',
    },
    gradient: {
        borderRadius: 5, // Rectangular shape with slight rounding
        paddingVertical: 15,
        paddingHorizontal: 25,
        alignItems: 'center',
    },
});

export default Home;
