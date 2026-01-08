import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import EmojiSelector from 'react-native-emoji-selector';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// Color Scheme
const COLORS = {
  PRIMARY: '#0d64dd', // Professional blue
  PRIMARY_LIGHT: '#e6f0ff', // Light blue background
  SECONDARY: '#ff6b6b', // Coral accent for actions
  BACKGROUND: '#f8f9fa', // Very light grey
  CARD: '#ffffff', // White
  TEXT: '#2d3436', // Dark grey
  TEXT_SECONDARY: '#636e72', // Medium grey
  BORDER: '#dfe6e9', // Light border
  SHADOW: 'rgba(0,0,0,0.08)', // Subtle shadow
  SUCCESS: '#00b894', // Green for success
};

const SIZES = {
  FONT: {
    LARGE: 20,
    MEDIUM: 16,
    SMALL: 14,
    XSMALL: 12,
  },
  SPACING: {
    LARGE: 24,
    MEDIUM: 16,
    SMALL: 12,
    XSMALL: 8,
  },
  RADIUS: {
    LARGE: 24,
    MEDIUM: 16,
    SMALL: 8,
  },
  ICON: 24,
};

const HASHTAG_CHOICES = [
  { value: 'TRENDING', label: 'Trending' },
  { value: 'VIRAL', label: 'Viral' },
  { value: 'CHALLENGES', label: 'Challenges' },
  { value: 'MEMES', label: 'Memes' },
  { value: 'INSPIRATION', label: 'Inspiration' },
  { value: 'LIFESTYLE', label: 'Lifestyle' },
  { value: 'FASHION', label: 'Fashion' },
  { value: 'BEAUTY', label: 'Beauty' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'FOOD', label: 'Food' },
  { value: 'TECH', label: 'Tech' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'FUNNY', label: 'Funny' },
  { value: 'MUSIC', label: 'Music' },
  { value: 'ART', label: 'Art' },
];


