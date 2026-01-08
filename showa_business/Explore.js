
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Dimensions,
  Linking,
  Platform,
  StatusBar,
  ImageBackground,
  ScrollView,
  LogBox
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';



const { width, height } = Dimensions.get('window');

const ExploreScreen = ({ navigation }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
  ]);

  const categories = ['All', 'Business', 'Content', 'Monetization', 'Connect'];

  const iconColors = {
    'Business Tool': '#066bdeff',
    'Official Broadcast': '#ff9e03ff',
    'Official Search': '#50e3c2',
    'Oosh Business': '#9013fe',
    'Live': '#e94e77',
    'Channels': '#d321beff',
    'e-Music': '#c52f2fff',
    'Monetize': '#ff6f61',
    'Quick Connect': '#246BFD',
    'Market Place': '#8a2be2',
    'Manage': '#ff8c00',
    'Analytics': '#2ecc71',
    'Training': '#9b59b6',
    'Support': '#3498db',
    'Events': '#e74c3c'
  };

  const menuItems = [
  {
    id: '1',
    title: 'Business Tool',
    description: 'Comprehensive tools to manage and grow your business',
    screen: 'ToolsScreen',
    icon: 'tools', 
    category: 'Business'
  },
  {
    id: '2',
    title: 'Official Broadcast',
    description: 'Send official updates to your audience',
    screen: 'BroadcastHome',
    icon: 'bullhorn', 
    category: 'Business'
  },
  {
    id: '3',
    title: 'Official Search',
    description: 'Find verified content and businesses',
    screen: 'OfficialSearch',
    icon: 'shield-search', 
    category: 'Business'
  },
  {
    id: '4',
    title: 'Quick Connect',
    description: 'Instant deals & offers with real-time matching',
    screen: 'Supplyrequest',
    icon: 'connection', 
    category: 'Connect'
  },
  {
    id: '5',
    title: 'Market Place',
    description: 'Browse thousands of products and services',
    screen: 'MarketPlace',
    icon: 'store-search', 
    category: 'Business'
  },
  {
    id: '6',
    title: 'Manage Posts',
    description: 'Manage your account and content in one place',
    screen: 'ManagePost',
    icon: 'post', 
    category: 'Content'
  },
  {
    id: '7',
    title: 'Channels',
    description: 'Create and manage your communication channels',
    screen: 'BJoinChannel',
    icon: 'message-text', 
    category: 'Content'
  },
  {
    id: '8',
    title: 'e-Music',
    description: 'Stream and monetize your music content',
    screen: 'Music',
    icon: 'music-note', 
    category: 'Content'
  },
  {
    id: '9',
    title: 'Monetize',
    description: 'Multiple ways to earn from your activities',
    screen: 'Monetize',
    icon: 'currency-usd', 
    category: 'Monetization'
  },
  // {
  //   id: '10',
  //   title: 'Go Live',
  //   description: 'Real-time engagement with your audience',
  //   screen: 'GoLive',
  //   icon: 'video-wireless', 
  //   category: 'Content'
  // },
  {
    id: '11',
    title: 'Watch Streams',
    description: 'Discover live broadcasts from creators',
    screen: 'LiveStreaming',
    icon: 'play-box-multiple', 
    category: 'Content'
  },
  {
    id: '12',
    title: 'Fast Earning',
    description: 'Make upto 1-million naira with a short perior of time',
    screen: 'Earnings',
    icon: 'rocket', 
    category: 'Business'
  },
  {
    id: '13',
    title: 'E-Report',
    description: 'Report any illegal activities on your area',
    screen: 'GlobalIssueReport',
    icon: 'alert-box', 
    category: 'Business'
  },
  {
    id: '14',
    title: 'Support',
    description: '24/7 assistance for all your needs',
    screen: 'ContactUs',
    icon: 'lifebuoy', 
    category: 'Business'
  },
  {
    id: '15',
    title: 'E-News',
    description: 'Stay updated with the latest news',
    screen: 'NewsList',
    icon: 'newspaper-variant', 
    category: 'Connect'
  },
  {
    id: '16',
    title: 'Essential Brands',
    description: 'Stay updated with the latest news',
    screen: 'EssentialPlatforms',
    icon: 'apps', 
    category: 'Connect'
  }
];

  const featuredItems = [
    {
      id: 'f1',
      title: 'Premium Features',
      description: 'Unlock exclusive tools and capabilities',
      screen: 'Premium',
      icon: 'crown',
      color: '#FFD700',
      category: 'Monetization'
    },
    {
      id: 'f2',
      title: 'Success Stories',
      description: 'Learn from top performers on our platform',
      screen: 'SuccessStory',
      icon: 'trophy',
      color: '#FF6B6B',
      category: 'Business'
    }
  ];

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const handlePress = async (item) => {
    if (item.title === 'Monetize') {
      setActiveModal('monetize');
    } else if (item.title === 'Quick Connect') {
      setActiveModal('quickConnect');
    } else if (item.title === 'Premium Features') {
      setActiveModal('premium');
    } else {
      navigation.navigate(item.screen);
    }
  };
  const handleUrlRedirect = async (item) => {
    if (item.title === 'Monetize') {
      Linking.openURL('https://showaapp.com/monetization');
    } else if (item.title === 'Quick Connect') {
      setActiveModal('quickConnect');
    } else if (item.title === 'Premium Features') {
      setActiveModal('premium');
    } else {
      navigation.navigate(item.screen);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setActiveCategory(item)}
      style={[
        styles.categoryItem,
        activeCategory === item && styles.activeCategoryItem
      ]}
    >
      <Text style={[
        styles.categoryText,
        activeCategory === item && styles.activeCategoryText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: '#fff' || '#246BFD' }]}
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
    >
      
      <LinearGradient
  
  colors={['rgba(240, 239, 239, 1)', 'rgba(243, 243, 243, 1)']} 
   start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
  style={styles.iconBackground}
