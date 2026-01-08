import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Linking,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';

const ContactUsScreen = ({ navigation }) => {
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [storyForm, setStoryForm] = useState({
    name: '',
    email: '',
    title: '',
    story: '',
    category: ''
  });

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@example.com?subject=App Support');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://www.example.com');
  };

  const handleSocialMediaPress = (platform) => {
    const urls = {
      facebook: 'https://facebook.com/example',
      twitter: 'https://twitter.com/example',
      instagram: 'https://instagram.com/example',
    };
    Linking.openURL(urls[platform]);
  };

  const handleShareStory = () => {
    setIsStoryModalVisible(true);
  };

  const handleSubmitStory = () => {
    // Validate form
    if (!storyForm.name || !storyForm.title || !storyForm.story) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    
    console.log('Story submitted:', storyForm);
    
    // Show success modal
    setIsStoryModalVisible(false);
    setIsSuccessModalVisible(true);
    
    // Reset form
    setStoryForm({
      name: '',
      email: '',
      title: '',
      story: '',
      category: ''
    });
  };

  const categories = [
    'Success Story',
    'Business Growth',
    'Personal Achievement',
    'Community Impact',
    'Overcoming Challenges',
    'Other'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Contact Us</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image source={require('../assets/images/zenithdirect-rep-animation-big.png')} style={{width:150, height:150, borderRadius:50, justifyContent:'center', alignSelf:'center'}}/>
          <Text style={[styles.heroText, {marginTop:18, alignSelf:'center'}]}>We're here to help!</Text>
          <Text style={styles.heroSubtext}>Reach out to our team for any questions or support.</Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Options</Text>
          
          {/* Email */}
          <TouchableOpacity style={styles.contactMethod} onPress={handleEmailPress}>
            <View style={[styles.iconContainer, { backgroundColor: '#3498db20' }]}>
              <Icon name="envelope" size={20} color="#3498db" />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>info@essential.com</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#95a5a6" />
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity style={styles.contactMethod} onPress={handlePhonePress}>
            <View style={[styles.iconContainer, { backgroundColor: '#2ecc7120' }]}>
              <Icon name="phone" size={20} color="#2ecc71" />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Call Us</Text>
              <Text style={styles.contactValue}>+234 978545</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#95a5a6" />
          </TouchableOpacity>

          {/* Website */}
          <TouchableOpacity style={styles.contactMethod} onPress={handleWebsitePress}>
            <View style={[styles.iconContainer, { backgroundColor: '#9b59b620' }]}>
              <Icon name="globe" size={20} color="#9b59b6" />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Visit Website</Text>
              <Text style={styles.contactValue}>www.edirect.ng</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#95a5a6" />
          </TouchableOpacity>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <Text style={styles.sectionSubtitle}>Stay connected on social media</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity 
              style={[styles.socialIconContainer, { backgroundColor: '#3b599820' }]}
              onPress={() => handleSocialMediaPress('facebook')}
            >
              <Icon name="facebook" size={20} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.socialIconContainer, { backgroundColor: '#1da1f220' }]}
              onPress={() => handleSocialMediaPress('twitter')}
            >
              <Icon name="twitter" size={20} color="#1da1f2" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.socialIconContainer, { backgroundColor: '#e1306c20' }]}
              onPress={() => handleSocialMediaPress('instagram')}
            >
              <Icon name="instagram" size={20} color="#e1306c" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Office Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Location</Text>
          <View style={styles.contactMethod}>
            <View style={[styles.iconContainer, { backgroundColor: '#e74c3c20' }]}>
              <Fontisto name="map-marker-alt" size={20} color="#e74c3c" />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Headquarters</Text>
              <Text style={styles.contactValue}>128 Iyala Lagos State</Text>
              <Text style={styles.contactValue}>Nigeria</Text>
            </View>
          </View>
        </View>

        {/* Success Stories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Stories</Text>
          <Text style={styles.successIntro}>
            Hear from people who shared their stories with us
          </Text>

          <View style={styles.storyCard}>
            <Text style={styles.storyText}>
              "I was hesitant to post at first, but after sharing my experience, I connected with so many people going through similar challenges."
            </Text>
            <Text style={styles.storyAuthor}>- Sarah J.</Text>
          </View>

          <View style={styles.storyCard}>
            <Text style={styles.storyText}>
              "Posting my story led to unexpected opportunities. A local organization reached out and offered resources that helped me tremendously."
            </Text>
            <Text style={styles.storyAuthor}>- Michael T.</Text>
          </View>

          <TouchableOpacity style={styles.ctaButton} onPress={handleShareStory}>
            <Text style={styles.ctaButtonText}>Share Your Story</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Story Submission Modal */}
      <Modal
        visible={isStoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsStoryModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Share Your Story</Text>
                <TouchableOpacity 
                  onPress={() => setIsStoryModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={storyForm.name}
                    placeholderTextColor="#999"
                    onChangeText={(text) => setStoryForm({...storyForm, name: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    placeholderTextColor="#999"
                    value={storyForm.email}
                    onChangeText={(text) => setStoryForm({...storyForm, email: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Story Title *</Text>
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="#999"
                    placeholder="Give your story a title"
                    value={storyForm.title}
                    onChangeText={(text) => setStoryForm({...storyForm, title: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Category</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
                    {categories.map((category, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.categoryPill,
                          storyForm.category === category && styles.categoryPillActive
                        ]}
                        onPress={() => setStoryForm({...storyForm, category})}
                      >
                        <Text style={[
                          styles.categoryText,
                          storyForm.category === category && styles.categoryTextActive
                        ]}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your Story *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Share your inspiring story..."
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={storyForm.story}
                    onChangeText={(text) => setStoryForm({...storyForm, story: text})}
                  />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitStory}>
                  <Text style={styles.submitButtonText}>Submit Your Story</Text>
                </TouchableOpacity>
                <View style={{padding:40}}></View>
                
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
       
        </KeyboardAvoidingView>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={isSuccessModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsSuccessModalVisible(false)}
      >
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            {/* <LottieView
              source={require('../assets/animations/success.json')}
              autoPlay
              loop={false}
              style={styles.successAnimation}
            /> */}
            <Text style={styles.successTitle}>Thank You!</Text>
            <Text style={styles.successMessage}>
              Your story has been received and will be published soon after review.
            </Text>
            <TouchableOpacity 
              style={styles.successButton}
              onPress={() => setIsSuccessModalVisible(false)}
            >
              <Text style={styles.successButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  heroSection: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  heroText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  heroSubtext: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
    alignSelf:'center',
    justifyContent:'center',
    alignContent:'center',
    textAlign:'center'
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  socialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  successIntro: {
    fontSize: 15,
    color: '#7f8c8d',
    marginBottom: 16,
    lineHeight: 22,
  },
  storyCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  storyText: {
    fontSize: 15,
    color: '#34495e',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 8,
  },
  storyAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'right',
  },
  ctaButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    color:'#2c3e50',
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  categoryText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  categoryTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Success Modal Styles
  successModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    
  },
  successModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    
  },
  successAnimation: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#27ae60',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  successButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  successButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContactUsScreen;