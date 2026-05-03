import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function InsightsScreen() {
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
          <Text style={styles.headerTitle}>Your Insights.</Text>
        </View>

        {/* Weekly Summary */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitleText}>Weekly Summary</Text>
              <Text style={styles.cardSubtitleText}>Oct 16 - Oct 22</Text>
            </View>
            <View style={styles.badgeError}>
              <Text style={styles.badgeErrorText}>High Stress</Text>
            </View>
          </View>
          <Text style={styles.cardBodyText}>
            Your routine has been irregular this week, particularly concerning sleep and hydration levels. Focus on stabilization.
          </Text>
          <View style={styles.progressBarBg}>
             <View style={styles.progressBarFillError} />
          </View>
        </View>

        {/* Detected Patterns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detected Patterns</Text>
          
          {/* Pattern 1 */}
          <View style={styles.patternCard}>
            <View style={styles.patternAccentError} />
            <View style={styles.patternContent}>
              <View style={styles.patternIconError}>
                <MaterialIcons name="bedtime" size={20} color="#ba1a1a" />
              </View>
              <View style={styles.patternTextContainer}>
                <Text style={styles.patternTitle}>Sleep Deprivation</Text>
                <Text style={styles.patternDesc}>
                  You've slept under 6 hours for 4 consecutive days.
                </Text>
                <TouchableOpacity style={styles.guidanceBtn}>
                  <Text style={styles.guidanceBtnText}>View Guidance</Text>
                  <MaterialIcons name="expand-more" size={20} color="#006a6a" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Pattern 2 */}
          <View style={styles.patternCard}>
            <View style={styles.patternAccentWarning} />
            <View style={styles.patternContent}>
              <View style={styles.patternIconWarning}>
                <MaterialIcons name="water-drop" size={20} color="#FF8F00" />
              </View>
              <View style={styles.patternTextContainer}>
                <Text style={styles.patternTitle}>Dehydration Trend</Text>
                <Text style={styles.patternDesc}>
                  Water intake is 30% below your target during afternoon hours.
                </Text>
                <TouchableOpacity style={styles.guidanceBtn}>
                  <Text style={styles.guidanceBtnText}>View Guidance</Text>
                  <MaterialIcons name="expand-more" size={20} color="#006a6a" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
           
           <View style={styles.recommendationList}>
              <View style={styles.recItem}>
                 <View style={styles.recIconWrapDefault}>
                    <MaterialIcons name="nights-stay" size={18} color="#6200ee" />
                 </View>
                 <Text style={styles.recText}>Sleep before 12AM × 3 nights</Text>
                 <TouchableOpacity style={styles.recAddBtn}>
                    <MaterialIcons name="add" size={16} color="#7a7488" />
                 </TouchableOpacity>
              </View>

              <View style={styles.recItem}>
                 <View style={styles.recIconWrapTertiary}>
                    <MaterialIcons name="directions-walk" size={18} color="#006218" />
                 </View>
                 <Text style={styles.recText}>15-min walk after class</Text>
                 <TouchableOpacity style={styles.recAddBtn}>
                    <MaterialIcons name="add" size={16} color="#7a7488" />
                 </TouchableOpacity>
              </View>

              <View style={styles.recItem}>
                 <View style={styles.recIconWrapError}>
                    <MaterialIcons name="local-cafe" size={18} color="#ba1a1a" />
                 </View>
                 <Text style={styles.recText}>Reduce sugary drinks</Text>
                 <TouchableOpacity style={styles.recAddBtn}>
                    <MaterialIcons name="add" size={16} color="#7a7488" />
                 </TouchableOpacity>
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
  badgeError: {
    backgroundColor: '#ffdad6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeErrorText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#93000a',
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
  progressBarFillError: {
    width: '75%',
    height: '100%',
    backgroundColor: '#ba1a1a',
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
    marginBottom: 16,
  },
  guidanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(144, 239, 239, 0.2)',
    borderWidth: 1,
    borderColor: '#90efef',
    borderRadius: 8,
    padding: 12,
  },
  guidanceBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#006a6a',
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
  recIconWrapDefault: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recIconWrapTertiary: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 98, 24, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recIconWrapError: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(186, 26, 26, 0.2)',
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
