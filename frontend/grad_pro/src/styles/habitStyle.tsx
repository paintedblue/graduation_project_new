import { StyleSheet } from 'react-native';

const habitStyles = StyleSheet.create({
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
      width: '100%',
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    contentContainerCentered: {
      justifyContent: 'center',
    },
    title: {
      fontSize: 35,
      marginTop: 40, 
      fontFamily: 'Jua-Regular',
    },
    subtitle: {
      fontSize: 25,
      marginTop: 40, 
      marginBottom: 40,
      fontFamily: 'Jua-Regular',
      textAlign: 'center',
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'center',
      width: '70%',
    },
    buttonContainerCentered: {
      justifyContent: 'center',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
    },
    buttonText: {
      marginLeft: 10,
      fontSize: 20,
      fontFamily: 'Jua-Regular',
    },
    input: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
      width: '100%',
    },
    completeButton: {
      backgroundColor: '#129F42',
      padding: 15,
      borderRadius: 5,
      marginTop: 30,
      alignSelf: 'stretch',
      alignItems: 'center',
    },
    backButton: {
      position: 'absolute',
      top: 40,
      left: 20,
      padding: 10,
    },
    backIcon: {
      width: 30,
      height: 30,
    },
  });
  

  export default habitStyles;