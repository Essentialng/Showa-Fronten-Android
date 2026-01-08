import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
  Animated,
  Dimensions,
  Pressable,
  Alert,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import Video from 'react-native-video';

const { height, width } = Dimensions.get('window');

const ManagePostsScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('marketplace');
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const videoRefs = useRef({});
  const [loading, setLoading] = useState(true);
const fetchMarketplace = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(`${API_ROUTE}/my-listings/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMarketplacePosts(res.data || []);
    } catch (error) {
      setMarketplacePosts([]);
      console.error('Error fetching marketplace posts:', error);
    }
  };

  const fetchTweets = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(`${API_ROUTE}/my-posts/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTweets(res.data || []);
    } catch (error) {
      setTweets([]);
      console.error('Error fetching tweets:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(`${API_ROUTE}/my-shorts/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserVideos(res.data || []);
    } catch (error) {
      setUserVideos([]);
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchMarketplace(), fetchTweets(), fetchVideos()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const confirmDelete = (type, id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => handleDelete(type, id),
          style: "destructive"
        }
      ]
    );
  };

  const handleDelete = async (type, id) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      let endpoint = '';
      if (type === 'marketplace') {
        endpoint = `${API_ROUTE}/my-listings/${id}/`;
      } else if (type === 'tweets') {
        endpoint = `${API_ROUTE}/my-posts/${id}/`;
      } else {
        endpoint = `${API_ROUTE}/my-shorts/${id}/`;
      }

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh the appropriate list
      if (type === 'marketplace') {
        fetchMarketplace();
      } else if (type === 'tweets') {
        fetchTweets();
      } else {
        fetchVideos();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete item");
    }
    toggleModal();
  };

  useEffect(() => {
    fetchMarketplace();
    fetchTweets();
    fetchVideos();
  }, []);

  const toggleModal = (item = null) => {
    setSelectedItem(item);
    if (item) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  };

  const toggleVideoPlayback = (id) => {
    if (playingVideo === id) {
      setPlayingVideo(null);
    } else {
      setPlayingVideo(id);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={60} color="#d1d5db" />
      <Text style={styles.emptyText}>You haven’t posted anything yet. Create your first post and start sharing!</Text>
      {/* <TouchableOpacity 
        style={styles.createButton}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.createButtonText}>Create your first post</Text>
      </TouchableOpacity> */}
    </View>
  );

  const currentData = () => {
    switch(selectedTab) {
      case 'marketplace': return marketplacePosts;
      case 'tweets': return tweets;
      case 'videos': return userVideos;
      default: return [];
    }
  };

  const renderMarketplacePost = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.images?.[0]?.image }} 
        style={styles.postImage}
      />
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <TouchableOpacity onPress={() => toggleModal(item)}>
            <Ionicons name="ellipsis-vertical" size={20} color="#7f8c8d" />
          </TouchableOpacity>
        </View>
        <Text style={styles.postPrice}>${item.price}</Text>
        <Text style={styles.postDate}>{item.date}</Text>
      </View>
    </View>
  );

  const renderTweet = ({ item }) => (
    <View style={styles.card}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={styles.postText} numberOfLines={3}>{item.content}</Text>
          <TouchableOpacity onPress={() => toggleModal(item)}>
            <Ionicons name="ellipsis-vertical" size={20} color="#7f8c8d" />
          </TouchableOpacity>
        </View>
        <View style={styles.postStats}>
          <Text style={styles.postStat}>{item.likes} likes</Text>
          <Text style={styles.postStat}>{item.comments} comments</Text>
          <Text style={styles.postDate}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

  const renderVideo = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => toggleVideoPlayback(item.id)}
        style={styles.videoContainer}
      >
        <Video
          ref={(ref) => (videoRefs.current[item.id] = ref)}
          source={{ uri: item.video }}
          style={styles.postImage}
          resizeMode="cover"
          paused={playingVideo !== item.id}
          repeat={true}
          onError={(error) => console.log('Video error:', error)}
        />
        {playingVideo !== item.id && (
          <View style={styles.playButton}>
            <Ionicons name="play" size={48} color="rgba(255,255,255,0.8)" />
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={styles.postTitle}>{item.caption}</Text>
          <TouchableOpacity onPress={() => toggleModal(item)}>
            <Ionicons name="ellipsis-vertical" size={20} color="#7f8c8d" />
          </TouchableOpacity>
        </View>
        <View style={styles.postStats}>
          <Text style={styles.postStat}>{item.like_count} likes</Text>
          <Text style={styles.postStat}>{item.comment_count} comments</Text>
          <Text style={styles.postDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Posts</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tab Bar */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          onPress={() => {
            setSelectedTab('marketplace');
            setPlayingVideo(null);
          }} 
          style={[styles.tab, selectedTab === 'marketplace' && styles.activeTab]}
        >
          <Ionicons 
            name="cart-outline" 
            size={20} 
            color={selectedTab === 'marketplace' ? '#fff' : '#0d64dd'} 
          />
          <Text style={[styles.tabText, selectedTab === 'marketplace' && styles.activeTabText]}>
            Marketplace
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => {
            setSelectedTab('tweets');
            setPlayingVideo(null);
          }} 
          style={[styles.tab, selectedTab === 'tweets' && styles.activeTab]}
        >
          <Ionicons 
            name="chatbubble-outline" 
            size={20} 
            color={selectedTab === 'tweets' ? '#fff' : '#0d64dd'} 
          />
          <Text style={[styles.tabText, selectedTab === 'tweets' && styles.activeTabText]}>
            Broadcast
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => {
            setSelectedTab('videos');
          }} 
          style={[styles.tab, selectedTab === 'videos' && styles.activeTab]}
        >
          <Ionicons 
            name="videocam-outline" 
            size={20} 
            color={selectedTab === 'videos' ? '#fff' : '#0d64dd'} 
          />
          <Text style={[styles.tabText, selectedTab === 'videos' && styles.activeTabText]}>
            Videos
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0d64dd" />
        </View>
      ) : currentData().length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={currentData()}
          renderItem={
            selectedTab === 'marketplace'
              ? renderMarketplacePost
              : selectedTab === 'tweets'
              ? renderTweet
              : renderVideo
          }
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Content */}
      {/* <FlatList
        data={
          selectedTab === 'marketplace'
            ? marketplacePosts
            : selectedTab === 'tweets'
            ? tweets
            : userVideos
        }
        renderItem={
          selectedTab === 'marketplace'
            ? renderMarketplacePost
            : selectedTab === 'tweets'
            ? renderTweet
            : renderVideo
        }
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      /> */}

      {/* Bottom Sheet Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
        animationType="none"
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop} 
            onPress={toggleModal}
          />
          
          <Animated.View 
            style={[
              styles.modalContainer,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Post Options</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => confirmDelete(selectedTab, selectedItem.id)}
            >
              <Ionicons name="trash-outline" size={24} color="#e74c3c" />
              <Text style={[styles.modalOptionText, { color: '#e74c3c' }]}>Delete Post</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={()=>setModalVisible(false)}
            >
              <Ionicons name="close-circle-outline" size={24} color="#3498db" />
              <Text style={styles.modalOptionText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 2,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    fontFamily: 'Lato-Bold',
  },
  headerRight: {
    width: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#0d64dd',
    shadowColor: '#0d64dd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    marginLeft: 8,
    color: '#0d64dd',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Lato-SemiBold',
  },
  activeTabText: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
  },
  videoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  postContent: {
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    marginRight: 8,
    fontFamily: 'Lato-SemiBold',
  },
  postText: {
    fontSize: 15,
    color: '#495057',
    flex: 1,
    marginRight: 8,
    lineHeight: 22,
    fontFamily: 'Lato-Regular',
  },
  postPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#27ae60',
    marginBottom: 4,
    fontFamily: 'Lato-Bold',
  },
  postStats: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  postStat: {
    fontSize: 13,
    color: '#6c757d',
    marginRight: 16,
    fontFamily: 'Lato-Regular',
  },
  postDate: {
    fontSize: 12,
    color: '#adb5bd',
    fontFamily: 'Lato-Regular',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Lato-SemiBold',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 16,
    fontFamily: 'Lato-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#0d64dd',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default ManagePostsScreen;