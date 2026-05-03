import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/create-profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHalf}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="health-and-safety" size={48} color="#4800b2" />
        </View>
        <Text style={styles.title}>LifeTrack</Text>
      </View>

      <View style={styles.bottomHalf}>
        <View style={styles.textContent}>
          <Text style={styles.headline}>Know your habits. Guard your health.</Text>
          <Text style={styles.bodyText}>
            Built for students who are too busy to notice the signs.
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            activeOpacity={0.8}
            onPress={handleGetStarted}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginHint}>Already have an account?</Text>
            <TouchableOpacity 
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  topHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 32,
  },
  logoContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#e8ddff',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    lineHeight: 32,
    color: '#4800b2',
    textAlign: 'center',
  },
  bottomHalf: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 48,
    gap: 24,
  },
  textContent: {
    alignItems: 'center',
    gap: 12,
  },
  headline: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
    lineHeight: 28,
    color: '#191c1d',
    textAlign: 'center',
  },
  bodyText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#494456',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  actionsContainer: {
    gap: 16,
    marginTop: 12,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#4800b2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  loginHint: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#494456',
  },
  loginText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    letterSpacing: 0.5,
    color: '#4800b2',
  },
});