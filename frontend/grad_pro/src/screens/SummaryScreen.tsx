import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const SummaryScreen = ({ route, navigation }) => {
  const { answers } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>요약 정보</Text>
      <Text style={styles.content}>주인공: {answers.mainCharacter}</Text>
      <Text style={styles.content}>좋아하는 색깔: {answers.likeColor}</Text>
      <Text style={styles.content}>좋아하는 것: {answers.likeThing}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default SummaryScreen;
