
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
//   ActivityIndicator,
//   Alert,
//   Modal,
//   ScrollView,
//   KeyboardAvoidingView,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import { API_ROUTE } from '../../api_routing/api';

// export default function EmailScreen({ navigation, route }) {
//   const phoneNumber = route.params?.phoneNumberID;
//   const navigate = useNavigation();
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [emailError, setEmailError] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);

//   const redirectBack = () => {
//     navigation.navigate('Signin');
//   };

//   const checkEmailExists = async () => {
//     try {
//       const response = await axios.post(`${API_ROUTE}/check-email/`, { email });
//       return response.data.exists;
//     } catch (error) {
//       console.error('Error checking email:', error);
//       return false;
//     }
//   };

//   const handleEmailSentOTP = async () => {
//     if (!email) {
//       Alert.alert('Error', 'Please enter a valid email address.');
//       return;
//     }

//     // Basic email validation
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       Alert.alert('Error', 'Please enter a valid email address.');
//       return;
//     }

//     setLoading(true);
//     setEmailError('');

//     try {
//       // First check if email exists
//       const emailExists = await checkEmailExists();
      
//       if (emailExists) {
//         setModalVisible(true);
//         setLoading(false);
//         return;
//       }

//       // If email doesn't exist, proceed with OTP for registration
//       await sendOTP('registration');
//     } catch (error) {
//       console.error('Error:', error.response || error);
//       if (error.response?.data?.email) {
//         setEmailError(error.response.data.email[0]);
//       } else {
//         Alert.alert('Error', 'An error occurred. Please try again.');
//       }
//       setLoading(false);
//     }
//   };

//   const sendOTP = async (purpose) => {
//     try {
//       const response = await axios.post(`${API_ROUTE}/send-otp/`, { email, purpose });
      
//       if (response.status === 200 || response.status === 201) {
//         Alert.alert(
//           'Success',
//           `An OTP has been sent to ${email}.\nPlease check your email inbox and enter the code to ${purpose === 'login' ? 'login' : 'verify your account'}.`,
//           [{ text: 'OK', onPress: () => {
//             if (purpose === 'login') {
//               // Navigate to login OTP verification screen
//               navigation.navigate('VerificationCode', {
//                 emailID: email,
//                 purpose: 'login'
//               });
//             } else {
//               // Navigate to registration OTP verification screen
//               navigation.navigate('LinkingScreen', {
//                 phoneNumberID: phoneNumber,
//                 emailID: email,
//               });
//             }
//           }}]
//         );
//       } else {
//         Alert.alert('Error', 'Failed to send OTP. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       Alert.alert('Error', 'An error occurred while sending the OTP. Please try again.');
//     } finally {
//       setLoading(false);
//       setModalVisible(false);
//     }
//   };

//   const handleLoginInstead = () => {
//     setModalVisible(false);
//     sendOTP('login');
//   };

//   const handleUseDifferentEmail = () => {
//     setModalVisible(false);
//     setEmail('');
//   };

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
//         <TouchableOpacity onPress={redirectBack} style={styles.iconButton}>
//           <Icon name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Email Verification</Text>
//         <TouchableOpacity onPress={redirectBack} style={styles.iconButton}>
//           <Icon name="close" size={24} color="#fff" />
//         </TouchableOpacity>
//       </LinearGradient>

//       <ScrollView contentContainerStyle={styles.content}>
//         <View style={styles.iconContainer}>
//           <LinearGradient colors={['#0d64dd', '#1e90ff']} style={styles.emailIcon}>
//             <Icon name="mail-outline" size={40} color="#fff" />
//           </LinearGradient>
//         </View>

//         <Text style={styles.title}>Enter your email</Text>
//         <Text style={styles.subtitle}>
//           Add a valid email address to receive an OTP and access your Showa account.
//         </Text>

