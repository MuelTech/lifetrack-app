import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../../utils/api';

// Date Formatter helper
const getLocalDateString = (d: Date = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function HomeScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [todayLog, setTodayLog] = useState<any>(null);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  // Refresh data whenever screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile
      const profileRes = await api.get('/users/profile/me');
      setProfile(profileRes.data.profile);

      // 2. Fetch Today's Log Status
      const todayDateStr = getLocalDateString();
      const todayLogRes = await api.get(`/users/logs/today?date=${todayDateStr}`);
      if (todayLogRes.data && todayLogRes.data.logged) {
        setTodayLog(todayLogRes.data.log);
        setHasLoggedToday(true);
      } else {
        setTodayLog(null);
        setHasLoggedToday(false);
      }

      // 3. Fetch Weekly Snapshot
      const historyRes = await api.get('/users/logs/history');
      const allLogs = historyRes.data.logs || [];
      
      // Calculate last 7 calendar days
      const daysArray = [];
      const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = getLocalDateString(d);
        const label = weekdayLabels[d.getDay()];
        
        // Find if a log exists for this date string
        const matchingLog = allLogs.find((l: any) => {
          // slice "YYYY-MM-DD" from ISO string if returned, or match exactly
          const logDatePart = l.date.split('T')[0];
          return logDatePart === dayStr;
        });

        if (matchingLog) {
          let color = '#78dc77'; // BALANCED
          if (matchingLog.patternResult) {
            if (matchingLog.patternResult.lifestyleStatus === 'NEEDS_IMPROVEMENT') {
              color = '#fbbc04';
            } else if (matchingLog.patternResult.lifestyleStatus === 'UNHEALTHY_PATTERN_DETECTED') {
              color = '#ba1a1a';
            }
          }
          
          // Height between 15 and 60 depending on sleep hours (cap at 12 hours)
          const sleepHrs = matchingLog.sleepHours || 0;
          const height = Math.min(60, Math.max(15, (sleepHrs / 12) * 50 + 10));

          daysArray.push({
            day: label,
            height,
            color,
          });
        } else {
          // No log
          daysArray.push({
            day: label,
            height: 10,
            color: '#e1e3e4',
          });
        }
      }

      setWeeklyData(daysArray);
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLog = () => {
    router.push('/(tabs)/log' as any);
  };

  if (loading && !profile) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color="#6200ee" />
      </SafeAreaView>
    );
  }

  // Formatting Greeting Details
  const nickname = profile?.nickname || 'Friend';
  const streak = profile?.currentStreak || 0;

  // Formatting Today Status Card
  let statusTitle = 'NO LOG';
  let statusDesc = 'You have not logged any lifestyle metrics for today. Let us track your sleep, diet, activity, screen time, and stress levels.';
  let statusColor = '#6200ee';
  
  if (hasLoggedToday && todayLog) {
    const statusVal = todayLog.patternResult?.lifestyleStatus || 'BALANCED';
    if (statusVal === 'BALANCED') {
      statusTitle = 'Balanced';
      statusDesc = 'Your metrics look good overall! Maintain your current sleep, hydration, and active hours.';
      statusColor = '#6200ee';
    } else if (statusVal === 'NEEDS_IMPROVEMENT') {
      statusTitle = 'Needs Improvement';
      statusDesc = 'Some of your logged habits (like low sleep or hydration) need attention. Take a look at your insights.';
      statusColor = '#fbbc04';
    } else {
      statusTitle = 'Unhealthy Pattern';
      statusDesc = 'Multiple negative patterns detected today (e.g. high screen time and high stress). Try to wind down early.';
      statusColor = '#ba1a1a';
    }
  }

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

      {/* Notification Banner */}
      {!hasLoggedToday && (
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <MaterialIcons name="error" size={18} color="#93000a" />
            <Text style={styles.bannerText}>You haven't logged data today yet.</Text>
          </View>
          <TouchableOpacity onPress={navigateToLog}>
            <Text style={styles.bannerAction}>Log now</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>Good morning, {nickname}</Text>
          <Text style={styles.greetingSubtitle}>
            {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })} • {hasLoggedToday ? 'Logged' : 'Need to log'}
          </Text>
        </View>

        {/* Bento Grid */}
        <View style={styles.grid}>
          
          {/* Today's Status (Full Width) */}
          <View style={styles.fullCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.cardTitle}>TODAY'S STATUS</Text>
              <View style={[styles.statusPill, { backgroundColor: statusColor + '1c' }]}>
                <MaterialIcons name="balance" size={14} color={statusColor} />
                <Text style={[styles.statusPillText, { color: statusColor }]}>{statusTitle}</Text>
              </View>
            </View>
            <Text style={styles.statusDesc}>{statusDesc}</Text>
          </View>

          {/* Row 1: Sleep & Stress */}
          <View style={styles.row}>
            {/* Sleep Card */}
            <View style={styles.halfCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.iconWrapper}>
                  <MaterialIcons name="bedtime" size={16} color="#6200ee" />
                </View>
                <Text style={styles.cardHeaderTitle}>Sleep</Text>
              </View>
              <View style={styles.cardValueRow}>
                <Text style={styles.cardValue}>
                  {hasLoggedToday ? todayLog?.sleepHours : '--'}
                </Text>
                <Text style={styles.cardUnit}>hrs</Text>
              </View>
              <View style={styles.trendRow}>
                <MaterialIcons 
                  name={hasLoggedToday && todayLog?.sleepHours >= 7 ? "arrow-upward" : "arrow-downward"} 
                  size={14} 
                  color={hasLoggedToday && todayLog?.sleepHours >= 7 ? "#006218" : "#ba1a1a"} 
                />
                <Text style={[styles.trendText, { color: hasLoggedToday && todayLog?.sleepHours >= 7 ? "#006218" : "#ba1a1a" }]}>
                  {hasLoggedToday ? (todayLog?.sleepHours >= 7 ? 'Optimal sleep' : 'Under 7h target') : 'No entry'}
                </Text>
              </View>
            </View>

            {/* Stress Card */}
            <View style={styles.halfCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.iconWrapper}>
                  <MaterialIcons name="psychology" size={16} color="#6200ee" />
                </View>
                <Text style={styles.cardHeaderTitle}>Stress</Text>
              </View>
              
              {/* Stress Level Visualizer */}
              {hasLoggedToday ? (
                <>
                  <View style={styles.progressBarBg}>
                    <View style={[
                      styles.progressBarFill, 
                      { 
                        width: todayLog?.stressLevel === 'LOW' ? '30%' : todayLog?.stressLevel === 'MODERATE' ? '60%' : '100%',
                        backgroundColor: todayLog?.stressLevel === 'LOW' ? '#006a6a' : todayLog?.stressLevel === 'MODERATE' ? '#fbbc04' : '#ba1a1a' 
                      }
                    ]} />
                  </View>
                  <Text style={[
                    styles.stressLabel, 
                    { color: todayLog?.stressLevel === 'LOW' ? '#006a6a' : todayLog?.stressLevel === 'MODERATE' ? '#c89200' : '#ba1a1a' }
                  ]}>
                    {todayLog?.stressLevel ? todayLog.stressLevel.charAt(0) + todayLog.stressLevel.slice(1).toLowerCase() : '--'}
                  </Text>
                </>
              ) : (
                <Text style={styles.noValueText}>No entry</Text>
              )}
            </View>
          </View>

          {/* Row 2: Activity & Streak */}
          <View style={styles.row}>
            {/* Activity Card */}
            <View style={styles.halfCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.iconWrapper}>
                  <MaterialIcons name="directions-run" size={16} color="#6200ee" />
                </View>
                <Text style={styles.cardHeaderTitle}>Activity</Text>
              </View>
              <Text style={styles.activityValue}>
                {hasLoggedToday && todayLog?.activityDuration > 0 ? `${todayLog.activityDuration} min` : 'None'}
              </Text>
              <Text style={styles.activitySub}>
                {hasLoggedToday && todayLog?.activityType[0] && todayLog?.activityType[0] !== 'NONE' 
                  ? todayLog.activityType[0].charAt(0) + todayLog.activityType[0].slice(1).toLowerCase() 
                  : 'No sessions'}
              </Text>
            </View>

            {/* Streak Card */}
            <View style={styles.halfCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.iconWrapperRed}>
                  <MaterialIcons name="local-fire-department" size={16} color="#ba1a1a" />
                </View>
                <Text style={styles.cardHeaderTitle}>Streak</Text>
              </View>
              <View style={styles.cardValueRow}>
                <Text style={styles.cardValue}>{streak}</Text>
                <Text style={styles.cardUnit}>days</Text>
              </View>
            </View>
          </View>

          {/* Weekly Snapshot (Full Width) */}
          <View style={styles.fullCard}>
             <Text style={[styles.cardTitle, { marginBottom: 12 }]}>WEEKLY SNAPSHOT (SLEEP)</Text>
             <View style={styles.chartContainer}>
                {weeklyData.length > 0 ? (
                  weeklyData.map((item, idx) => (
                    <View key={idx} style={styles.chartCol}>
                      <View style={[styles.chartBar, { height: item.height, backgroundColor: item.color }]} />
                      <Text style={styles.chartDay}>{item.day}</Text>
                    </View>
                  ))
                ) : (
                  [...Array(7)].map((_, idx) => (
                    <View key={idx} style={styles.chartCol}>
                      <View style={[styles.chartBar, { height: 10, backgroundColor: '#e1e3e4' }]} />
                      <Text style={styles.chartDay}>-</Text>
                    </View>
                  ))
                )}
             </View>
          </View>

          {/* Log Today CTA */}
          <TouchableOpacity style={styles.ctaButton} onPress={navigateToLog} activeOpacity={0.9}>
             <MaterialIcons name="edit" size={20} color="#ffffff" style={{ marginRight: 8 }} />
             <Text style={styles.ctaButtonText}>
               {hasLoggedToday ? 'Update Today\'s Entry' : 'Log Today\'s Data'}
             </Text>
          </TouchableOpacity>

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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffdad6',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#93000a',
  },
  bannerAction: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#6200ee',
    textDecorationLine: 'underline',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  greetingContainer: {
    marginBottom: 24,
  },
  greetingTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#191c1d',
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#494456',
  },
  grid: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  fullCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cbc3d9',
    padding: 12,
  },
  halfCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cbc3d9',
    padding: 12,
    justifyContent: 'space-between',
    minHeight: 110,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#494456',
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  statusPillText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
  },
  statusDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#191c1d',
    lineHeight: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  iconWrapper: {
    backgroundColor: '#f3f4f5',
    padding: 4,
    borderRadius: 6,
  },
  iconWrapperRed: {
    backgroundColor: '#ffdad6',
    padding: 4,
    borderRadius: 6,
  },
  cardHeaderTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#494456',
  },
  cardValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 4,
  },
  cardValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#191c1d',
  },
  cardUnit: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#494456',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#e1e3e4',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  stressLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
  },
  noValueText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#7a7488',
  },
  activityValue: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
    color: '#191c1d',
    marginBottom: 4,
  },
  activitySub: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#494456',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 60,
    paddingHorizontal: 8,
  },
  chartCol: {
    alignItems: 'center',
    gap: 4,
  },
  chartBar: {
    width: 24,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartDay: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: '#494456',
    letterSpacing: 1,
  },
  ctaButton: {
    width: '100%',
    backgroundColor: '#006a6a',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  ctaButtonText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  }
});
