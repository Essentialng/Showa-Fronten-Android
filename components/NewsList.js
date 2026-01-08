import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,

  Linking,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import colors from '../theme/colors';

const NewsListScreen = () => {
  const navigation = useNavigation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await fetch(
        `https://backend.essentialnews.ng/api/posts/breaking?page=${pageNum}`
      );
      const data = await response.json();

      if (data.status === 'success') {
        let newsData = data.data.posts;
        if (newsData.length > 20) {
          newsData = newsData.slice(0, 20);
          setHasMore(false);
        }
        
        if (isRefresh || pageNum === 1) {
          setNews(newsData);
        } else {
          setNews(prevNews => [...prevNews, ...newsData]);
        }
        
        setHasMore(data.data.pagination.current_page < data.data.pagination.last_page);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleRefresh = () => {
    setPage(1);
    fetchNews(1, true);
  };

  const loadMore = () => {
    if (hasMore && !loading && news.length < 20) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleExplorePress = () => {
    Linking.openURL('https://essentialnews.ng');
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity
      style={styles.newsItem}
      onPress={handleExplorePress}
    >
      <Image
        source={{ uri: item.featured_image || 'https://via.placeholder.com/300x200' }}
        style={styles.newsImage}
        resizeMode="cover"
      />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.newsMeta}>
          <View style={styles.metaItem}>
            <Icon name="category" size={14} color="#666" />
            <Text style={styles.metaText}>{item.category_names || 'General'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="calendar-today" size={14} color="#666" />
            <Text style={styles.metaText}>{formatDate(item.created_at)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="visibility" size={14} color="#666" />
            <Text style={styles.metaText}>{item.views} views</Text>
          </View>
        </View>
        {item.is_breaking && (
          <View style={styles.breakingBadge}>
            <Icon name="warning" size={12} color="#fff" />
            <Text style={styles.breakingText}>BREAKING</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading && news.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0750b5" />
        <Text style={styles.loadingText}>Loading news...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0750b5" />
      
      {/* Professional Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navbarContent}>
          <Text style={styles.navbarTitle}>Essential News</Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={handleExplorePress}
          >
            <Icon name="explore" size={20} color="#fff" />
            <Text style={styles.exploreButtonText}>Explore</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore && news.length > 0 ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color="#0750b5" />
              <Text style={styles.footerText}>Loading more news...</Text>
            </View>
          ) : news.length > 0 ? (
            <View style={styles.footer}>
              <Text style={styles.footerText}>No more news to load</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            {/* <Icon name="news" size={64} color="#ccc" /> */}
            <Text style={styles.emptyText}>No news available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Navbar styles
  navbar: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navbarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
  },
  newsItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    lineHeight: 24,
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  breakingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53e3e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  breakingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  emptyText: {
    marginTop: 16,
    color: '#666',
    fontSize: 18,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
});

export default NewsListScreen;