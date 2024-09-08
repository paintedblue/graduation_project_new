import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TabBarButtons from '../components/TabBarButtons';  



const LyricsBox = ({ lyrics }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.lyrics}>{lyrics}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%', // Adjusted width to make it smaller
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  lyrics: {
    fontFamily: 'Jua-Regular',
    fontSize: 18, // Adjusted font size
    color: 'black',
    lineHeight: 25, // Adjusted line height for better readability
    textAlign: 'center',
  },
});

export default LyricsBox;
