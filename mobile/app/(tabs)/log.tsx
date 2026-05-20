import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DailyLogScreen() {
  const router = useRouter();
  
  const [sleptAt, setSleptAt] = useState('23:30');
  const [wokeUp, setWokeUp] = useState('07:00');
  
  const [breakfast, setBreakfast] = useState('Balanced');
  const [lunch, setLunch] = useState('Junk');
  const [dinner, setDinner] = useState('');
  
  const [waterIntake, setWaterIntake] = useState(4);
  const [activitySelected, setActivitySelected] = useState('Walk');
  
  const [stressLevel, setStressLevel] = useState('Moderate');

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
        
        {/* Header & Progress */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTextRow}>
            <Text style={styles.screenTitle}>Today's Log</Text>
            <Text style={styles.dateText}>Oct 24</Text>
          </View>
          
          {/* Progress Dots */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressLine} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressLine} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressLine} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressLine} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
          </View>
        </View>

        <View style={styles.grid}>
          {/* Sleep Card */}
          <View style={styles.fullCard}>
             <View style={styles.cardHeaderRow}>
               <MaterialIcons name="bedtime" size={20} color="#6200ee" />
               <Text style={styles.cardTitle}>Sleep</Text>
             </View>
             
             <View style={styles.sleepInputsRow}>
               <View style={styles.sleepInputCol}>
                 <Text style={styles.inputLabel}>SLEPT AT</Text>
                 <View style={styles.timeInput}>
                    <Text style={styles.timeText}>{sleptAt}</Text>
                 </View>
               </View>
               <View style={styles.sleepInputCol}>
                 <Text style={styles.inputLabel}>WOKE UP</Text>
                 <View style={styles.timeInput}>
                    <Text style={styles.timeText}>{wokeUp}</Text>
                 </View>
               </View>
             </View>

             <View style={styles.durationRow}>
                <Text style={styles.durationLabel}>Total duration</Text>
                <Text style={styles.durationValue}>7.5 hr</Text>
             </View>
          </View>

          {/* Food & Water Card */}
          <View style={styles.fullCard}>
             <View style={styles.cardHeaderRow}>
               <MaterialIcons name="restaurant" size={20} color="#006a6a" />
               <Text style={styles.cardTitle}>Food & Water</Text>
             </View>

             <View style={styles.mealsContainer}>
                {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                  <View key={meal} style={styles.mealRow}>
                     <Text style={styles.mealName}>{meal}</Text>
                     <View style={styles.mealChips}>
                        <TouchableOpacity style={[styles.mealChip, meal === 'Breakfast' ? styles.mealChipSelectedBalanced : {}]}>
                           <Text style={[styles.mealChipText, meal === 'Breakfast' ? styles.mealChipTextSelectedBalanced : {}]}>Balanced</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.mealChip, meal === 'Lunch' ? styles.mealChipSelectedJunk : {}]}>
                           <Text style={[styles.mealChipText, meal === 'Lunch' ? styles.mealChipTextSelectedJunk : {}]}>Junk</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mealChip}>
                           <Text style={styles.mealChipText}>Skipped</Text>
                        </TouchableOpacity>
                     </View>
                  </View>
                ))}
             </View>

             <View style={styles.waterContainer}>
                <Text style={styles.inputLabel}>WATER INTAKE</Text>
                <View style={styles.waterRow}>
                   <View style={styles.waterDrops}>
                      {[...Array(8)].map((_, i) => (
                        <MaterialIcons key={i} name="water-drop" size={24} color={i < 4 ? "#006a6a" : "#cbc3d9"} />
                      ))}
                   </View>
                   <Text style={styles.waterValue}>4 / 8 Cups</Text>
                </View>
             </View>
          </View>

          {/* Activity Card */}
          <View style={styles.fullCard}>
             <View style={styles.activityHeader}>
                <View style={styles.cardHeaderRow}>
                  <MaterialIcons name="fitness-center" size={20} color="#6200ee" />
                  <Text style={styles.cardTitle}>Activity</Text>
                </View>
                <View style={styles.durationPill}>
                  <Text style={styles.durationPillText}>45 min</Text>
                </View>
             </View>
             
             <View style={styles.sliderContainer}>
                <View style={styles.mockSlider} />
             </View>

             <View style={styles.activityChips}>
                {['Walk', 'Gym', 'Sports', 'None'].map(act => (
                  <TouchableOpacity key={act} style={[styles.activityChip, activitySelected === act ? styles.activityChipSelected : {}]}>
                    <Text style={[styles.activityChipText, activitySelected === act ? styles.activityChipTextSelected : {}]}>{act}</Text>
                  </TouchableOpacity>
                ))}
             </View>
          </View>

          {/* Screen Time Card */}
          <View style={styles.fullCard}>
             <View style={styles.cardHeaderRow}>
               <MaterialIcons name="devices" size={20} color="#7a7488" />
               <Text style={styles.cardTitle}>Screen Time</Text>
             </View>
             
             <View style={styles.screenTimeRow}>
                <View style={styles.screenTimeHeader}>
                  <Text style={styles.inputLabel}>STUDY</Text>
                  <Text style={styles.screenTimeValue}>4.5 hrs</Text>
                </View>
                <View style={styles.sliderContainer}>
                   <View style={styles.mockSlider} />
                </View>
             </View>

             <View style={styles.screenTimeRow}>
                <View style={styles.screenTimeHeader}>
                  <Text style={styles.inputLabel}>LEISURE</Text>
                  <Text style={styles.screenTimeValue}>2.0 hrs</Text>
                </View>
                <View style={styles.sliderContainer}>
                   <View style={styles.mockSlider} />
                </View>
             </View>
          </View>

          {/* Stress Level Card */}
          <View style={styles.fullCard}>
             <View style={styles.cardHeaderRow}>
               <MaterialIcons name="psychology" size={20} color="#ba1a1a" />
               <Text style={styles.cardTitle}>Stress Level</Text>
             </View>

             <View style={styles.stressRow}>
                <TouchableOpacity style={styles.stressCard}>
                   <Text style={styles.stressEmoji}>😌</Text>
                   <Text style={styles.stressLabelText}>Low</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.stressCard, styles.stressCardSelected]}>
                   <Text style={styles.stressEmoji}>😐</Text>
                   <Text style={[styles.stressLabelText, {color: '#002020'}]}>Moderate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.stressCard}>
                   <Text style={styles.stressEmoji}>😫</Text>
                   <Text style={styles.stressLabelText}>High</Text>
                </TouchableOpacity>
             </View>
          </View>

          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Submit Entry</Text>
            <MaterialIcons name="check-circle" size={20} color="#fff" />
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
  headerContainer: {
    marginBottom: 24,
  },
  headerTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  screenTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#191c1d',
  },
  dateText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#7a7488',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 280,
    alignSelf: 'center',
    marginTop: 12,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e1e3e4',
  },
  progressDotActive: {
    backgroundColor: '#6200ee',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e1e3e4',
    marginHorizontal: 4,
  },
  grid: {
    gap: 12,
  },
  fullCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cbc3d9',
    padding: 12,
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
    color: '#191c1d',
  },
  sleepInputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sleepInputCol: {
    flex: 1,
    gap: 4,
  },
  inputLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    letterSpacing: 1,
    color: '#7a7488',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#e1e3e4',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: '#191c1d',
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e1e3e4',
    paddingTop: 8,
    marginTop: 4,
  },
  durationLabel: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#7a7488',
  },
  durationValue: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
    color: '#6200ee',
  },
  mealsContainer: {
    gap: 8,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e1e3e4',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
  },
  mealName: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: '#191c1d',
    width: 80,
  },
  mealChips: {
    flexDirection: 'row',
    gap: 8,
  },
  mealChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cbc3d9',
  },
  mealChipText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: '#7a7488',
  },
  mealChipSelectedBalanced: {
    backgroundColor: '#7ade79',
    borderColor: '#7ade79',
  },
  mealChipTextSelectedBalanced: {
    color: '#002204',
  },
  mealChipSelectedJunk: {
    backgroundColor: '#ffdad6',
    borderColor: '#ffdad6',
  },
  mealChipTextSelectedJunk: {
    color: '#93000a',
  },
  waterContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e1e3e4',
    paddingTop: 8,
    gap: 4,
  },
  waterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waterDrops: {
    flexDirection: 'row',
    gap: 2,
  },
  waterValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#006a6a',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationPill: {
    backgroundColor: '#e8ddff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationPillText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#6200ee',
  },
  sliderContainer: {
    paddingVertical: 16,
  },
  mockSlider: {
    height: 4,
    backgroundColor: '#cbc3d9',
    borderRadius: 2,
    width: '100%',
  },
  activityChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbc3d9',
  },
  activityChipSelected: {
    backgroundColor: '#4800b2',
    borderColor: '#4800b2',
  },
  activityChipText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: '#7a7488',
  },
  activityChipTextSelected: {
    color: '#ffffff',
  },
  screenTimeRow: {
    gap: 4,
  },
  screenTimeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenTimeValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#191c1d',
  },
  stressRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stressCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbc3d9',
    backgroundColor: '#f8f9fa',
    opacity: 0.6,
  },
  stressCardSelected: {
    opacity: 1,
    borderColor: '#006a6a',
    backgroundColor: '#93f2f2',
    borderWidth: 2,
  },
  stressEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  stressLabelText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#191c1d',
  },
  submitBtn: {
    backgroundColor: '#6200ee',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    marginBottom: 24,
  },
  submitBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
    color: '#ffffff',
  }
});