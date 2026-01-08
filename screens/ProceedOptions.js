import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  StatusBar,
  Modal,
  Easing,
 
} from 'react-native';
import { Appbar } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default function LoginOptionScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  

  const openBusinessModal = () => {
    setShowBusinessModal(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      })
    ]).start();
  };

  const closeBusinessModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      })
    ]).start(() => setShowBusinessModal(false));
  };

  useEffect(() => {
    // Staggered animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleBack = () => navigation.navigate('LinkingScreen');
  const goToUserLogin = () => navigation.navigate('PHome');
  const goToBusinessAccount = () => navigation.navigate('BusinessHome');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Minimal Appbar */}
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction color="#000" />
        <Appbar.Content title="" />
      </Appbar.Header>

      {/* Animated Brand Header */}
      <Animated.View style={[
        styles.brandContainer, 
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideUpAnim }] 
        }
      ]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <LottieView
                  source={require("../assets/animations/ConversationLottieAnimation.json")}
                  autoPlay
                  loop={true}
                  style={styles.logo}
                />
        </Animated.View>
        <Text style={styles.brandText}>Welcome to Showa </Text>
        <Text style={styles.brandTagline}>Connect, share, and grow with your community</Text>
      </Animated.View>

      {/* Options Section with staggered animations */}
      <View style={styles.optionsContainer}>
        <Animated.Text style={[
          styles.sectionTitle, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }] 
          }
        ]}>
          Select Account Type
        </Animated.Text>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }}>
          <TouchableOpacity 
            style={styles.optionCard} 
            onPress={goToUserLogin}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(13, 100, 221, 0.1)' }]}>
                <Icon name="person-outline" size={24} color="#0d64dd" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Personal Account</Text>
                <Text style={styles.optionDesc}>Connect with friends, share moments, and explore content</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#888" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: slideUpAnim }],
            marginTop: 12
          }}
        >
          <TouchableOpacity 
            style={[styles.optionCard,{backgroundColor:'#0750b5'}]} 
            //onPress={goToBusinessAccount}
             onPress={openBusinessModal}
            activeOpacity={0.8}
          >
            <View style={[styles.optionContent]}>
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(255, 255, 255, 0.18)' }]}>
                <Icon name="business-outline" size={24} color="#fff" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle,{color:'#fff'}]}>Business Account</Text>
                <Text style={[styles.optionDesc,{color:'#fff'}]}>Grow your brand, engage customers, and analyze performance</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Footer with fade animation ============================*/}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text style={styles.linkText} onPress={() => navigation.navigate('Terms')}>Terms</Text>{' '}
          
        </Text>
      </Animated.View>
      {/* Business Account Modal */}
      <Modal
        visible={showBusinessModal}
        transparent
        animationType="none"
        onRequestClose={closeBusinessModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={closeBusinessModal}
          />
          
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch to Business Account</Text>
              <TouchableOpacity  onPress={()=>setShowBusinessModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <LottieView
              source={require('../assets/animations/Business.json')}
              autoPlay
              loop
              style={styles.modalAnimation}
            />
            
            <Text style={styles.modalText}>
              Your account is currently set to <Text style={styles.highlight}>Personal mode</Text>.
              To access business features:
            </Text>
            
            <View style={styles.stepsContainer}>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>Go to Homepage</Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>Tap the 3-dot menu</Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>Select "Switch Account"</Text>
              </View>
              
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Text style={styles.stepText}>Choose Business Account</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={()=>navigation.replace('PHome')}
            >
              <Text style={styles.modalButtonText}>Proceed with personal</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 24,
  },
   modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'SourceSansPro-SemiBold',
    color: '#0a2540',
  },
  modalAnimation: {
    width: '100%',
    height: 190,
    alignSelf: 'center',
    marginVertical: 16,
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'SourceSansPro-Regular',
    color: '#6b7c93',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  highlight: {
    fontFamily: 'SourceSansPro-SemiBold',
    color: '#0750b5',
  },
  stepsContainer: {
    marginBottom: 32,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0750b5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
  },
  stepText: {
    fontSize: 16,
    fontFamily: 'SourceSansPro-Regular',
    color: '#0a2540',
    flex: 1,
  },
  modalButton: {
    backgroundColor: '#0750b5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
  },
  appbar: {
    backgroundColor: 'transparent',
    elevation: 0,
    marginTop: 8,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandCard: {
    width: 120,
    height: 120,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0d64dd',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  logo: {
    width: 300,
    height: 200,
    tintColor: '#fff',
    marginTop:-50
    
  },
  brandText: {
    color: '#0a2540',
    fontSize: 28,
    fontFamily: 'Lato-Black',
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  brandTagline: {
    color: '#6b7c93',
    fontSize: 16,
    fontFamily: 'SourceSansPro-Regular',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 15,
    color: '#6b7c93',
    marginBottom: 20,
    fontFamily: 'SourceSansPro-SemiBold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e6ebf1',
    shadowColor: '#0a2540',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    color: '#0a2540',
    fontFamily: 'SourceSansPro-SemiBold',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    color: '#6b7c93',
    fontFamily: 'SourceSansPro-Regular',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 13,
    color: '#9aa8ba',
    fontFamily: 'SourceSansPro-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
   image: {
    width: '80%',
    height: 20,
    marginBottom: 30,
  },
  linkText: {
    color: '#0d64dd',
    fontFamily: 'SourceSansPro-SemiBold',
  },
});