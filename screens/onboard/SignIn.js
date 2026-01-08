

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const COUNTRIES = [
  { code: 'NG', name: 'Nigeria', dial: '+234' },
  { code: 'GH', name: 'Ghana', dial: '+233' },
  { code: 'KE', name: 'Kenya', dial: '+254' },
  { code: 'US', name: 'United States', dial: '+1' },
  { code: 'GB', name: 'United Kingdom', dial: '+44' },
  { code: 'ZA', name: 'South Africa', dial: '+27' },
  { code: 'CM', name: 'Cameroon', dial: '+237' },
  { code: 'UG', name: 'Uganda', dial: '+256' },
  { code: 'CA', name: 'Canada', dial: '+1' },
  { code: 'DE', name: 'Germany', dial: '+49' },
  { code: 'FR', name: 'France', dial: '+33' },
  { code: 'IT', name: 'Italy', dial: '+39' },
  { code: 'IN', name: 'India', dial: '+91' },
  { code: 'BR', name: 'Brazil', dial: '+55' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966' },
  { code: 'AE', name: 'UAE', dial: '+971' },
  { code: 'TR', name: 'Turkey', dial: '+90' },
  { code: 'RU', name: 'Russia', dial: '+7' },
  { code: 'PK', name: 'Pakistan', dial: '+92' },
  { code: 'BD', name: 'Bangladesh', dial: '+880' },
];

const PRIMARY_COLOR = '#0d64dd';
const BORDER_COLOR = '#ddd';
const TEXT_PRIMARY = '#333';
const TEXT_SECONDARY = '#666';
const PLACEHOLDER_COLOR = '#999';

export default function PhoneNumberScreen({ navigation }) {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBackNavigation = () => {
    navigation.navigate('Loginscreen');
  };

  const validateInput = () => {
    if (!selectedCountry) {
      Alert.alert('Selection Required', 'Please select your country/region.');
      return false;
    }
    
    if (!phoneNumber.trim()) {
      Alert.alert('Input Required', 'Please enter your phone number.');
      return false;
    }

    // Basic phone number validation (digits only)
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      Alert.alert('Invalid Format', 'Please enter a valid phone number containing only digits.');
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (validateInput()) {
      setIsLoading(true);
      // Simulate API call or navigation delay
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate('Signin_two', { 
          phoneNumberID: `${selectedCountry}${phoneNumber}` 
        });
      }, 500);
    }
  };

  const getFlagEmoji = (countryCode) => {
    return countryCode
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
  };

  const formatPhoneNumber = (text) => {
    // Remove non-digit characters
    const cleaned = text.replace(/\D/g, '');
    setPhoneNumber(cleaned);
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={[PRIMARY_COLOR, PRIMARY_COLOR]} 
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={handleBackNavigation}
          style={styles.headerButton}
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleBackNavigation}
          style={styles.headerButton}
          accessibilityLabel="Close"
        >
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.title}>Enter Phone Number</Text>
        <Text style={styles.subtitle}>
          Select your country and enter your Showa phone number
        </Text>

        {/* Country Selection */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Country/Region</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCountry}
              onValueChange={setSelectedCountry}
              style={styles.picker}
              dropdownIconColor={TEXT_PRIMARY}
            >
              <Picker.Item 
                label="Select country/region" 
                value="" 
                color={PLACEHOLDER_COLOR}
              />
              {COUNTRIES.map((country, index) => (
                <Picker.Item
                  key={`${country.code}-${index}`}
                  label={`${getFlagEmoji(country.code)} ${country.name} (${country.dial})`}
                  value={country.dial}
                  color={TEXT_PRIMARY}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            placeholder="Enter your phone number"
            style={styles.input}
            keyboardType="phone-pad"
            placeholderTextColor={PLACEHOLDER_COLOR}
            value={phoneNumber}
            onChangeText={formatPhoneNumber}
            editable={!isLoading}
            maxLength={15} 
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          onPress={handleContinue}
          style={[
            styles.primaryButton,
            isLoading && styles.buttonDisabled
          ]}
          disabled={isLoading}
          accessibilityLabel="Continue to next step"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: TEXT_PRIMARY,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
    fontFamily: 'Lato-Black',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    marginBottom: 8,
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  picker: {
    height: 52,
  },
  input: {
    height: 52,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: TEXT_PRIMARY,
    backgroundColor: '#fafafa',
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
