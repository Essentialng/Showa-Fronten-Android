import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Platform,
  Linking
} from 'react-native';
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';

export default function AdvertisementScreen({navigation}) {
  const [profileData, setProfileData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        const profile = Array.isArray(response.data) ? response.data[0] : response.data;
        setProfileData(profile);
        if (profile.logo) {
          setLogo({ uri: `${API_ROUTE_IMAGE}${profile.logo}` });
        }
      }
    } catch (err) {
      //console.error('Failed to load profile', err);
    }
  };

  const handleGetStarted = () => {
    setShowModal(true);
  };

  const handleContinue = () => {
    setShowModal(false);
    navigation.navigate('CreateAdForm');
  };

  const openLearnMore = () => {
    Linking.openURL('https://showaessential.com/');
  };

  return (
    <View style={styles.container}>
    
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Advertise on Showa</Text>
        <Divider />
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.title}>Create your first ad</Text>
        <Text style={styles.subtitle}>
          Start reaching new customers in just a couple of minutes with our step-by-step ad creator.
        </Text>

        {/* Ad Preview Card */}
        <View style={styles.adCard}>
          {profileData && profileData.id && (
            <>
              <View style={styles.userInfo}>
                <Image
                  source={
                    profileData
                      ? { uri: `${API_ROUTE_IMAGE}${profileData.image}` }
                      : require('../assets/images/dad.jpg')
                  }
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.username}>{profileData.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.sponsored}>Sponsored · </Text>
                    <Icon name="earth" size={14} color="#999" />
                  </View>
                </View>
              </View>

              <Image
                source={
                  profileData
                    ? { uri: `${API_ROUTE_IMAGE}${profileData.image}` }
                    : require('../assets/images/dad.jpg')
                }
                style={styles.adImage}
              />

              <View style={styles.adFooter}>
                <Text style={[styles.adTitle,{color:'#555'}]}>{profileData.website || profileData.about?.slice(0,20)}</Text>
                <View style={styles.radioGroup}>
                  <Icon name="radiobox-marked" size={16} color="#000" />
                  <Text style={styles.radioText}>Showa</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
     
      <TouchableOpacity 
        style={styles.button}
        onPress={handleGetStarted}
      >
        <Text style={styles.buttonText}>Get started</Text>
      </TouchableOpacity>

      {/* Motivational Modal Bottom Sheet */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Unlock Your Business Potential</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.benefitItem}>
                <Icon name="rocket-launch" size={28} color="#1976D2" style={styles.benefitIcon} />
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Reach More Customers</Text>
                  <Text style={styles.benefitDescription}>
                    Get your business in front of thousands of potential customers actively searching for what you offer.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Icon name="chart-line" size={28} color="#1976D2" style={styles.benefitIcon} />
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Boost Your Sales</Text>
                  <Text style={styles.benefitDescription}>
                    Our advertisers see an average 3x increase in sales within the first month of running ads.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Icon name="bullseye" size={28} color="#1976D2" style={styles.benefitIcon} />
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Target Precisely</Text>
                  <Text style={styles.benefitDescription}>
                    Reach the right audience based on location, interests, and behavior to maximize your ROI.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Icon name="cash" size={28} color="#1976D2" style={styles.benefitIcon} />
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Full Control</Text>
                  <Text style={styles.benefitDescription}>
                    Set your own budget and only pay when people engage with your ad. Start with as little as $5/day.
                  </Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.learnMoreButton}
                onPress={openLearnMore}
              >
                <Text style={styles.learnMoreText}>Learn more about advertising</Text>
                <Icon name="open-in-new" size={16} color="#1976D2" />
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={handleContinue}
              >
                <Text style={styles.continueButtonText}>Continue to Ad Creator</Text>
                <Icon name="arrow-right" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#1976D2',
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  
  },
  body: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
    color:'#333'
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  adCard: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
  },
  sponsored: {
    fontSize: 12,
    color: '#777',
  },
  adImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  adFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adTitle: {
    fontWeight: '600',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  radioText: {
    fontSize: 13,
    color:'#555'
  },
  button: {
    backgroundColor: '#1976D2',
    margin: 20,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 10,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  benefitIcon: {
    marginRight: 16,
    marginTop: 4,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  learnMoreText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  modalFooter: {
    padding: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  continueButton: {
    backgroundColor: '#0d64dd',
    borderRadius: 25,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0d64dd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