//         <View style={styles.inputContainer}>
//           <Icon name="mail" size={20} color="#666" style={styles.inputIcon} />
//           <TextInput
//             placeholder="Enter your email address"
//             style={[styles.input, emailError && styles.inputError]}
//             keyboardType="email-address"
//             value={email}
//             placeholderTextColor='#999'
//             onChangeText={(text) => {
//               setEmail(text);
//               setEmailError('');
//             }}
//             autoCapitalize="none"
//             autoCorrect={false}
//           />
//         </View>
        
//         {emailError ? (
//           <View style={styles.errorContainer}>
//             <Icon name="warning-outline" size={16} color="#ff3b30" />
//             <Text style={styles.errorText}>{emailError}</Text>
//           </View>
//         ) : null}

//         <TouchableOpacity
//           onPress={handleEmailSentOTP}
//           style={[styles.button, loading && styles.buttonDisabled]}
//           disabled={loading}
//         >
//           <LinearGradient 
//             colors={['#0d64dd', '#1e90ff']} 
//             style={styles.buttonGradient}
//             start={{x: 0, y: 0}} 
//             end={{x: 1, y: 0}}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" size="small" />
//             ) : (
//               <View style={styles.buttonContent}>
//                 <Text style={styles.buttonText}>Continue</Text>
//                 <Icon name="arrow-forward" size={20} color="#fff" />
//               </View>
//             )}
//           </LinearGradient>
//         </TouchableOpacity>

//         <Text style={styles.footerText}>
//           By continuing, you agree to our Terms of Service and Privacy Policy.
//         </Text>
//       </ScrollView>

//       {/* Email Already Registered Modal */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <View style={styles.modalIconContainer}>
//                 <LinearGradient colors={['#ff9500', '#ff5e3a']} style={styles.modalIcon}>
//                   <Icon name="information-circle" size={30} color="#fff" />
//                 </LinearGradient>
//               </View>
//               <Text style={styles.modalTitle}>This email is already registered</Text>
//               <Text style={styles.modalSubtitle}>
//                 The email address {email} is already register tap to login.
//               </Text>
//             </View>

