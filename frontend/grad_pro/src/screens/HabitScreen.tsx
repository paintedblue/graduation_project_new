import React, {useState} from "react";
import {Text, View, TouchableOpacity, TextInput, Image, StyleSheet} from "react-native";
import BaseStyles from "../styles/BaseStyles"
import Header from "../components/TabBarButtons";
import { ScrollView } from "react-native-gesture-handler";

const HabirScreen = ({route, navigation}) => {

    const [habit, setHabit] = useState(''); 

    const [popup, setpopup] = useState(false); 

    const maintitleText = "습관 입력하기"
    const subtitleText = "아이가 잘 해냈으면 하는 습관을 입력해주세요.\nex. 양치하기, 손씻기"

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
                    <View style={[BaseStyles.middleContainer]}>
                        <TouchableOpacity style={[BaseStyles.button]} onPress={handlerOpenPopUP}>
                            <View style={[styles.habitBox]}>
                                    <Text style={[BaseStyles.text, styles.addText]}>+</Text>
                            </View>
                        </TouchableOpacity>
                        <ScrollView style={[styles.scrollView]}>
                            
                        </ScrollView>
                    </View>
                    <View style={[BaseStyles.bottomContainer, styles.bottomContainer]}>
                        <TouchableOpacity style={[BaseStyles.button]}>
                            <Image source={require('../assets/imgs/right_arrow.png')} style={[styles.nextButton]}></Image>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                {popup ? 
                <View style={[styles.popupBg]}>
                    <View style={[styles.popupWin]}>
                        <Text style={[BaseStyles.text, {fontSize:25}]}>습관 입력하기</Text>
                        <TextInput style={styles.inputField}
                        placeholder="습관을 입력하세요"
                        placeholderTextColor="#999"
                        value={habit}
                        onChangeText={setHabit}
                        autoFocus={true}
                        keyboardType="default"
                        returnKeyType="done"
                        />
                        <TouchableOpacity style={styles.completeButton} onPress={handleCustomHabitSubmit}>
                            <Text style={[BaseStyles.text, {color:'#000'}]}>완료</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={handlerClosePopUP}>
                            <Text style={[BaseStyles.text, {fontSize:30}]}>x</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                :
                <></>
                }
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

export default HabirScreen;