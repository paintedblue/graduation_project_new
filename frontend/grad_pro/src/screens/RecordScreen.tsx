import React, { useState, useEffect } from 'react';
import { Text, View, Alert, Image, TouchableOpacity, ImageBackground, PermissionsAndroid, Platform } from 'react-native';
import AudioRecorderPlayer, { AudioEncoderAndroidType, AudioSourceAndroidType, AVEncodingOption, AVEncoderAudioQualityIOSType, AVModeIOSOption } from 'react-native-audio-recorder-player';
import styles from '../styles/recordStyle';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecordScreen = ({ route, navigation }) => {
    const [Page, setPage] = useState(0);
    //const [isRecording, setIsRecording] = useState(false);
    const [onRecording, setOnRecording] = useState(false);
    const [recordedFile, setRecordedFile] = useState('');

    useEffect(() => {
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ]);

                if (
                    grants['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('Permissions granted');
                } else {
                    console.log('All required permissions not granted');
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const nextPage = () => {
        setPage(Page + 1);
    };

    const prevPage = () => {
        setPage(Page - 1);
    };

    const startRecord = async () => {
        const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVModeIOS: AVModeIOSOption.measurement,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.max,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
            AVSampleRateKeyIOS: 44100,
        };

        try {
            console.log('Start recording...');
            const result = await audioRecorderPlayer.startRecorder(undefined, audioSet);
            audioRecorderPlayer.addRecordBackListener((e) => {
                setOnRecording(true);
                console.log('Recording: ', e.currentPosition);
            });
            setRecordedFile(result);
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    };

    const stopRecord = async () => {
        try {
            console.log('Stop recording...');
            const result = await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
            setOnRecording(false);
            console.log(result);
            setPage(Page + 1);
        } catch (err) {
            console.error(err);
        }
    };

    const startPlayback = async () => {
        try {
            console.log('Start playback...');
            const msg = await audioRecorderPlayer.startPlayer(recordedFile);
            audioRecorderPlayer.addPlayBackListener((e) => {
                console.log('Playing: ', e.currentPosition);
            });
            console.log(msg);
        } catch (err) {
            console.error(err);
        }
    };

    const stopPlayback = async () => {
        try {
            console.log('Stop playback...');
            const msg = await audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
            console.log(msg);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/imgs/subpage2.png')}
                style={styles.backgroundImage}
            >
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
                                <TouchableOpacity
                                    style={[styles.button, styles.startButton]}
                                    onPress={onRecording ? stopRecord : startRecord}
                                >
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
                                <TouchableOpacity style={styles.highRowContainer} onPress={startPlayback}>
                                    <Image source={require('../assets/imgs/play.png')} style={styles.rRImage} />
                                    <Text style={styles.playText}>내 멜로디 들어보기</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.rowContainer} onPress={prevPage}>
                                    <Image source={require('../assets/imgs/ReRecord.png')} style={styles.rRImage} />
                                    <Text style={styles.reRecordingText}>   다시 녹음하기</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.nextContainer} onPress={nextPage}>
                                    <Image source={require('../assets/imgs/right_arrow.png')} style={styles.nextImage} />
                                </TouchableOpacity>
                            </View>
                        </View>
                }
            </ImageBackground>
        </View>
    );
};

export default RecordScreen;
