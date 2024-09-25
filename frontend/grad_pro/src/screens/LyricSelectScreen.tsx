import React, {useState,useEffect} from "react";
import {Text, View, TouchableOpacity, ImageBackground, Image, StyleSheet} from "react-native";
import BaseStyles from "../styles/BaseStyles"
import Header from "../components/TabBarButtons";

const LyricSelectScreen = ({route, navigation}) => {

    const { userId, tempSelectedCategories } = route.params;
    const type = "Lyric";
    const [complete, setComplete] = useState(false);

    const maintitleText = "가사 만들기";
    const subtitleText = "카테고리를 눌러 대답해보세요.";

    // 선택된 카테고리 상태 업데이트
    const [selectedCategories, setSelectedCategories] = useState(tempSelectedCategories);
    
    useEffect(() => {
        // 모든 카테고리가 선택된 경우 complete를 true로 설정
        setComplete(Object.values(selectedCategories).every(value => value === true));
    }, [selectedCategories]);

    const handleCategoryPress = (category) => {
        navigation.navigate('LyricQuestionScreen', {
            userId, category, selectedCategories
        });
    };

    const handlerLyricMake = () => {
        navigation.navigate('LoadingScreen', { userId, type });
    };

    return (
        <View style={[BaseStyles.flexContainer, {backgroundColor: '#A5BEDF'}]}>
            <Header />
            <View style={[BaseStyles.contentContainer]}>
                <View style={[BaseStyles.topContainer]}>
                    <Text style={[BaseStyles.mainText, styles.title]}>{maintitleText}</Text>
                    <Text style={[BaseStyles.mainText, styles.subtitle]}>{subtitleText}</Text>
                </View>
                <View style={[BaseStyles.middleContainer, {justifyContent: 'flex-start'}]}>
                    <Frame
                        isChecked={selectedCategories.likeFood}
                        onPress={() => handleCategoryPress('likeFood')}
                    >
                        내가 좋아하는 음식🍗
                    </Frame>
                    <Frame
                        isChecked={selectedCategories.likeAnimal || selectedCategories.likeCharacter} // 동물이나 캐릭터 선택 여부
                        onPress={() => handleCategoryPress('likeAnimalOrCharacter')} // 이 버튼을 눌렀을 때 처리할 동작
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
                <View style={[BaseStyles.bottomContainer, {justifyContent: 'center'}]}>
                    {complete ?
                        <TouchableOpacity style={styles.button} onPress={handlerLyricMake}>
                            <Text style={[BaseStyles.mainText, {fontSize: 25}]}>가사 생성하기</Text>
                        </TouchableOpacity>
                        :
                        <View style={[styles.button, {backgroundColor: 'rgba(0,82,212,0.5)'}]}>
                            <Text style={[BaseStyles.mainText, {fontSize: 25, color: 'rgba(255,241,241,0.5)'}]}>가사 생성하기</Text>
                        </View>
                    }
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

const Frame = ({ children, isChecked, onPress, isLarge }) => {
    return (
    <TouchableOpacity 
        style={[styles.frameDiv, isLarge && styles.largeFrameDiv]} 
        onPress={onPress}>
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
