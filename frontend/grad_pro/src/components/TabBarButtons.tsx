import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header: React.FC = () => {
  const navigation = useNavigation(); // navigation 객체 사용

  const goToHome = () => {
    navigation.navigate('HomeScreen'); // 홈 화면으로 이동
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
        <View style={styles.tab}>
          <Text style={styles.symbol}>⏰</Text>
          <Text style={styles.label}>습관</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.symbol}>📃</Text>
          <Text style={styles.label}>가사</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.symbol}>🎶</Text>
          <Text style={styles.label2}>멜로디</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.symbol}>✅</Text>
          <Text style={styles.label3}>동요 완성!</Text>
        </View>
      </View>

      {/* 탭바 하단 구분선 */}
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row', // 아이콘과 타이틀을 한 줄에 배치
    alignItems: 'center',
    justifyContent: 'center', // 타이틀을 중앙에 배치
    width: '100%',
    height: 50,
    backgroundColor: '#A5BEDF', // 배경색 설정 (필요 시 수정)
  },
  homeIconContainer: {
    position: 'absolute', // 홈 아이콘을 좌측 상단에 고정
    left: 35, 
    top: 18, // 홈 버튼을 아래로 이동 (10으로 조정 가능)
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
    textAlign: 'center', // 텍스트를 중앙에 맞춤
  },
  rightSpace: {
    position: 'absolute', // 우측에 빈 공간을 두어 타이틀이 중앙에 오도록 함
    right: 10,
  },
  tabBarButtons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 탭바 아이콘을 균등하게 배치
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#A5BEDF', // 배경색 설정 (필요 시 수정)
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
  label2: {
    fontSize: 14,
    fontFamily: 'Jua-Regular',
    textAlign: 'center',
    marginTop: 5,
  },
  label3: {
    fontSize: 13,
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
