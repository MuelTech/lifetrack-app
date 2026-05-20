import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { api } from '../../utils/api';

export default function InsightsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      fetchInsights();
    }, [])
  );

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/insights');
      setInsights(res.data);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !insights) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color="#6200ee" />
      </SafeAreaView>
    );
  }

  const lifestyleStatus = insights?.lifestyleStatus || 'BALANCED';
  const activePatterns = insights?.activePatterns || [];
  const recommendations = insights?.recommendations || [
    'Maintain your regular log entries to build patterns.',
    'Try drinking 8 cups of water today.',
    'Aim to sleep before midnight.'
  ];

  // Map status values for visual elements
  let statusText = 'Balanced Routine';
  let statusDesc = 'Your routine is stable. Keep tracking to maintain your healthy habits.';
  let statusBadge = 'Normal';
  let statusColor = '#00480f'; // green
  let statusBg = '#e2f4e3';
  let barWidth = '100%';

  if (lifestyleStatus === 'NEEDS_IMPROVEMENT') {
    statusText = 'Needs Improvement';
    statusDesc = 'We noticed minor irregularities in sleep or hydration. Focus on consistent hydration and regular sleep.';
    statusBadge = 'Minor Risks';
    statusColor = '#FF8F00'; // orange
    statusBg = '#fff3e0';
    barWidth = '60%';
  } else if (lifestyleStatus === 'UNHEALTHY_PATTERN_DETECTED') {
    statusText = 'Unhealthy Patterns';
    statusDesc = 'Multiple critical warnings detected regarding sleep, high screen hours, and physical inactivity.';
    statusBadge = 'High Warning';
    statusColor = '#ba1a1a'; // red
    statusBg = '#ffdad6';
    barWidth = '30%';
  }

  // Details for rendering patterns
  const PATTERN_DETAILS: { [key: string]: { icon: string, title: string, desc: string, isWarning: boolean } } = {
    'Sleep Deprivation': {
      icon: 'bedtime',
      title: 'Sleep Deprivation',
      desc: 'You have slept under 6 hours on average over your recent entries.',
      isWarning: false, // critical/red
    },
    'Dehydration Trend': {
      icon: 'water-drop',
      title: 'Dehydration Trend',
      desc: 'Your average water intake is below the recommended 5 cups.',
      isWarning: true, // warning/orange
    },
    'Excessive Screen Time': {
      icon: 'devices',
      title: 'Excessive Screen Time',
      desc: 'You are spending a high amount of leisure screen time (>4 hours/day).',
      isWarning: true,
    },
    'Poor Nutrition': {
      icon: 'restaurant',
      title: 'Poor Nutrition',
      desc: 'You have skipped meals or eaten junk food frequently in the past few days.',
      isWarning: true,
    },
    'Sedentary Lifestyle': {
      icon: 'directions-run',
      title: 'Sedentary Lifestyle',
      desc: 'Your physical activity level is low (average <15 mins/day).',
      isWarning: true,
    },
    'High Stress Alert': {
      icon: 'psychology',
      title: 'High Stress Alert',
      desc: 'Your stress level is currently reported as High.',
      isWarning: false,
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top AppBar */}
      <View style={styles.appBar}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="health-and-safety" size={24} color="#6200ee" />
          <Text style={styles.logoText}>LifeTrack</Text>
        </View>
        <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push('/profile')}>
          <MaterialIcons name="person" size={20} color="#494456" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Insights.</Text>
        </View>

        {/* Weekly Summary */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitleText}>{statusText}</Text>
              <Text style={styles.cardSubtitleText}>Overall Routine Health</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: statusBg }]}>
              <Text style={[styles.badgeText, { color: statusColor }]}>{statusBadge}</Text>
            </View>
          </View>
          <Text style={styles.cardBodyText}>{statusDesc}</Text>
          <View style={styles.progressBarBg}>
             <View style={[styles.progressBarFill, { width: barWidth as any, backgroundColor: statusColor }]} />
          </View>
        </View>

        {/* Detected Patterns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detected Patterns</Text>
          
          {activePatterns.length > 0 ? (
            activePatterns.map((patName: string) => {
              const details = PATTERN_DETAILS[patName] || {
                icon: 'warning',
                title: patName,
                desc: 'Unhealthy lifestyle trend detected.',
                isWarning: true,
              };

              return (
                <View key={patName} style={styles.patternCard}>
                  <View style={details.isWarning ? styles.patternAccentWarning : styles.patternAccentError} />
                  <View style={styles.patternContent}>
                    <View style={details.isWarning ? styles.patternIconWarning : styles.patternIconError}>
                      <MaterialIcons name={details.icon as any} size={20} color={details.isWarning ? '#FF8F00' : '#ba1a1a'} />
                    </View>
                    <View style={styles.patternTextContainer}>
                      <Text style={styles.patternTitle}>{details.title}</Text>
                      <Text style={styles.patternDesc}>{details.desc}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="check-circle" size={40} color="#006218" style={{ marginBottom: 8 }} />
              <Text style={styles.emptyText}>All systems nominal! No unhealthy patterns detected in your recent logs.</Text>
            </View>
          )}
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
           
           <View style={styles.recommendationList}>
              {recommendations.map((recText: string, idx: number) => {
                // Pick icon colors based on index
                const iconColors = [
                  { bg: 'rgba(98, 0, 238, 0.1)', color: '#6200ee', icon: 'nights-stay' },
                  { bg: 'rgba(0, 98, 24, 0.1)', color: '#006218', icon: 'directions-walk' },
                  { bg: 'rgba(186, 26, 26, 0.2)', color: '#ba1a1a', icon: 'local-cafe' },
                ];
                const opt = iconColors[idx % iconColors.length];

                return (
                  <View key={idx} style={styles.recItem}>
                     <View style={[styles.recIconWrap, { backgroundColor: opt.bg }]}>
                        <MaterialIcons name={opt.icon as any} size={18} color={opt.color} />
                     </View>
                     <Text style={styles.recText}>{recText}</Text>
                     <TouchableOpacity style={styles.recAddBtn}>
                        <MaterialIcons name="add" size={16} color="#7a7488" />
                     </TouchableOpacity>
                  </View>
                );
              })}
           </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 20,
    letterSpacing: -0.5,
    color: '#6200ee',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e1e3e4',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#191c1d',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e3e4',
    padding: 16,
    marginBottom: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
    color: '#191c1d',
  },
  cardSubtitleText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#494456',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
  },
  cardBodyText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#191c1d',
    lineHeight: 20,
    marginBottom: 12,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#e7e8e9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
    color: '#191c1d',
    marginBottom: 4,
  },
  patternCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e3e4',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  patternAccentError: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#ba1a1a',
  },
  patternAccentWarning: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FFA000',
  },
  patternContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  patternIconError: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffdad6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternIconWarning: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFECB3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternTextContainer: {
    flex: 1,
  },
  patternTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: '#191c1d',
  },
  patternDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#494456',
    marginTop: 4,
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e3e4',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#00480f',
    textAlign: 'center',
    lineHeight: 20,
  },
  recommendationList: {
    gap: 12,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e3e4',
    padding: 12,
    gap: 12,
  },
  recIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recText: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#191c1d',
  },
  recAddBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7a7488',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
