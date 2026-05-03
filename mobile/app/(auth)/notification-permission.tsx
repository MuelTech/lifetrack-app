import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function NotificationPermissionScreen() {
  const router = useRouter();

  const handleAllow = () => {
    // Navigate to Home Dashboard after allowing notifications
    // Assuming Home Dashboard is in tabs
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Placeholder Illustration */}
        <View style={styles.illustrationContainer}>
          <MaterialIcons name="notifications-active" size={72} color="#4800b2" />
        </View>

        <Text style={styles.title}>Stay on track</Text>
        <Text style={styles.description}>
          Allow notifications to get short reminders for your daily log and alerts when we notice new health patterns.
        </Text>

        {/* Mock Notifications */}
        <View style={styles.mockContainer}>
          <View style={styles.mockCard}>
            <View style={styles.mockIconBg}>
              <MaterialIcons name="wb-sunny" size={16} color="#4800b2" />
            </View>
            <View style={styles.mockTextContainer}>
              <View style={styles.mockHeaderRow}>
                <Text style={styles.mockTitle}>LifeTrack</Text>
                <Text style={styles.mockTime}>8:00 AM</Text>
              </View>
              <Text style={styles.mockSubTitle}>Good morning!</Text>
              <Text style={styles.mockMessage}>Log your sleep and breakfast.</Text>
            </View>
          </View>

          <View style={styles.mockCard}>
            <View style={styles.mockIconBg}>
              <MaterialIcons name="insights" size={16} color="#4800b2" />
            </View>
            <View style={styles.mockTextContainer}>
              <View style={styles.mockHeaderRow}>
                <Text style={styles.mockTitle}>LifeTrack</Text>
                <Text style={styles.mockTime}>Now</Text>
              </View>
              <Text style={styles.mockSubTitle}>Pattern detected</Text>
              <Text style={styles.mockMessage}>We noticed something in your routine. Check your Insights.</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleAllow} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Allow Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostButton} onPress={handleSkip} activeOpacity={0.8}>
            <Text style={styles.ghostButtonText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
  },
  illustrationContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 28,
    color: '#191c1d',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: '#494456',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  mockContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 48,
  },
  mockCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    gap: 12,
  },
  mockIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  mockTextContainer: {
    flex: 1,
  },
  mockHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mockTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: '#494456',
  },
  mockTime: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: '#888780',
  },
  mockSubTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#191c1d',
    marginBottom: 2,
  },
  mockMessage: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: '#494456',
    lineHeight: 18,
  },
  footer: {
    width: '100%',
    marginTop: 'auto',
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#4800b2',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
  ghostButton: {
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostButtonText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: '#494456',
  },
});
