import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, RefreshControl, ActivityIndicator,
  SafeAreaView, Image, Animated, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { API_ROUTE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// API Service - Added directly to the file
const createApiService = () => {
  // Create axios-like instance
  const createApiInstance = () => {
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

    // Request interceptor for adding token
    const requestInterceptor = async (config) => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
      } catch (error) {
        console.error('Error getting token:', error);
      }
      return config;
    };

    // Main request method
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

        // Apply request interceptor
        const finalConfig = await requestInterceptor(mergedConfig);
        
        const response = await fetch(
          `${baseURL}${finalConfig.url}`.replace(/([^:]\/)\/+/g, "$1"),
          {
            method: finalConfig.method || 'GET',
            headers: finalConfig.headers,
            body: finalConfig.data ? JSON.stringify(finalConfig.data) : null,
            timeout: finalConfig.timeout,
          }
        );

        // Response interceptor for handling errors
        if (!response.ok) {
          if (response.status === 401) {
          
            await AsyncStorage.removeItem('token');
            
            // navigation.navigate('Login');
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
    api.put = (url, data, config) => api.request({ ...config, url, data, method: 'PUT' });
    api.delete = (url, config) => api.request({ ...config, url, method: 'DELETE' });
    api.patch = (url, data, config) => api.request({ ...config, url, data, method: 'PATCH' });

    return api;
  };

  return createApiInstance();
};

// Create API instance
const api = createApiService();

const WalletDashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    fetchWalletData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // Fetch wallet data
      const walletResponse = await api.get('/wallet/enhanced/');
      setWallet(walletResponse.data);
      
      // Fetch analytics
      const analyticsResponse = await api.get('/analytics/');
      setAnalytics(analyticsResponse.data);
      
      // Fetch recent transactions
      const transactionsResponse = await api.get('/rewards/history/?limit=5');
      setRecentTransactions(transactionsResponse.data.results || transactionsResponse.data);
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatCoins = (coins) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(coins);
  };

  const getTransactionIcon = (actionType) => {
    switch(actionType) {
      case 'daily_login': return 'alarm';
      case 'like': return 'thumb-up';
      case 'comment': return 'comment';
      case 'follow': return 'person-add';
      case 'create_post': return 'post-add';
      case 'watch_video_10s': return 'ondemand-video';
      case 'referral_signup': return 'group-add';
      case 'milestone_achieved': return 'star';
      default: return 'attach-money';
    }
  };

  const getTransactionColor = (coins) => {
    return coins > 0 ? '#4CAF50' : '#F44336';
  };

  // Custom chart component without react-native-chart-kit
  const CustomChart = ({ data }) => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(...data.map(item => parseFloat(item.usd_earned)));
    const chartHeight = 120;
    
    return (
      <View style={styles.customChartContainer}>
        <View style={styles.customChart}>
          {data.slice(0, 6).reverse().map((item, index) => {
            const height = (parseFloat(item.usd_earned) / maxValue) * chartHeight;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barBackground}>
                  <View 
                    style={[
                      styles.barFill, 
                      { height: Math.max(height, 4) }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>
                  {`${item.month}/${item.year.toString().slice(-2)}`}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.chartAxis}>
          <View style={styles.yAxis}>
            <Text style={styles.axisText}>${maxValue.toFixed(0)}</Text>
            <Text style={styles.axisText}>${(maxValue/2).toFixed(0)}</Text>
            <Text style={styles.axisText}>$0</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading wallet data...</Text>
      </View>
    );
  }

  if (!wallet) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={60} color="#667eea" />
        <Text style={styles.errorText}>Unable to load wallet data</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchWalletData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.toggleDrawer()}
          >
            <Icon name="menu" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Wallet</Text>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="notifications" size={24} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Balance Card */}
        <Animated.View 
          style={[
            styles.balanceCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.gradientCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.balanceHeader}>
              <Icon name="account-balance-wallet" size={28} color="#fff" />
              <Text style={styles.balanceTitle}>Total Balance</Text>
            </View>
            
            <Text style={styles.balanceAmount}>
              {formatCurrency(wallet.usd_total || 0)}
            </Text>
            
            <Text style={styles.coinBalance}>
              {formatCoins(wallet.coins_total)} coins
            </Text>
            
            <View style={styles.balanceInfoRow}>
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceInfoLabel}>Available</Text>
                <Text style={styles.balanceInfoValue}>
                  {formatCurrency(wallet.usd_available || 0)}
                </Text>
              </View>
              
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceInfoLabel}>Pending</Text>
                <Text style={styles.balanceInfoValue}>
                  {formatCurrency((wallet.coins_pending || 0) * (wallet.exchange_rate || 0.01))}
                </Text>
              </View>
              
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceInfoLabel}>Exchange Rate</Text>
                <Text style={styles.balanceInfoValue}>
                  1 coin = ${wallet.exchange_rate || 0.01}
                </Text>
              </View>
            </View>
            
            <View style={styles.balanceActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.withdrawButton]}
                onPress={() => navigation.navigate('Withdraw')}
              >
                <Icon name="arrow-upward" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Withdraw</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.earnButton]}
                onPress={() => navigation.navigate('EarningDashbordWallet')}
              >
                <Icon name="trending-up" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Earn More</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FFD70020' }]}>
              <Icon name="show-chart" size={24} color="#FFD700" />
            </View>
            <Text style={styles.statValue}>
              {formatCurrency(analytics?.current_month?.usd_earned || 0)}
            </Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#4CAF5020' }]}>
              <Icon name="bolt" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.statValue}>{wallet.streak_count || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#2196F320' }]}>
              <Icon name="people" size={24} color="#2196F3" />
            </View>
            <Text style={styles.statValue}>{wallet.total_referrals || 0}</Text>
            <Text style={styles.statLabel}>Referrals</Text>
          </View>
        </View>

        {/* Monthly Earnings Chart */}
        {analytics?.monthly_history?.length > 0 && (
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Monthly Earnings</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Analytics')}>
                <Text style={styles.viewAllText}>View Details</Text>
              </TouchableOpacity>
            </View>
            
            <CustomChart data={analytics.monthly_history.slice(0, 6).reverse()} />
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => navigation.navigate('Referrals')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FF9800' }]}>
                <Icon name="share" size={24} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>Refer & Earn</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => navigation.navigate('Transactions')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#2196F3' }]}>
                <Icon name="receipt" size={24} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>Transactions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => navigation.navigate('Milestones')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#9C27B0' }]}>
                <Icon name="emoji-events" size={24} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>Milestones</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => navigation.navigate('Settings')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#607D8B' }]}>
                <Icon name="settings" size={24} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentTransactions.length === 0 ? (
            <View style={styles.emptyTransactions}>
              <Icon name="receipt" size={50} color="#ddd" />
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>Start earning coins to see transactions here</Text>
            </View>
          ) : (
            recentTransactions.map((transaction, index) => (
              <TouchableOpacity 
                key={transaction.id || index}
                style={styles.transactionItem}
                onPress={() => navigation.navigate('TransactionDetail', { id: transaction.id })}
              >
                <View style={styles.transactionIconContainer}>
                  <View style={[
                    styles.transactionIcon,
                    { backgroundColor: getTransactionColor(transaction.coins) + '20' }
                  ]}>
                    <Icon 
                      name={getTransactionIcon(transaction.action_type)} 
                      size={20} 
                      color={getTransactionColor(transaction.coins)} 
                    />
                  </View>
                </View>
                
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>
                    {transaction.action_type?.replace(/_/g, ' ').toUpperCase() || 'Transaction'}
                  </Text>
                  <Text style={styles.transactionTime}>
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.amountText,
                    { color: getTransactionColor(transaction.coins) }
                  ]}>
                    {transaction.coins > 0 ? '+' : ''}{transaction.coins} coins
                  </Text>
                  <Text style={styles.usdAmount}>
                    ${(Math.abs(transaction.coins) * (wallet.exchange_rate || 0.01)).toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Milestones Progress */}
        {analytics?.milestones?.length > 0 && (
          <View style={styles.milestonesContainer}>
            <View style={styles.milestonesHeader}>
              <Text style={styles.sectionTitle}>Milestones Progress</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Milestones')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {analytics.milestones.slice(0, 3).map((milestone, index) => (
              <View key={index} style={styles.milestoneItem}>
                <View style={styles.milestoneInfo}>
                  <Text style={styles.milestoneTitle}>
                    {milestone.type.replace(/_/g, ' ')}
                  </Text>
                  <Text style={styles.milestoneTarget}>
                    Target: ${milestone.target_value.toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(milestone.progress_percentage, 100)}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {milestone.progress_percentage.toFixed(1)}%
                  </Text>
                </View>
                
                <View style={styles.milestoneReward}>
                  <Icon name="star" size={16} color="#FFD700" />
                  <Text style={styles.rewardText}>
                    +{milestone.reward_coins} coins
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Need Help?</Text>
          <Text style={styles.footerText}>
            Contact support for any wallet-related questions
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#667eea',
  },
  menuButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationButton: {
    padding: 5,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  balanceCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  gradientCard: {
    padding: 25,
    borderRadius: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  balanceTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 10,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  coinBalance: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 25,
  },
  balanceInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  balanceInfo: {
    alignItems: 'center',
  },
  balanceInfoLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 5,
  },
  balanceInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
  },
  withdrawButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  earnButton: {
    backgroundColor: '#FFD700',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  customChartContainer: {
    flexDirection: 'row',
    height: 150,
  },
  customChart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  barContainer: {
    alignItems: 'center',
    width: 40,
  },
  barBackground: {
    height: 120,
    width: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#667eea',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  chartAxis: {
    width: 50,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  yAxis: {
    justifyContent: 'space-between',
    height: 120,
  },
  axisText: {
    fontSize: 10,
    color: '#999',
  },
  quickActionsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  transactionsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionIconContainer: {
    marginRight: 15,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  transactionTime: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  usdAmount: {
    fontSize: 12,
    color: '#999',
  },
  milestonesContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  milestonesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  milestoneItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  milestoneInfo: {
    marginBottom: 10,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
    marginBottom: 3,
  },
  milestoneTarget: {
    fontSize: 12,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    minWidth: 40,
  },
  milestoneReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
    marginLeft: 5,
  },
  footer: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 40,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  supportButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default WalletDashboard;