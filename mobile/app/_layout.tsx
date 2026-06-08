import { useEffect, useState } from 'react';
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
import * as Network from 'expo-network';
import { useAuthStore } from '../utils/store/authStore';
import { useSyncStore } from '../utils/store/syncStore';
import { api } from '../utils/api';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments() as string[];
  const sessionToken = useAuthStore(state => state.sessionToken);
  const hasProfile = useAuthStore(state => state.hasProfile);

  useEffect(() => {
    const rootGroup = segments[0];
    const screenName = segments[1];

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
        const isAuthCredentialScreen = rootGroup === '(auth)' || screenName === 'login' || screenName === 'create-account';
        
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

  const [isHydrated, setIsHydrated] = useState(useAuthStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setIsHydrated(true));
    setIsHydrated(useAuthStore.persist.hasHydrated());
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded && isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error, isHydrated]);

  // Background Auto-Syncer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const syncLogs = async () => {
      const state = useSyncStore.getState();
      const queuedLogs = state.queuedLogs;
      
      if (queuedLogs.length === 0) return;

      const networkState = await Network.getNetworkStateAsync();
      if (networkState.isConnected) {
        for (const log of queuedLogs) {
          try {
            await api.post('/users/log', log.payload);
            state.removeLog(log.id); // Remove on success
            console.log(`Synced log ${log.id} successfully.`);
          } catch (error) {
            console.error(`Failed to sync log ${log.id}:`, error);
          }
        }
      }
    };

    // Try to sync on mount
    syncLogs();

    // Polling every 15 seconds
    interval = setInterval(syncLogs, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!fontsLoaded || !isHydrated) {
    return null;
  }

  return (
    <>
      <NavigationGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: 'Welcome' }} />
          <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="profile" options={{ title: 'Profile', presentation: 'modal' }} />
        </Stack>
      </NavigationGuard>
      <StatusBar style="auto" />
    </>
  );
}