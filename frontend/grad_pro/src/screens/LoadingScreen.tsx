import React, {useState, useEffect} from "react";
import {Text, View, TouchableOpacity, Alert, TextInput, Image, StyleSheet} from "react-native";
import BaseStyles from "../styles/BaseStyles"
import Header from "../components/TabBarButtons";

const LoadingScreen = ({route, navigation}) => {
    const {userId, type} = route.params;
    const [isLoading, setIsLoading] = useState(true); 

    const [requestData, setRequestData] = useState({}); 

    const [mainText,setMainText] = useState("");
    
    //랜더링 마다 되었을 때 실행
    useEffect(() => {
        if(type === "Lyric"){
            setMainText("가사가 만들어지고 있어요~!") 
            requestMakeLyric();
        }else if(type === "Music"){
            setMainText("동요가 만들어지고 있어요~!") 
            requestMakeMusic();
        }
    },[]);

    const requestMakeLyric = async () => {
        console.log("서버) 가사 생성 요청...");
        setIsLoading(true);
        try {
            const response = await fetch('http://15.165.249.244:3000/api/lyric', {
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

            const data = await response.json();
            console.log("Response data:", data);
            setRequestData(data);
        } catch (error) {
            console.error("Error during fetch operation:", error.message);
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false);
            navigation.replace('LyricMakeScreen', {userId, requestData})
        }
    };
    const requestMakeMusic = async () => {
        console.log("서버) 동요 생성 요청...");
        setIsLoading(true);
        try {
            const response = await fetch('http://15.165.249.244:3000/api/song', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({body: JSON.stringify({ userId:userId.toString()})}
                )
            });
            const data = await response.json();
            console.log("Response data:", data);
            setRequestData(data);
            const type = "Gen"
        } catch (error) {
            console.error("Error during fetch operation:", error.message);
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false);
            navigation.replace('PlayScreen', {userId, requestData, type})
        }
    };

    return (
        <View style={[BaseStyles.flexContainer, {backgroundColor: '#A5BEDF'}]}>
            <Header></Header>
            <View style={[BaseStyles.contentContainer]}>
                <View style={[BaseStyles.middleContainer]}>
                    <Text style={[BaseStyles.mainText, styles.title]}>{mainText}</Text>
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
});

export default LoadingScreen;