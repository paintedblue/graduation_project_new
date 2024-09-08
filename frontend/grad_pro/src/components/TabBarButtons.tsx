import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TabBarButtons: React.FC = () => {
  return (
    <View style={styles.tabBarButtons}>
      <View style={styles.tab}>
        <Text style={styles.symbol}>⏰</Text>
        <Text style={styles.label}>습관</Text>
      </View>
      <View style={styles.tab}>
        <Text style={styles.symbol}>📃</Text>
        <Text style={styles.label}>가사</Text>
      </View>
      <View style={styles.tab}>
        <Text style={styles.symbol}>🎶</Text>
        <Text style={styles.label2}>멜로디</Text>
      </View>
      <View style={styles.tab}>
        <Text style={styles.symbol}>✅</Text>
        <Text style={styles.label3}>동요 완성!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarButtons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Adjusted to evenly distribute the tabs
    paddingHorizontal: 10,
    paddingVertical: 5,
    boxSizing: 'border-box',
  },
  tab: {
    flex: 1, // Each tab takes up an equal amount of space
    alignItems: 'center',
    justifyContent: 'center',
    height: 70, // Adjusted height to accommodate larger text
    flexDirection: 'column', // Arrange items in a column (top to bottom)
  },
  label: {
    fontSize: 14, // Increased font size
    fontFamily: 'Jua-Regular',
    textAlign: 'center',
    marginTop: 5, // Space between icon and text
  },
  label2: {
    fontSize: 14, // Increased font size
    fontFamily: 'Jua-Regular',
    textAlign: 'center',
    marginTop: 5, // Space between icon and text
  },
  label3: {
    fontSize: 13, // Increased font size slightly
    fontFamily: 'Jua-Regular',
    textAlign: 'center',
    marginTop: 5, // Space between icon and text
  },
  symbol: {
    fontSize: 24, // Increased icon size to match larger text
    fontWeight: '500',
    fontFamily: 'Jua-Regular',
    color: '#999',
    textAlign: 'center',
  },
});

export default TabBarButtons;
