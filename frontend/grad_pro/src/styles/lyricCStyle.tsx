import { StyleSheet } from 'react-native';

const lyricCStyle = StyleSheet.create({
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
        marginTop: 200, // 위로 더 이동
      },
      rRImage: {
        width: 50,
        height: 50,
      },
      nextImage: {
        width: 80,
        height: 80,
      },
      rowContainer:{
        flexDirection: 'row', 
        alignItems:'center',
        marginBottom: 80,
      },
      QuestionText: {
        color: '#000',
        textAlign: 'center',
        fontFamily: 'Jua-Regular',
        fontSize: 25,
        lineHeight:50,
      },
      AnswerText: {
        color: '#E4007F',
        textAlign: 'center',
        fontFamily: 'Jua-Regular',
        fontSize: 28,
        lineHeight:50,
      },
      buttonContainer: {
        width: '80%',
        alignItems: 'center',
        marginBottom: 40,
      },
      nextContainer: {
        width: '90%',
        alignItems:'flex-end',
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
      buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'Jua-Regular',
      },
      reRecordingText: {
        color: '#254A7B',
        fontSize: 25,
        fontFamily: 'Jua-Regular',
        marginLeft: 10,
      },
});
export default lyricCStyle;