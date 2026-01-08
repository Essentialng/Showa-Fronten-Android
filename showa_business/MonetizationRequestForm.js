import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity,ActivityIndicator, Image, StatusBar, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';



const MonetizationRequest = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    channelName: '',
    category: '',
    bio: '',
    website: '',
    taxInfo: '',
    paymentMethod: 'Paystack',
    contentType: 'Videos',
    audienceAge: '18-34',
    uploadFrequency: '3-5 per week',
    agreeTerms: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Application Submitted',
        'Your monetization request has been received. We will review your application and get back to you within 5-7 business days.',
        [
          { text: 'OK', onPress: () => navigation.replace('CreatorDashboard') }
        ]
      );
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepContainer}>
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <View style={[styles.step, currentStep === step && styles.activeStep]}>
              <Text style={[styles.stepText, currentStep === step && styles.activeStepText]}>{step}</Text>
            </View>
            {step < 4 && <View style={[styles.stepLine, currentStep > step && styles.activeStepLine]} />}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const renderStepOne = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Micheal Adabayo"
          placeholderTextColor='#555'
          value={formData.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="mike@gmail.com"
          keyboardType="email-address"
          placeholderTextColor='#555'
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+234 456 7890"
          keyboardType="phone-pad"
          placeholderTextColor='#555'
          value={formData.phone}
          onChangeText={(text) => handleChange('phone', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Account Name</Text>
        <TextInput
          style={styles.input}
          placeholder="My Awesome Account"
          placeholderTextColor='#555'
          value={formData.channelName}
          onChangeText={(text) => handleChange('channelName', text)}
        />
      </View>
    </View>
  );

  const renderStepTwo = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Content Details</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Content Category</Text>
        <View style={styles.selectInput}>
          <Text style={styles.selectText}>{formData.category || 'Select category bellow'}</Text>
          
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Primary Content Type</Text>
        <View style={styles.radioGroup}>
          {['Videos', 'Photos', 'Articles', 'Live Streams', 'Podcasts'].map((type) => (
            <TouchableOpacity 
              key={type} 
              style={styles.radioOption}
              onPress={() => handleChange('contentType', type)}
            >
              <View style={styles.radioCircle}>
                {formData.contentType === type && <View style={styles.radioChecked} />}
              </View>
              <Text style={styles.radioLabel}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Primary Audience Age</Text>
        <View style={styles.radioGroup}>
          {['13-17', '18-34', '35-54', '55+'].map((age) => (
            <TouchableOpacity 
              key={age} 
              style={styles.radioOption}
              onPress={() => handleChange('audienceAge', age)}
            >
              <View style={styles.radioCircle}>
                {formData.audienceAge === age && <View style={styles.radioChecked} />}
              </View>
              <Text style={styles.radioLabel}>{age}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Upload Frequency</Text>
        <View style={styles.radioGroup}>
          {['Daily', '3-5 per week', '1-2 per week', 'Less than weekly'].map((freq) => (
            <TouchableOpacity 
              key={freq} 
              style={styles.radioOption}
              onPress={() => handleChange('uploadFrequency', freq)}
            >
              <View style={styles.radioCircle}>
                {formData.uploadFrequency === freq && <View style={styles.radioChecked} />}
              </View>
              <Text style={styles.radioLabel}>{freq}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Channel Bio</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Tell us about your content..."
          multiline
          value={formData.bio}
          onChangeText={(text) => handleChange('bio', text)}
        />
      </View>
    </View>
  );

  const renderStepThree = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Monetization Preferences</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Preferred Payment Method</Text>
        <View style={styles.selectInput}>
          <Text style={styles.selectText}>{formData.paymentMethod}</Text>
          <Icon name="keyboard-arrow-down" size={24} color="#666" />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tax Information (SSN/EIN)</Text>
        <TextInput
          style={styles.input}
          placeholder="Required for payment processing"
          value={formData.taxInfo}
          onChangeText={(text) => handleChange('taxInfo', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Website/Portfolio (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com"
          keyboardType="url"
          value={formData.website}
          onChangeText={(text) => handleChange('website', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Monetization Options</Text>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => handleChange('agreeTerms', !formData.agreeTerms)}
          >
            {formData.agreeTerms ? (
              <Icon name="check-box" size={24} color="#0d64dd" />
            ) : (
              <Icon name="check-box-outline-blank" size={24} color="#666" />
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            I agree to the Terms of Service and confirm that all content is original and complies with community guidelines
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStepFour = () => (
    <View style={styles.formSection}>
      <View style={styles.summaryHeader}>
        <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
        <Text style={styles.summaryTitle}>Review Your Information</Text>
        <Text style={styles.summarySubtitle}>Please verify all details before submitting your application</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryCardTitle}>Basic Information</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Full Name:</Text>
          <Text style={styles.summaryValue}>{formData.fullName || 'Not provided'}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Email:</Text>
          <Text style={styles.summaryValue}>{formData.email || 'Not provided'}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Channel Name:</Text>
          <Text style={styles.summaryValue}>{formData.channelName || 'Not provided'}</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryCardTitle}>Content Details</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Content Type:</Text>
          <Text style={styles.summaryValue}>{formData.contentType}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Primary Audience:</Text>
          <Text style={styles.summaryValue}>{formData.audienceAge}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Upload Frequency:</Text>
          <Text style={styles.summaryValue}>{formData.uploadFrequency}</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryCardTitle}>Payment Information</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Payment Method:</Text>
          <Text style={styles.summaryValue}>{formData.paymentMethod}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tax Info Provided:</Text>
          <Text style={styles.summaryValue}>{formData.taxInfo ? 'Yes' : 'No'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
        <StatusBar backgroundColor='#fff' barStyle='dark-content' />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#4267B2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Monetization Request</Text>
          <View style={{ width: 24 }} />
        </View>

        {renderStepIndicator()}

        {currentStep === 1 && renderStepOne()}
        {currentStep === 2 && renderStepTwo()}
        {currentStep === 3 && renderStepThree()}
        {currentStep === 4 && renderStepFour()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < 4 ? (
          <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
            <Text style={styles.primaryButtonText}>Continue</Text>
            <Feather name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.loadingButton]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>Submit Application</Text>
                <Icon name="send" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    fontFamily:'Lato-Bold',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#0d64dd',
  },
  stepText: {
    color: '#666',
    fontWeight: 'bold',
  },
  activeStepText: {
    color: '#fff',
  },
  stepLine: {
    width: 50,
    height: 2,
    backgroundColor: '#eaeaea',
  },
  activeStepLine: {
    backgroundColor: '#0d64dd',
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color:'#777',
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
  },
  selectText: {
    fontSize: 16,
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioChecked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0d64dd',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d64dd',
    marginBottom: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryLabel: {
    width: 120,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d64dd',
    borderRadius: 8,
    padding: 15,
    marginLeft: 10,
  },
  loadingButton: {
    opacity: 0.8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  secondaryButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MonetizationRequest;