import { StyleSheet } from 'react-native';

const MainStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20, // 위아래 여백 추가
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 40, // 위로 더 이동
    },
    image: {
        width: 200,
        height: 200,
    },
    speechBubble: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        width: '80%',
        alignItems: 'center',
        marginBottom: 20,
    },
    speechBubbleText: {
        color: '#000',
        textAlign: 'center',
        fontFamily: 'Jua-Regular',
        fontSize: 20, 
    },
    buttonContainer: {
        width: '80%',
        alignItems: 'center',
        marginBottom: 40, 
    },
    button: {
        marginVertical: 5,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '50%',
    },
    startButton: {
        backgroundColor: '#129F42',
    },
    savedSongsButton: {
        backgroundColor: '#3E68FA',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'Jua-Regular',
    },
    songsList: {
        marginTop: 20,
        alignItems: 'center',
    },
    songText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Jua-Regular', // 폰트 설정
    },
    topImage: {
        width: '100%',
        height: 200, // Adjust the height as needed
    },
    
});

export default MainStyles;
