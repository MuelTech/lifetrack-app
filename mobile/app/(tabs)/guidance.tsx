import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Platform, TextInput, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function GuidanceScreen() {
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
        
        {/* Header & Search */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Health Guidance</Text>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#7a7488" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search topics, symptoms..."
              placeholderTextColor="#cbc3d9"
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          <TouchableOpacity style={[styles.categoryChip, styles.categoryChipActive]}>
            <Text style={[styles.categoryText, styles.categoryTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryChip}>
            <Text style={styles.categoryText}>Nutrition</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryChip}>
            <Text style={styles.categoryText}>Sleep</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryChip}>
            <Text style={styles.categoryText}>Stress</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryChip}>
            <Text style={styles.categoryText}>Exercise</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryChip}>
            <Text style={styles.categoryText}>Early Signs</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Featured Article */}
        <TouchableOpacity style={styles.featuredCard} activeOpacity={0.9}>
          <View style={styles.featuredImageContainer}>
            <View style={styles.featuredImagePlaceholder}>
               <MaterialIcons name="image" size={48} color="#cbc3d9" />
            </View>
            <View style={styles.featuredBadge}>
              <MaterialIcons name="star" size={14} color="#006218" />
              <Text style={styles.featuredBadgeText}>FEATURED</Text>
            </View>
          </View>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle} numberOfLines={2}>Managing Screen Fatigue During Late Coding Sessions</Text>
            <Text style={styles.featuredDesc} numberOfLines={2}>Practical strategies to protect your eyes and maintain focus when pushing through complex algorithms past midnight.</Text>
            <View style={styles.readTimeContainer}>
              <MaterialIcons name="schedule" size={16} color="#7a7488" />
              <Text style={styles.readTimeText}>5 min read</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Latest Insights List */}
        <View style={styles.latestSection}>
          <Text style={styles.sectionTitle}>Latest Insights</Text>
          
          <View style={styles.listContainer}>
            {/* Article 1 */}
            <TouchableOpacity style={styles.listCard} activeOpacity={0.9}>
              <View style={styles.listIconContainerSecondary}>
                <MaterialIcons name="restaurant-menu" size={24} color="#006a6a" />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listTitle} numberOfLines={1}>Quick Brain Food</Text>
                <Text style={styles.listDesc} numberOfLines={2}>Nutrition-dense snacks that don't require prep time and boost cognitive function.</Text>
                <View style={styles.readTimeContainer}>
                  <MaterialIcons name="schedule" size={14} color="#7a7488" />
                  <Text style={styles.readTimeSmallText}>3 min read</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Article 2 */}
            <TouchableOpacity style={styles.listCard} activeOpacity={0.9}>
              <View style={styles.listIconContainerPrimary}>
                <MaterialIcons name="bedtime" size={24} color="#4800b2" />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listTitle} numberOfLines={1}>Optimizing Power Naps</Text>
                <Text style={styles.listDesc} numberOfLines={2}>How 20 minutes can reset your debugging capability without entering deep sleep.</Text>
                <View style={styles.readTimeContainer}>
                  <MaterialIcons name="schedule" size={14} color="#7a7488" />
                  <Text style={styles.readTimeSmallText}>4 min read</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Article 3 */}
            <TouchableOpacity style={styles.listCard} activeOpacity={0.9}>
              <View style={styles.listIconContainerError}>
                <MaterialIcons name="monitor-heart" size={24} color="#ba1a1a" />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listTitle} numberOfLines={1}>Recognizing Burnout</Text>
                <Text style={styles.listDesc} numberOfLines={2}>Early physiological signs that you need to step away from the keyboard immediately.</Text>
                <View style={styles.readTimeContainer}>
                  <MaterialIcons name="schedule" size={14} color="#7a7488" />
                  <Text style={styles.readTimeSmallText}>6 min read</Text>
                </View>
              </View>
            </TouchableOpacity>
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
    paddingBottom: 80,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#191c1d',
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e3e4',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#191c1d',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbc3d9',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  categoryText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#494456',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  featuredCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e3e4',
    marginHorizontal: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  featuredImageContainer: {
    height: 160,
    position: 'relative',
    backgroundColor: '#f3f4f5',
  },
  featuredImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 4,
  },
  featuredBadgeText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    letterSpacing: 1,
    color: '#006218',
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
    color: '#191c1d',
    marginBottom: 8,
  },
  featuredDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#494456',
    lineHeight: 20,
    marginBottom: 12,
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#7a7488',
  },
  readTimeSmallText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#7a7488',
  },
  latestSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
    color: '#191c1d',
    marginBottom: 12,
  },
  listContainer: {
    gap: 12,
  },
  listCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e3e4',
    padding: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  listIconContainerSecondary: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#90efef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listIconContainerPrimary: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#e8ddff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listIconContainerError: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#ffdad6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: '#191c1d',
    marginBottom: 4,
  },
  listDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#494456',
    lineHeight: 18,
    marginBottom: 8,
  },
});
