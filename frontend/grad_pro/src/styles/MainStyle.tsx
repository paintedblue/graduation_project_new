import { StyleSheet } from 'react-native';


const MainStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: 20,
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
    },
    speechBubbleText: {
      color: '#000',
      textAlign: 'center',
    },
    buttonContainer: {
      width: '80%',
      alignItems: 'center',
    },
    button: {
      marginVertical: 5,
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      width: '100%',
    },
    startButton: {
      backgroundColor: '#FF7777',
    },
    savedSongsButton: {
      backgroundColor: '#3E68FA',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    songsList: {
      marginTop: 20,
      alignItems: 'center',
    },
    songText: {
      fontSize: 16,
      color: '#000',
    },
  });
  export default MainStyles;