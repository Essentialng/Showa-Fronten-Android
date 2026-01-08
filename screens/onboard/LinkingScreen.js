
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_ROUTE } from '../../api_routing/api';

const VerificationCodeScreen = ({ route }) => {
  const phoneNumberID = route.params?.phoneNumberID;
  const emailId = route.params?.emailID;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); 
  const [error, setError] = useState(''); 
  const navigation = useNavigation();
  const inputsRef = useRef([]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      setError(''); 

      if (text && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  const redirectBack = () => {
    navigation.goBack();
  };

  const resendOTP = async () => {
    if (!emailId) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post(`${API_ROUTE}/send-otp/`, { email: emailId });
      if (response.status === 200 || response.status === 201) {
        alert('OTP sent');
        setTimer(300); 
        setError(''); 
      } else {
        alert('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      //console.error('Error sending OTP:', error);
      alert('An error occurred while sending the OTP. Please try again.');
    }
  };
  
  const verifyOTP = async () => {
    if (!emailId) {
      alert('Please enter a valid email address.');
      return;
    }

    const convertarrayotpcode = code;
    const otpResult = Number(convertarrayotpcode.join(''));

    try {
      const response = await axios.post(`${API_ROUTE}/verify-otp/`, 
        { 
          email: emailId, 
          otp: otpResult 
        }
      );
      if (response.status === 200 || response.status === 201) {
        navigation.navigate('Register', {
          phoneNumberID: phoneNumberID,
          emailID: emailId,
        });
        alert('OTP verify successful');
      } else {
        setError('Incorrect code. Please try again.'); 
      }
    } catch (error) {
      // Check if the error response contains OTP validation error
      if (error.response && error.response.data && error.response.data.error) {
        console.log('OTP verification error:', error.response.data.error);
        setError(error.response.data.error); // Display server error message
      } else {
        setError('Incorrect code. Please try again.'); // Generic error message
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
        <TouchableOpacity onPress={redirectBack}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={redirectBack}>
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to your email ({emailId})
        </Text>
        <Text style={{ marginTop: 10, fontSize: 16, color: '#d00' }}>
          Expires in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
        </Text>
      </View>

      {/* Error message display */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={el => (inputsRef.current[index] = el)}
            value={digit}
            onChangeText={text => handleCodeChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            maxLength={1}
            placeholderTextColor='#777'
            keyboardType="numeric"
            style={[
              styles.codeInput,
              error ? styles.codeInputError : null 
            ]}
            returnKeyType="done"
            autoFocus={index === 0}
            textContentType="oneTimeCode"
          />
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: isCodeComplete ? '#0d64dd' : '#8fb1ff' },
        ]}
        disabled={!isCodeComplete}
        onPress={verifyOTP}
      >
        <Text style={styles.submitButtonText}>Verify & Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={resendOTP}
        style={styles.resendContainer}
        disabled={timer > 0}
      >
        <Text style={[styles.resendText, { opacity: timer > 0 ? 0.5 : 1 }]}>
          {timer > 0
            ? `Resend available in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`
            : "Didn't receive the code? Resend"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 100,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWrapper: {
    paddingHorizontal: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#000',
    marginBottom: 8,
    fontFamily:'Lato-Black'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20, // Reduced margin to make space for error message
    marginHorizontal: 10,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 22,
    color:'#555',
    backgroundColor: '#f9f9f9',
  },
  codeInputError: {
    borderColor: '#d00', // Red border for error state
  },
  errorText: {
    color: '#d00',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  submitButton: {
    marginHorizontal: 40,
    marginTop: 30, // Reduced margin to make space for error message
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    color: '#0d64dd',
    fontSize: 14,
  },
});

export default VerificationCodeScreen;
