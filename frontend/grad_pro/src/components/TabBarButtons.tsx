import React,{useContext} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet ,Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SelectedCategoriesContext } from "../contexts/SelectedCategoriesContext"; // 컨텍스트 임포트

const Header: React.FC = () => {
  const { selectedCategories, clearCategory, userIdInit } = useContext(SelectedCategoriesContext);
  const navigation = useNavigation(); // navigation 객체 사용
  const userId = userIdInit; // userId 선언

  const goToHome = async() => {
    try {
      const response = await fetch('http://15.165.249.244:3000/api/preferences/reset', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId:userId.toString()})
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
      }
      
      } catch (error) {
      console.error("Error during fetch operation:", error.message);
      Alert.alert("Error", error.message);
      }

    navigation.navigate('HomeScreen'); // 홈 화면으로 이동, 기본 title 설정
    clearCategory();

  };

  const goToHabit = () => {
    navigation.navigate('HabitScreen', { userId }); // 습관 화면으로 이동
  };

  const goToLyricMake = () => {
    navigation.navigate('LyricSelectScreen', { userId }); // 가사 생성 화면으로 이동
  };

  const goToMelody = () => {
    navigation.navigate('MelodyScreen', { userId }); // 멜로디 화면으로 이동
  };

  const goToPlay = () => {
    //navigation.navigate('PlayScreen', { userId }); // 동요 완성 화면으로 이동
  };

  return (
    <View>
      {/* 상단 헤더 */}
      <View style={styles.headerContainer}>
        {/* 좌측 홈 버튼 */}
        <TouchableOpacity onPress={goToHome} style={styles.homeIconContainer}>
          <Image 
            source={require('../assets/imgs/home.png')} 
            style={styles.homeIcon} 
          />
        </TouchableOpacity>

        {/* 타이틀 */}
        <Text style={styles.appTitle}>꿈가락</Text>

        {/* 우측 빈 공간으로 중앙 타이틀 위치를 보정 */}
        <View style={styles.rightSpace} />
      </View>

      {/* 탭바 버튼들 */}
      <View style={styles.tabBarButtons}>
        <TouchableOpacity onPress={goToHabit} style={styles.tab}>
          <Text style={styles.symbol}>⏰</Text>
          <Text style={styles.label}>습관</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToLyricMake} style={styles.tab}>
          <Text style={styles.symbol}>📃</Text>
          <Text style={styles.label}>가사</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToMelody} style={styles.tab}>
          <Text style={styles.symbol}>🎶</Text>
          <Text style={styles.label}>악기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToPlay} style={styles.tab}>
          <Text style={styles.symbol}>✅</Text>
          <Text style={styles.label}>동요 완성!</Text>
        </TouchableOpacity>
      </View>

      {/* 탭바 하단 구분선 */}
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center', 
    width: '100%',
    height: 50,
    backgroundColor: '#A5BEDF', // 배경색 설정 (필요 시 수정)
  },
  homeIconContainer: {
    position: 'absolute', 
    left: 35, 
    top: 18, 
  },
  homeIcon: {
    width: 30,
    height: 30,
  },
  appTitle: {
    fontSize: 25,
    fontFamily: "Jua-Regular",
    color: '#FFF',
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    textAlign: 'center', 
  },
  rightSpace: {
    position: 'absolute',
    right: 10,
  },
  tabBarButtons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#A5BEDF',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    flexDirection: 'column',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Jua-Regular',
    textAlign: 'center',
    marginTop: 5,
  },
  symbol: {
    fontSize: 24,
    fontWeight: '500',
    fontFamily: 'Jua-Regular',
    color: '#999',
    textAlign: 'center',
  },
  line: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.25)',
    height: 1,
  },
});

export default Header;
