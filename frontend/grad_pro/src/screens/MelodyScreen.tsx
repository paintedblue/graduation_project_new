import React, {useState} from "react";
import {Text, View, TouchableOpacity, TextInput, Image, StyleSheet} from "react-native";
import BaseStyles from "../styles/BaseStyles"
import Header from "../components/TabBarButtons";
import { ScrollView } from "react-native-gesture-handler";

const MelodyScreen = ({route, navigation}) => {

    const [habit, setHabit] = useState(''); 

    const [popup, setpopup] = useState(false); 

    const maintitleText = "악기 고르기"
    const subtitleText = "노래에 넣고 싶은 악기를 골라볼까요?\n악기를 클릭하면 연주돼요."

    const handleCustomHabitSubmit = () => {
        
    };

    const handlerOpenPopUP = () => {
        setpopup(true);
    };

    const handlerClosePopUP = () => {
        setpopup(false);
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
                        <TouchableOpacity style={styles.frameDiv}>
                            <Image source={require('../assets/imgs/icons8-피아노-96.png')}/>
                            <Text style={styles.categoryText}>피아노</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.frameDiv}>
                            <Image source={require('../assets/imgs/icons8-기타-96.png')}/>
                            <Text style={styles.categoryText}>기타</Text>
                        </TouchableOpacity>
                        </View>
                        <View style={BaseStyles.row}>
                        <TouchableOpacity style={styles.frameDiv}>
                            <Image source={require('../assets/imgs/icons8-녹음기-악기-96.png')}/>
                            <Text style={styles.categoryText}>리코더</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.frameDiv}>
                            <Image source={require('../assets/imgs/icons8-목금-96.png')}/>
                            <Text style={styles.categoryText}>실로폰</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[BaseStyles.bottomContainer, styles.bottomContainer]}>
                        <TouchableOpacity style={[BaseStyles.button]}>
                            <Image source={require('../assets/imgs/right_arrow.png')} style={[styles.nextButton]}></Image>
                        </TouchableOpacity>
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
    popupBg:{
        position:'absolute',
        width:'100%',
        height:'100%',
        backgroundColor:'rgba(150,150,150,0.5)',
        justifyContent:'center',
        alignItems:'center',
    },
    popupWin:{
        borderRadius:10,
        width:300,
        height:200,
        backgroundColor:'#0052D4',
        justifyContent:'center',
        alignItems:'center',
    },
    inputField:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 5,
        width: '80%',
        marginVertical: 20,
    },
    completeButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButton:{
        position:'absolute',
        right:20,
        top:15,
    }
});

export default MelodyScreen;