import React, {useState} from "react";
import {Text, View, TouchableOpacity, ImageBackground, Image, StyleSheet} from "react-native";
import BaseStyles from "../styles/BaseStyles"
import Header from "../components/TabBarButtons";

const LyricSelectScreen = ({route, navigation}) => {

    const [complete, setComplete] = useState(false); 

    const maintitleText = "가사 만들기"
    const subtitleText = "카테고리를 눌러 대답해보세요."

    const [selectedCategories, setSelectedCategories] = useState({
        likeFood: false,
        likeAnimal: false,
        likeColor: false,
        likeCharacter: false,
    });
    
    const handleCategoryPress = (category) => {
    setSelectedCategories((prevState) => ({
        ...prevState,
        [category]: !prevState[category],
    }));

    // Navigate to LyricCreation screen and pass the selected category
    navigation.navigate('LyricCreation', {
        category, // Pass the selected category to LyricCreation screen
    });
    };

    return (
        <View style={[BaseStyles.flexContainer, {backgroundColor: '#A5BEDF'}]}>
            <Header></Header>
            <View style={[BaseStyles.contentContainer]}>
                    <View style={[BaseStyles.topContainer]}>
                        <Text style={[BaseStyles.mainText, styles.title]}>{maintitleText}</Text>
                        <Text style={[BaseStyles.mainText, styles.subtitle]}>{subtitleText}</Text>
                    </View>
                    <View style={[BaseStyles.middleContainer, {justifyContent:'flex-start'}]}>
                        <Frame
                        isChecked={selectedCategories.likeFood}
                        onPress={() => handleCategoryPress('likeFood')}
                        >
                        내가 좋아하는 음식🍗
                        </Frame>
                        <Frame
                        isChecked={selectedCategories.likeAnimal}
                        onPress={() => handleCategoryPress('likeAnimal')}
                        >
                        내가 좋아하는 동물🐰
                        </Frame>
                        <Frame
                        isChecked={selectedCategories.likeColor}
                        onPress={() => handleCategoryPress('likeColor')}
                        >
                        내가 좋아하는 색깔🍀
                        </Frame>
                        <Frame
                        isChecked={selectedCategories.likeCharacter}
                        onPress={() => handleCategoryPress('likeCharacter')}
                        >
                        내가 좋아하는 캐릭터🐳
                        </Frame>
                    </View>
                    <View style={[BaseStyles.bottomContainer, {justifyContent:'center'}]}>
                    {complete ?
                        <TouchableOpacity style={styles.button} disabled={false}>
                            <Text style={[BaseStyles.mainText, {fontSize:25}]}>가사 생성하기</Text>
                        </TouchableOpacity>
                        :
                        <View style={[styles.button, {backgroundColor:'rgba(0,82,212,0.5)'}]}>
                            <Text style={[BaseStyles.mainText, {fontSize:25, color:'rgba(255,241,241,0.5)'}]}>가사 생성하기</Text>
                        </View>
                    }
                    </View>
                </View>
        </View>
    )
};

const styles = StyleSheet.create({
    title:{
        fontSize: 35,
        lineHeight:90,
    },
    subtitle:{
        fontSize: 20,
        lineHeight:40,
    },
    frameDiv: {
        width: '75%', // Increased the width of the frame
        position: 'relative',
        borderRadius: 10,
        backgroundColor: '#f7f7f7',
        height: 63,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row', // To position the text and checkmark in a row
        paddingHorizontal: 20, // Padding for the left and right sides
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
        height: 30,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 4,
      },
      checkMark: {
        width: 30, // Increased the checkmark size
        height: 30, // Increased the checkmark size
      },
      button: {
        backgroundColor: '#0052d4',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 100,
        marginTop: 30, // Reduced marginTop to move the button upwards
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

const Frame = ({ children, isChecked, onPress }) => {
    return (
    <TouchableOpacity style={styles.frameDiv} onPress={onPress}>
        <Text style={styles.categoryText}>{children}</Text>
        <Image
        source={
            isChecked
              ? require('../assets/imgs/CheckMark_blue.png') // 클릭되면 파란색 체크마크
              : require('../assets/imgs/CheckMark.png') // 클릭되지 않았을 때 회색 체크마크
        }
        style={styles.checkMark}
        />
    </TouchableOpacity>
    );
};

export default LyricSelectScreen;