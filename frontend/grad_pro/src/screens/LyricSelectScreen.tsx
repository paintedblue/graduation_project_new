import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import TabBarButtons from '../components/TabBarButtons';  // Assuming you have a TabBarButtons component

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

const LyricSelectScreen = ({ navigation }) => {
  const [selectedCategories, setSelectedCategories] = useState({
    food: false,
    animal: false,
    color: false,
    character: false,
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

  const handleLyricCreationPress = () => {
    // Handle the "가사 생성하기" button press logic here
    console.log('가사 생성하기 버튼이 눌렸습니다.');
  };

  return (
    <View style={[styles.container, { backgroundColor: '#A5BEDF' }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.appTitle}>꿈가락</Text>
      </View>
      <View style={styles.tabBarContainer}>
        <TabBarButtons />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>가사 만들기</Text>
        <Text style={styles.subtitle}>카테고리를 눌러 대답해보세요</Text>

        <Frame
          isChecked={selectedCategories.food}
          onPress={() => handleCategoryPress('food')}
        >
          내가 좋아하는 음식🍗
        </Frame>
        <Frame
          isChecked={selectedCategories.animal}
          onPress={() => handleCategoryPress('animal')}
        >
          내가 좋아하는 동물🐰
        </Frame>
        <Frame
          isChecked={selectedCategories.color}
          onPress={() => handleCategoryPress('color')}
        >
          내가 좋아하는 색깔🍀
        </Frame>
        <Frame
          isChecked={selectedCategories.character}
          onPress={() => handleCategoryPress('character')}
        >
          내가 좋아하는 캐릭터🐳
        </Frame>

        <TouchableOpacity style={styles.button} onPress={handleLyricCreationPress}>
          <Text style={styles.buttonText}>가사 생성하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  tabBarContainer: {
    marginBottom: 0, // Adjusted if needed to move content upwards
  },
  appTitle: {
    width: 200,
    position: 'relative',
    fontSize: 25,
    letterSpacing: -0.41,
    lineHeight: 50,
    fontFamily: 'Jua-Regular',
    backgroundColor: 'transparent',
    background: 'linear-gradient(90deg, #f7f0ac, #acf7f0 50%, #f0acf7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    display: 'inline-block',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: -20, // Added negative margin to move content upwards
  },
  title: {
    fontSize: 35,
    fontFamily: 'Jua-Regular',
    color: '#000',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Jua-Regular',
    color: '#000',
    marginBottom: 40,
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
    justifyContent: 'space-between', // Space between text and checkmark
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
    display: 'inline-block',
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
  buttonText: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'Jua-Regular',
  },
});

export default LyricSelectScreen;
