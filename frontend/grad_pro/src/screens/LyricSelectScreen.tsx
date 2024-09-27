import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import BaseStyles from "../styles/BaseStyles";
import Header from "../components/TabBarButtons";

const LyricSelectScreen = ({ route, navigation }) => {
    const { userId, tempSelectedCategories } = route.params;
    const type = "Lyric";
    const [complete, setComplete] = useState(false);

    const maintitleText = "가사 만들기";
    const subtitleText = "카테고리를 눌러 대답해보세요.";

    // 선택된 카테고리 상태 업데이트
    const [selectedCategories, setSelectedCategories] = useState(tempSelectedCategories || {});

    // tempSelectedCategories가 변경되었을 때 실행

     useEffect(() => {
        const categories = tempSelectedCategories || {}; // tempSelectedCategories가 undefined일 경우 빈 객체로 초기화
        setSelectedCategories(categories);
        console.log('tempSelectedCategories:', categories);
        setComplete(Object.values(categories).every(value => value === true));
    }, [tempSelectedCategories]);
    
    const handleCategoryPress = (category) => {
    console.log('선택한 카테고리:', category);
    navigation.navigate('LyricQuestionScreen', {
        userId, category, selectedCategories
    });
    };
    


    const handlerLyricMake = () => {
        navigation.navigate('LoadingScreen', { userId, type });
    };

    return (
        <View style={[BaseStyles.flexContainer, { backgroundColor: '#A5BEDF' }]}>
            <Header />
            <View style={[BaseStyles.contentContainer]}>
                <View style={[BaseStyles.topContainer]}>
                    <Text style={[BaseStyles.mainText, styles.title]}>{maintitleText}</Text>
                    <Text style={[BaseStyles.mainText, styles.subtitle]}>{subtitleText}</Text>
                </View>
                <View style={[BaseStyles.middleContainer, { justifyContent: 'flex-start' }]}>
                    <Frame
                        isChecked={selectedCategories.likeFood}
                        onPress={() => handleCategoryPress('likeFood')}
                    >
                        내가 좋아하는 음식🍗
                    </Frame>
                    <Frame
                        isChecked={selectedCategories.likeAnimalOrCharacter}
                        onPress={() => handleCategoryPress('likeAnimalOrCharacter')}
                    >
                        내가 좋아하는 {'\n'} 캐릭터나 동물🐰🐳
                    </Frame>
                    <Frame
                        isChecked={selectedCategories.likeColor}
                        onPress={() => handleCategoryPress('likeColor')}
                    >
                        내가 좋아하는 색깔🍀
                    </Frame>
                </View>
                <View style={[BaseStyles.bottomContainer, { justifyContent: 'center' }]}>
                    {complete ?
                        <TouchableOpacity style={styles.button} onPress={handlerLyricMake}>
                            <Text style={[BaseStyles.mainText, { fontSize: 25 }]}>가사 생성하기</Text>
                        </TouchableOpacity>
                        :
                        <View style={[styles.button, { backgroundColor: 'rgba(0,82,212,0.5)' }]}>
                            <Text style={[BaseStyles.mainText, { fontSize: 25, color: 'rgba(255,241,241,0.5)' }]}>가사 생성하기</Text>
                        </View>
                    }
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        lineHeight: 60,
    },
    subtitle: {
        fontSize: 18,
        lineHeight: 30,
    },
    frameDiv: {
        width: '75%',
        position: 'relative',
        borderRadius: 10,
        backgroundColor: '#f7f7f7',
        height: 70,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    categoryText: {
        width: 220,
        position: 'relative',
        fontSize: 21,
        letterSpacing: 2,
        lineHeight: 30,
        fontFamily: 'Jua-Regular',
        color: '#000',
        textAlign: 'center',
        flexWrap: 'wrap',
        height: 'auto',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 4,
    },
    checkMark: {
        width: 30,
        height: 30,
    },
    button: {
        backgroundColor: '#0052d4',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 100,
        marginTop: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

const Frame = ({ children, isChecked, onPress }) => {
    console.log('isChecked:', isChecked);
    return (
        <TouchableOpacity
            style={styles.frameDiv}
            onPress={onPress}
        >
            <Text style={styles.categoryText}>{children}</Text>
            <Image
                source={
                    isChecked
                        ? require('../assets/imgs/CheckMark_blue.png')
                        : require('../assets/imgs/CheckMark.png')
                }
                style={styles.checkMark}
            />
        </TouchableOpacity>
    );
};

export default LyricSelectScreen;
