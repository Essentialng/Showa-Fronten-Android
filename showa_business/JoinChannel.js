import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Divider, Snackbar } from 'react-native-paper';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext'; 

const ChatScreen = ({ navigation }) => {
  const { colors, theme, isDark } = useTheme(); 
  
  const [search, setSearch] = useState('');
  const [channels, setChannels] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const fetchChannels = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const res = await axios.get(`${API_ROUTE}/channels/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChannels(res.data);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.error('Error fetching channels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (slug, index) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      // Optimistically update the UI
      const updatedChannels = [...channels];
      const channelIndex = updatedChannels.findIndex(c => c.slug === slug);
      
      if (channelIndex !== -1) {
        updatedChannels[channelIndex].isFollowing = !updatedChannels[channelIndex].isFollowing;
        if (updatedChannels[channelIndex].followers_count) {
          updatedChannels[channelIndex].followers_count = 
            updatedChannels[channelIndex].isFollowing 
              ? updatedChannels[channelIndex].followers_count + 1 
              : updatedChannels[channelIndex].followers_count - 1;
        }
        setChannels(updatedChannels);
      }

      // Make the API call
      await axios.post(
        `${API_ROUTE}/channels/${slug}/follow/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh data to ensure consistency
      await fetchChannels();
    } catch (err) {
      console.error('Follow error:', err.response?.data || err.message);
      // Revert changes if API call fails
      fetchChannels();
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(search.toLowerCase())
  );

  const navigateToChannelDetails = (channel) => {
    navigation.navigate('ChannelDetails', {
      receiverId: channel.id,
      name: channel.name,
      chatType: 'channel',
      profile_image: channel.image,
      channelSlug: channel.slug,
      InviteLink: channel.invite_link,
      followers: channel.followers_count
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <LinearGradient 
        colors={[colors.primary, colors.primaryDark || colors.primary]} 
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 1}}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back-outline" size={24} color='#fff' />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#fff' }]}>Discover Channels</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={[styles.searchBox, { backgroundColor: '#fff' }]}>
          <Icon name="search" size={18} color={colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search channels..."
            placeholderTextColor={colors.textTertiary}
            style={[styles.searchInput, { color: colors.text }]}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>
      </LinearGradient>

      <ScrollView 
        style={[styles.body, { backgroundColor: colors.backgroundSecondary }]}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Communities</Text>
          <Divider style={[styles.divider, { backgroundColor: colors.border }]} />

          {loading ? (
            <View style={styles.loadingContainer}>
              {[1, 2, 3].map((item) => (
                <View key={item} style={[styles.skeletonCard, { backgroundColor: colors.surface }]}>
                  <View style={[styles.skeletonAvatar, { backgroundColor: colors.surfaceSecondary }]} />
                  <View style={styles.skeletonTextContainer}>
                    <View style={[styles.skeletonText, { width: '70%', backgroundColor: colors.surfaceSecondary }]} />
                    <View style={[styles.skeletonText, { width: '50%', backgroundColor: colors.surfaceSecondary }]} />
                  </View>
                  <View style={[styles.skeletonButton, { backgroundColor: colors.surfaceSecondary }]} />
                </View>
              ))}
            </View>
          ) : filteredChannels.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="compass-outline" size={50} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No channels found</Text>
              <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>Try a different search term</Text>
            </View>
          ) : (
            filteredChannels.map((channel) => (
              <Animated.View 
                key={channel.id}
                style={{ opacity: fadeAnim }}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.card, { backgroundColor: colors.background }]}
                  onPress={() => {
                    if (channel.isFollowing) {
                      navigateToChannelDetails(channel);
                    } else {
                      setSnackbarVisible(true);
                    }
                  }}
                >
                  <Image
                    source={
                      channel.image
                        ? { uri: `${API_ROUTE_IMAGE}${channel.image}` }
                        : require('../assets/images/channelfallbackimg.png')
                    }
                    style={[styles.avatar, { borderColor: colors.border }]}
                  />
                  <View style={styles.channelInfo}>
                    <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{channel.name}</Text>
                    <Text style={[styles.followers, { color: colors.textSecondary }]}>
                      {channel.followers_count?.toLocaleString() || '0'} members
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.followBtn,
                      { backgroundColor: colors.buttonPrimary },
                      channel.isFollowing && [styles.followingBtn, { backgroundColor: colors.buttonSecondary }],
                    ]}
                    onPress={() => handleFollow(channel.slug)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.followText,
                      { color: colors.buttonPrimaryText },
                      channel.isFollowing && [styles.followingText, { color: colors.buttonSecondaryText }]
                    ]}>
                      {channel.isFollowing ? (
                        <>
                          <Icon name="checkmark" size={14} color={colors.buttonSecondaryText} /> Following
                        </>
                      ) : (
                        'Follow'
                      )}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={[styles.snackbar, { backgroundColor: colors.primary }]}
        action={{
          label: 'OK',
          labelColor: colors.textInverse,
          onPress: () => setSnackbarVisible(false),
        }}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="lock-closed" size={16} color={colors.textInverse} style={{marginRight: 8}} />
          <Text style={{color: colors.textInverse}}>Follow to access this channel</Text>
        </View>
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 30,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 46,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
  },
  body: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 15,
  },
  divider: {
    marginBottom: 15,
    height: 1.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
    borderWidth: 1,
  },
  channelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 3,
  },
  followers: {
    fontSize: 13,
  },
  followBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followingBtn: {
    backgroundColor: '#f0f0f0',
  },
  followText: {
    fontWeight: '500',
    fontSize: 14,
  },
  followingText: {
    color: '#666',
  },
  snackbar: {
    borderRadius: 8,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 5,
  },
  loadingContainer: {
    marginTop: 10,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
  },
  skeletonAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  skeletonTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  skeletonText: {
    height: 14,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonButton: {
    width: 80,
    height: 30,
    borderRadius: 18,
  },
});

export default ChatScreen;