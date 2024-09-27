import React, {useState, useEffect} from "react";
import {Text, View, TouchableOpacity, TextInput, Image, StyleSheet} from "react-native";
import BaseStyles from "../styles/BaseStyles"
import Header from "../components/TabBarButtons";
import { ScrollView } from "react-native-gesture-handler";

const LyricMakeScreen = ({route, navigation}) => {
    //개발용 더미 데이터!
    //끝
    const {userId, requestData} = route.params;
    const [title, setTitle] = useState(""); 
    const [lyric, setLyric] = useState(""); 
    const type = "Lyric"        
    const maintitleText = "가사가 완성됐어요!"

    useEffect(() => {
        requestLiric();
    },[]);

    const requestLiric = async() =>{
        try {
            const response = await fetch(`http://10.22.164.133:3000/api/lyric/${userId}`, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    }
            });
            if (!response.ok) {
                throw new Error(`Network response was not ok`);
            }
            const data = await response.json();
            setTitle(data.title);
            setLyric(data.lyric);
            } catch (error) {
            console.error("Error during fetch operation:", error.message);
            Alert.alert("Error", error.message);
            }
    }
    const handlerReGenerate = () => {
        navigation.replace('LoadingScreen', {userId, type})
    }
    const handlerNext = () => {
        navigation.navigate('MelodyScreen', {userId})
    }

    return (
        <View style={[BaseStyles.flexContainer, {backgroundColor: '#A5BEDF'}]}>
            <Header></Header>
            <View style={[BaseStyles.contentContainer]}>
                    <View style={[BaseStyles.topContainer, {justifyContent:'center'}]}>
                        <Text style={[BaseStyles.mainText, styles.title]}>{maintitleText}</Text>
                        <View style={[styles.frameTitle]}>
                            <Text style={[BaseStyles.text, {color:'#000', fontSize:24}]}>{title}</Text>
                        </View>
                    </View>
                    <View style={[BaseStyles.middleContainer, {justifyContent:'flex-start'}]}>
                        <View style={[styles.frameLyric]}>
                        <ScrollView style={[styles.scrollView]}>
                            <Text style={[BaseStyles.text, {color:'#000', fontSize:20}]}>{lyric}</Text>
                        </ScrollView>
                        </View>
                        <TouchableOpacity style={[BaseStyles.row, {marginTop:20}]} onPress={handlerReGenerate}>
                            <Image source={require('../assets/imgs/ReRecord.png')} style={styles.reRecordingImage} />
                            <Text style={styles.reRecordingText}>다시 만들래요</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[BaseStyles.bottomContainer, styles.bottomContainer]}>
                        
                        <TouchableOpacity style={[BaseStyles.button]} onPress={handlerNext}>
                            <Image source={require('../assets/imgs/right_arrow.png')} style={[styles.nextButton]}></Image>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                
        </View>
    )
};

const styles = StyleSheet.create({
    title:{
        fontSize: 30,
        lineHeight:60,
    },
    subtitle:{
        fontSize: 18,
        lineHeight:30,
    },
    scrollView:{
        flex:1,
    },
    frameTitle: {
        width: 'auto', 
        paddingHorizontal:30,
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
        flexDirection: 'row', // To position the text and checkmark in a row
    },
    frameLyric: {
        width: 300, // Increased the width of the frame
        position: 'relative',
        borderRadius: 10,
        backgroundColor: '#f7f7f7',
        height: "70%",
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row', // To position the text and checkmark in a row
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

    bottomContainer:{
        height:"15%",
        justifyContent:'flex-end',
        alignItems:'flex-end',
        padding:20,
    },
    nextButton:{
        width:90,
        height:90,
    },
    recordImage: {
        width: 150,  // Increased width
        height: 150,  // Increased height
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

export default LyricMakeScreen;