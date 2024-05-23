import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ViewDataScreen = ({ route, navigation }) => {
  const { data } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>저장된 사용자 정보</Text>
      <Text style={styles.content}>사용자 ID: {data.userId}</Text> 
      <Button title="돌아가기" onPress={() => navigation.goBack()} />
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

export default ViewDataScreen;