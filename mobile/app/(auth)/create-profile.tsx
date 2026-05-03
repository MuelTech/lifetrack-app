import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const HEALTH_CONCERNS = ['Diabetes history', 'Hypertension history', 'None'];

export default function CreateProfileScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [yearLevel, setYearLevel] = useState('1st Year');
  const [section, setSection] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('Male');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(['None']);
  
  const [showYearModal, setShowYearModal] = useState(false);

  const toggleConcern = (concern: string) => {
    if (concern === 'None') {
      setSelectedConcerns(['None']);
    } else {
      let updated = selectedConcerns.filter(c => c !== 'None');
      if (updated.includes(concern)) {
        updated = updated.filter(c => c !== concern);
      } else {
        updated.push(concern);
      }
      if (updated.length === 0) {
        updated = ['None'];
      }
      setSelectedConcerns(updated);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.contentContainer}>
          {/* Header with Progress */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Let's set up your profile.</Text>
            <Text style={styles.headerSubtitle}>This data helps tailor your dashboard metrics.</Text>
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Primary Form Card */}
            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nickname / First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Alex"
                  placeholderTextColor="#7a7488"
                  value={nickname}
                  onChangeText={setNickname}
                />
              </View>

              <View style={styles.bentoRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Year Level</Text>
                  <TouchableOpacity 
                    style={styles.dropdownButton}
                    onPress={() => setShowYearModal(true)}
                  >
                    <Text style={styles.dropdownText}>{yearLevel}</Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color="#7a7488" />
                  </TouchableOpacity>
                </View>

                <View style={[styles.inputGroup, { flex: 0.8 }]}>
                  <Text style={styles.label}>Section</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. IT-1A"
                    placeholderTextColor="#7a7488"
                    value={section}
                    onChangeText={setSection}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="18"
                  placeholderTextColor="#7a7488"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Biological Sex</Text>
                <View style={styles.segmentedControl}>
                  {['Male', 'Female', 'Prefer not'].map((option) => {
                    const isActive = sex === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[styles.segment, isActive && styles.segmentActive]}
                        onPress={() => setSex(option)}
                      >
                        <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Health Concerns Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.label}>Optional Health Concerns</Text>
                <Text style={styles.helpText}>Select any that apply.</Text>
              </View>
              <View style={styles.chipGroup}>
                {HEALTH_CONCERNS.map((concern) => {
                  const isActive = selectedConcerns.includes(concern);
                  return (
                    <TouchableOpacity
                      key={concern}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => toggleConcern(concern)}
                    >
                      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                        {concern}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Fixed Bottom CTA */}
          <View style={styles.footerContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => {
                // Navigate to next step or app walkthrough for now
                router.push('/(auth)/app-walkthrough');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#ffffff" style={styles.buttonIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Year Level Modal */}
      <Modal
        visible={showYearModal}
        transparent={true}
        animationType="fade"
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowYearModal(false)}
        >
          <View style={styles.modalContent}>
            {YEAR_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                style={styles.modalOption}
                onPress={() => {
                  setYearLevel(level);
                  setShowYearModal(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText, 
                  yearLevel === level && styles.modalOptionTextActive
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: '#f8f9fa',
    zIndex: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  progressDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#e1e3e4',
  },
  progressDotActive: {
    width: 32,
    backgroundColor: '#4800b2',
  },
  headerTitle: {
    marginTop: 35,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#191c1d',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#494456',
    marginTop: 8,
    lineHeight: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for fixed CTA
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cbc3d9',
    padding: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 4,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  label: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#191c1d',
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbc3d9',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: '#191c1d',
  },
  dropdownButton: {
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbc3d9',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: '#191c1d',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f5',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: '#cbc3d9',
    marginTop: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  segmentActive: {
    backgroundColor: '#4800b2',
  },
  segmentText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#494456',
  },
  segmentTextActive: {
    color: '#ffffff',
  },
  cardHeader: {
    gap: 4,
  },
  helpText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#494456',
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cbc3d9',
    backgroundColor: '#ffffff',
  },
  chipActive: {
    borderColor: '#4800b2',
    backgroundColor: '#e8ddff',
  },
  chipText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#494456',
  },
  chipTextActive: {
    color: '#22005d',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    // Provide a subtle gradient feel or just solid background
    backgroundColor: '#f8f9fa', 
    zIndex: 20,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#4800b2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 28,
  },
  primaryButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#ffffff',
  },
  buttonIcon: {
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '80%',
    overflow: 'hidden',
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f5',
  },
  modalOptionText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: '#191c1d',
    textAlign: 'center',
  },
  modalOptionTextActive: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#4800b2',
  },
});
