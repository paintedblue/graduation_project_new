import React, {useState} from "react";
import {Text, View, TouchableOpacity, TextInput, Image, StyleSheet} from "react-native";
import BaseStyles from "../styles/BaseStyles"
import Header from "../components/TabBarButtons";
import { ScrollView } from "react-native-gesture-handler";

const SongListScreen = ({route, navigation}) => {

    const [habit, setHabit] = useState(''); 

    const [popup, setpopup] = useState(false); 

    const maintitleText = "저장된 노래"
    

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
                        
                    </View>
                    <View style={[BaseStyles.middleContainer]}>
                        <ScrollView style={[styles.scrollView]}>
                            
                        </ScrollView>
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
});

export default SongListScreen;