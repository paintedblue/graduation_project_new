import React, { useState, useEffect } from 'react';
import { Text, View, Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TabBarButtons from '../components/TabBarButtons';  

const NewRecordScreen = ({ route, navigation }) => {
    
    return (
        <View style={[styles.container, { backgroundColor: '#A5BEDF' }]}>
          {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.appTitle}>꿈가락</Text>
            </View>
    
          {/* TabBar */}
            <View style={styles.tabBarContainer}>
                <TabBarButtons />
            </View>
    
            <View style={styles.contentContainer}>
            <View>
                <Text style={styles.title}>악기 정하기</Text>
                <Text style={styles.subtitle}>노래에 넣고 싶은 악기를 골라볼까요?
                </Text>   
            </View>
            
            <Text style={styles.subtitle}>
                악기를 클릭하면 연주돼요.
            </Text>

            <View style={styles.row}>
            <TouchableOpacity style={styles.frameDiv}>
                <Image source={require('../assets/imgs/icons8-피아노-96.png')}/>
                <Text style={styles.categoryText}>피아노</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.frameDiv}>
                <Image source={require('../assets/imgs/icons8-기타-96.png')}/>
                <Text style={styles.categoryText}>기타</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.row}>
            <TouchableOpacity style={styles.frameDiv}>
                <Image source={require('../assets/imgs/icons8-녹음기-악기-96.png')}/>
                <Text style={styles.categoryText}>리코더</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.frameDiv}>
                <Image source={require('../assets/imgs/icons8-목금-96.png')}/>
                <Text style={styles.categoryText}>실로폰</Text>
            </TouchableOpacity>
            </View>

            <View style={styles.arrowContainer}>
          <TouchableOpacity>
            <Image source={require('../assets/imgs/right_arrow.png')} style={styles.arrowImage} />
          </TouchableOpacity>
          
        </View>

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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
      marginTop: -150, // Added negative margin to move content upwards
    },
    
  TopContainer:{
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  MiddleContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BottomContainer:{
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: "Jua-Regular",
    fontSize: 35,
    fontWeight: "400",
    lineHeight: 50,
    letterSpacing: -0.408,
    textAlign: "center",
    color: "white",
    backgroundColor: "transparent",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontFamily: "Jua-Regular",
    fontSize: 20,
    fontWeight: "400",
    lineHeight: 50,
    letterSpacing: -0.408,
    textAlign: "center",
    color: "white",
    backgroundColor: "transparent",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    paddingHorizontal: 20,
  },
    arrowContainer: {
        position: 'absolute',
        bottom: 50, // Moved higher
        right: 50,  // Moved more to the right
      },
      arrowImage: {
        width: 70,  // Increased size
        height: 70, // Increased size
      },
    frameDiv: {
      width: 150, // Increased the width of the frame
      margin: 10,
      borderRadius: 10,
      backgroundColor: '#f7f7f7',
      height: 150,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      flexDirection:'column', // To position the text and checkmark in a row
    },
    categoryText: {
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
export default NewRecordScreen;
