import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Platform, ActivityIndicator, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../../utils/api';

const CATEGORIES = [
  { label: 'All', value: 'ALL' },
  { label: 'Nutrition', value: 'NUTRITION' },
  { label: 'Sleep', value: 'SLEEP_HYGIENE' },
  { label: 'Stress', value: 'STRESS_MANAGEMENT' },
  { label: 'Early Signs', value: 'EARLY_SIGNS' },
];

export default function GuidanceScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const renderFormattedContent = (text: string) => {
    if (!text) return null;
    
    // Split by newlines to preserve paragraphs
    const paragraphs = text.split('\n');
    
    return paragraphs
      .filter(para => para.trim() !== '')
      .map((para, paraIdx) => {
        const parts = para.split('**');
        
        return (
          <Text key={paraIdx} style={styles.modalParagraph}>
            {parts.map((part, partIdx) => {
              const isBold = partIdx % 2 === 1;
              return (
                <Text key={partIdx} style={isBold ? styles.boldText : null}>
                  {part}
                </Text>
              );
            })}
          </Text>
        );
      });
  };
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Article Modal Reader State
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, searchQuery]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory !== 'ALL' ? `&category=${selectedCategory}` : '';
      const searchParam = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : '';
      const res = await api.get(`/articles?${categoryParam}${searchParam}`);
      setArticles(res.data.articles || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const openArticle = (article: any) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  const getCategoryLabel = (categoryValue: string) => {
    const found = CATEGORIES.find(c => c.value === categoryValue);
    return found ? found.label : 'General';
  };

  // Extract featured and latest lists
  const featuredArticle = articles.find(a => a.featured);
  const regularArticles = articles.filter(a => a.id !== featuredArticle?.id);

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
          <Text style={styles.headerTitle}>Wellness Library.</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
           <MaterialIcons name="search" size={20} color="#7a7488" style={styles.searchIcon} />
           <TextInput 
             style={styles.searchInput}
             placeholder="Search health guides, tips..."
             placeholderTextColor="#cbc3d9"
             value={searchQuery}
             onChangeText={setSearchQuery}
           />
           {searchQuery.length > 0 && (
             <TouchableOpacity onPress={() => setSearchQuery('')}>
               <MaterialIcons name="close" size={18} color="#7a7488" />
             </TouchableOpacity>
           )}
        </View>

        {/* Category Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.value;
            return (
              <TouchableOpacity 
                key={cat.value} 
                style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                onPress={() => setSelectedCategory(cat.value)}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading && articles.length === 0 ? (
          <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 40 }} />
        ) : articles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={40} color="#7a7488" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyText}>No articles found matching your criteria.</Text>
          </View>
        ) : (
          <View style={styles.libraryContainer}>
            {/* Hero / Featured Article */}
            {featuredArticle && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Featured Guide</Text>
                <TouchableOpacity 
                  style={styles.featuredCard} 
                  activeOpacity={0.9}
                  onPress={() => openArticle(featuredArticle)}
                >
                   <View style={styles.featuredContent}>
                      <View style={styles.badgeRow}>
                         <View style={styles.featuredBadge}>
                            <Text style={styles.featuredBadgeText}>
                              {getCategoryLabel(featuredArticle.category)}
                            </Text>
                         </View>
                         <Text style={styles.featuredMeta}>{featuredArticle.readTime} min read</Text>
                      </View>
                      <Text style={styles.featuredTitle}>{featuredArticle.title}</Text>
                      <Text style={styles.featuredPreview}>{featuredArticle.preview}</Text>
                      <View style={styles.readMoreRow}>
                         <Text style={styles.readMoreText}>Read Guide</Text>
                         <MaterialIcons name="arrow-forward" size={16} color="#ffffff" />
                      </View>
                   </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Library list */}
            {regularArticles.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Latest Library</Text>
                <View style={styles.articleList}>
                  {regularArticles.map((article) => (
                    <TouchableOpacity 
                      key={article.id} 
                      style={styles.articleCard}
                      onPress={() => openArticle(article)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.articleTextContainer}>
                         <View style={styles.badgeRow}>
                            <View style={styles.articleBadge}>
                               <Text style={styles.articleBadgeText}>
                                 {getCategoryLabel(article.category)}
                               </Text>
                            </View>
                            <Text style={styles.articleMeta}>{article.readTime} min read</Text>
                         </View>
                         <Text style={styles.articleTitle}>{article.title}</Text>
                         <Text style={styles.articlePreview}>{article.preview}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Reader Modal */}
      {selectedArticle && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
               <View style={styles.modalHeader}>
                  <View style={styles.modalBadgeRow}>
                     <View style={styles.modalCategoryBadge}>
                        <Text style={styles.modalCategoryBadgeText}>
                          {getCategoryLabel(selectedArticle.category)}
                        </Text>
                     </View>
                     <Text style={styles.modalMeta}>{selectedArticle.readTime} min read</Text>
                  </View>
                  <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                     <MaterialIcons name="close" size={24} color="#191c1d" />
                  </TouchableOpacity>
               </View>

               <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalTitle}>{selectedArticle.title}</Text>
                  
                  {/* Divider */}
                  <View style={styles.modalDivider} />

                  <View>
                    {renderFormattedContent(selectedArticle.content)}
                  </View>
               </ScrollView>
            </View>
          </View>
        </Modal>
      )}
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
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#191c1d',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e3e4',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#191c1d',
    padding: 0,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbc3d9',
    backgroundColor: '#ffffff',
    height: 36,
  },
  categoryChipSelected: {
    backgroundColor: '#4800b2',
    borderColor: '#4800b2',
  },
  categoryText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: '#494456',
  },
  categoryTextSelected: {
    color: '#ffffff',
  },
  libraryContainer: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
    color: '#191c1d',
  },
  featuredCard: {
    backgroundColor: '#4800b2',
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredContent: {
    padding: 20,
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featuredBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#ffffff',
  },
  featuredMeta: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: '#cbc3d9',
  },
  featuredTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 22,
    color: '#ffffff',
    lineHeight: 28,
  },
  featuredPreview: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#e8ddff',
    lineHeight: 20,
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  readMoreText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#ffffff',
  },
  articleList: {
    gap: 12,
  },
  articleCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e3e4',
    borderRadius: 16,
    padding: 16,
  },
  articleTextContainer: {
    gap: 8,
  },
  articleBadge: {
    backgroundColor: '#f3f4f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  articleBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#494456',
  },
  articleMeta: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: '#7a7488',
  },
  articleTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#191c1d',
  },
  articlePreview: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: '#494456',
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: '#7a7488',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  modalBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalCategoryBadge: {
    backgroundColor: '#e8ddff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  modalCategoryBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#4800b2',
  },
  modalMeta: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: '#7a7488',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 22,
    color: '#191c1d',
    lineHeight: 28,
    marginBottom: 16,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#e1e3e4',
    marginBottom: 16,
  },
  modalParagraph: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: '#191c1d',
    lineHeight: 24,
    marginBottom: 12,
  },
  boldText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: 'bold',
  }
});
