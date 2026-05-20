import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../utils/store/authStore';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments() as string[];
  const sessionToken = useAuthStore(state => state.sessionToken);
  const hasProfile = useAuthStore(state => state.hasProfile);

  useEffect(() => {
    if (segments.length === 0) return;

    const rootGroup = segments[0];
    const screenName = segments[1];

    const inAuthGroup = rootGroup === '(auth)';
    const inTabsGroup = rootGroup === '(tabs)';
    
    // Check if the current screen is part of the profile setup flow
    const isProfileSetupScreen = 
      screenName === 'create-profile' || 
      screenName === 'app-walkthrough' || 
      screenName === 'notification-permission';

    if (!sessionToken) {
      // 1. Not Authenticated
      // If user is inside tabs or profile setup screens, force them to Welcome (/)
      if (inTabsGroup || isProfileSetupScreen) {
        router.replace('/');
      }
    } else {
      // 2. Authenticated
      if (!hasProfile) {
        // User logged in but profile is not completed
        // Force profile creation flow
        if (!isProfileSetupScreen) {
          router.replace('/(auth)/create-profile');
        }
      } else {
        // User is logged in and has profile completed
        // Send them to dashboard tabs. If they land on login, register, or welcome, redirect to tabs
        const isRootWelcome = rootGroup === 'index' || segments.join('/') === '';
        const isAuthCredentialScreen = screenName === 'login' || screenName === 'create-account';
        
        if (isRootWelcome || isAuthCredentialScreen || isProfileSetupScreen) {
          router.replace('/(tabs)');
        }
      }
    }
  }, [sessionToken, hasProfile, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <NavigationGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: 'Welcome' }} />
          <Stack.Screen name="profile" options={{ title: 'Profile', presentation: 'modal' }} />
        </Stack>
      </NavigationGuard>
      <StatusBar style="auto" />
    </>
  );
}