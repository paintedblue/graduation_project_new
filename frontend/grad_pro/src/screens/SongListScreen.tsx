import React, {useState, useEffect} from "react";
import {Text, View, TouchableOpacity, Alert, StyleSheet, Image} from "react-native";
import BaseStyles from "../styles/BaseStyles";
import Header from "../components/TabBarButtons";
import { ScrollView } from "react-native-gesture-handler";

const SongListScreen = ({route, navigation}) => {
    // 개발용 더미 데이터
    const exData = [{"created_at": "2024-09-17T19:38:30.716Z", 
                "id": "b75bae35-8041-4d42-a1b1-4e226a241206", 
                "lyric": "나는 나는 지윤, 초콜릿을 좋아해\n근데 매일매일 양치해야 해\n노란 빛 칫솔로 씽씽씽\n건강한 미소로 빙글빙글 웃지", 
                "title": "지윤이 양치송", 
                },
                {"created_at": "2024-09-17T19:38:30.716Z", 
                "id": "b75bae35-8041-4d42-a1b1-4e226a241206", 
                "lyric": "나는 나는 지윤, 초콜릿을 좋아해\n근데 매일매일 양치해야 해\n노란 빛 칫솔로 씽씽씽\n건강한 미소로 빙글빙글 웃지", 
                "title": "지윤이 양치송", 
                }];
    
    const {userId} = route.params;
    const [songs, setSongs] = useState(exData); 
    const type = "Play";
    const maintitleText = "저장된 노래";
    
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
            setSongs(data.habits);
        } catch (error) {
            console.error("Error during fetch operation:", error.message);
            Alert.alert("Error", error.message);
        }
    };

    const selectSong = (index) => {
        const requestData = songs[index];
        navigation.navigate('PlayScreen', {userId, requestData, type});
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}.${day}`;
    };

    return (
        <View style={[BaseStyles.flexContainer, {backgroundColor: '#A5BEDF'}]}>
            <Header />

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Image source={require('../assets/imgs/backward.png')} style={styles.backButtonImage} />
            </TouchableOpacity>

            <View style={[BaseStyles.contentContainer]}>
                <View style={[BaseStyles.topContainer, {height:'15%'}]}>
                    <Text style={[BaseStyles.mainText, styles.title]}>{maintitleText}</Text>
                </View>
                <View style={[BaseStyles.middleContainer]}>
                    <ScrollView style={[styles.scrollView]}>
                        {songs.map((song, index) => (
                            <TouchableOpacity key={index} style={[BaseStyles.button]} onPress={() => selectSong(index)}>
                                <View style={[styles.habitBox, BaseStyles.row, {justifyContent : 'flex-start'}]}>
                                    <Text style={[BaseStyles.text, styles.dateText]}>{formatDate(song.created_at)}</Text>
                                    <Text style={[BaseStyles.text, styles.addText]}>{song.title}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title:{
        fontSize: 35,
        lineHeight: 90,
    },
    subtitle:{
        fontSize: 20,
        lineHeight: 40,
    },
    scrollView:{
        flex:1,
    },
    habitBox:{
        width: 300,
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
        flexDirection: 'row',
    },
    dateText:{
        fontSize: 20,
        color: "#8C8C8C",
        marginHorizontal: 20,
    },
    addText:{
        fontSize: 25,
        color: "#000",
    },
    habitText:{
        fontSize: 20,
        color: "#000",
    },
    backButton:{
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 90,
        height: 90,
        zIndex: 10,  // Ensures that the button is on top of other elements
    },
    backButtonImage: {
        width: 90,
        height: 90,
    },
});

export default SongListScreen;
