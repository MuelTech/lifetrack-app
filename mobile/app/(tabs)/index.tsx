import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const navigateToLog = () => {
    router.push('/(tabs)/log' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top AppBar */}
      <View style={styles.appBar}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="health-and-safety" size={24} color="#6200ee" />
          <Text style={styles.logoText}>LifeTrack</Text>
        </View>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={20} color="#494456" />
        </View>
      </View>

      {/* Notification Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerLeft}>
          <MaterialIcons name="error" size={18} color="#93000a" />
          <Text style={styles.bannerText}>You haven't logged data today yet.</Text>
        </View>
        <TouchableOpacity onPress={navigateToLog}>
          <Text style={styles.bannerAction}>Log now</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>Good morning, Alex</Text>
          <Text style={styles.greetingSubtitle}>Wednesday, Oct 25 • Need to log</Text>
        </View>

        {/* Bento Grid */}
        <View style={styles.grid}>
          
          {/* Today's Status (Full Width) */}
          <View style={styles.fullCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.cardTitle}>TODAY'S STATUS</Text>
              <View style={styles.statusPill}>
                <MaterialIcons name="balance" size={14} color="#6200ee" />
                <Text style={styles.statusPillText}>Balanced</Text>
              </View>
            </View>
            <Text style={styles.statusDesc}>Your metrics look good overall, but sleep could be improved based on yesterday's log.</Text>
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
                <Text style={styles.cardValue}>5.5</Text>
                <Text style={styles.cardUnit}>hrs</Text>
              </View>
              <View style={styles.trendRow}>
                <MaterialIcons name="arrow-downward" size={14} color="#ba1a1a" />
                <Text style={styles.trendText}>-1h from avg</Text>
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
              <View style={styles.progressBarBg}>
                <View style={styles.progressBarFill} />
              </View>
              <Text style={styles.stressLabel}>Low-Medium</Text>
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
              <Text style={styles.activityValue}>Active</Text>
              <Text style={styles.activitySub}>2 sessions</Text>
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
                <Text style={styles.cardValue}>12</Text>
                <Text style={styles.cardUnit}>days</Text>
              </View>
            </View>
          </View>

          {/* Weekly Snapshot (Full Width) */}
          <View style={styles.fullCard}>
             <Text style={[styles.cardTitle, { marginBottom: 12 }]}>WEEKLY SNAPSHOT</Text>
             <View style={styles.chartContainer}>
                {[ 
                  { day: 'M', height: 40, color: '#78dc77' },
                  { day: 'T', height: 50, color: '#78dc77' },
                  { day: 'W', height: 30, color: '#fbbc04' },
                  { day: 'T', height: 20, color: '#ba1a1a' },
                  { day: 'F', height: 45, color: '#78dc77' },
                  { day: 'S', height: 10, color: '#e1e3e4' },
                  { day: 'S', height: 10, color: '#e1e3e4' }
                ].map((item, idx) => (
                  <View key={idx} style={styles.chartCol}>
                    <View style={[styles.chartBar, { height: item.height, backgroundColor: item.color }]} />
                    <Text style={styles.chartDay}>{item.day}</Text>
                  </View>
                ))}
             </View>
          </View>

          {/* Log Today CTA */}
          <TouchableOpacity style={styles.ctaButton} onPress={navigateToLog} activeOpacity={0.9}>
             <MaterialIcons name="edit" size={20} color="#ffffff" style={{ marginRight: 8 }} />
             <Text style={styles.ctaButtonText}>Log Today's Data</Text>
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
    paddingBottom: 80,
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
    backgroundColor: '#e8ddff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  statusPillText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#6200ee',
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
    marginBottom: 12,
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
    color: '#ba1a1a',
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
    width: '40%',
    height: '100%',
    backgroundColor: '#006a6a',
    borderRadius: 4,
  },
  stressLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#006a6a',
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