export default function CreatePost({ navigation }) {
  // State management
  const [content, setContent] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [userfullname, setFullname] = useState('');
  const [userprofileimage, setUserProfileImage] = useState('');
  const [emojiModalVisible, setEmojiModalVisible] = useState(false);
  const [pollModalVisible, setPollModalVisible] = useState(false);
  const [hashtagModalVisible, setHashtagModalVisible] = useState(false);
  const [pollOption1, setPollOption1] = useState('');
  const [pollOption2, setPollOption2] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const json = await AsyncStorage.getItem('userData');
        const parsed = json ? JSON.parse(json) : null;

        let userID = parsed?.id;
        if (!token || !userID) return;

        const response = await axios.get(`${API_ROUTE}/user/${userID}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setFullname(response.data.name);
          setUsername(response.data.name);
          setUserProfileImage(`${API_ROUTE_IMAGE}${response.data.profile_picture}`);
        }
      } catch (error) {
       // console.error('Error fetching user:', error);
        Alert.alert('Error', 'Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  const selectImage = async () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets?.[0]) {
        const asset = response.assets[0];
        setImage({
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
        });
      }
    });
  };

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('Required', 'Please enter some content');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Authentication Required', 'Please log in');
        return;
      }
      
      const formData = new FormData();
      formData.append('content', content);
      if (selectedHashtag) formData.append('hashtags', selectedHashtag);
      formData.append('user_profile_picture', userprofileimage);
      
      if (image) {
        formData.append('image', {
          uri: image.uri,
          name: image.name,
          type: image.type,
        });
      }

      await axios.post(`${API_ROUTE}/create-posts/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Success', 'Your post was published!');
      navigation.navigate('BroadcastHome');
      setContent('');
      setSelectedHashtag('');
      setImage(null);
    } catch (error) {
      //console.error('Post error:', error);
      Alert.alert('Error', 'Could not create post');
    } finally {
      setLoading(false);
    }
  };

  const selectHashtag = (hashtag) => {
    setSelectedHashtag(hashtag.value);
    setContent(content ? `${content} #${hashtag.label}` : `#${hashtag.label}`);
    setHashtagModalVisible(false);
  };

  const handlePollSubmit = () => {
    if (!pollOption1.trim() || !pollOption2.trim()) {
      Alert.alert('Required', 'Please enter both options');
      return;
    }
    const pollText = `Poll: ${pollOption1} vs ${pollOption2}`;
    setContent(content ? `${content}\n${pollText}` : pollText);
    setPollOption1('');
    setPollOption2('');
    setPollModalVisible(false);
  };

  const renderHashtagItem = ({ item }) => (
    <TouchableOpacity
      style={styles.hashtagItem}
      onPress={() => selectHashtag(item)}
    >
      <Text style={styles.hashtagText}>#{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header with gradient */}
        <LinearGradient
          colors={['#0d64dd', '#1a73e8']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={SIZES.ICON} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>New Post</Text>
          
          <TouchableOpacity
            style={styles.postButton}
            onPress={handlePost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.postButtonText}>Publish</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Author Section */}
          <View style={styles.authorContainer}>
            <Image 
              source={userprofileimage ? { uri: userprofileimage } : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')}
              style={styles.avatar}
            />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{userfullname || 'User'}</Text>
              <Text style={styles.authorUsername}>@{username || 'username'}</Text>
            </View>
          </View>

          {/* Content Input */}
          <TextInput
            placeholder="Share your thoughts..."
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={280}
            autoFocus
          />
          
          <Text style={styles.charCount}>{content.length}/280</Text>

          {/* Image Preview */}
          {image && (
            <View style={styles.imagePreviewContainer}>
              <Image 
                source={{ uri: image.uri }} 
                style={styles.previewImage} 
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImage(null)}
              >
                <Icon name="close-circle" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Selected Hashtag */}
          {selectedHashtag && (
            <View style={styles.selectedHashtagContainer}>
              <Text style={styles.selectedHashtag}>
                #{HASHTAG_CHOICES.find(h => h.value === selectedHashtag)?.label}
              </Text>
              <TouchableOpacity onPress={() => setSelectedHashtag('')}>
                <Icon name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={selectImage}
            >
              <Icon name="image" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.actionButtonText}>Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setHashtagModalVisible(true)}
            >
              <Icon name="pricetag" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.actionButtonText}>Hashtag</Text>
            </TouchableOpacity>
            
            {/* <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setPollModalVisible(true)}
            >
              <Icon name="stats-chart" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.actionButtonText}>Poll</Text>
            </TouchableOpacity> */}
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setEmojiModalVisible(true)}
            >
              <Icon name="happy" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.actionButtonText}>Emoji</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Hashtag Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={hashtagModalVisible}
          onRequestClose={() => setHashtagModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Hashtag</Text>
                <TouchableOpacity onPress={() => setHashtagModalVisible(false)}>
                  <Icon name="close" size={24} color={COLORS.TEXT} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={HASHTAG_CHOICES}
                renderItem={renderHashtagItem}
                keyExtractor={(item) => item.value}
                contentContainerStyle={styles.hashtagList}
              />
            </View>
          </View>
        </Modal>

        {/* Poll Modal */}
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={pollModalVisible}
          onRequestClose={() => setPollModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Poll</Text>
                <TouchableOpacity onPress={() => setPollModalVisible(false)}>
                  <Icon name="close" size={24} color={COLORS.TEXT} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubtitle}>Ask your followers to vote</Text>
              
              <TextInput
                placeholder="Option 1"
                placeholderTextColor={COLORS.TEXT_SECONDARY}
                style={styles.modalInput}
                value={pollOption1}
                onChangeText={setPollOption1}
              />
              
              <TextInput
                placeholder="Option 2"
                placeholderTextColor={COLORS.TEXT_SECONDARY}
                style={styles.modalInput}
                value={pollOption2}
                onChangeText={setPollOption2}
              />
              
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handlePollSubmit}
              >
                <Text style={styles.modalSubmitButtonText}>Add Poll</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal> */}

        {/* Emoji Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={emojiModalVisible}
          onRequestClose={() => setEmojiModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.emojiModalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Emoji</Text>
                <TouchableOpacity onPress={() => setEmojiModalVisible(false)}>
                  <Icon name="close" size={24} color={COLORS.TEXT} />
                </TouchableOpacity>
              </View>
              <EmojiSelector
                onEmojiSelected={(emoji) => {
                  setContent(content + emoji);
                  setEmojiModalVisible(false);
                }}
                showSearchBar={true}
                showTabs={true}
                columns={8}
                categoryEmojiSize={24}
                emojiSize={24}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.SPACING.MEDIUM,
    paddingTop: Platform.OS === 'ios' ? 50 : SIZES.SPACING.MEDIUM,
    paddingBottom: SIZES.SPACING.MEDIUM,
    width: '100%',
  },
  headerTitle: {
    fontSize: SIZES.FONT.LARGE,
    fontWeight: '600',
    color: 'white',
  },
  backButton: {
    padding: SIZES.SPACING.XSMALL,
  },
  postButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: SIZES.SPACING.MEDIUM,
    paddingVertical: SIZES.SPACING.XSMALL,
  },
  postButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: SIZES.FONT.SMALL,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.SPACING.MEDIUM,
    backgroundColor: COLORS.CARD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: SIZES.SPACING.SMALL,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: SIZES.FONT.MEDIUM,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  authorUsername: {
    fontSize: SIZES.FONT.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  contentInput: {
    minHeight: 150,
    fontSize: SIZES.FONT.MEDIUM,
    padding: SIZES.SPACING.MEDIUM,
    color: COLORS.TEXT,
    backgroundColor: COLORS.CARD,
    lineHeight: 24,
  },
  charCount: {
    textAlign: 'right',
    paddingRight: SIZES.SPACING.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    fontSize: SIZES.FONT.XSMALL,
    marginTop: SIZES.SPACING.XSMALL,
  },
  imagePreviewContainer: {
    margin: SIZES.SPACING.MEDIUM,
    borderRadius: SIZES.RADIUS.MEDIUM,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  previewImage: {
    width: '100%',
    height: 200,
  },
  removeImageButton: {
    position: 'absolute',
    top: SIZES.SPACING.SMALL,
    right: SIZES.SPACING.SMALL,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  selectedHashtagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SIZES.SPACING.SMALL,
    paddingVertical: SIZES.SPACING.XSMALL,
    borderRadius: SIZES.RADIUS.SMALL,
    marginHorizontal: SIZES.SPACING.MEDIUM,
    marginBottom: SIZES.SPACING.SMALL,
    alignSelf: 'flex-start',
  },
  selectedHashtag: {
    color: 'white',
    fontWeight: '600',
    marginRight: SIZES.SPACING.XSMALL,
    fontSize: SIZES.FONT.SMALL,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SIZES.SPACING.MEDIUM,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    backgroundColor: COLORS.CARD,
    marginTop: SIZES.SPACING.MEDIUM,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.SPACING.XSMALL,
    borderRadius: SIZES.RADIUS.SMALL,
    paddingHorizontal: SIZES.SPACING.SMALL,
  },
  actionButtonText: {
    marginLeft: SIZES.SPACING.XSMALL,
    color: COLORS.PRIMARY,
    fontWeight: '500',
    fontSize: SIZES.FONT.SMALL,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.CARD,
    borderRadius: SIZES.RADIUS.MEDIUM,
    width: width - 40,
    maxHeight: '60%',
    padding: SIZES.SPACING.MEDIUM,
  },
  emojiModalContainer: {
    backgroundColor: COLORS.CARD,
    borderRadius: SIZES.RADIUS.MEDIUM,
    width: width - 40,
    height: '100%',
    padding: SIZES.SPACING.MEDIUM,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.SPACING.MEDIUM,
  },
  modalTitle: {
    fontSize: SIZES.FONT.LARGE,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  modalSubtitle: {
    fontSize: SIZES.FONT.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SIZES.SPACING.MEDIUM,
  },
  hashtagList: {
    paddingBottom: SIZES.SPACING.MEDIUM,
  },
  hashtagItem: {
    paddingVertical: SIZES.SPACING.SMALL,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  hashtagText: {
    fontSize: SIZES.FONT.MEDIUM,
    color: COLORS.TEXT,
  },
  modalInput: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SIZES.RADIUS.SMALL,
    padding: SIZES.SPACING.MEDIUM,
    marginBottom: SIZES.SPACING.MEDIUM,
    fontSize: SIZES.FONT.MEDIUM,
    color: COLORS.TEXT,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  modalSubmitButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: SIZES.RADIUS.SMALL,
    padding: SIZES.SPACING.MEDIUM,
    alignItems: 'center',
    marginTop: SIZES.SPACING.MEDIUM,
  },
  modalSubmitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: SIZES.FONT.MEDIUM,
  },
});