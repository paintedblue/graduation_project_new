import React, { useState, useEffect, useContext } from "react";
import { Text, View,TextInput, TouchableOpacity, Alert, Image, StyleSheet } from "react-native";
import BaseStyles from "../styles/BaseStyles";
import Header from "../components/TabBarButtons";
import VoiceUtil from '../utils/VoiceUtil';
import { SelectedCategoriesContext } from "../contexts/SelectedCategoriesContext";
import { BallIndicator } from 'react-native-indicators';

const LyricQuestionScreen = ({ route, navigation }) => {
    const { selectedCategories, updateCategory } = useContext(SelectedCategoriesContext);
    const { userId, category} = route.params;
    const [isRecording, setIsRecording] = useState(true); // 녹음 하는 페이지인가~
    const [isDoneRecording, setIsDoneRecording] = useState(true); // 녹음 이 끝나서 서버에 보낼것인가~
    const [onRecording, setOnRecording] = useState(false); // 녹음 중인가~
    const [answer, setAnswer] = useState('');
    const [popup, setpopup] = useState(false); 
    const [imageUrl, setImageUrl] = useState('https://picsum.photos/400/400');
    const [newAnswer, setNewAnswer] = useState('');

    const commonSpeechText = ["마이크 버튼을 누르고 내가 좋아하는\n" + getCategoryText(category) + "을 말해보세요."];
    const commonSpeechEx = ["'내가 좋아하는 건 치킨!'\n'나는 치킨이 좋아'"];
    useEffect(() => {
        VoiceUtil.setSpeechResultCallback((results) => {
            setAnswer(results[0]);
            setIsDoneRecording(false);
            //setOnRecording(false);
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
        handlerOpenPopUP();
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
            setImageUrl(data.image_url);
            setIsRecording(false);
        } catch (error) {
            console.error("Error during fetch operation:", error.message);
            Alert.alert("Error", error.message);
        } finally {
            setOnRecording(false);
            handlerClosePopUP();
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

    const handlerNext = () => {
        updateCategory(category);
        // Navigate to the next screen with updated categories
        navigation.navigate('LyricSelectScreen', { userId });
    };

    const reRecording = () => {
        setIsRecording(true);
    };
    
    const handlerOpenPopUP = () => {
        setpopup(true);
    };

    const handlerClosePopUP = () => {
        setpopup(false);
    };

    const handlerInputSubmit = async() => {
        console.log("Sending request to server...");
        handlerOpenPopUP();
        try {
            const response = await fetch('http://15.165.249.244:3000/api/preferences/direct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId.toString(), field: category, value: newAnswer })
            });
            console.log(category);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }
            const data = await response.json();
            console.log("Response data:", data);
            setAnswer(data.keyword);
            setImageUrl(data.image_url);
            setIsRecording(false);
        } catch (error) {
            console.error("Error during fetch operation:", error.message);
            Alert.alert("Error", error.message);
        } 
        finally{
            setNewAnswer("");
            handlerClosePopUP();
        }
      };

    return (
        <View style={[BaseStyles.flexContainer, { backgroundColor: '#A5BEDF' }]}>
            <Header />

            <View style={[BaseStyles.contentContainer]}>
                <View style={[BaseStyles.topContainer, { justifyContent: 'center'}]}>
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
                        <View style={[styles.imageContainer]}>
                            {/* Recording Image */}
                            {onRecording ? (
                                <TouchableOpacity onPress={startSpeech}>
                                <Image source={require('../assets/imgs/recording.png')} style={styles.recordImage} />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={startSpeech}>
                                    <Image source={require('../assets/imgs/record.png')} style={styles.recordImage} />
                                </TouchableOpacity>
                            )}
                            
                            {/* Common Speech Text below the recording image */}
                            <Text style={[BaseStyles.mainText, { fontSize: 22, lineHeight: 40 }]}>{commonSpeechText}</Text>
                            <Text style={[BaseStyles.text, { color: '#777', fontSize: 18, lineHeight: 35 }]}>{commonSpeechEx}</Text>


                            <TextInput
                                style={[styles.categoryText, styles.inputField ,{marginTop:20, fontSize:24}]}
                                placeholder="직접 입력하기"
                                placeholderTextColor="#999"
                                value={newAnswer}
                                autoFocus={false}
                                onChangeText={setNewAnswer}
                                keyboardType="default"
                                returnKeyType="done"
                            />
                        </View>
                    ) : (
                        <View style={[styles.imageContainer,{justifyContent:"flex-start"}]}>
                            <View style={styles.AnswerBox}>
                                <Text style={[styles.categoryText,{ marginVertical: 20}]}>{`AI가 만들어준 사진이에요.`}</Text>
                                <Image source={{ uri: imageUrl }} style={[{width:240, height:240}]}/>


                                <Text style={[styles.categoryText,{ marginVertical: 20}]}>{`'${answer}'`}</Text>
                                
                            </View>

                        </View>
                    )}
                </View>
                <View style={[BaseStyles.bottomContainer, styles.bottomContainer]}>

                    {/* Back Button on the bottom left */}
                    <TouchableOpacity style={styles.backButton} onPress={isRecording? () => navigation.goBack():reRecording}>
                        <Image source={require('../assets/imgs/backward.png')} style={styles.backButtonImage} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[BaseStyles.button]} onPress={isRecording? handlerInputSubmit: handlerNext}>
                            <Image source={require('../assets/imgs/right_arrow.png')} style={[styles.nextButton]} />
                        </TouchableOpacity>
                    {/* Next Button on the bottom right */}
                    
                </View>
            </View>
            {popup && (
                <View style={[styles.popupBg, { backgroundColor: '#A5BEDF', flex: 1 }]}>
                <Header />
                <View style={[BaseStyles.topContainer,{height:'10%'}]}>
                  <Text style={[BaseStyles.mainText, styles.title]}>{"사진 생성 중"}</Text>
                </View>
                <View style={[BaseStyles.contentContainer, styles.centerContainer]}>
                  <View style={styles.indicatorContainer}>
                    <BallIndicator style={styles.ballIndicator} size={40} color="#FFFFFF" />
                    <Text style={[BaseStyles.mainText, styles.centerMessage]}>{"단어의 이미지가 만들어지고있어요~\n로오오오오딩"}</Text>
                  </View>
                </View>
              </View>
            )}
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
        height: "15%",
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
        fontFamily: 'Jua-Regular',
        color: '#000',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 4,
    },
    AnswerBox: {
        backgroundColor: '#F5F5DC',
        borderRadius: 20,
        height: 400,
        width: 350,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height:'100%',
        width:'100%',
    },
    recordImage: {
        width: 150,
        height: 150,
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
    },centerContainer: {
        flex: 1,
        justifyContent: 'center', // Centers content vertically
        alignItems: 'center',
      },
      indicatorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      ballIndicator: {
        position:'absolute',
        top : -80,
      },
      centerMessage: {
        fontSize: 24,
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
