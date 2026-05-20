import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Platform, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../../utils/api';

// Helpers
const getLocalDateString = (d: Date = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculateSleepDuration = (start: string, end: string): number => {
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  
  if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) return 0;
  
  let diff = (endH * 60 + endM) - (startH * 60 + startM);
  if (diff < 0) {
    diff += 24 * 60; // slept overnight
  }
  return Math.round((diff / 60) * 10) / 10;
};

const formatTimeFromDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const titleCase = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function DailyLogScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [sleptAt, setSleptAt] = useState('23:30');
  const [wokeUp, setWokeUp] = useState('07:00');
  
  const [breakfast, setBreakfast] = useState('BALANCED');
  const [lunch, setLunch] = useState('JUNK');
  const [dinner, setDinner] = useState('BALANCED');
  
  const [waterIntake, setWaterIntake] = useState(4);
  const [activityDuration, setActivityDuration] = useState(45);
  const [activitySelected, setActivitySelected] = useState('WALK');
  
  const [studyHours, setStudyHours] = useState(4.5);
  const [leisureHours, setLeisureHours] = useState(2.0);
  const [stressLevel, setStressLevel] = useState('MODERATE');

  useEffect(() => {
    fetchTodayLog();
  }, []);

  const fetchTodayLog = async () => {
    setLoading(true);
    try {
      const todayDate = getLocalDateString();
      const res = await api.get(`/users/logs/today?date=${todayDate}`);
      if (res.data && res.data.logged) {
        const log = res.data.log;
        setSleptAt(formatTimeFromDate(log.sleptAt) || '23:30');
        setWokeUp(formatTimeFromDate(log.wokeUp) || '07:00');
        setBreakfast(log.breakfast);
        setLunch(log.lunch);
        setDinner(log.dinner);
        setWaterIntake(log.waterCups);
        setActivityDuration(log.activityDuration);
        setActivitySelected(log.activityType[0] || 'NONE');
        setStudyHours(log.studyHours);
        setLeisureHours(log.screenTimeHours);
        setStressLevel(log.stressLevel);
      }
    } catch (error: any) {
      console.error('Failed to fetch today log:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const dateStr = getLocalDateString();
      const todayLogDate = new Date();
      
      const [sleepH, sleepM] = sleptAt.split(':').map(Number);
      const sleptDate = new Date(todayLogDate);
      sleptDate.setHours(isNaN(sleepH) ? 23 : sleepH, isNaN(sleepM) ? 30 : sleepM, 0, 0);

      const [wakeH, wakeM] = wokeUp.split(':').map(Number);
      const wokeDate = new Date(todayLogDate);
      wokeDate.setHours(isNaN(wakeH) ? 7 : wakeH, isNaN(wakeM) ? 0 : wakeM, 0, 0);

      // If wake time is earlier than slept time, it means they slept overnight
      if (wokeDate.getTime() < sleptDate.getTime()) {
        // sleptDate was yesterday
        sleptDate.setDate(sleptDate.getDate() - 1);
      }

      const calculatedSleep = calculateSleepDuration(sleptAt, wokeUp);

      const payload = {
        date: dateStr,
        sleptAt: sleptDate.toISOString(),
        wokeUp: wokeDate.toISOString(),
        sleepHours: calculatedSleep,
        breakfast,
        lunch,
        dinner,
        waterCups: waterIntake,
        activityDuration,
        activityType: [activitySelected],
        studyHours,
        screenTimeHours: leisureHours,
        stressLevel,
      };

      await api.post('/users/log', payload);
      Alert.alert('Success', 'Daily log saved successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error: any) {
      console.error('Submit log error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to submit log entry.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalSleep = calculateSleepDuration(sleptAt, wokeUp);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color="#6200ee" />
      </SafeAreaView>
    );
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header & Progress */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTextRow}>
            <Text style={styles.screenTitle}>Today's Log</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </Text>
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
                 <Text style={styles.inputLabel}>SLEPT AT (HH:MM)</Text>
                 <View style={styles.timeInputContainer}>
                    <TextInput
                      style={styles.timeInput}
                      value={sleptAt}
                      onChangeText={setSleptAt}
                      placeholder="23:30"
                      placeholderTextColor="#cbc3d9"
                      maxLength={5}
                    />
                 </View>
               </View>
               <View style={styles.sleepInputCol}>
                 <Text style={styles.inputLabel}>WOKE UP (HH:MM)</Text>
                 <View style={styles.timeInputContainer}>
                    <TextInput
                      style={styles.timeInput}
                      value={wokeUp}
                      onChangeText={setWokeUp}
                      placeholder="07:00"
                      placeholderTextColor="#cbc3d9"
                      maxLength={5}
                    />
                 </View>
               </View>
             </View>

             <View style={styles.durationRow}>
                <Text style={styles.durationLabel}>Total duration</Text>
                <Text style={styles.durationValue}>{totalSleep} hr</Text>
             </View>
          </View>

          {/* Food & Water Card */}
          <View style={styles.fullCard}>
             <View style={styles.cardHeaderRow}>
               <MaterialIcons name="restaurant" size={20} color="#006a6a" />
               <Text style={styles.cardTitle}>Food & Water</Text>
             </View>

             <View style={styles.mealsContainer}>
                {[
                  { label: 'Breakfast', state: breakfast, setter: setBreakfast },
                  { label: 'Lunch', state: lunch, setter: setLunch },
                  { label: 'Dinner', state: dinner, setter: setDinner }
                ].map((meal) => (
                  <View key={meal.label} style={styles.mealRow}>
                     <Text style={styles.mealName}>{meal.label}</Text>
                     <View style={styles.mealChips}>
                        <TouchableOpacity 
                          style={[styles.mealChip, meal.state === 'BALANCED' ? styles.mealChipSelectedBalanced : {}]}
                          onPress={() => meal.setter('BALANCED')}
                        >
                           <Text style={[styles.mealChipText, meal.state === 'BALANCED' ? styles.mealChipTextSelectedBalanced : {}]}>Balanced</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.mealChip, meal.state === 'JUNK' ? styles.mealChipSelectedJunk : {}]}
                          onPress={() => meal.setter('JUNK')}
                        >
                           <Text style={[styles.mealChipText, meal.state === 'JUNK' ? styles.mealChipTextSelectedJunk : {}]}>Junk</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.mealChip, meal.state === 'SKIPPED' ? styles.mealChipSelectedSkipped : {}]}
                          onPress={() => meal.setter('SKIPPED')}
                        >
                           <Text style={[styles.mealChipText, meal.state === 'SKIPPED' ? styles.mealChipTextSelectedSkipped : {}]}>Skipped</Text>
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
                        <TouchableOpacity key={i} onPress={() => setWaterIntake(i + 1)}>
                          <MaterialIcons name="water-drop" size={24} color={i < waterIntake ? "#006a6a" : "#cbc3d9"} />
                        </TouchableOpacity>
                      ))}
                   </View>
                   <Text style={styles.waterValue}>{waterIntake} / 8 Cups</Text>
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
                <View style={styles.counterControl}>
                  <TouchableOpacity onPress={() => setActivityDuration(prev => Math.max(0, prev - 15))}>
                    <MaterialIcons name="remove" size={18} color="#6200ee" />
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{activityDuration} min</Text>
                  <TouchableOpacity onPress={() => setActivityDuration(prev => Math.min(240, prev + 15))}>
                    <MaterialIcons name="add" size={18} color="#6200ee" />
                  </TouchableOpacity>
                </View>
             </View>

             <View style={styles.activityChips}>
                {[
                  { display: 'Walk', value: 'WALK' },
                  { display: 'Gym', value: 'GYM' },
                  { display: 'Sports', value: 'SPORTS' },
                  { display: 'None', value: 'NONE' }
                ].map(act => (
                  <TouchableOpacity 
                    key={act.value} 
                    style={[styles.activityChip, activitySelected === act.value ? styles.activityChipSelected : {}]}
                    onPress={() => setActivitySelected(act.value)}
                  >
                    <Text style={[styles.activityChipText, activitySelected === act.value ? styles.activityChipTextSelected : {}]}>
                      {act.display}
                    </Text>
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
                  <View style={styles.counterControl}>
                    <TouchableOpacity onPress={() => setStudyHours(prev => Math.max(0, Math.round((prev - 0.5) * 10) / 10))}>
                      <MaterialIcons name="remove" size={18} color="#7a7488" />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{studyHours} hrs</Text>
                    <TouchableOpacity onPress={() => setStudyHours(prev => Math.min(24, Math.round((prev + 0.5) * 10) / 10))}>
                      <MaterialIcons name="add" size={18} color="#7a7488" />
                    </TouchableOpacity>
                  </View>
                </View>
             </View>

             <View style={styles.screenTimeRow}>
                <View style={styles.screenTimeHeader}>
                  <Text style={styles.inputLabel}>LEISURE</Text>
                  <View style={styles.counterControl}>
                    <TouchableOpacity onPress={() => setLeisureHours(prev => Math.max(0, Math.round((prev - 0.5) * 10) / 10))}>
                      <MaterialIcons name="remove" size={18} color="#7a7488" />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{leisureHours} hrs</Text>
                    <TouchableOpacity onPress={() => setLeisureHours(prev => Math.min(24, Math.round((prev + 0.5) * 10) / 10))}>
                      <MaterialIcons name="add" size={18} color="#7a7488" />
                    </TouchableOpacity>
                  </View>
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
                {[
                  { label: 'LOW', display: 'Low', emoji: '😌', color: '#93f2f2', border: '#006a6a' },
                  { label: 'MODERATE', display: 'Moderate', emoji: '😐', color: '#fff9c4', border: '#fbbc04' },
                  { label: 'HIGH', display: 'High', emoji: '😫', color: '#ffdad6', border: '#ba1a1a' }
                ].map((s) => {
                  const isSel = stressLevel === s.label;
                  return (
                    <TouchableOpacity 
                      key={s.label}
                      style={[
                        styles.stressCard, 
                        isSel ? { opacity: 1, backgroundColor: s.color, borderColor: s.border, borderWidth: 2 } : {}
                      ]}
                      onPress={() => setStressLevel(s.label)}
                    >
                       <Text style={styles.stressEmoji}>{s.emoji}</Text>
                       <Text style={styles.stressLabelText}>{s.display}</Text>
                    </TouchableOpacity>
                  );
                })}
             </View>
          </View>

          <TouchableOpacity 
            style={[styles.submitBtn, submitting ? { opacity: 0.7 } : {}]} 
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Submit Entry'}</Text>
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
  timeInputContainer: {
    borderWidth: 1,
    borderColor: '#e1e3e4',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  timeInput: {
    height: 40,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: '#191c1d',
    textAlign: 'center',
    padding: 0,
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
    width: 70,
  },
  mealChips: {
    flexDirection: 'row',
    gap: 4,
  },
  mealChip: {
    paddingHorizontal: 8,
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
  mealChipSelectedSkipped: {
    backgroundColor: '#e1e3e4',
    borderColor: '#cbc3d9',
  },
  mealChipTextSelectedSkipped: {
    color: '#494456',
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
  counterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8ddff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
  },
  counterValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#6200ee',
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