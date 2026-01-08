
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Linking,
  ScrollView,
  Animated,
  StatusBar,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const BANNER_IMAGE = require('../assets/images/dad.jpg');

// Create an animated version of FlatList
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const BrandApp = () => {
  const [channelId, setChannelId] = useState('');
  const [channelIdInput, setChannelIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];
  const scrollX = useRef(new Animated.Value(0)).current;
  const brandsScrollViewRef = useRef(null);
  const scrollInterval = useRef(null);

  // Professional color scheme
  const primaryColor = '#2563EB';
  const secondaryColor = '#64748B';
  const accentColor = '#0EA5E9'; 
  const lightColor = '#F8FAFC'; 
  const darkColor = '#1E293B'; 
  const cardColor = '#FFFFFF'; 

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Start auto-scrolling
    startAutoScroll();

    // Clean up on unmount
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, []);

  const startAutoScroll = () => {
    let scrollValue = 0;
    const brandWidth = 80;
    
    scrollInterval.current = setInterval(() => {
      scrollValue += brandWidth;
      
      if (brandsScrollViewRef.current) {
        brandsScrollViewRef.current.scrollToOffset({
          offset: scrollValue,
          animated: true
        });
      }
      
      // Reset to start when reaching the end
      if (scrollValue >= brandWidth * allBrands.length) {
        scrollValue = 0;
        setTimeout(() => {
          if (brandsScrollViewRef.current) {
            brandsScrollViewRef.current.scrollToOffset({
              offset: 0,
              animated: false
            });
          }
        }, 1000);
      }
    }, 2000);
  };

  const allBrands = [
  { name: 'e-Direct', icon: 'book-open-outline', color: primaryColor, url: 'https://edirect.ng', description: 'No 1 nigeria largest directory in africa' },
  { name: 'e-Jobs', icon: 'briefcase-outline', color: '#84CC16', url: 'https://ejobs.com', description: 'Recruitment platform' },
  { name: 'e-Store', icon: 'store-outline', color: secondaryColor, url: 'https://estore.com', description: 'Online marketplace' },
  { name: 'e-Deal', icon: 'tag-outline', color: '#F59E0B', url: 'https://edeal.com', description: 'Daily deals platform' },
  { name: 'e-Ride', icon: 'car-outline', color: '#06B6D4', url: 'https://eride.com', description: 'Transportation service' },
  { name: 'e-Plan', icon: 'calendar-month-outline', color: '#EC4899', url: 'https://eplan.com', description: 'Event planning tool' },
  { name: 'e-Farm', icon: 'sprout-outline', color: '#10B981', url: 'https://efarm.com', description: 'Agricultural marketplace' },
  { name: 'eHangout', icon: 'account-group-outline', color: '#8B5CF6', url: 'https://ehangout.com', description: 'Social platform' },
  { name: 'e-Wallet', icon: 'wallet-outline', color: '#F97316', url: 'https://ewallet.com', description: 'Payment solution' },
  { name: 'Showa', icon: 'video-outline', color: '#EF4444', url: 'https://showa.com', description: 'Live streaming platform' },
  { name: 'EBNB Hotel', icon: 'bed-outline', color: '#8B5CF6', url: 'https://showa.com', description: 'A hotel management software for all hotel types' },
  { name: 'Essential News', icon: 'newspaper-variant-outline', color: '#2563EB', url: 'https://showa.com', description: 'A news platform and blogging' },
  { name: 'E-Hotels', icon: 'office-building-outline', color: '#DC2626', url: 'https://showa.com', description: 'A hotels system management software' },
  { name: 'E-apartment', icon: 'home-outline', color: '#059669', url: 'https://showa.com', description: 'An apartment booking website' },
  { name: 'HRMS', icon: 'account-tie-outline', color: '#7C3AED', url: 'https://showa.com', description: 'HR Management System' },
  { name: 'E-Medicals', icon: 'hospital-box-outline', color: '#DB2777', url: 'https://showa.com', description: 'Hospital Management System' },
  { name: 'E-Shortstay', icon: 'clock-time-three-outline', color: '#EA580C', url: 'https://showa.com', description: 'Hourly booking' },
  { name: 'Oosh-Mail', icon: 'email-outline', color: '#0891B2', url: 'https://ooshmail.com', description: 'An Email platform' },
];

  const featuredBrands = allBrands.slice(0, 20);

  const BrandCard = ({ brand }) => (
    <TouchableOpacity 
      style={[styles.brandCard, { borderLeftColor: brand.color }]}
      onPress={() => {
        Linking.openURL(brand.url);
        setSelectedBrand(brand);
      }}
      activeOpacity={0.9}
    >
      <View style={styles.brandIconContainer}>
        <Icon name={brand.icon} size={28} color={brand.color} />
      </View>
      <Text style={styles.brandName}>{brand.name}</Text>
      <Text style={styles.brandDescription}>{brand.description}</Text>
    </TouchableOpacity>
  );

  const BrandNavItem = ({ brand, index }) => {
    return (
      <TouchableOpacity 
        onPress={() => {
          setSelectedBrand(brand);
        }}
      >
        <View style={[
          styles.navBrandItem, 
          { 
            backgroundColor: '#F8FAFC',
            borderColor: brand.color,
          }
        ]}>
          <Icon name={brand.icon} size={20} color={brand.color} />
          <Text style={[styles.navBrandText, { color: '#1E293B' }]} numberOfLines={1}>{brand.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar backgroundColor='#F8FAFC' barStyle="dark-content" />
      
      {/* Scrolling Brands Navigation Bar */}
      {/* <View style={styles.navContainer}>
        <View style={styles.trendingHeader}>
          <Text style={styles.trendingTitle}>Trending now...</Text>
        </View>
        
        <View style={styles.navScrollContainer}>
          <AnimatedFlatList
            ref={brandsScrollViewRef}
            data={allBrands}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.navContent}
            renderItem={({ item, index }) => (
              <BrandNavItem brand={item} index={index} />
            )}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
          />
        </View>
      </View> */}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.mainContent}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={BANNER_IMAGE}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Digital Ecosystem</Text>
            <Text style={styles.heroSubtitle}>
              Integrated solutions for modern living
            </Text>
            
            <TouchableOpacity
              style={[styles.ctaButton, { backgroundColor: '#2563EB' }]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.ctaButtonText}>Explore Ecosystem</Text>
              <Icon name="arrow-right" size={20} color="#fff" style={styles.ctaIcon} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Featured Brands Grid */}
        <View style={styles.brandsSection}>
          <Text style={styles.sectionTitle}>Our Brands</Text>
          <Text style={styles.sectionSubtitle}>
            Comprehensive solutions for your needs
          </Text>
          
          <View style={styles.brandsGrid}>
            {featuredBrands.map((brand, index) => (
              <BrandCard key={index} brand={brand} />
            ))}
          </View>
        </View>

        {/* Value Proposition */}
        <View style={styles.valueSection}>
          <Text style={styles.sectionTitle}>Why Choose Our Platform?</Text>
          
          <View style={styles.valueItem}>
            <View style={[styles.valueIconContainer, { backgroundColor: `${primaryColor}15` }]}>
              <Icon name="sync" size={24} color='#2563EB' />
            </View>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueTitle}>Seamless Integration</Text>
              <Text style={styles.valueDescription}>
                All services work together for a unified experience
              </Text>
            </View>
          </View>
          
          <View style={styles.valueItem}>
            <View style={[styles.valueIconContainer, { backgroundColor: `${accentColor}15` }]}>
              <Icon name="shield-check" size={24} color={accentColor} />
            </View>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueTitle}>Enterprise Security</Text>
              <Text style={styles.valueDescription}>
                Your data is protected with industry-standard security
              </Text>
            </View>
          </View>
          
          <View style={styles.valueItem}>
            <View style={[styles.valueIconContainer, { backgroundColor: `${primaryColor}15` }]}>
              <Icon name="star-circle" size={24} color='#2563EB' />
            </View>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueTitle}>Premium Experience</Text>
              <Text style={styles.valueDescription}>
                Consistent quality and design across all services
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Ecosystem Description Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" size={24} color='#1E293B' />
            </TouchableOpacity>
            
            <ScrollView style={styles.ecosystemScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <View style={[styles.modalIconContainer, { backgroundColor: `${primaryColor}15` }]}>
                  <Icon name="atom" size={32} color='#2563EB' />
                </View>
                <Text style={styles.modalTitle}>Our Digital Ecosystem</Text>
                <Text style={styles.modalSubtitle}>
                  Integrated services designed to work seamlessly together
                </Text>
              </View>
              
              <View style={styles.ecosystemSection}>
                <Text style={styles.ecosystemSectionTitle}>Comprehensive Solutions</Text>
                <Text style={styles.ecosystemText}>
                  Our ecosystem brings together a carefully curated collection of digital services 
                  that provide comprehensive solutions for modern living. From communication to commerce, 
                  transportation to entertainment, we've built a network of applications that work in 
                  harmony to create a seamless user experience.
                </Text>
              </View>
              
              <View style={styles.ecosystemSection}>
                <Text style={styles.ecosystemSectionTitle}>Key Advantages</Text>
                
                <View style={styles.benefitItem}>
                  <Icon name="check-circle" size={20} color='#2563EB' />
                  <Text style={styles.benefitText}>Unified account across all platforms</Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <Icon name="check-circle" size={20} color='#2563EB' />
                  <Text style={styles.benefitText}>Integrated payment and wallet system</Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <Icon name="check-circle" size={20} color='#2563EB' />
                  <Text style={styles.benefitText}>Centralized notification management</Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <Icon name="check-circle" size={20} color='#2563EB' />
                  <Text style={styles.benefitText}>Cross-service rewards program</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  trendingHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  trendingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  navScrollContainer: {
    height: 70,
  },
  navContent: {
    paddingHorizontal: 10,
  },
  navBrandItem: {
    width: 70,
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    padding: 5,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  navBrandText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
  },
  heroContainer: {
    height: 400,
    width: '100%',
    position: 'relative',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: '80%',
    opacity: 0.9,
    fontWeight: '400',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  ctaIcon: {
    marginLeft: 4,
  },
  brandsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '400',
  },
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  brandCard: {
    width: (width - 60) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
  },
  brandIconContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  brandName: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  brandDescription: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '400',
  },
  valueSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  valueIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  valueTextContainer: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    fontWeight: '400',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  ecosystemScroll: {
    width: '100%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    marginTop: 10,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  ecosystemSection: {
    marginBottom: 24,
  },
  ecosystemSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  ecosystemText: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: '400',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    color: '#64748B',
    marginLeft: 10,
    fontWeight: '400',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  helpLink: {
    marginBottom: 24,
  },
  helpText: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#2563EB',
  },
  modalButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  connectedStatus: {
    alignItems: 'center',
    marginBottom: 24,
  },
  connectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 12,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 40,
  },
});

export default BrandApp;
