import React, {useState} from "react";
import {Text, View, TouchableOpacity, Alert, Image, StyleSheet} from "react-native";
import BaseStyles from "../styles/BaseStyles"
import Header from "../components/TabBarButtons";

const MelodyScreen = ({route, navigation}) => {

    const {userId} = route.params;
    const [select, setSelect] = useState("Piano"); 
    const type = "Music"

    const maintitleText = "악기 고르기"
    const subtitleText = "노래에 넣고 싶은 악기를 골라볼까요?\n악기를 클릭하면 연주돼요."

    const handlerCheck = (instrument) => {
        //요청
        setSelect(instrument);
    };

    const handlerNext = async() => {
        //요청
        try {
            const response = await fetch('http://192.168.0.31:3000/api/instrument', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId:userId.toString(), instrument:select})
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }
            const data = await response.json();

            navigation.navigate('LoadingScreen', {userId, type})
            } catch (error) {
            console.error("Error during fetch operation:", error.message);
            Alert.alert("Error", error.message);
            }
    };


    return (
        <View style={[BaseStyles.flexContainer, {backgroundColor: '#A5BEDF'}]}>
            <Header></Header>
            <View style={[BaseStyles.contentContainer]}>
                    <View style={[BaseStyles.topContainer]}>
                        <Text style={[BaseStyles.mainText, styles.title]}>{maintitleText}</Text>
                        <Text style={[BaseStyles.mainText, styles.subtitle]}>{subtitleText}</Text>
                    </View>
                    <View style={[BaseStyles.middleContainer, {justifyContent:"flex-start"}]}>
                        <View style={BaseStyles.row}>
                        <TouchableOpacity style={[styles.frameDiv, select === "Piano"?{backgroundColor : '#4F8FED'}:{}]} onPress={() => handlerCheck("Piano")}>
                            <Image source={require('../assets/imgs/iconP.png')}/>
                            <Text style={styles.categoryText}>피아노</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.frameDiv, select === "Guitar"?{backgroundColor : '#4F8FED'}:{}]} onPress={() => handlerCheck("Guitar")}>
                            <Image source={require('../assets/imgs/iconG.png')}/>
                            <Text style={styles.categoryText}>기타</Text>
                        </TouchableOpacity>
                        </View>
                        <View style={BaseStyles.row}>
                        <TouchableOpacity style={[styles.frameDiv, select === "Recorder"?{backgroundColor : '#4F8FED'}:{}]} onPress={() => handlerCheck("Recorder")}>
                            <Image source={require('../assets/imgs/iconR.png')}/>
                            <Text style={styles.categoryText}>리코더</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.frameDiv, select === "Xylophone"?{backgroundColor : '#4F8FED'}:{}]} onPress={() => handlerCheck("Xylophone")}>
                            <Image source={require('../assets/imgs/iconX.png')}/>
                            <Text style={styles.categoryText}>실로폰</Text>
                        </TouchableOpacity>
                        </View>
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
    habitBox:{
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 35,
        width:250,
        height:70,
        backgroundColor:'#FFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        marginVertical:5,
    },
    frameDiv: {
        width: 150, 
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    categoryText: {
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
    addText:{
        fontSize:35,
        color:"#000",
    },
    habitText:{
        fontSize:20,
        color:"#000",
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
    closeButton:{
        position:'absolute',
        right:20,
        top:15,
    }
});

export default MelodyScreen;