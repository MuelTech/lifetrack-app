import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '../utils/api';
import { useAuthStore } from '../utils/store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const clearSession = useAuthStore(state => state.clearSession);
  const user = useAuthStore(state => state.user);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/profile/me');
      setProfile(res.data.profile);
    } catch (error: any) {
      console.error('Failed to fetch profile details:', error);
      Alert.alert('Error', 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: () => {
            clearSession();
            router.replace('/');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6200ee" />
      </SafeAreaView>
    );
  }

  const formatSex = (sexVal: string) => {
    if (!sexVal) return 'Not Specified';
    if (sexVal === 'MALE') return 'Male';
    if (sexVal === 'FEMALE') return 'Female';
    return 'Prefer not to say';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#191c1d" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card Header */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
             <MaterialIcons name="person" size={48} color="#4800b2" />
          </View>
          <Text style={styles.nicknameText}>{profile?.nickname || 'Friend'}</Text>
          <Text style={styles.emailText}>{user?.email || 'No email'}</Text>
          
          <View style={styles.streakWrapper}>
             <MaterialIcons name="local-fire-department" size={20} color="#ba1a1a" />
             <Text style={styles.streakText}>{profile?.currentStreak || 0} Day Streak</Text>
          </View>
        </View>

        {/* Profile Details section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Profile</Text>
          <View style={styles.detailsCard}>
             <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Year Level</Text>
                <Text style={styles.detailValue}>{profile?.yearLevel || 'Not set'}</Text>
             </View>
             <View style={styles.detailDivider} />
             <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Section</Text>
                <Text style={styles.detailValue}>{profile?.section || 'Not set'}</Text>
             </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Details</Text>
          <View style={styles.detailsCard}>
             <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Age</Text>
                <Text style={styles.detailValue}>{profile?.age ? `${profile.age} years old` : 'Not set'}</Text>
             </View>
             <View style={styles.detailDivider} />
             <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Biological Sex</Text>
                <Text style={styles.detailValue}>{formatSex(profile?.sex)}</Text>
             </View>
          </View>
        </View>

        {/* Health Concerns */}
        {profile?.healthConcerns && profile.healthConcerns.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Concerns</Text>
            <View style={styles.chipsContainer}>
               {profile.healthConcerns.map((concern: string, idx: number) => (
                 <View key={idx} style={styles.chip}>
                    <Text style={styles.chipText}>{concern}</Text>
                 </View>
               ))}
            </View>
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
           <MaterialIcons name="logout" size={20} color="#ffffff" style={{ marginRight: 8 }} />
           <Text style={styles.logoutBtnText}>Log Out Account</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 18,
    color: '#191c1d',
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
    gap: 20,
  },
  avatarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e3e4',
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8ddff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  nicknameText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 22,
    color: '#191c1d',
  },
  emailText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#7a7488',
  },
  streakWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffdad6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    marginTop: 8,
  },
  streakText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#ba1a1a',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: '#494456',
    paddingLeft: 4,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e3e4',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  detailLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: '#7a7488',
  },
  detailValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#191c1d',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#f3f4f5',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbc3d9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: '#494456',
  },
  logoutBtn: {
    backgroundColor: '#ba1a1a',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  }
});
