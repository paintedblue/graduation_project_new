import React, { useState, useEffect } from 'react';
import { Text, View, Alert, Image, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import styles from '../styles/recordStyle';

const RecordScreen = ({ route, navigation }) => {
    const [Page, setPage] = useState(0);
    const [isRecording, setIsRecording] = useState(true);
    const [onRecording, setOnRecording] = useState(false);

    const nextPage = () => {
        setPage(Page+1);
    }

    const startRecord = () => {
        Alert.alert("아직 개발되지 않았습니다.")
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/imgs/subpage2.png')}
                style={styles.backgroundImage}
            >
                <Text style={customStyles.titleText}>멜로디 만들기</Text>

                {Page == 0 ?
                    <View style={styles.contentContainer}>
                        <View style={styles.imageContainer}>
                            <Text style={styles.QuestionText}>이제 가사에 맞는 멜로디를</Text>
                            <Text style={styles.QuestionText}>만들어볼까요?</Text>
                            <Text style={styles.QuestionText}>오늘은 oo이가 가수</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.nextContainer} onPress={nextPage}>
                                <Image source={require('../assets/imgs/right_arrow.png')} style={styles.nextImage} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    : Page == 1 ?
                        <View style={styles.contentContainer}>
                            <View style={styles.imageContainer}>
                                <Text style={styles.QuestionText}>준비가 되면 녹음 버튼을 누르고</Text>
                                <Text style={styles.QuestionText}>가사 없는 멜로디를 불러봐요~!</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={[styles.button, styles.startButton]} onPress={startRecord}>
                                    <Text style={styles.buttonText}>{onRecording ? "녹음중..." : "녹음하기"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <View style={styles.contentContainer}>
                            <View style={styles.playContainer}>
                                <Text style={styles.QuestionText}>잘했어요!</Text>
                                <Text style={styles.QuestionText}></Text>
                                <Text style={styles.QuestionText}>아래 초록 버튼을 누르면 내가 녹음</Text>
                                <Text style={styles.QuestionText}>한 멜로디를 들어볼 수 있어요.</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.highRowContainer} >
                                    <Image source={require('../assets/imgs/play.png')} style={styles.rRImage} />
                                    <Text style={styles.playText}>내 멜로디 들어보기</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.rowContainer} >
                                    <Image source={require('../assets/imgs/ReRecord.png')} style={styles.rRImage} />
                                    <Text style={styles.reRecordingText}>   다시 녹음하기</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.nextContainer}>
                                    <Image source={require('../assets/imgs/right_arrow.png')} style={styles.nextImage} />
                                </TouchableOpacity>
                            </View>
                        </View>
                }
            </ImageBackground>
        </View>
    );
};

const customStyles = StyleSheet.create({
  titleText: {
    fontFamily: 'Jua-Regular',
    fontSize: 34,
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
});

export default RecordScreen;
