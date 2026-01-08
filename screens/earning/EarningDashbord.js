
import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, RefreshControl, ActivityIndicator,
   Animated, Dimensions, Modal,
   Alert, Linking
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../../api_routing/api';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const BRAND_COLOR = '#0d64dd';

const createApiService = () => {
  const baseURL = `${API_ROUTE}`;
  
  const api = {
    interceptors: {
      request: { use: () => {} },
      response: { use: () => {} }
    },
    defaults: {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  api.request = async (config) => {
    try {
      const mergedConfig = {
        ...api.defaults,
        ...config,
        headers: {
          ...api.defaults.headers,
          ...config.headers,
        },
      };

      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        mergedConfig.headers.Authorization = `Bearer ${token}`;
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), mergedConfig.timeout);
      
      const response = await fetch(
        `${baseURL}${mergedConfig.url}`.replace(/([^:]\/)\/+/g, "$1"),
        {
          method: mergedConfig.method || 'GET',
          headers: mergedConfig.headers,
          body: mergedConfig.data ? JSON.stringify(mergedConfig.data) : null,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.removeItem('userToken');
          throw new Error('Unauthorized');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status, headers: response.headers };
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  api.get = (url, config) => api.request({ ...config, url, method: 'GET' });
  api.post = (url, data, config) => api.request({ ...config, url, data, method: 'POST' });

  return api;
};

const api = createApiService();

const EarnTasksScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [welcomeFadeAnim] = useState(new Animated.Value(0));
  const [welcomeScaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    checkFirstVisit();
    fetchEarnData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (welcomeVisible) {
      Animated.parallel([
        Animated.timing(welcomeFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(welcomeScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [welcomeVisible]);

  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem('hasVisitedEarnScreen');
      if (!hasVisited) {
        setWelcomeVisible(true);
        await AsyncStorage.setItem('hasVisitedEarnScreen', 'true');
      }
    } catch (error) {
      console.error('Error checking first visit:', error);
    }
  };

  const fetchEarnData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/earn/enhanced/');
      setTasks(response.data.tasks);
      setStats(response.data.stats);
      
      if (response.data.stats) {
        setDailyProgress((response.data.stats.coins_today / response.data.stats.daily_cap) * 100);
        setWeeklyProgress((response.data.stats.coins_this_week / response.data.stats.weekly_cap) * 100);
      }
    } catch (error) {
      console.error('Error fetching earn data:', error);
      Alert.alert('Error', 'Failed to load earn tasks. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEarnData();
  };

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const navigateToSection = (section) => {
    switch(section) {
      case 'videos':
        navigation.navigate('ShortVideos');
        break;
      case 'posts':
        navigation.navigate('CreatePost');
        break;
      case 'messages':
        navigation.navigate('Chat');
        break;
      case 'profile':
        navigation.navigate('Profile');
        break;
      case 'business':
        navigation.navigate('BusinessProfile');
        break;
      default:
        break;
    }
  };

  const getTaskIcon = (taskType) => {
    switch(taskType) {
      case 'daily': return 'calendar-today';
      case 'engagement': return 'trending-up';
      case 'content': return 'create';
      case 'profile': return 'person';
      case 'verification': return 'verified-user';
      case 'business': return 'business';
      default: return 'monetization-on';
    }
  };

  const getTaskColor = (taskType) => {
    switch(taskType) {
      case 'daily': return '#4CAF50';
      case 'engagement': return '#FF9800';
      case 'content': return '#9C27B0';
      case 'profile': return '#00BCD4';
      case 'verification': return '#3F51B5';
      case 'business': return '#607D8B';
      default: return BRAND_COLOR;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const CustomProgressBar = ({ progress, color, style }) => {
    return (
      <View style={[styles.customProgressBarContainer, style]}>
        <View style={[
          styles.customProgressBarFill, 
          { 
            width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
            backgroundColor: color || BRAND_COLOR
          }
        ]} />
      </View>
    );
  };

  const WelcomePopup = () => (
    <Modal
      transparent={true}
      visible={welcomeVisible}
      animationType="none"
      onRequestClose={() => setWelcomeVisible(false)}
    >
      <View style={styles.welcomeOverlay}>
        <Animated.View 
          style={[
            styles.welcomeContainer,
            {
              opacity: welcomeFadeAnim,
              transform: [{ scale: welcomeScaleAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={[BRAND_COLOR, '#0a53b9', '#083a8a']}
            style={styles.welcomeHeader}
          >
            <View style={styles.welcomeIconCircle}>
              <Icon name="monetization-on" size={50} color="#FFD700" />
            </View>
            <Text style={styles.welcomeTitle}>Welcome to Earn!</Text>
            <Text style={styles.welcomeSubtitle}>Start Making Money with Showa</Text>
          </LinearGradient>

          <ScrollView style={styles.welcomeContent} showsVerticalScrollIndicator={false}>
            <View style={styles.welcomeFeature}>
              <View style={[styles.featureIcon, { backgroundColor: '#4CAF5020' }]}>
                <Icon name="auto-awesome" size={24} color="#4CAF50" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Auto-Earn System</Text>
                <Text style={styles.featureDescription}>
                  Earn coins automatically while using Showa normally. No extra steps needed!
                </Text>
              </View>
            </View>

            <View style={styles.welcomeFeature}>
              <View style={[styles.featureIcon, { backgroundColor: '#2196F320' }]}>
                <Icon name="trending-up" size={24} color="#2196F3" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Multiple Earning Ways</Text>
                <Text style={styles.featureDescription}>
                  Watch videos, create posts, chat, and more - everything earns you money!
                </Text>
              </View>
            </View>

            <View style={styles.welcomeFeature}>
              <View style={[styles.featureIcon, { backgroundColor: '#FF980020' }]}>
                <Icon name="attach-money" size={24} color="#FF9800" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Real Cash Withdrawals</Text>
                <Text style={styles.featureDescription}>
                  Convert coins to real money via PayPal, bank transfer, or mobile money.
                </Text>
              </View>
            </View>

            <View style={styles.welcomeFeature}>
              <View style={[styles.featureIcon, { backgroundColor: '#9C27B020' }]}>
                <Icon name="security" size={24} color="#9C27B0" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Secure & Reliable</Text>
                <Text style={styles.featureDescription}>
                  Your earnings are safe and withdrawals are processed quickly.
                </Text>
              </View>
            </View>

            <View style={styles.earningsPreview}>
              <Text style={styles.earningsTitle}>Quick Earnings Preview</Text>
              <View style={styles.earningsGrid}>
                <View style={styles.earningItem}>
                  <Icon name="play-arrow" size={20} color="#2196F3" />
                  <Text style={styles.earningText}>Watch Video</Text>
                  <Text style={styles.earningReward}>+1 coin</Text>
                </View>
                <View style={styles.earningItem}>
                  <Icon name="favorite" size={20} color="#E91E63" />
                  <Text style={styles.earningText}>Like Post</Text>
                  <Text style={styles.earningReward}>+0.5 coins</Text>
                </View>
                <View style={styles.earningItem}>
                  <Icon name="create" size={20} color="#9C27B0" />
                  <Text style={styles.earningText}>Create Post</Text>
                  <Text style={styles.earningReward}>+1 coin</Text>
                </View>
                <View style={styles.earningItem}>
                  <Icon name="message" size={20} color="#00BCD4" />
                  <Text style={styles.earningText}>Send Message</Text>
                  <Text style={styles.earningReward}>+1 coin</Text>
                </View>
              </View>
            </View>

            <View style={styles.dailyLimitCard}>
              <View style={styles.limitHeader}>
                <Icon name="today" size={22} color="#4CAF50" />
                <View style={styles.limitTexts}>
                  <Text style={styles.limitTitle}>Daily Earnings Limit</Text>
                  <Text style={styles.limitAmount}>Up to {stats?.daily_cap || 50} coins/day</Text>
                </View>
              </View>
              <Text style={styles.limitNote}>
                That's ≈ {formatCurrency((stats?.daily_cap || 50) * (stats?.exchange_rate || 0.01))} per day!
              </Text>
            </View>
          </ScrollView>

          <View style={styles.welcomeFooter}>
            <TouchableOpacity 
              style={styles.getStartedButton}
              onPress={() => setWelcomeVisible(false)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[BRAND_COLOR, '#0a53b9']}
                style={styles.gradientButton}
              >
                <Text style={styles.getStartedText}>Get Started</Text>
                <Icon name="arrow-forward" size={22} color="#fff" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => setWelcomeVisible(false)}
            >
              <Text style={styles.skipText}>Skip Tutorial</Text>
            </TouchableOpacity>
            <Text style={styles.welcomeFooterNote}>
              💡 Pro Tip: Check back daily for streak bonuses!
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <WelcomePopup />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[BRAND_COLOR]}
            tintColor={BRAND_COLOR}
          />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={[BRAND_COLOR, '#0a53b9']}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Earn Money</Text>
          <TouchableOpacity 
            style={styles.walletButton}
            onPress={() => navigation.navigate('EarningWallet')}
          >
            <Icon name="account-balance-wallet" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Banner */}
        <Animated.View 
          style={[
            styles.statsBanner,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Earnings Dashboard</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Icon name="monetization-on" size={24} color="#FFD700" />
                <Text style={styles.statNumber}>{stats?.coins_total || 0}</Text>
                <Text style={styles.statLabel}>Total Coins</Text>
              </View>
              
              <View style={styles.statBox}>
                <Icon name="attach-money" size={24} color="#4CAF50" />
                <Text style={styles.statNumber}>{formatCurrency(stats?.usd_total)}</Text>
                <Text style={styles.statLabel}>Total Value</Text>
              </View>
              
              <View style={styles.statBox}>
                <Icon name="whatshot" size={24} color="#FF5722" />
                <Text style={styles.statNumber}>{stats?.streak || 0}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              
              <View style={styles.statBox}>
                <Icon name="trending-up" size={24} color="#2196F3" />
                <Text style={styles.statNumber}>{stats?.coins_today || 0}</Text>
                <Text style={styles.statLabel}>Today's Coins</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* How It Works Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Icon2 name="lightbulb" size={22} color={BRAND_COLOR} />
            <Text style={styles.infoTitle}>How Earning Works</Text>
          </View>
          <Text style={styles.infoText}>
            💡 <Text style={styles.infoBold}>Earn automatically</Text> while using Showa! Coins are awarded in the background when you:
          </Text>
          
          <View style={styles.infoPoints}>
            <View style={styles.infoPoint}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={styles.pointText}>Watch videos (10+ seconds)</Text>
            </View>
            <View style={styles.infoPoint}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={styles.pointText}>Like & comment on posts</Text>
            </View>
            <View style={styles.infoPoint}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={styles.pointText}>Send and reply to messages</Text>
            </View>
            <View style={styles.infoPoint}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={styles.pointText}>Create posts and content</Text>
            </View>
            <View style={styles.infoPoint}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={styles.pointText}>Follow other users</Text>
            </View>
          </View>
        </View>

        {/* Daily & Weekly Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Icon name="today" size={22} color="#4CAF50" />
              <View style={styles.progressTitleContainer}>
                <Text style={styles.progressTitle}>Daily Progress</Text>
                <Text style={styles.progressSubtitle}>{stats?.coins_today || 0}/{stats?.daily_cap || 50} coins</Text>
              </View>
            </View>
            <CustomProgressBar 
              progress={dailyProgress / 100} 
              color="#4CAF50"
            />
            <Text style={styles.progressTip}>
              Complete daily tasks to earn up to {stats?.daily_cap || 50} coins per day
            </Text>
          </View>
          
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Icon name="date-range" size={22} color="#2196F3" />
              <View style={styles.progressTitleContainer}>
                <Text style={styles.progressTitle}>Weekly Progress</Text>
                <Text style={styles.progressSubtitle}>{stats?.coins_this_week || 0}/{stats?.weekly_cap || 250} coins</Text>
              </View>
            </View>
            <CustomProgressBar 
              progress={weeklyProgress / 100} 
              color="#2196F3"
            />
            <Text style={styles.progressTip}>
              Weekly limit: {stats?.weekly_cap || 250} coins ({formatCurrency((stats?.weekly_cap || 250) * (stats?.exchange_rate || 0.01))})
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Earn Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('VideoAds')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#2196F320' }]}>
                <Icon name="ondemand-video" size={28} color="#2196F3" />
              </View>
              <Text style={styles.actionTitle}>Watch Videos</Text>
              <Text style={styles.actionReward}>+1 coin per video</Text>
              <Text style={styles.actionSub}>15 videos/day</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('CreateBroadcastPost')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#9C27B020' }]}>
                <Icon name="create" size={28} color="#9C27B0" />
              </View>
              <Text style={styles.actionTitle}>Create Posts</Text>
              <Text style={styles.actionReward}>+1 coin per post</Text>
              <Text style={styles.actionSub}>5 posts/day</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
             // onPress={() => navigateToSection('messages')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FF980020' }]}>
                <Icon name="message" size={28} color="#FF9800" />
              </View>
              <Text style={styles.actionTitle}>Send Messages</Text>
              <Text style={styles.actionReward}>+1 coin per reply</Text>
              <Text style={styles.actionSub}>10 replies/day</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              //onPress={() => navigateToSection('profile')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#00BCD420' }]}>
                <Icon name="person" size={28} color="#00BCD4" />
              </View>
              <Text style={styles.actionTitle}>Complete Profile</Text>
              <Text style={styles.actionReward}>+5 coins</Text>
              <Text style={styles.actionSub}>One-time reward</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* All Earning Opportunities */}
        <View style={styles.opportunitiesSection}>
          <Text style={styles.sectionTitle}>All Earning Opportunities</Text>
          
          {/* Daily Tasks */}
          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: '#4CAF5020' }]}>
                <Icon name="calendar-today" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.categoryTitle}>Daily Rewards</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>Auto-earn</Text>
              </View>
            </View>
            
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="brightness-5" size={18} color="#4CAF50" />
                  <Text style={styles.taskName}>Daily Login</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+3 coins</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.03)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="trending-up" size={18} color="#FF9800" />
                  <Text style={styles.taskName}>7-Day Streak</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+10 coins</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.10)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Video Watching */}
          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: '#2196F320' }]}>
                <Icon name="ondemand-video" size={20} color="#2196F3" />
              </View>
              <Text style={styles.categoryTitle}>Watch & Earn</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>Auto-earn</Text>
              </View>
            </View>
            
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="play-arrow" size={18} color="#2196F3" />
                  <Text style={styles.taskName}>Watch Video (10+ seconds)</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+1 coin</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.01)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="check-circle" size={18} color="#4CAF50" />
                  <Text style={styles.taskName}>Watch Full Video</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+1 coin</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.01)}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.categoryNote}>Earn automatically while watching Short Videos</Text>
          </View>

          {/* Social Engagement */}
          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: '#FF980020' }]}>
                <Icon name="thumb-up" size={20} color="#FF9800" />
              </View>
              <Text style={styles.categoryTitle}>Social Engagement</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>Auto-earn</Text>
              </View>
            </View>
            
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="favorite" size={18} color="#E91E63" />
                  <Text style={styles.taskName}>Like Posts</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+0.5 coins</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.005)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="comment" size={18} color="#2196F3" />
                  <Text style={styles.taskName}>Comment on Posts</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+1 coin</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.01)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="person-add" size={18} color="#4CAF50" />
                  <Text style={styles.taskName}>Follow Users</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+1 coin</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.01)}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.categoryNote}>Earn automatically when you engage with content</Text>
          </View>

          {/* Content Creation */}
          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: '#9C27B020' }]}>
                <Icon name="create" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.categoryTitle}>Content Creation</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>Auto-earn</Text>
              </View>
            </View>
            
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="post-add" size={18} color="#9C27B0" />
                  <Text style={styles.taskName}>Create Post</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+1 coin</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.01)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="videocam" size={18} color="#2196F3" />
                  <Text style={styles.taskName}>Create Short Video</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+2 coins</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.02)}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.categoryNote}>Earn automatically when you create content</Text>
          </View>

          {/* Messaging */}
          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: '#00BCD420' }]}>
                <Icon name="message" size={20} color="#00BCD4" />
              </View>
              <Text style={styles.categoryTitle}>Messaging</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>Auto-earn</Text>
              </View>
            </View>
            
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="send" size={18} color="#00BCD4" />
                  <Text style={styles.taskName}>First Message to New Contact</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+1 coin</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.01)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="reply" size={18} color="#FF9800" />
                  <Text style={styles.taskName}>Reply in Conversation</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+1 coin</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.01)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="business" size={18} color="#607D8B" />
                  <Text style={styles.taskName}>Business Reply (Business Mode)</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+2 coins</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.02)}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.categoryNote}>Earn automatically when you chat with others</Text>
          </View>

          {/* Account & Verification */}
          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: '#3F51B520' }]}>
                <Icon name="verified-user" size={20} color="#3F51B5" />
              </View>
              <Text style={styles.categoryTitle}>Account & Verification</Text>
            </View>
            
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <TouchableOpacity 
                  style={styles.taskInfo}
                  onPress={() => navigateToSection('profile')}
                >
                  <Icon name="person" size={18} color="#00BCD4" />
                  <Text style={styles.taskName}>Complete Profile</Text>
                </TouchableOpacity>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+5 coins</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.05)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="email" size={18} color="#FF9800" />
                  <Text style={styles.taskName}>Verify Email</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+5 coins</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.05)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="phone" size={18} color="#4CAF50" />
                  <Text style={styles.taskName}>Verify Phone</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+10 coins</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.10)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Business Features */}
          <View style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: '#607D8B20' }]}>
                <Icon name="business" size={20} color="#607D8B" />
              </View>
              <Text style={styles.categoryTitle}>Business Features</Text>
            </View>
            
            <View style={styles.taskList}>
              <View style={styles.taskItem}>
                <TouchableOpacity 
                  style={styles.taskInfo}
                  onPress={() => navigateToSection('business')}
                >
                  <Icon name="store" size={18} color="#607D8B" />
                  <Text style={styles.taskName}>Create Business Catalog</Text>
                </TouchableOpacity>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+10 coins</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.10)}</Text>
                </View>
              </View>
              
              <View style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Icon name="verified" size={18} color="#4CAF50" />
                  <Text style={styles.taskName}>Business Account Verified</Text>
                </View>
                <View style={styles.taskRewardInfo}>
                  <Text style={styles.taskCoins}>+20 coins</Text>
                  <Text style={styles.taskValue}>≈ {formatCurrency(0.20)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Withdrawal Info */}
        <View style={styles.withdrawalSection}>
          <LinearGradient
            colors={[BRAND_COLOR, '#0a53b9']}
            style={styles.withdrawalCard}
          >
            <Icon name="account-balance" size={40} color="#fff" style={styles.withdrawalIcon} />
            <Text style={styles.withdrawalTitle}>Ready to Cash Out?</Text>
            <Text style={styles.withdrawalAmount}>
              {formatCurrency(stats?.usd_available || 0)} available
            </Text>
            
            <View style={styles.withdrawalInfo}>
              <View style={styles.infoRow}>
                <Icon name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.infoText}>Minimum: {formatCurrency((stats?.withdrawal?.minimum_usd || 1))}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.infoText}>Exchange Rate: 1 coin = {formatCurrency(stats?.exchange_rate || 0.01)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.infoText}>Withdrawal Fee: {stats?.withdrawal?.fee_percent || 5}%</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.withdrawButton}
              onPress={() => navigation.navigate('Withdraw')}
            >
              <Text style={styles.withdrawButtonText}>Withdraw Now</Text>
              <Icon name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>💡 How do I earn coins?</Text>
            <Text style={styles.faqAnswer}>
              Coins are awarded automatically when you use Showa! Watch videos, like posts, send messages, create content - all these activities earn you coins in the background.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>💰 What can I do with my coins?</Text>
            <Text style={styles.faqAnswer}>
              Convert coins to real money! 100 coins = ${stats?.exchange_rate * 100 || 1.00}. Withdraw via PayPal, bank transfer, or mobile money.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>📊 Are there limits?</Text>
            <Text style={styles.faqAnswer}>
              Yes: {stats?.daily_cap || 50} coins daily, {stats?.weekly_cap || 250} coins weekly. Some tasks also have per-day limits.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>🔥 What are streaks?</Text>
            <Text style={styles.faqAnswer}>
              Log in daily to maintain your streak! 7-day streak = +10 coins, 30-day streak = +30 coins bonus rewards.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Start Earning Today! 🚀</Text>
          <Text style={styles.footerText}>
            Use Showa normally and watch your earnings grow automatically. The more you engage, the more you earn!
          </Text>
          <View style={styles.footerStats}>
            <View style={styles.footerStat}>
              <Icon name="timer" size={16} color="#666" />
              <Text style={styles.footerStatText}>Tasks refresh daily</Text>
            </View>
            <View style={styles.footerStat}>
              <Icon name="autorenew" size={16} color="#666" />
              <Text style={styles.footerStatText}>Auto-earn enabled</Text>
            </View>
            <View style={styles.footerStat}>
              <Icon name="security" size={16} color="#666" />
              <Text style={styles.footerStatText}>Secure withdrawals</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Task Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedTask && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[
                    styles.modalIcon,
                    { backgroundColor: getTaskColor(selectedTask.type) + '20' }
                  ]}>
                    <Icon 
                      name={getTaskIcon(selectedTask.type)} 
                      size={30} 
                      color={getTaskColor(selectedTask.type)} 
                    />
                  </View>
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalTitle}>{selectedTask.title}</Text>
                    <Text style={styles.modalSubtitle}>{selectedTask.description}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Icon name="close" size={24} color="#999" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalBody}>
                  <View style={styles.rewardCard}>
                    <Icon name="monetization-on" size={28} color="#FFD700" />
                    <Text style={styles.rewardAmount}>+{selectedTask.coins} coins</Text>
                    <Text style={styles.rewardValue}>
                      ≈ {formatCurrency(selectedTask.usd_value || (selectedTask.coins * (stats?.exchange_rate || 0.01)))}
                    </Text>
                  </View>
                  
                  {selectedTask.max_per_day && (
                    <View style={styles.limitCard}>
                      <Icon name="info" size={20} color="#2196F3" />
                      <View style={styles.limitInfo}>
                        <Text style={styles.limitTitle}>Daily Limit</Text>
                        <Text style={styles.limitText}>
                          {selectedTask.max_per_day} times per day
                        </Text>
                      </View>
                    </View>
                  )}
                  
                  <View style={styles.instructionsCard}>
                    <Text style={styles.instructionsTitle}>How to Earn:</Text>
                    <Text style={styles.instructionsText}>
                      This reward is awarded automatically when you perform this action in the app. No manual claiming needed!
                    </Text>
                    
                    {selectedTask.type === 'video' && (
                      <>
                        <View style={styles.instructionStep}>
                          <Text style={styles.stepNumber}>1</Text>
                          <Text style={styles.stepText}>Go to Short Videos section</Text>
                        </View>
                        <View style={styles.instructionStep}>
                          <Text style={styles.stepNumber}>2</Text>
                          <Text style={styles.stepText}>Watch any video for 10+ seconds</Text>
                        </View>
                        <View style={styles.instructionStep}>
                          <Text style={styles.stepNumber}>3</Text>
                          <Text style={styles.stepText}>Coins awarded automatically</Text>
                        </View>
                      </>
                    )}
                    
                    {selectedTask.type === 'engagement' && (
                      <>
                        <View style={styles.instructionStep}>
                          <Text style={styles.stepNumber}>1</Text>
                          <Text style={styles.stepText}>Browse posts in your feed</Text>
                        </View>
                        <View style={styles.instructionStep}>
                          <Text style={styles.stepNumber}>2</Text>
                          <Text style={styles.stepText}>Like, comment, or share posts</Text>
                        </View>
                        <View style={styles.instructionStep}>
                          <Text style={styles.stepNumber}>3</Text>
                          <Text style={styles.stepText}>Coins awarded automatically</Text>
                        </View>
                      </>
                    )}
                  </View>
                </ScrollView>
                
                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={styles.goButton}
                    onPress={() => {
                      setModalVisible(false);
                      if (selectedTask.type === 'video') navigateToSection('videos');
                      else if (selectedTask.type === 'content') navigateToSection('posts');
                      else if (selectedTask.type === 'messages') navigateToSection('messages');
                    }}
                  >
                    <Text style={styles.goButtonText}>Start Earning</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
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
  // Welcome Popup Styles
  welcomeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  welcomeHeader: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  welcomeIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  welcomeContent: {
    maxHeight: height * 0.45,
    padding: 20,
  },
  welcomeFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  earningsPreview: {
    marginTop: 15,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
  },
  earningsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  earningItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  earningText: {
    fontSize: 12,
    color: '#333',
    marginVertical: 5,
    textAlign: 'center',
  },
  earningReward: {
    fontSize: 13,
    fontWeight: 'bold',
    color: BRAND_COLOR,
  },
  dailyLimitCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  limitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitTexts: {
    marginLeft: 10,
    flex: 1,
  },
  limitTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  limitAmount: {
    fontSize: 13,
    color: '#4CAF50',
  },
  limitNote: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  welcomeFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  getStartedButton: {
    width: '100%',
    marginBottom: 15,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: '#666',
    fontSize: 14,
  },
  welcomeFooterNote: {
    fontSize: 12,
    color: '#999',
    marginTop: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: BRAND_COLOR,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 35,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#fff',
  },
  walletButton: {
    padding: 5,
  },
  statsBanner: {
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoSection: {
    marginHorizontal: 20,
    marginTop: 25,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  infoBold: {
    fontWeight: 'bold',
    color: BRAND_COLOR,
  },
  infoPoints: {
    marginTop: 10,
  },
  infoPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pointText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  progressContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  progressTip: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    fontStyle: 'italic',
  },
  quickActions: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  actionReward: {
    fontSize: 12,
    fontWeight: 'bold',
    color: BRAND_COLOR,
    marginBottom: 3,
  },
  actionSub: {
    fontSize: 11,
    color: '#666',
  },
  opportunitiesSection: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  taskList: {
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskName: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  taskRewardInfo: {
    alignItems: 'flex-end',
  },
  taskCoins: {
    fontSize: 14,
    fontWeight: 'bold',
    color: BRAND_COLOR,
  },
  taskValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  categoryNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
  },
  withdrawalSection: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  withdrawalCard: {
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  withdrawalIcon: {
    marginBottom: 15,
  },
  withdrawalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  withdrawalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
  },
  withdrawalInfo: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 10,
    flex: 1,
  },
  withdrawButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
  },
  withdrawButtonText: {
    color: BRAND_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  faqSection: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 15,
  },
  footerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  footerStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerStatText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  rewardCard: {
    backgroundColor: '#FFF9C4',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  rewardAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  rewardValue: {
    fontSize: 16,
    color: '#666',
  },
  limitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  limitInfo: {
    marginLeft: 12,
    flex: 1,
  },
  limitTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 3,
  },
  limitText: {
    fontSize: 13,
    color: '#2196F3',
  },
  instructionsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: BRAND_COLOR,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  stepText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  goButton: {
    backgroundColor: BRAND_COLOR,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  goButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customProgressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  customProgressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default EarnTasksScreen;