>
  <MaterialCommunityIcons
          name={item.icon}
          size={28}
          color={iconColors[item.title] || '#246BFD'}
        />

</LinearGradient>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      {item.color && (
        <View style={styles.featuredBadge}>
          <FontAwesome name="star" size={12} color={item.color} />
          <Text style={[styles.featuredText, { color: item.color }]}>Featured</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.featuredCard, { backgroundColor: `${item.color}20` }]}
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.featuredIcon}>
        <MaterialCommunityIcons
          name={item.icon}
          size={32}
          color={item.color}
        />
      </View>
      <View style={styles.featuredTextContainer}>
        <Text style={[styles.featuredTitle, { color: item.color }]}>{item.title}</Text>
        <Text style={styles.featuredDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView nestedScrollEnabled={true}>
          <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0750b5" />
      
      {/* Header with Search */}
      <LinearGradient 
        colors={['#045ad1', '#066bde']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Explore Features</Text>
          <Text style={styles.headerSubtitle}>Discover powerful tools to grow your business with our app</Text>
        </View>
       
      </LinearGradient>

      {/* Featured Section */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Tools</Text>
        <ScrollView>
          <FlatList
          data={featuredItems}
          renderItem={renderFeaturedItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
          
        />
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Main Content */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={[styles.sectionTitle, { marginLeft: 16, marginTop: 8 }]}>
            {activeCategory === 'All' ? 'All Features' : activeCategory}
          </Text>
        }
      />

      {/* Monetize Modal */}
      <Modal
        isVisible={activeModal === 'monetize'}
        onBackdropPress={() => setActiveModal(null)}
        backdropOpacity={0.5}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <LottieView
            source={require("../assets/animations/money.json")}
            autoPlay
            loop={true}
            style={styles.animation}
          />
          <Text style={styles.modalTitleM}>Monetize Your Content</Text>
          <Text style={styles.modalText}>
            Unlock multiple revenue streams for your business and content. 
            Our platform offers various ways to monetize:
          </Text>
          
          <View style={styles.monetizationOptions}>
            <View style={styles.option}>
              <MaterialCommunityIcons name="advertisements" size={20} color="#617bffff" />
              <Text style={styles.optionText}>Ad Revenue Sharing</Text>
            </View>
            <View style={styles.option}>
              <MaterialCommunityIcons name="account-cash" size={20} color="#617bffff" />
              <Text style={styles.optionText}>Paid Subscriptions</Text>
            </View>
            <View style={styles.option}>
              <MaterialCommunityIcons name="gift" size={20} color="#617bffff" />
              <Text style={styles.optionText}>Sponsorships</Text>
            </View>
           
          </View>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => navigation.navigate('MonetizationRequestForm')}
          >
            <Text style={styles.modalButtonText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton2}
            onPress={() => setActiveModal(null)}
          >
            <Text style={styles.modalButtonText2}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Quick Connect Modal */}
      <Modal
        isVisible={activeModal === 'quickConnect'}
        onBackdropPress={() => setActiveModal(null)}
        backdropOpacity={0.5}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          {/* <LottieView
            source={require("../assets/animations/connection.json")}
            autoPlay
            loop={true}
            style={styles.animationSmall}
          /> */}
          <Text style={styles.modalTitle}>Quick Connect</Text>
          <Text style={styles.modalText}>
            Instantly connect with potential customers or suppliers in real-time. 
            Our smart matching algorithm helps you find the perfect business partners.
          </Text>
          
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={[styles.stepIcon, { backgroundColor: '#045ad120' }]}>
                <MaterialCommunityIcons name="pencil-outline" size={20} color="#045ad1" />
              </View>
              <Text style={styles.stepText}>Post your offer or request</Text>
            </View>
            <View style={styles.step}>
              <View style={[styles.stepIcon, { backgroundColor: '#f5a62320' }]}>
                <MaterialCommunityIcons name="bell-outline" size={20} color="#f5a623" />
              </View>
              <Text style={styles.stepText}>Get instant notifications</Text>
            </View>
            <View style={styles.step}>
              <View style={[styles.stepIcon, { backgroundColor: '#50e3c220' }]}>
                <MaterialCommunityIcons name="chat-outline" size={20} color="#50e3c2" />
              </View>
              <Text style={styles.stepText}>Connect and finalize deals</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#246BFD' }]}
            onPress={() => {
              setActiveModal(null);
              navigation.navigate('Supplyrequest');
            }}
          >
            <Text style={styles.modalButtonText}>Start Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalBugtton, { backgroundColor: '#fff', marginTop:20 }]}
            onPress={() => {
              setActiveModal(null);
             
            }}
          >
            <Text style={[styles.modalButtonText,{color:'#333', marginTop:10}]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Premium Features Modal */}
      <Modal
        isVisible={activeModal === 'premium'}
        onBackdropPress={() => setActiveModal(null)}
        backdropOpacity={0.5}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          {/* <LottieView
            source={require("../assets/animations/premium.json")}
            autoPlay
            loop={true}
            style={styles.animationSmall}
          /> */}
          <Text style={[styles.modalTitle, { color: '#FFD700' }]}>Premium Features</Text>
          <Text style={styles.modalText}>
            Upgrade to access exclusive tools that will take your business to the next level:
          </Text>
          
          <View style={styles.premiumFeatures}>
            <View style={styles.feature}>
              <MaterialCommunityIcons name="chart-bar" size={20} color="#FFD700" />
              <Text style={styles.featureText}>Advanced Analytics Dashboard</Text>
            </View>
            <View style={styles.feature}>
              <MaterialCommunityIcons name="badge-account" size={20} color="#FFD700" />
              <Text style={styles.featureText}>Priority Customer Support</Text>
            </View>
            
            <View style={styles.feature}>
              <MaterialCommunityIcons name="rocket" size={20} color="#FFD700" />
              <Text style={styles.featureText}>Increased Visibility</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#FFD700' }]}
            onPress={() => navigation.navigate('ContactUs')}
          >
            <Text style={[styles.modalButtonText, { color: '#000' }]}>Upgrade Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton2}
            onPress={() => setActiveModal(null)}
          >
            <Text style={styles.modalButtonText2}>Not Now</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Lato-Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    fontFamily: 'Lato-Regular',
    justifyContent:'center',
    alignContent:'center',
    alignSelf:'center',
    textAlign:'center'
  },
  searchButton: {
    padding: 8,
  },
  featuredSection: {
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    marginLeft: 16,
    fontFamily: 'Lato-Bold',
  },
  featuredList: {
    paddingHorizontal: 16,
  },
  featuredCard: {
    width: width * 0.7,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featuredTextContainer: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#555',
  },
  categoriesContainer: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  activeCategoryItem: {
    backgroundColor: '#045ad1',
  },
  categoryText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    fontFamily: 'Lato-Bold',
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    fontFamily: 'Lato-Regular',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  animation: {
    width: '100%',
    height: 200,
    marginTop: -40,
    marginBottom: -40,
  },
  animationSmall: {
    width: '100%',
    height: 150,
    marginTop: -50,
    marginBottom: -30,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Lato-Black',
  },
  modalTitleM: {
    fontSize: 22,
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Lato-Black',
    marginTop: 50,
  },
  modalText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: 'Lato-Regular',
  },
  modalButton: {
    backgroundColor: '#0750b5',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Lato-Bold',
  },
  modalButton2: {
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText2: {
    color: '#777',
    fontSize: 14,
    marginVertical: 12,
    fontFamily: 'Lato-Bold',
  },
  stepsContainer: {
    width: '100%',
    marginVertical: 8,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    fontFamily: 'Lato-Regular',
  },
  monetizationOptions: {
    width: '100%',
    marginVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5ffff',
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 12,
    fontFamily: 'Lato-Regular',
  },
  premiumFeatures: {
    width: '100%',
    marginVertical: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fffae5',
    borderRadius: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 12,
    fontFamily: 'Lato-Regular',
  },
});

export default ExploreScreen;