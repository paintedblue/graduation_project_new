import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert, Image, StyleSheet } from "react-native";
import BaseStyles from "../styles/BaseStyles";
import Header from "../components/TabBarButtons";
import VoiceUtil from '../utils/VoiceUtil';

const LyricQuestionScreen = ({ route, navigation }) => {
    const { userId, category, selectedCategories } = route.params;
    const [isRecording, setIsRecording] = useState(true);
    const [isDoneRecording, setIsDoneRecording] = useState(true);
    const [onRecording, setOnRecording] = useState(false);
    const [answer, setAnswer] = useState('');

    const commonSpeechText = ["마이크 버튼을 누르고 내가 좋아하는\n" + getCategoryText(category) + "을 말해보세요."];
    const commonSpeechEx = ["'내가 좋아하는 건 치킨!'\n'나는 치킨이 좋아'"];

    useEffect(() => {
        VoiceUtil.setSpeechResultCallback((results) => {
            setAnswer(results[0]);
            setIsDoneRecording(false);
            setOnRecording(false);
        });

        VoiceUtil.setErrorCallback((error) => {
            Alert.alert("인식하지 못했습니다. 다시 입력해주세요.");
            setOnRecording(false);
        });

        return () => {
            VoiceUtil.destroyRecognizer();
        };
    }, []);

    useEffect(() => {
        if (!isDoneRecording) {
            sendPreferenceToServer();
            setIsDoneRecording(true);

        }
    }, [isDoneRecording]);

    const sendPreferenceToServer = async () => {
        console.log("Sending request to server...");
        try {
            const response = await fetch('http://15.165.249.244:3000/api/preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId.toString(), field: category, value: answer })
            });
            console.log(category);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }
            const data = await response.json();
            console.log("Response data:", data);
            setAnswer(data.keyword);
            setIsRecording(false);
        } catch (error) {
            console.error("Error during fetch operation:", error.message);
            Alert.alert("Error", error.message);
        } finally {
            setIsDoneRecording(true);
            setOnRecording(false);
        }
    };

    const startSpeech = () => {
        if (!onRecording) {
            VoiceUtil.startListening();
            setOnRecording(true);
        } else {
            VoiceUtil.stopListening();
            setOnRecording(false);
        }
    };

    const reRecording = () => {
        setIsRecording(true);
    };

    const handlerNext = () => {
        const tempSelectedCategories = { ...selectedCategories, [category]: true };
        // Navigate to the next screen with updated categories
        navigation.navigate('LyricSelectScreen', { userId, tempSelectedCategories });
    };

    return (
        <View style={[BaseStyles.flexContainer, { backgroundColor: '#A5BEDF' }]}>
            <Header />

            <View style={[BaseStyles.contentContainer]}>
                <View style={[BaseStyles.topContainer, { justifyContent: 'center' }]}>
                    <View style={[BaseStyles.row]}>
                        <Frame categoryText={getCategoryLabel(category)} />

                        {/* Text "은 뭘까?" placed next to the frame */}
                        {isRecording ? (
                            <Text style={[BaseStyles.mainText, { fontSize: 25 }]}> 은 뭘까?</Text>
                        ) : (
                            <></>
                        )}
                    </View>
                </View>
                <View style={[BaseStyles.middleContainer]}>
                    {isRecording ? (
                        <View style={styles.imageContainer}>
                            {/* Recording Image */}
                            {onRecording ? (
                                <Image source={require('../assets/imgs/recording.png')} style={styles.recordImage} />
                            ) : (
                                <TouchableOpacity onPress={startSpeech}>
                                    <Image source={require('../assets/imgs/record.png')} style={styles.recordImage} />
                                </TouchableOpacity>
                            )}
                            {/* Common Speech Text below the recording image */}
                            <Text style={[BaseStyles.mainText, { fontSize: 22, lineHeight: 40 }]}>{commonSpeechText}</Text>
                            <Text style={[BaseStyles.text, { color: '#777', fontSize: 18, lineHeight: 35 }]}>{commonSpeechEx}</Text>
                        </View>
                    ) : (
                        <View style={styles.imageContainer}>
                            <View style={styles.AnswerBox}>
                                <Text style={[styles.categoryText, { marginVertical: 8 }]}>{`'${answer}'`}</Text>
                            </View>

                            <TouchableOpacity style={BaseStyles.row} onPress={reRecording}>
                                <Image source={require('../assets/imgs/ReRecord.png')} style={styles.reRecordingImage} />
                                <Text style={styles.reRecordingText}>다시 말할래요</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View style={[BaseStyles.bottomContainer, styles.bottomContainer]}>

                    {/* Back Button on the bottom left */}
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/imgs/backward.png')} style={styles.backButtonImage} />
                    </TouchableOpacity>

                    {/* Next Button on the bottom right */}
                    {isRecording ? (
                        <></>
                    ) : (
                        <TouchableOpacity style={[BaseStyles.button]} onPress={handlerNext}>
                            <Image source={require('../assets/imgs/right_arrow.png')} style={[styles.nextButton]} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 35,
        lineHeight: 90,
    },
    subtitle: {
        fontSize: 20,
        lineHeight: 40,
    },
    bottomContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    nextButton: {
        width: 90,
        height: 90,
    },
    backButton: {
        width: 90,
        height: 90,
    },
    backButtonImage: {
        width: 90,
        height: 90,
    },
    frameDiv: {
        width: 270,
        position: 'relative',
        borderRadius: 10,
        backgroundColor: '#f7f7f7',
        height: 63,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row',
    },
    categoryText: {
        width: 280,
        position: 'relative',
        fontSize: 21,
        letterSpacing: 2,
        lineHeight: 30,
        fontFamily: 'Jua-Regular',
        color: '#000',
        textAlign: 'center',
        height: 30,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 4,
    },
    AnswerBox: {
        backgroundColor: '#F5F5DC',
        borderRadius: 20,
        height: 300,
        width: 300,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordImage: {
        width: 150,
        height: 150,
    },
    reRecordingImage: {
        width: 50,
        height: 50,
        marginRight: 20,
    },
    reRecordingText: {
        fontSize: 22,
        fontFamily: 'Jua-Regular',
    },
});

const Frame = ({ categoryText }) => {
    return (
        <View style={styles.frameDiv}>
            <Text style={styles.categoryText}>{categoryText}</Text>
        </View>
    );
};

const getCategoryLabel = (category) => {
    const categoryLabels = {
        likeFood: "내가 좋아하는 음식 🍗",
        likeAnimalOrCharacter: "내가 좋아하는 캐릭터나 동물 🐰🐳",
        likeColor: "내가 좋아하는 색깔 🍀",
    };
    return categoryLabels[category] || "내가 좋아하는 카테고리";
};

const getCategoryText = (category) => {
    const categoryLabels = {
        likeFood: "음식",
        likeAnimalOrCharacter: "캐릭터나 동물",
        likeColor: "색깔",
    };
    return categoryLabels[category] || "카테고리";
};

export default LyricQuestionScreen;
