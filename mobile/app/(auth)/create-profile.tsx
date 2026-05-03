import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreateProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Profile</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholderText}>Profile Form goes here</Text>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: '#4800b2',
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#191c1d',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 20,
  },
  placeholderText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: '#494456',
    textAlign: 'center',
    marginVertical: 40,
  },
  primaryButton: {
    backgroundColor: '#4800b2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#ffffff',
    textTransform: 'uppercase',
  }
});
