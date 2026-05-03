import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function HistoryScreen() {
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your History.</Text>
          <Text style={styles.headerSubtitle}>Review your past wellness data.</Text>
        </View>

        {/* Month Selector & Calendar Bento */}
        <View style={styles.calendarCard}>
          {/* Month Selector */}
          <View style={styles.monthSelector}>
            <TouchableOpacity style={styles.navButton}>
              <MaterialIcons name="chevron-left" size={24} color="#494456" />
            </TouchableOpacity>
            <Text style={styles.monthText}>November 2023</Text>
            <TouchableOpacity style={styles.navButton}>
              <MaterialIcons name="chevron-right" size={24} color="#494456" />
            </TouchableOpacity>
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {/* Days of Week */}
            <View style={styles.daysRow}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <Text key={i} style={styles.dayLabel}>{day}</Text>
              ))}
            </View>

            {/* Dates Grid Row 1 */}
            <View style={styles.datesRow}>
              <View style={[styles.dateCircle, styles.dateDimmed]}><Text style={styles.dateTextDimmed}>29</Text></View>
              <View style={[styles.dateCircle, styles.dateDimmed]}><Text style={styles.dateTextDimmed}>30</Text></View>
              <View style={[styles.dateCircle, styles.dateDimmed]}><Text style={styles.dateTextDimmed}>31</Text></View>
              <View style={[styles.dateCircle, styles.dateGood]}><Text style={styles.dateTextWhite}>1</Text></View>
              <View style={[styles.dateCircle, styles.dateOptimal]}><Text style={styles.dateTextWhite}>2</Text></View>
              <View style={[styles.dateCircle, styles.dateWarning]}><Text style={styles.dateTextDark}>3</Text></View>
              <View style={[styles.dateCircle, styles.dateGood]}><Text style={styles.dateTextWhite}>4</Text></View>
            </View>

            {/* Dates Grid Row 2 */}
            <View style={styles.datesRow}>
              <View style={[styles.dateCircle, styles.dateCritical]}><Text style={styles.dateTextWhite}>5</Text></View>
              <View style={[styles.dateCircle, styles.dateOptimal]}><Text style={styles.dateTextWhite}>6</Text></View>
              <View style={[styles.dateCircle, styles.dateGood]}><Text style={styles.dateTextWhite}>7</Text></View>
              <View style={[styles.dateCircle, styles.dateNeutral]}><Text style={styles.dateTextDark}>8</Text></View>
              <View style={[styles.dateCircle, styles.dateGood]}><Text style={styles.dateTextWhite}>9</Text></View>
              <View style={[styles.dateCircle, styles.dateOptimal]}><Text style={styles.dateTextWhite}>10</Text></View>
              <View style={[styles.dateCircle, styles.dateOptimal]}><Text style={styles.dateTextWhite}>11</Text></View>
            </View>

            {/* Dates Grid Row 3 */}
            <View style={styles.datesRow}>
              <View style={[styles.dateCircle, styles.dateGood]}><Text style={styles.dateTextWhite}>12</Text></View>
              <View style={[styles.dateCircle, styles.dateCritical]}><Text style={styles.dateTextWhite}>13</Text></View>
              <View style={[styles.dateCircle, styles.dateToday]}><Text style={styles.dateTextDark}>14</Text></View>
              <View style={[styles.dateCircle, styles.dateDimmed]}><Text style={styles.dateTextDimmed}>15</Text></View>
              <View style={[styles.dateCircle, styles.dateDimmed]}><Text style={styles.dateTextDimmed}>16</Text></View>
              <View style={[styles.dateCircle, styles.dateDimmed]}><Text style={styles.dateTextDimmed}>17</Text></View>
              <View style={[styles.dateCircle, styles.dateDimmed]}><Text style={styles.dateTextDimmed}>18</Text></View>
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#00480f' }]} />
              <Text style={styles.legendText}>OPTIMAL</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#006a6a' }]} />
              <Text style={styles.legendText}>GOOD</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#fbbc04' }]} />
              <Text style={styles.legendText}>WARNING</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ba1a1a' }]} />
              <Text style={styles.legendText}>CRITICAL</Text>
            </View>
          </View>
        </View>

        {/* Past Log Entries */}
        <View style={styles.entriesSection}>
          <Text style={styles.sectionLabel}>RECENT ENTRIES</Text>
          
          <View style={styles.entryList}>
            {/* Entry 1 */}
            <View style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryDate}>Nov 13, 2023</Text>
                <View style={styles.badgeCritical}>
                  <Text style={styles.badgeCriticalText}>HIGH STRESS</Text>
                </View>
              </View>
              <View style={styles.entryIcons}>
                <View style={styles.iconBoxDefault}>
                  <MaterialIcons name="bed" size={18} color="#494456" />
                </View>
                <View style={styles.iconBoxDefault}>
                  <MaterialIcons name="directions-run" size={18} color="#494456" />
                </View>
                <View style={styles.iconBoxCritical}>
                  <MaterialIcons name="psychology" size={18} color="#93000a" />
                </View>
              </View>
            </View>

            {/* Entry 2 */}
            <View style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryDate}>Nov 12, 2023</Text>
                <View style={styles.badgeGood}>
                  <Text style={styles.badgeGoodText}>GOOD DAY</Text>
                </View>
              </View>
              <View style={styles.entryIcons}>
                <View style={styles.iconBoxDefault}>
                  <MaterialIcons name="bed" size={18} color="#494456" />
                </View>
                <View style={styles.iconBoxGood}>
                  <MaterialIcons name="directions-walk" size={18} color="#006e6e" />
                </View>
                <View style={styles.iconBoxGood}>
                  <MaterialIcons name="local-dining" size={18} color="#006e6e" />
                </View>
              </View>
            </View>
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
    paddingBottom: 80,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#191c1d',
  },
  headerSubtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#494456',
    marginTop: 4,
  },
  calendarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e3e4',
    padding: 16,
    marginBottom: 24,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: '#191c1d',
  },
  calendarGrid: {
    marginBottom: 16,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: '#494456',
    width: 32,
    textAlign: 'center',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDimmed: {
    borderWidth: 1,
    borderColor: '#cbc3d9',
    borderStyle: 'dashed',
  },
  dateTextDimmed: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#494456',
    opacity: 0.5,
  },
  dateGood: {
    backgroundColor: '#006a6a',
  },
  dateOptimal: {
    backgroundColor: '#00480f',
  },
  dateWarning: {
    backgroundColor: '#fbbc04',
  },
  dateCritical: {
    backgroundColor: '#ba1a1a',
  },
  dateNeutral: {
    backgroundColor: '#e1e3e4',
  },
  dateToday: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#4800b2',
  },
  dateTextWhite: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#ffffff',
  },
  dateTextDark: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#191c1d',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
    color: '#494456',
    letterSpacing: 1,
  },
  entriesSection: {
    gap: 8,
  },
  sectionLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: '#494456',
    letterSpacing: 1,
    marginBottom: 4,
  },
  entryList: {
    gap: 12,
  },
  entryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e3e4',
    padding: 16,
  },
  entryHeader: {
    gap: 4,
  },
  entryDate: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#191c1d',
  },
  badgeCritical: {
    backgroundColor: '#ffdad6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  badgeCriticalText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
    color: '#93000a',
  },
  badgeGood: {
    backgroundColor: '#90efef',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  badgeGoodText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
    color: '#006e6e',
  },
  entryIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBoxDefault: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#edeeef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxCritical: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#ffdad6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxGood: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#90efef',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
