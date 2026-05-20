import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { api } from '../../utils/api';

const getLocalDateString = (d: Date = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function HistoryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [calendarGrid, setCalendarGrid] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchLogsHistory();
    }, [])
  );

  const fetchLogsHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/logs/history');
      const allLogs = res.data.logs || [];
      setLogs(allLogs);

      // Build Calendar Grid for current month
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth(); // 0-indexed

      // Get first day of the month (0 = Sunday, 1 = Monday...)
      const firstDayIndex = new Date(year, month, 1).getDay();
      
      // Get total days in month
      const totalDays = new Date(year, month + 1, 0).getDate();

      // Get total days in previous month for padding
      const prevMonthTotalDays = new Date(year, month, 0).getDate();

      const tempGrid = [];

      // 1. Previous month padding days
      for (let i = firstDayIndex - 1; i >= 0; i--) {
        const day = prevMonthTotalDays - i;
        tempGrid.push({
          day,
          isCurrentMonth: false,
          color: '#ffffff',
          textColor: '#cbc3d9',
          status: 'none',
        });
      }

      // 2. Current month days
      for (let day = 1; day <= totalDays; day++) {
        const dateObj = new Date(year, month, day);
        const dateStr = getLocalDateString(dateObj);
        
        // Find matching log
        const matchingLog = allLogs.find((l: any) => {
          const logDatePart = l.date.split('T')[0];
          return logDatePart === dateStr;
        });

        let color = '#f8f9fa'; // no log
        let textColor = '#191c1d';
        let status = 'none';

        if (matchingLog) {
          const lifestyleStatus = matchingLog.patternResult?.lifestyleStatus || 'BALANCED';
          if (lifestyleStatus === 'BALANCED') {
            color = '#e2f4e3'; // light green
            status = 'good';
          } else if (lifestyleStatus === 'NEEDS_IMPROVEMENT') {
            color = '#fff3e0'; // light orange
            status = 'warning';
          } else {
            color = '#ffdad6'; // light red
            status = 'critical';
          }
        }

        // Highlight today
        const isToday = getLocalDateString() === dateStr;

        tempGrid.push({
          day,
          isCurrentMonth: true,
          color,
          textColor,
          status,
          isToday,
        });
      }

      // 3. Next month padding days to complete grid rows (usually 6 rows of 7 = 42 cells or 5 rows = 35 cells)
      const cellsFilled = tempGrid.length;
      const totalCellsNeeded = cellsFilled > 35 ? 42 : 35;
      const nextMonthPadding = totalCellsNeeded - cellsFilled;

      for (let i = 1; i <= nextMonthPadding; i++) {
        tempGrid.push({
          day: i,
          isCurrentMonth: false,
          color: '#ffffff',
          textColor: '#cbc3d9',
          status: 'none',
        });
      }

      setCalendarGrid(tempGrid);
    } catch (error) {
      console.error('Failed to fetch logs history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabelAndColor = (status: string) => {
    switch (status) {
      case 'BALANCED':
        return { text: 'Balanced', color: '#006218', bg: '#e2f4e3' };
      case 'NEEDS_IMPROVEMENT':
        return { text: 'Needs Imp.', color: '#d97d00', bg: '#fff3e0' };
      case 'UNHEALTHY_PATTERN_DETECTED':
        return { text: 'Unhealthy', color: '#ba1a1a', bg: '#ffdad6' };
      default:
        return { text: 'No Status', color: '#7a7488', bg: '#f8f9fa' };
    }
  };

  const formatDateLabel = (dateISOString: string) => {
    const d = new Date(dateISOString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };

  if (loading && logs.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color="#6200ee" />
      </SafeAreaView>
    );
  }

  const currentMonthName = new Date().toLocaleDateString([], { month: 'long', year: 'numeric' });

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
          <Text style={styles.headerTitle}>Logs History.</Text>
        </View>

        {/* Calendar Bento Grid */}
        <View style={styles.bentoCard}>
          <Text style={styles.calendarTitle}>{currentMonthName}</Text>
          
          <View style={styles.weekdayHeaders}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, idx) => (
              <Text key={idx} style={styles.weekdayText}>{w}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarGrid.map((item, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.calendarCell, 
                  { backgroundColor: item.color },
                  item.isToday ? { borderWidth: 2, borderColor: '#6200ee' } : {}
                ]}
              >
                <Text style={[styles.cellText, { color: item.textColor }]}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Entries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          
          {logs.length > 0 ? (
            logs.map((log: any) => {
              const statusObj = getStatusLabelAndColor(log.patternResult?.lifestyleStatus);
              
              // Map stress level to simple visual indicator
              let stressText = 'Low Stress';
              let stressColor = '#006a6a';
              if (log.stressLevel === 'MODERATE') {
                stressText = 'Moderate Stress';
                stressColor = '#d97d00';
              } else if (log.stressLevel === 'HIGH') {
                stressText = 'High Stress';
                stressColor = '#ba1a1a';
              }

              return (
                <View key={log.id} style={styles.entryCard}>
                   <View style={styles.entryHeader}>
                      <Text style={styles.entryDate}>{formatDateLabel(log.date)}</Text>
                      <View style={[styles.badge, { backgroundColor: statusObj.bg }]}>
                         <Text style={[styles.badgeText, { color: statusObj.color }]}>{statusObj.text}</Text>
                      </View>
                   </View>

                   <View style={styles.entryMetricsRow}>
                      <View style={styles.entryMetricCol}>
                         <View style={styles.metricIconLabel}>
                            <MaterialIcons name="bedtime" size={14} color="#6200ee" />
                            <Text style={styles.metricLabel}>SLEEP</Text>
                         </View>
                         <Text style={styles.metricValue}>{log.sleepHours} hrs</Text>
                      </View>

                      <View style={styles.entryMetricCol}>
                         <View style={styles.metricIconLabel}>
                            <MaterialIcons name="directions-walk" size={14} color="#006218" />
                            <Text style={styles.metricLabel}>ACTIVE</Text>
                         </View>
                         <Text style={styles.metricValue}>
                           {log.activityDuration > 0 ? `${log.activityDuration} min` : 'None'}
                         </Text>
                      </View>

                      <View style={styles.entryMetricCol}>
                         <View style={styles.metricIconLabel}>
                            <MaterialIcons name="psychology" size={14} color={stressColor} />
                            <Text style={styles.metricLabel}>STRESS</Text>
                         </View>
                         <Text style={[styles.metricValue, { color: stressColor }]}>
                           {log.stressLevel.charAt(0) + log.stressLevel.slice(1).toLowerCase()}
                         </Text>
                      </View>
                   </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="history" size={40} color="#7a7488" style={{ marginBottom: 8 }} />
              <Text style={styles.emptyText}>No logs submitted yet. Start tracking today!</Text>
            </View>
          )}
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
  bentoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e3e4',
    padding: 16,
    marginBottom: 24,
  },
  calendarTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: '#191c1d',
    marginBottom: 12,
  },
  weekdayHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekdayText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: '#7a7488',
    width: 32,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  calendarCell: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
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
  entryCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e3e4',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryDate: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: '#191c1d',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
  },
  entryMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f5',
    paddingTop: 12,
  },
  entryMetricCol: {
    flex: 1,
    gap: 4,
  },
  metricIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 9,
    letterSpacing: 0.5,
    color: '#7a7488',
  },
  metricValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#191c1d',
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
    color: '#494456',
    textAlign: 'center',
  }
});
