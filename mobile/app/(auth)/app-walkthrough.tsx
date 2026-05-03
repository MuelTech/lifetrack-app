import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Log your day',
    description: 'Takes less than 2 minutes. Sleep, food, activity, stress — all in one place.',
    icon: 'edit-document',
    iconBg: 'rgba(98, 0, 238, 0.1)', // primary-container/10
    iconColor: '#4800b2', // primary
  },
  {
    id: '2',
    title: 'We find the patterns',
    description: 'LifeTrack detects unhealthy routines before they become health risks.',
    icon: 'insights',
    iconBg: '#e8ddff',
    iconColor: '#4800b2',
  },
  {
    id: '3',
    title: 'Get real guidance',
    description: 'Not a diagnosis — just honest, student-friendly advice based on your habits.',
    icon: 'menu-book',
    iconBg: 'rgba(98, 0, 238, 0.2)', // primary-container/20
    iconColor: '#4800b2', // primary
  },
];

export default function AppWalkthroughScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Final slide CTA -> Next is Notification Permission
      router.push('/(auth)/notification-permission' as any); // fallback if it doesn't exist yet we will create it next
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/notification-permission' as any);
  };

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return (
      <View style={styles.slide}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
          <MaterialIcons name={item.icon as any} size={80} color={item.iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Actions */}
      <View style={styles.header}>
        {currentIndex < SLIDES.length - 1 ? (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ height: 40 }} /> /* Spacer for alignment */
        )}
      </View>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={styles.flatList}
      />

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {/* Progress Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* CTA Button */}
        {currentIndex === SLIDES.length - 1 ? (
          <TouchableOpacity style={styles.finalButton} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.finalButtonText}>Sounds good, let's go</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextButtonText}>Next</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#ffffff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        )}
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
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  skipText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#494456',
    letterSpacing: 0.5,
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 192,
    height: 192,
    borderRadius: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#191c1d',
    textAlign: 'center',
    lineHeight: 32,
  },
  description: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: '#494456',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 32,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e1e3e4',
  },
  activeDot: {
    backgroundColor: '#4800b2',
  },
  nextButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#4800b2',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
    color: '#ffffff',
  },
  finalButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#4800b2',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finalButtonText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
    color: '#ffffff',
  },
});