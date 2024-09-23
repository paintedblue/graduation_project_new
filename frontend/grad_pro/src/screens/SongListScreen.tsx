import React, {useState,useEffect} from "react";
import {Text, View, TouchableOpacity, Alert, StyleSheet} from "react-native";
import BaseStyles from "../styles/BaseStyles"
import Header from "../components/TabBarButtons";
import { ScrollView } from "react-native-gesture-handler";

const SongListScreen = ({route, navigation}) => {
//개발용 더미 데이터!
const exData = [{
    "__v": 0, 
    "_id": "1", 
    "created_at": "2024-09-20T08:35:38.081Z", 
    "id": "임의 id", 
    "instrument": "Xylophone", 
    "lyric": "임시 가사입니다", 
    "songId": "2", 
    "title": "임시 제목입니다.", 
    "userId": "1"
},
{
    "__v": 0, 
    "_id": "1", 
    "created_at": "2024-09-20T08:35:38.081Z", 
    "id": "임의 id", 
    "instrument": "Xylophone", 
    "lyric": "임시 가사입니다", 
    "songId": "2", 
    "title": "임시 제목입니다.", 
    "userId": "1"
}]

//끝
    const {userId} = route.params;
    const [songs, setSongs] = useState(exData); 
    const type = "Play"   
    const maintitleText = "저장된 노래"
    
    useEffect(() => {
        requestSongList();
    }, []);

    const requestSongList = async () => {
        console.log("서버) 동요 리스트 요청");
        try {
        const response = await fetch(`http://15.165.249.244:3000/api/song/${userId}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                }
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok`);
        }
        const data = await response.json();
        setSongs(data.songs);
        } catch (error) {
        console.error("Error during fetch operation:", error.message);
        Alert.alert("Error", error.message);
        }
    };


    const selectSong = (index) => {
        const requestData = songs[index];
        console.log(requestData);
        navigation.navigate('PlayScreen', {userId, requestData, type});
    };

    const formatDate = (isoString) => {
        // ISO 형식의 문자열을 Date 객체로 변환
        const date = new Date(isoString);
      
        // 월(Month)과 일(Day) 추출 (월은 0부터 시작하므로 1을 더해줌)
        const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더함
        const day = date.getDate();
      
        // 월과 일을 "9.17" 형식으로 변환
        return `${month}.${day}`;
      };

    return (
        <View style={[BaseStyles.flexContainer, {backgroundColor: '#A5BEDF'}]}>
            <Header></Header>
            <View style={[BaseStyles.contentContainer]}>
                    <View style={[BaseStyles.topContainer, {height:'auto'}]}>
                        <Text style={[BaseStyles.mainText, styles.title]}>{maintitleText}</Text>
                        
                    </View>
                    <View style={[BaseStyles.middleContainer]}>
                        <ScrollView style={[styles.scrollView]}>
                            {songs.map((song, index) => (
                                <TouchableOpacity style={[BaseStyles.button]} onPress={() => selectSong(index)}>
                                <View style={[styles.habitBox, BaseStyles.row, {justifyContent : 'flex-start'}]}>
                                        <Text style={[BaseStyles.text, styles.dateText]}>{formatDate(song.created_at)}</Text>
                                        <Text style={[BaseStyles.text, styles.addText]}>{song.title}</Text>
                                </View>
                            </TouchableOpacity>
                            ))
                            }
                        </ScrollView>
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
        width: 300, // Increased the width of the frame
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
    dateText:{
        fontSize:20,
        color:"#8C8C8C",
        marginHorizontal: 20
    },
    addText:{
        fontSize:25,
        color:"#000",
    },
    habitText:{
        fontSize:20,
        color:"#000",
    },

});

export default SongListScreen;