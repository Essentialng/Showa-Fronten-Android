
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';

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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
        <TouchableOpacity onPress={redirectBack} style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Email Verification</Text>
        <TouchableOpacity onPress={redirectBack} style={styles.iconButton}>
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <LinearGradient colors={['#0d64dd', '#1e90ff']} style={styles.emailIcon}>
            <Icon name="mail-outline" size={40} color="#fff" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>Enter your email</Text>
        <Text style={styles.subtitle}>
          Add a valid email address to receive an OTP and access your Showa account.
        </Text>

        <View style={styles.inputContainer}>
          <Icon name="mail" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Enter your email address"
            style={[styles.input, emailError && styles.inputError]}
            keyboardType="email-address"
            value={email}
            placeholderTextColor='#999'
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        
        {emailError ? (
          <View style={styles.errorContainer}>
            <Icon name="warning-outline" size={16} color="#ff3b30" />
            <Text style={styles.errorText}>{emailError}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={handleEmailSentOTP}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
        >
          <LinearGradient 
            colors={['#0d64dd', '#1e90ff']} 
            style={styles.buttonGradient}
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Continue</Text>
                <Icon name="arrow-forward" size={20} color="#fff" />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>

      {/* Email Already Registered Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <LinearGradient colors={['#ff9500', '#ff5e3a']} style={styles.modalIcon}>
                  <Icon name="information-circle" size={30} color="#fff" />
                </LinearGradient>
              </View>
              <Text style={styles.modalTitle}>This email is already registered</Text>
              <Text style={styles.modalSubtitle}>
                The email address {email} is already register tap to login.
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.loginButton]}
                onPress={handleLoginInstead}
              >
                <Text style={styles.loginButtonText}>Login Instead</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.differentEmailButton]}
                onPress={handleUseDifferentEmail}
              >
                <Text style={styles.differentEmailText}>Use Different Email</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: {
    height: 100,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  iconButton: {
    padding: 5,
  },
  content: {
    padding: 25,
    flexGrow: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  emailIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    height: 55,
    paddingHorizontal: 15,
    color: '#333',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  errorText: {
    color: '#ff3b30',
    marginLeft: 5,
    fontSize: 14,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
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
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    position: 'relative',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  modalIconContainer: {
    marginBottom: 15,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    width: '100%',
  },
  modalButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: '#0d64dd',
  },
  differentEmailButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  differentEmailText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  modalClose: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
});