//             <View style={styles.modalButtons}>
//               <TouchableOpacity 
//                 style={[styles.modalButton, styles.loginButton]}
//                 onPress={handleLoginInstead}
//               >
//                 <Text style={styles.loginButtonText}>Login Instead</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={[styles.modalButton, styles.differentEmailButton]}
//                 onPress={handleUseDifferentEmail}
//               >
//                 <Text style={styles.differentEmailText}>Use Different Email</Text>
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity 
//               style={styles.modalClose}
//               onPress={() => setModalVisible(false)}
//             >
//               <Icon name="close" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#fff' 
//   },
//   header: {
//     height: 100,
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//     paddingHorizontal: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   iconButton: {
//     padding: 5,
//   },
//   content: {
//     padding: 25,
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   iconContainer: {
//     alignItems: 'center',
//     marginBottom: 25,
//   },
//   emailIcon: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#000',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 30,
//     lineHeight: 22,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 12,
//     marginBottom: 15,
//     backgroundColor: '#f9f9f9',
//   },
//   inputIcon: {
//     padding: 15,
//   },
//   input: {
//     flex: 1,
//     height: 55,
//     paddingHorizontal: 15,
//     color: '#333',
//     fontSize: 16,
//   },
//   inputError: {
//     borderColor: '#ff3b30',
//   },
//   errorContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   errorText: {
//     color: '#ff3b30',
//     marginLeft: 5,
//     fontSize: 14,
//   },
//   button: {
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginBottom: 20,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   buttonGradient: {
//     paddingVertical: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//     marginRight: 10,
//   },
//   footerText: {
//     fontSize: 12,
//     color: '#999',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 25,
//     width: '100%',
//     maxWidth: 400,
//     alignItems: 'center',
//     position: 'relative',
//   },
//   modalHeader: {
//     alignItems: 'center',
//     marginBottom: 25,
//   },
//   modalIconContainer: {
//     marginBottom: 15,
//   },
//   modalIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   modalSubtitle: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   modalButtons: {
//     width: '100%',
//   },
//   modalButton: {
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   loginButton: {
//     backgroundColor: '#0d64dd',
//   },
//   differentEmailButton: {
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   loginButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   differentEmailText: {
//     color: '#666',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   modalClose: {
//     position: 'absolute',
//     top: 15,
//     right: 15,
//     padding: 5,
//   },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';

const PRIMARY_COLOR = '#0d64dd';
const PRIMARY_LIGHT = '#4a90e2';
const WHITE = '#ffffff';
const TEXT_PRIMARY = '#333';
const TEXT_SECONDARY = '#666';
const PLACEHOLDER_COLOR = '#999';
const BORDER_COLOR = '#ddd';
const ERROR_COLOR = '#ff3b30';
const SUCCESS_COLOR = '#34c759';

const { width, height } = Dimensions.get('window');

export default function EmailScreen({ navigation, route }) {
  const phoneNumber = route.params?.phoneNumberID;
  const navigate = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const redirectBack = () => {
    navigation.navigate('Signin');
  };

  const checkEmailExists = async () => {
    try {
      const response = await axios.post(`${API_ROUTE}/check-email/`, { email });
      return response.data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleEmailSentOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setEmailError('');

    try {
      // First check if email exists
      const emailExists = await checkEmailExists();
      
      if (emailExists) {
        setModalVisible(true);
        setLoading(false);
        return;
      }

      // If email doesn't exist, proceed with OTP for registration
      await sendOTP('registration');
    } catch (error) {
      console.error('Error:', error.response || error);
      if (error.response?.data?.email) {
        setEmailError(error.response.data.email[0]);
      } else {
        Alert.alert('Error', 'An error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  const sendOTP = async (purpose) => {
    try {
      const response = await axios.post(`${API_ROUTE}/send-otp/`, { email, purpose });
      
      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          'Success',
          `An OTP has been sent to ${email}.\nPlease check your email inbox and enter the code to ${purpose === 'login' ? 'login' : 'verify your account'}.`,
          [{ text: 'OK', onPress: () => {
            if (purpose === 'login') {
              // Navigate to login OTP verification screen
              navigation.navigate('VerificationCode', {
                emailID: email,
                purpose: 'login'
              });
            } else {
              // Navigate to registration OTP verification screen
              navigation.navigate('LinkingScreen', {
                phoneNumberID: phoneNumber,
                emailID: email,
              });
            }
          }}]
        );
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'An error occurred while sending the OTP. Please try again.');
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  const handleLoginInstead = () => {
    setModalVisible(false);
    sendOTP('login');
  };

  const handleUseDifferentEmail = () => {
    setModalVisible(false);
    setEmail('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={PRIMARY_COLOR}
        translucent={false}
      />
      
      {/* Professional Header */}
      <LinearGradient 
        colors={[PRIMARY_COLOR, PRIMARY_LIGHT]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              onPress={redirectBack}
              style={styles.headerButton}
              accessibilityLabel="Go back"
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="arrow-back" size={22} color={WHITE} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Email Verification</Text>
            {Platform.OS === 'android' && (
              <Text style={styles.headerSubtitle}>Secure your account</Text>
            )}
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              onPress={redirectBack}
              style={styles.headerButton}
              accessibilityLabel="Close"
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="close" size={22} color={WHITE} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Header bottom border */}
        <View style={styles.headerBottomBorder} />
      </LinearGradient>

      {/* Content Section */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={Platform.OS === 'ios'}
        >
          <View style={styles.mainContent}>
            {/* Email Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <LinearGradient 
                  colors={[PRIMARY_COLOR, PRIMARY_LIGHT]} 
                  style={styles.gradientCircle}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="mail-outline" size={40} color={WHITE} />
                </LinearGradient>
              </View>
            </View>

            {/* Title Section */}
            <Text style={styles.title}>Enter Your Email</Text>
            <Text style={styles.subtitle}>
              Add a valid email address to receive an OTP and secure your Showa account.
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[
                styles.inputWrapper,
                emailError && styles.inputWrapperError
              ]}>
                <Icon name="mail" size={20} color={TEXT_SECONDARY} style={styles.inputIcon} />
                <TextInput
                  placeholder="you@example.com"
                  style={styles.input}
                  keyboardType="email-address"
                  value={email}
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError('');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="done"
                  onSubmitEditing={handleEmailSentOTP}
                  editable={!loading}
                />
                {email.length > 0 && !emailError && (
                  <Icon name="checkmark-circle" size={20} color={SUCCESS_COLOR} />
                )}
              </View>
              
              {emailError ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color={ERROR_COLOR} />
                  <Text style={styles.errorText}>{emailError}</Text>
                </View>
              ) : (
                <Text style={styles.hintText}>
                  We'll send a verification code to this email
                </Text>
              )}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              onPress={handleEmailSentOTP}
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient 
                colors={[PRIMARY_COLOR, PRIMARY_LIGHT]} 
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color={WHITE} size="small" />
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>Continue</Text>
                    <Icon name="arrow-forward" size={18} color={WHITE} style={styles.buttonIcon} />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {/* Footer Text - Outside the main content to prevent overlap */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkText}>Terms of Service</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Email Already Registered Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <LinearGradient 
              colors={[PRIMARY_COLOR, PRIMARY_LIGHT]} 
              style={styles.modalHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
                activeOpacity={0.7}
              >
                <Icon name="close" size={22} color={WHITE} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Email Already Registered</Text>
              <View style={styles.modalPlaceholder} />
            </LinearGradient>

            {/* Modal Body */}
            <View style={styles.modalBody}>
              <View style={styles.modalIconContainer}>
                <View style={styles.modalIconCircle}>
                  <Icon name="mail" size={40} color={PRIMARY_COLOR} />
                </View>
              </View>
              
              <Text style={styles.modalMainText}>
                <Text style={styles.emailHighlight}>{email}</Text> is already registered
              </Text>
              
              <Text style={styles.modalSubtext}>
                This email address is already associated with an existing account. 
                Would you like to login instead?
              </Text>

              {/* Modal Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.primaryModalButton]}
                  onPress={handleLoginInstead}
                  activeOpacity={0.8}
                >
                  <LinearGradient 
                    colors={[PRIMARY_COLOR, PRIMARY_LIGHT]} 
                    style={styles.modalButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.primaryModalButtonText}>Login Instead</Text>
                    <Icon name="log-in" size={18} color={WHITE} style={styles.modalButtonIcon} />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalButton, styles.secondaryModalButton]}
                  onPress={handleUseDifferentEmail}
                  activeOpacity={0.7}
                >
                  <Text style={styles.secondaryModalButtonText}>Use Different Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: WHITE
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    borderBottomLeftRadius: Platform.OS === 'ios' ? 0 : 20,
    borderBottomRightRadius: Platform.OS === 'ios' ? 0 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerBottomBorder: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 30 : 24,
    minHeight: height * 0.7, // Ensure minimum height for content
  },
  footerContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginTop: 'auto', // Push to bottom
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 100, 221, 0.05)',
  },
  gradientCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 15,
    color: TEXT_PRIMARY,
    marginBottom: 12,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
  },
  inputWrapperError: {
    borderColor: ERROR_COLOR,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: TEXT_PRIMARY,
    paddingVertical: 0,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    color: ERROR_COLOR,
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  hintText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: WHITE,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 10,
  },
  footerText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: WHITE,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  modalPlaceholder: {
    width: 44,
  },
  modalBody: {
    padding: 24,
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 20,
  },
  modalIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(13, 100, 221, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalMainText: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
  },
  emailHighlight: {
    color: PRIMARY_COLOR,
  },
  modalSubtext: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  modalButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryModalButton: {
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryModalButtonText: {
    color: WHITE,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalButtonIcon: {
    marginLeft: 10,
  },
  secondaryModalButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    backgroundColor: WHITE,
  },
  secondaryModalButtonText: {
    color: TEXT_PRIMARY,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
