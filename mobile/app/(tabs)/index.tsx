import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Home Dashboard</Text>
        <Text style={styles.subtitle}>Bento grid cards will go here</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#191c1d',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: '#494456',
  }
});
