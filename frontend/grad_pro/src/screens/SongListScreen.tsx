import React, {useState, useEffect} from "react";
import {Text, View, TouchableOpacity, Alert, StyleSheet, Image} from "react-native";
import BaseStyles from "../styles/BaseStyles";
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
    const type = "Play";
    const maintitleText = "저장된 노래";
    const [popup, setpopup] = useState(false); 
    const [delIndex, setDelIndex] = useState(0); 
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

    const deleteSong = (index) => {
        setDelIndex(index);
        handlerOpenPopUP();
    };

    const deleteSongTrue = async () => {
        try {
            const response = await fetch('http://15.165.249.244:3000/api/song/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ songId: songs[delIndex].songId })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error during fetch operation:", error.message);
            Alert.alert("Error", error.message);
        }finally{
        requestSongList();
        handlerClosePopUP();
        }
    };

    const handlerOpenPopUP = () => {
        setpopup(true);
    };

    const handlerClosePopUP = () => {
        setpopup(false);
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

                                    <TouchableOpacity style={styles.closeButton} onPress={() => deleteSong(index)}>
                                    <Text style={[BaseStyles.text, styles.closeButtonText]}>X</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
            {popup && (
                <View style={[styles.popupBg]}>
                    <View style={[styles.popupWin]}>
                        <Text style={[BaseStyles.text, { fontSize: 25 }]}>정말로 삭제하시겠습니까?</Text>
                        <View style={[BaseStyles.row,{width:'100%',justifyContent:'space-between', paddingHorizontal:80}]}>
                            <TouchableOpacity style={styles.completeButton} onPress={deleteSongTrue}>
                                <Text style={[BaseStyles.text, { color: '#000' }]}>네</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.completeButton} onPress={handlerClosePopUP}>
                                <Text style={[BaseStyles.text, { color: '#000' }]}>아니요</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
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
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 10,
        borderRadius: 20,
        padding: 5,
      },
      closeButtonText: {
        color:'#F22',
        fontSize: 16,
        fontWeight: 'bold',
      },
    popupBg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(150,150,150,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupWin: {
        borderRadius: 10,
        width: 300,
        height: 200,
        backgroundColor: '#0052D4',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical:50
    },
    completeButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
});

export default SongListScreen;
