

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   FlatList,
//   Modal,
//   Animated,
//   Dimensions,
//   Pressable,
//   Alert,
//   ActivityIndicator,
//   SafeAreaView,
//   StatusBar,
//   TextInput
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Iconn from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../../api_routing/api';
// import Video from 'react-native-video';
// import { useTheme } from '../src/context/ThemeContext';

// const { height, width } = Dimensions.get('window');

// const UserProfile = ({ route }) => {
//   const {colors, theme} = useTheme();
//   const navigation = useNavigation();
//   const [selectedTab, setSelectedTab] = useState('marketplace');
//   const [marketplacePosts, setMarketplacePosts] = useState([]);
//   const [tweets, setTweets] = useState([]);
//   const [userVideos, setUserVideos] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [playingVideo, setPlayingVideo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isOwnProfile, setIsOwnProfile] = useState(true);
//   const slideAnim = useRef(new Animated.Value(height)).current;
//   const videoRefs = useRef({});

//   const [userData, setUserData] = useState([]);
//   const [userProfileImage, setUserProfileImage] = useState('');
//   const [businessProfile, setBusinessProfile] = useState(null);
//   const [businessHours, setBusinessHours] = useState([]);
//   const [catalogData, setCatalogData] = useState([]);
//   const [showBusinessInfo, setShowBusinessInfo] = useState(false);
//   const [businessLoading, setBusinessLoading] = useState(false);

//   // New state for followers/following and editing
//   const [followStats, setFollowStats] = useState({
//     followers_count: 0,
//     following_count: 0,
//     followers: [],
//     following: []
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({
//     name: '',
//     email: '',
//     country: '',
//     active_mode: 'personal'
//   });
//   const [profileLoading, setProfileLoading] = useState(false);

//   // Check if viewing own profile or other user's profile
//   useEffect(() => {
//     const checkProfileOwnership = async () => {
//       if (route.params?.userId) {
//         const currentUserId = await AsyncStorage.getItem('userId');
//         setIsOwnProfile(route.params.userId === currentUserId);
//       }
//     };
//     checkProfileOwnership();
//   }, [route.params]);

//   const fetchUserData = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const json = await AsyncStorage.getItem('userData');
//       const parsed = json ? JSON.parse(json) : null;

//       if (!token || !parsed?.id) return null;

//       const response = await axios.get(`${API_ROUTE}/user/${parsed.id}/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         setUserData(response.data);
//         setEditForm({
//           name: response.data.name || '',
//           email: response.data.email || '',
//           country: response.data.country || '',
//           active_mode: response.data.active_mode || 'personal'
//         });
//         const baseURL = `${API_ROUTE_IMAGE}`;
//         const profilePicture = response.data.profile_picture
//           ? `${baseURL}${response.data.profile_picture}`
//           : null;
//         setUserProfileImage(profilePicture);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         navigation.navigate('Login');
//       }
//       setUserProfileImage(null);
//     }
//   };

//   // Fetch follow stats
//   const fetchFollowStats = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const userId = isOwnProfile ? null : route.params?.userId;
      
//       let endpoint;
//       if (isOwnProfile) {
//         endpoint = `${API_ROUTE}/me/follow-stats/`;
//       } else {
//         endpoint = `${API_ROUTE}/users/${route.params?.userId}/follow-stats/`;
//       }

//       const response = await axios.get(endpoint, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         setFollowStats(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching follow stats:', error.response?.data || error.message);
//       setFollowStats({
//         followers_count: 0,
//         following_count: 0,
//         followers: [],
//         following: []
//       });
//     }
//   };

//   // Update user profile
//   const updateUserProfile = async () => {
//     try {
//       setProfileLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
//       const formData = new FormData();
      
//       // Append text fields
//       Object.keys(editForm).forEach(key => {
//         if (editForm[key] !== undefined && editForm[key] !== null) {
//           formData.append(key, editForm[key]);
//         }
//       });

//       const response = await axios.patch(`${API_ROUTE}/me/profile/update/`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.status === 200) {
//         setUserData(response.data);
//         setIsEditing(false);
//         Alert.alert('Success', 'Profile updated successfully');
        
//         // Update AsyncStorage with new data
//         const updatedUserData = {
//           ...JSON.parse(await AsyncStorage.getItem('userData')),
//           ...response.data
//         };
//         await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error.response?.data || error.message);
//       Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   // Follow/Unfollow user
//   const handleFollow = async (userId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.post(`${API_ROUTE}/follow/`, {
//         following_user: userId,
//         follow_type: 'user'
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 201) {
//         fetchFollowStats(); // Refresh follow stats
//         Alert.alert('Success', 'User followed successfully');
//       }
//     } catch (error) {
//       console.error('Error following user:', error.response?.data || error.message);
//       Alert.alert('Error', error.response?.data?.message || 'Failed to follow user');
//     }
//   };

//   const handleUnfollow = async (followId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.delete(`${API_ROUTE}/follow/${followId}/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       fetchFollowStats(); // Refresh follow stats
//       Alert.alert('Success', 'User unfollowed successfully');
//     } catch (error) {
//       console.error('Error unfollowing user:', error.response?.data || error.message);
//       Alert.alert('Error', error.response?.data?.message || 'Failed to unfollow user');
//     }
//   };

//   // Check if current user is following this profile
//   const isFollowing = () => {
//     return followStats.following.some(follow => 
//       follow.following_user.id === route.params?.userId
//     );
//   };

//   // Fetch business profile data
//   const fetchBusinessProfile = async () => {
//     try {
//       setBusinessLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/profiles/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200 || response.status === 201) {
//         const profile = Array.isArray(response.data) ? response.data[0] : response.data;
//         setBusinessProfile(profile);
        
//         if (profile.id) {
//           await fetchBusinessHours(profile.id);
//           await fetchBusinessCatalog();
//         }
        
//         setShowBusinessInfo(!!(profile.name || profile.description));
//       } else {
//         setBusinessProfile(null);
//         setShowBusinessInfo(false);
//       }
//     } catch (err) {
//       console.error('Failed to load business profile', err);
//       setBusinessProfile(null);
//       setShowBusinessInfo(false);
//     } finally {
//       setBusinessLoading(false);
//     }
//   };

//   const fetchBusinessHours = async (profileId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const res = await fetch(`${API_ROUTE}/business-hours/${profileId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setBusinessHours(data || []);
//     } catch (err) {
//       console.error('Error fetching business hours:', err);
//       setBusinessHours([]);
//     }
//   };

//   const fetchBusinessCatalog = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await axios.get(`${API_ROUTE}/catalogs/my/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         setCatalogData(response.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching catalog:', error);
//       setCatalogData([]);
//     }
//   };

//   const fetchMarketplace = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const userId = isOwnProfile ? null : route.params?.userId;
//       const endpoint = userId ? `${API_ROUTE}/user-listings/${userId}/` : `${API_ROUTE}/my-listings/`;
      
//       const res = await axios.get(endpoint, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMarketplacePosts(res.data || []);
//     } catch (error) {
//       setMarketplacePosts([]);
//       console.error('Error fetching marketplace posts:', error);
//     }
//   };

//   const fetchTweets = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const userId = isOwnProfile ? null : route.params?.userId;
//       const endpoint = userId ? `${API_ROUTE}/user-posts/${userId}/` : `${API_ROUTE}/my-posts/`;
      
//       const res = await axios.get(endpoint, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setTweets(res.data || []);
//     } catch (error) {
//       setTweets([]);
//       console.error('Error fetching tweets:', error);
//     }
//   };

//   const fetchVideos = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const userId = isOwnProfile ? null : route.params?.userId;
//       const endpoint = userId ? `${API_ROUTE}/user-shorts/${userId}/` : `${API_ROUTE}/my-shorts/`;
      
//       const res = await axios.get(endpoint, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUserVideos(res.data || []);
//     } catch (error) {
//       setUserVideos([]);
//       console.error('Error fetching videos:', error);
//     }
//   };

//   // Refresh data when screen comes into focus
//   useFocusEffect(
//     React.useCallback(() => {
//       const fetchData = async () => {
//         setLoading(true);
//         await fetchUserData();
//         await fetchFollowStats();
//         if (isOwnProfile) {
//           await fetchBusinessProfile();
//         }
//         await Promise.all([fetchMarketplace(), fetchTweets(), fetchVideos()]);
//         setLoading(false);
//       };
//       fetchData();
//     }, [isOwnProfile, route.params?.userId])
//   );

//   const confirmDelete = (type, id) => {
//     Alert.alert(
//       "Confirm Delete",
//       "Are you sure you want to delete this item?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Delete", 
//           onPress: () => handleDelete(type, id),
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const handleDelete = async (type, id) => {
//     const token = await AsyncStorage.getItem('userToken');
//     try {
//       let endpoint = '';
//       if (type === 'marketplace') {
//         endpoint = `${API_ROUTE}/my-listings/${id}/`;
//       } else if (type === 'tweets') {
//         endpoint = `${API_ROUTE}/my-posts/${id}/`;
//       } else {
//         endpoint = `${API_ROUTE}/my-shorts/${id}/`;
//       }

//       await axios.delete(endpoint, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (type === 'marketplace') {
//         fetchMarketplace();
//       } else if (type === 'tweets') {
//         fetchTweets();
//       } else {
//         fetchVideos();
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to delete item");
//     }
//     toggleModal();
//   };

//   const toggleModal = (item = null) => {
//     setSelectedItem(item);
//     if (item) {
//       setModalVisible(true);
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(slideAnim, {
//         toValue: height,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => setModalVisible(false));
//     }
//   };

//   const toggleVideoPlayback = (id) => {
//     if (playingVideo === id) {
//       setPlayingVideo(null);
//     } else {
//       setPlayingVideo(id);
//     }
//   };

//   // Navigation to followers/following screens
//   const navigateToFollowers = () => {
//     navigation.navigate('Followers', { 
//       userId: isOwnProfile ? null : route.params?.userId,
//       followers: followStats.followers 
//     });
//   };

//   const navigateToFollowing = () => {
//     navigation.navigate('Following', { 
//       userId: isOwnProfile ? null : route.params?.userId,
//       following: followStats.following 
//     });
//   };

//   const handleBusinessAction = (action) => {
//     if (action === 'contact') {
//       if (businessProfile.phone) {
//         Alert.alert('Contact Business', `Call ${businessProfile.phone}?`, [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Call', onPress: () => console.log('Calling:', businessProfile.phone) }
//         ]);
//       } else if (businessProfile.email) {
//         Alert.alert('Contact Business', `Email ${businessProfile.email}?`, [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Email', onPress: () => console.log('Emailing:', businessProfile.email) }
//         ]);
//       }
//     } else if (action === 'website' && businessProfile.website) {
//       Alert.alert('Visit Website', `Open ${businessProfile.website}?`, [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Open', onPress: () => console.log('Opening:', businessProfile.website) }
//       ]);
//     }
//   };

//   const navigateToBusinessProfile = () => {
//     if (businessProfile) {
//       navigation.navigate('BusinessProfileScreen');
//     }
//   };

//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <Icon name="document-text-outline" size={60} color="#d1d5db" />
//       <Text style={styles.emptyText}>
//         {isOwnProfile 
//           ? "You haven't posted anything yet. Create your first post and start sharing!" 
//           : "This user hasn't posted anything yet."}
//       </Text>
//     </View>
//   );

//   const currentData = () => {
//     switch(selectedTab) {
//       case 'marketplace': return marketplacePosts;
//       case 'tweets': return tweets;
//       case 'videos': return userVideos;
//       default: return [];
//     }
//   };

//   // Render Edit Profile Form
//   const renderEditForm = () => (
//     <View style={styles.editForm}>
//       <Text style={styles.editTitle}>Edit Profile</Text>
      
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Name</Text>
//         <TextInput
//           style={styles.input}
//           value={editForm.name}
//           onChangeText={(text) => setEditForm({...editForm, name: text})}
//           placeholder="Enter your name"
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Email</Text>
//         <TextInput
//           style={styles.input}
//           value={editForm.email}
//           onChangeText={(text) => setEditForm({...editForm, email: text})}
//           placeholder="Enter your email"
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Country</Text>
//         <TextInput
//           style={styles.input}
//           value={editForm.country}
//           onChangeText={(text) => setEditForm({...editForm, country: text})}
//           placeholder="Enter your country"
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Active Mode</Text>
//         <View style={styles.radioGroup}>
//           <TouchableOpacity
//             style={styles.radioOption}
//             onPress={() => setEditForm({...editForm, active_mode: 'personal'})}
//           >
//             <View style={styles.radio}>
//               {editForm.active_mode === 'personal' && <View style={styles.radioSelected} />}
//             </View>
//             <Text style={styles.radioText}>Personal</Text>
//           </TouchableOpacity>
          
//         </View>
//       </View>

//       <View style={styles.editActions}>
//         <TouchableOpacity 
//           style={styles.cancelButton}
//           onPress={() => setIsEditing(false)}
//         >
//           <Text style={styles.cancelButtonText}>Cancel</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.saveButton, profileLoading && styles.saveButtonDisabled]}
//           onPress={updateUserProfile}
//           disabled={profileLoading}
//         >
//           {profileLoading ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <Text style={styles.saveButtonText}>Save Changes</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   // Render Business Info Section
//   const renderBusinessInfo = () => {
//     if (!showBusinessInfo || !businessProfile) return null;

//     return (
//       <View style={styles.businessContainer}>
//         <TouchableOpacity onPress={navigateToBusinessProfile} activeOpacity={0.9}>
//           <View style={styles.businessHeader}>
//             <Text style={styles.businessTitle}>Business Information</Text>
//             {businessProfile.logo && (
//               <Image 
//                 source={{ uri: `${API_ROUTE_IMAGE}${businessProfile.logo}` }} 
//                 style={styles.businessLogo}
//               />
//             )}
//           </View>

//           {businessProfile.name && (
//             <Text style={styles.businessName}>{businessProfile.name}</Text>
//           )}

//           {businessProfile.categories?.length > 0 && (
//             <View style={styles.businessCategory}>
//               <Icon name="business-outline" size={16} color="#666" />
//               <Text style={styles.categoryText}>
//                 {businessProfile.categories.map(cat => cat.name).join(', ')}
//               </Text>
//             </View>
//           )}

//           {businessProfile.description && (
//             <Text style={styles.businessDescription} numberOfLines={3}>
//               {businessProfile.description}
//             </Text>
//           )}

//           {businessHours.length > 0 && (
//             <View style={styles.businessHours}>
//               <Text style={styles.sectionSubtitle}>Business Hours</Text>
//               {businessHours.slice(0, 3).map((hour, idx) => (
//                 <Text key={idx} style={styles.hourText}>
//                   {hour.day}: {hour.open_time} - {hour.close_time}
//                 </Text>
//               ))}
//               {businessHours.length > 3 && (
//                 <Text style={styles.moreText}>+{businessHours.length - 3} more days</Text>
//               )}
//             </View>
//           )}

//           {catalogData.length > 0 && (
//             <View style={styles.productsPreview}>
//               <Text style={styles.sectionSubtitle}>Products ({catalogData.length})</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
//                 {catalogData.slice(0, 5).map((item, index) => (
//                   <View key={index} style={styles.productItem}>
//                     <Image
//                       source={{ uri: `${API_ROUTE_IMAGE}${item.image}` }}
//                       style={styles.productImage}
//                       resizeMode="cover"
//                     />
//                     <Text style={styles.productName} numberOfLines={1}>
//                       {item.name}
//                     </Text>
//                     <Text style={styles.productPrice}>
//                       ₦{parseFloat(item.price).toFixed(2)}
//                     </Text>
//                   </View>
//                 ))}
//               </ScrollView>
//             </View>
//           )}

//           <View style={styles.contactInfo}>
//             {businessProfile.address && (
//               <View style={styles.contactItem}>
//                 <Icon name="location-outline" size={16} color="#666" />
//                 <Text style={styles.contactText}>{businessProfile.address}</Text>
//               </View>
//             )}
            
//             {businessProfile.email && (
//               <View style={styles.contactItem}>
//                 <Icon name="mail-outline" size={16} color="#666" />
//                 <Text style={styles.contactText}>{businessProfile.email}</Text>
//               </View>
//             )}
            
//             {businessProfile.phone && (
//               <View style={styles.contactItem}>
//                 <Icon name="call-outline" size={16} color="#666" />
//                 <Text style={styles.contactText}>{businessProfile.phone}</Text>
//               </View>
//             )}
            
//             {businessProfile.website && (
//               <View style={styles.contactItem}>
//                 <Icon name="globe-outline" size={16} color="#666" />
//                 <Text style={[styles.contactText, styles.websiteText]}>
//                   {businessProfile.website}
//                 </Text>
//               </View>
//             )}
//           </View>

//           <View style={styles.businessActions}>
//             <TouchableOpacity 
//               style={styles.businessButton}
//               onPress={() => handleBusinessAction('contact')}
//             >
//               <Icon name="call-outline" size={18} color="#fff" />
//               <Text style={styles.businessButtonText}>Contact Business</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={[styles.businessButton, styles.secondaryButton]}
//               onPress={() => handleBusinessAction('website')}
//             >
//               <Icon name="navigate-outline" size={18} color="#0d64dd" />
//               <Text style={[styles.businessButtonText, styles.secondaryButtonText]}>
//                 Visit Website
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const renderMarketplacePost = ({ item }) => (
//     <View style={styles.card}>
//       <Image 
//         source={{ uri: item.images?.[0]?.image }} 
//         style={styles.postImage}
//       />
//       <View style={styles.postContent}>
//         <View style={styles.postHeader}>
//           <Text style={styles.postTitle}>{item.title}</Text>
//           {isOwnProfile && (
//             <TouchableOpacity onPress={() => toggleModal(item)}>
//               <Icon name="ellipsis-vertical" size={20} color="#7f8c8d" />
//             </TouchableOpacity>
//           )}
//         </View>
//         <Text style={styles.postPrice}>${item.price}</Text>
//         <Text style={styles.postDate}>{item.date}</Text>
//       </View>
//     </View>
//   );

//   const renderTweet = ({ item }) => (
//     <View style={styles.card}>
//       {item.image && (
//         <Image source={{ uri: item.image }} style={styles.postImage} />
//       )}
//       <View style={styles.postContent}>
//         <View style={styles.postHeader}>
//           <Text style={styles.postText} numberOfLines={3}>{item.content}</Text>
//           {isOwnProfile && (
//             <TouchableOpacity onPress={() => toggleModal(item)}>
//               <Icon name="ellipsis-vertical" size={20} color="#7f8c8d" />
//             </TouchableOpacity>
//           )}
//         </View>
//         <View style={styles.postStats}>
//           <Text style={styles.postStat}>{item.likes} likes</Text>
//           <Text style={styles.postStat}>{item.comments} comments</Text>
//           <Text style={styles.postDate}>{item.date}</Text>
//         </View>
//       </View>
//     </View>
//   );

//   const renderVideo = ({ item }) => (
//     <View style={styles.card}>
//       <TouchableOpacity 
//         activeOpacity={0.9}
//         onPress={() => toggleVideoPlayback(item.id)}
//         style={styles.videoContainer}
//       >
//         <Video
//           ref={(ref) => (videoRefs.current[item.id] = ref)}
//           source={{ uri: item.video }}
//           style={styles.postImage}
//           resizeMode="cover"
//           paused={playingVideo !== item.id}
//           repeat={true}
//           onError={(error) => console.log('Video error:', error)}
//         />
//         {playingVideo !== item.id && (
//           <View style={styles.playButton}>
//             <Icon name="play" size={48} color="rgba(255,255,255,0.8)" />
//           </View>
//         )}
//       </TouchableOpacity>
//       <View style={styles.postContent}>
//         <View style={styles.postHeader}>
//           <Text style={styles.postTitle}>{item.caption}</Text>
//           {isOwnProfile && (
//             <TouchableOpacity onPress={() => toggleModal(item)}>
//               <Icon name="ellipsis-vertical" size={20} color="#7f8c8d" />
//             </TouchableOpacity>
//           )}
//         </View>
//         <View style={styles.postStats}>
//           <Text style={styles.postStat}>{item.like_count} likes</Text>
//           <Text style={styles.postStat}>{item.comment_count} comments</Text>
//           <Text style={styles.postDate}>
//             {new Date(item.created_at).toLocaleDateString()}
//           </Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="#333" />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle,{color:'#333'}]}>Profile</Text>
//         {isOwnProfile && !isEditing && (
//           <TouchableOpacity 
//             style={styles.editButton}
//             onPress={() => setIsEditing(true)}
//           >
//             <Icon name="create-outline" size={22} color="#333" />
//           </TouchableOpacity>
//         )}
//         {isEditing && (
//           <TouchableOpacity 
//             style={styles.editButton}
//             onPress={() => setIsEditing(false)}
//           >
//             <Icon name="close" size={24} color="#333" />
//           </TouchableOpacity>
//         )}
//       </View>

//       <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
//         {/* Profile Section */}
//         {userData && userData.id && (
//           <View style={styles.profileContainer}>
//             {isEditing ? (
//               renderEditForm()
//             ) : (
//               <>
//                 <Image
//                   source={
//                     userProfileImage
//                       ? { uri: userProfileImage }
//                       : require('../../assets/images/dad.jpg')
//                   }
//                   style={styles.profileImage}
//                 />
//                 <Text style={styles.contactName}>{userData.name}</Text>
//                 <Text style={styles.contactPhone}>{userData.phone}</Text>
                
//                 {/* Business Badge */}
//                 {showBusinessInfo && (
//                   <View style={styles.businessBadge}>
//                     <Icon name="business" size={16} color="#fff" />
//                     <Text style={styles.businessBadgeText}>Business Account</Text>
//                   </View>
//                 )}
                
//                 {/* Following/Followers Section */}
//                 <View style={styles.statsContainer}>
//                   <TouchableOpacity style={styles.statItem} onPress={navigateToFollowing}>
//                     <Text style={styles.statNumber}>{followStats.following_count}</Text>
//                     <Text style={styles.statLabel}>Following</Text>
//                   </TouchableOpacity>
//                   <View style={styles.statDivider} />
//                   <TouchableOpacity style={styles.statItem} onPress={navigateToFollowers}>
//                     <Text style={styles.statNumber}>{followStats.followers_count}</Text>
//                     <Text style={styles.statLabel}>Followers</Text>
//                   </TouchableOpacity>
//                   <View style={styles.statDivider} />
//                   <TouchableOpacity style={styles.statItem}>
//                     <Text style={styles.statNumber}>{currentData().length}</Text>
//                     <Text style={styles.statLabel}>Posts</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Follow Button for other users */}
//                 {!isOwnProfile && (
//                   <TouchableOpacity 
//                     style={[
//                       styles.followButton,
//                       isFollowing() ? styles.unfollowButton : styles.followButtonActive
//                     ]}
//                     onPress={() => {
//                       const follow = followStats.following.find(f => f.following_user.id === route.params?.userId);
//                       if (isFollowing()) {
//                         handleUnfollow(follow?.id);
//                       } else {
//                         handleFollow(route.params?.userId);
//                       }
//                     }}
//                   >
//                     <Text style={[
//                       styles.followButtonText,
//                       isFollowing() && styles.unfollowButtonText
//                     ]}>
//                       {isFollowing() ? 'Unfollow' : 'Follow'}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               </>
//             )}
//           </View>
//         )}

//         {/* Business Information Section */}
//         {isOwnProfile && businessLoading ? (
//           <View style={styles.businessLoading}>
//             <ActivityIndicator size="small" color="#0d64dd" />
//             <Text style={styles.loadingText}>Loading business information...</Text>
//           </View>
//         ) : (
//           isOwnProfile && renderBusinessInfo()
//         )}

//         {/* Quick Actions */}
//         {isOwnProfile && !isEditing && (
//           <View style={styles.quickActions}>
//             <TouchableOpacity style={styles.quickAction}>
//               <Iconn style={styles.quickActionIcon} name="message" size={24} color="#fff" />
//               <Text style={styles.quickActionText}>Message</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.quickAction}>
//               <Icon style={styles.quickActionIcon} name="call" size={24} color="#fff" />
//               <Text style={styles.quickActionText}>Call</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.quickAction}>
//               <Icon style={styles.quickActionIcon} name="notifications-off" size={24} color="#fff" />
//               <Text style={styles.quickActionText}>Mute</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* Posts Section Header */}
//         {!isEditing && (
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>
//               {isOwnProfile ? 'Posts' : `${userData.name}'s Posts`}
//             </Text>
//           </View>
//         )}

//         {/* Tab Bar */}
//         {!isEditing && (
//           <View style={styles.tabContainer}>
//             <TouchableOpacity 
//               onPress={() => {
//                 setSelectedTab('marketplace');
//                 setPlayingVideo(null);
//               }} 
//               style={[styles.tab, selectedTab === 'marketplace' && styles.activeTab]}
//             >
//               <Icon 
//                 name="cart-outline" 
//                 size={20} 
//                 color={selectedTab === 'marketplace' ? '#fff' : '#0d64dd'} 
//               />
//               <Text style={[styles.tabText, selectedTab === 'marketplace' && styles.activeTabText]}>
//                 Marketplace
//               </Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               onPress={() => {
//                 setSelectedTab('tweets');
//                 setPlayingVideo(null);
//               }} 
//               style={[styles.tab, selectedTab === 'tweets' && styles.activeTab]}
//             >
//               <Icon 
//                 name="chatbubble-outline" 
//                 size={20} 
//                 color={selectedTab === 'tweets' ? '#fff' : '#0d64dd'} 
//               />
//               <Text style={[styles.tabText, selectedTab === 'tweets' && styles.activeTabText]}>
//                 Broadcast
//               </Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               onPress={() => {
//                 setSelectedTab('videos');
//               }} 
//               style={[styles.tab, selectedTab === 'videos' && styles.activeTab]}
//             >
//               <Icon 
//                 name="videocam-outline" 
//                 size={20} 
//                 color={selectedTab === 'videos' ? '#fff' : '#0d64dd'} 
//               />
//               <Text style={[styles.tabText, selectedTab === 'videos' && styles.activeTabText]}>
//                 Videos
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* Posts Content */}
//         {!isEditing && (loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#0d64dd" />
//           </View>
//         ) : currentData().length === 0 ? (
//           renderEmptyState()
//         ) : (
//           <FlatList
//             data={currentData()}
//             renderItem={
//               selectedTab === 'marketplace'
//                 ? renderMarketplacePost
//                 : selectedTab === 'tweets'
//                 ? renderTweet
//                 : renderVideo
//             }
//             keyExtractor={(item) => item.id.toString()}
//             contentContainerStyle={styles.listContent}
//             scrollEnabled={false}
//             showsVerticalScrollIndicator={false}
//           />
//         ))}
//       </ScrollView>

//       {/* Bottom Sheet Modal */}
//       <Modal
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={toggleModal}
//         animationType="none"
//       >
//         <View style={styles.modalOverlay}>
//           <Pressable 
//             style={styles.modalBackdrop} 
//             onPress={toggleModal}
//           />
          
//           <Animated.View 
//             style={[
//               styles.modalContainer,
//               { transform: [{ translateY: slideAnim }] }
//             ]}
//           >
//             <View style={styles.modalHandle} />
//             <Text style={styles.modalTitle}>Post Options</Text>
            
//             <TouchableOpacity 
//               style={styles.modalOption}
//               onPress={() => confirmDelete(selectedTab, selectedItem.id)}
//             >
//               <Icon name="trash-outline" size={24} color="#e74c3c" />
//               <Text style={[styles.modalOptionText, { color: '#e74c3c' }]}>Delete Post</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={styles.modalOption}
//               onPress={() => setModalVisible(false)}
//             >
//               <Icon name="close-circle-outline" size={24} color="#3498db" />
//               <Text style={styles.modalOptionText}>Cancel</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background 
//   },
//   scrollContainer: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: '#ffffffff',
//     paddingTop: 10,
//     marginBottom:20,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   iconButton: {
//     padding: 4,
//   },
//   editButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#fff',
//     fontFamily: 'Lato-Bold',
//   },
//   headerRight: {
//     width: 24,
//   },
//   profileContainer: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginTop: 60,
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 4,
//     borderColor: '#fff',
//     backgroundColor: '#eee',
//     marginTop: -60,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   contactName: {
//     marginTop: 16,
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#2c3e50',
//     fontFamily: 'Lato-Bold',
//   },
//   contactPhone: {
//     fontSize: 16,
//     color: '#6c757d',
//     marginBottom: 16,
//     fontFamily: 'Lato-Regular',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     width: '100%',
//     marginVertical: 16,
//     paddingHorizontal: 20,
//   },
//   statItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   statNumber: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     fontFamily: 'Lato-Bold',
//   },
//   statLabel: {
//     fontSize: 14,
//     color: '#6c757d',
//     marginTop: 4,
//     fontFamily: 'Lato-Regular',
//   },
//   statDivider: {
//     width: 1,
//     height: 30,
//     backgroundColor: '#e9ecef',
//   },
//   quickActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 20,
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginTop: 16,
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   quickAction: {
//     alignItems: 'center',
//   },
//   quickActionIcon: {
//     backgroundColor: '#0d64dd',
//     padding: 15,
//     borderRadius: 50,
//     shadowColor: '#0d64dd',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   quickActionText: {
//     marginTop: 8,
//     fontSize: 14,
//     color: '#2c3e50',
//     fontWeight: '600',
//     fontFamily: 'Lato-SemiBold',
//   },
//   sectionHeader: {
//     padding: 20,
//     paddingBottom: 10,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#2c3e50',
//     fontFamily: 'Lato-Bold',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginBottom: 16,
//     borderRadius: 12,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   tab: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     backgroundColor: 'transparent',
//   },
//   activeTab: {
//     backgroundColor: '#0d64dd',
//     shadowColor: '#0d64dd',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   tabText: {
//     marginLeft: 6,
//     color: '#0d64dd',
//     fontWeight: '600',
//     fontSize: 14,
//     fontFamily: 'Lato-SemiBold',
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   listContent: {
//     paddingHorizontal: 16,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     marginBottom: 16,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   postImage: {
//     width: '100%',
//     height: 200,
//     backgroundColor: '#f8f9fa',
//   },
//   videoContainer: {
//     position: 'relative',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playButton: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0,0,0,0.2)',
//   },
//   postContent: {
//     padding: 16,
//   },
//   postHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   postTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2c3e50',
//     flex: 1,
//     marginRight: 8,
//     fontFamily: 'Lato-SemiBold',
//   },
//   postText: {
//     fontSize: 15,
//     color: '#495057',
//     flex: 1,
//     marginRight: 8,
//     lineHeight: 22,
//     fontFamily: 'Lato-Regular',
//   },
//   postPrice: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#27ae60',
//     marginBottom: 4,
//     fontFamily: 'Lato-Bold',
//   },
//   postStats: {
//     flexDirection: 'row',
//     marginTop: 8,
//     flexWrap: 'wrap',
//   },
//   postStat: {
//     fontSize: 13,
//     color: '#6c757d',
//     marginRight: 16,
//     fontFamily: 'Lato-Regular',
//   },
//   postDate: {
//     fontSize: 12,
//     color: '#adb5bd',
//     fontFamily: 'Lato-Regular',
//   },
//   emptyContainer: {
//     padding: 40,
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     borderRadius: 16,
//     marginBottom: 16,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#6b7280',
//     textAlign: 'center',
//     marginTop: 16,
//     lineHeight: 22,
//     fontFamily: 'Lato-Regular',
//   },
//   loadingContainer: {
//     padding: 40,
//     alignItems: 'center',
//   },

//   // Edit Form Styles
//   editForm: {
//     width: '100%',
//   },
//   editTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#2c3e50',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   inputGroup: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#2c3e50',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     backgroundColor: '#fff',
//   },
//   radioGroup: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   radioOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   radio: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#0d64dd',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   radioSelected: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#0d64dd',
//   },
//   radioText: {
//     fontSize: 16,
//     color: '#2c3e50',
//   },
//   editActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   cancelButton: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: '#e0e0e0',
//     marginRight: 8,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: '#666',
//     fontWeight: '600',
//   },
//   saveButton: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: '#0d64dd',
//     marginLeft: 8,
//     alignItems: 'center',
//   },
//   saveButtonDisabled: {
//     backgroundColor: '#a0c0f0',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },

//   // Follow Button Styles
//   followButton: {
//     paddingHorizontal: 24,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginTop: 12,
//   },
//   followButtonActive: {
//     backgroundColor: '#0d64dd',
//   },
//   unfollowButton: {
//     backgroundColor: '#e0e0e0',
//   },
//   followButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   unfollowButtonText: {
//     color: '#666',
//   },

//   // Business Profile Styles
//   businessContainer: {
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginTop: 16,
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   businessHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   businessTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#2c3e50',
//     flex: 1,
//   },
//   businessLogo: {
//     width: 50,
//     height: 50,
//     borderRadius: 8,
//     marginLeft: 12,
//   },
//   businessName: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#2c3e50',
//     marginBottom: 8,
//   },
//   businessCategory: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   categoryText: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 6,
//   },
//   businessDescription: {
//     fontSize: 14,
//     color: '#555',
//     lineHeight: 20,
//     marginBottom: 16,
//   },
//   businessHours: {
//     marginBottom: 16,
//   },
//   sectionSubtitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2c3e50',
//     marginBottom: 8,
//   },
//   hourText: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 4,
//   },
//   moreText: {
//     fontSize: 12,
//     color: '#0d64dd',
//     fontStyle: 'italic',
//   },
//   productsPreview: {
//     marginBottom: 16,
//   },
//   productsScroll: {
//     marginTop: 8,
//   },
//   productItem: {
//     width: 100,
//     marginRight: 12,
//     alignItems: 'center',
//   },
//   productImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     marginBottom: 6,
//   },
//   productName: {
//     fontSize: 12,
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   productPrice: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#27ae60',
//   },
//   contactInfo: {
//     marginBottom: 16,
//   },
//   contactItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   contactText: {
//     fontSize: 14,
//     color: '#555',
//     marginLeft: 8,
//     flex: 1,
//   },
//   websiteText: {
//     color: '#0d64dd',
//   },
//   businessActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   businessButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#0d64dd',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginHorizontal: 4,
//   },
//   businessButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     marginLeft: 6,
//   },
//   secondaryButton: {
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: '#0d64dd',
//   },
//   secondaryButtonText: {
//     color: '#0d64dd',
//   },
//   businessBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#0d64dd',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginTop: 8,
//   },
//   businessBadgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   businessLoading: {
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginTop: 16,
//     borderRadius: 16,
//     padding: 20,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   loadingText: {
//     marginLeft: 12,
//     color: '#666',
//     fontSize: 14,
//   },
//   createBusinessPrompt: {
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginTop: 16,
//     borderRadius: 16,
//     padding: 24,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   promptTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#2c3e50',
//     marginTop: 12,
//     marginBottom: 8,
//   },
//   promptText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   createBusinessButton: {
//     backgroundColor: '#0d64dd',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//   },
//   createBusinessButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalBackdrop: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   modalContainer: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 24,
//     paddingBottom: 40,
//   },
//   modalHandle: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#2c3e50',
//     marginBottom: 24,
//     textAlign: 'center',
//     fontFamily: 'Lato-SemiBold',
//   },
//   modalOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   modalOptionText: {
//     fontSize: 16,
//     color: '#2c3e50',
//     marginLeft: 16,
//     fontFamily: 'Lato-Regular',
//   },
// });

// export default UserProfile;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
  Animated,
  Dimensions,
  Pressable,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../../api_routing/api';
import Video from 'react-native-video';
import { useTheme } from '../../src/context/ThemeContext';

const { height, width } = Dimensions.get('window');

const UserProfile = ({ route }) => {
  const { colors, theme } = useTheme(); 
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('marketplace');
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const videoRefs = useRef({});

  const [userData, setUserData] = useState([]);
  const [userProfileImage, setUserProfileImage] = useState('');
  const [businessProfile, setBusinessProfile] = useState(null);
  const [businessHours, setBusinessHours] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [businessLoading, setBusinessLoading] = useState(false);

  // New state for followers/following and editing
  const [followStats, setFollowStats] = useState({
    followers_count: 0,
    following_count: 0,
    followers: [],
    following: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    country: '',
    active_mode: 'personal'
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Create dynamic styles based on theme
  const styles = createStyles(colors);

  // Check if viewing own profile or other user's profile
  useEffect(() => {
    const checkProfileOwnership = async () => {
      if (route.params?.userId) {
        const currentUserId = await AsyncStorage.getItem('userId');
        setIsOwnProfile(route.params.userId === currentUserId);
      }
    };
    checkProfileOwnership();
  }, [route.params]);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await AsyncStorage.getItem('userData');
      const parsed = json ? JSON.parse(json) : null;

      if (!token || !parsed?.id) return null;

      const response = await axios.get(`${API_ROUTE}/user/${parsed.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setUserData(response.data);
        setEditForm({
          name: response.data.name || '',
          email: response.data.email || '',
          country: response.data.country || '',
          active_mode: response.data.active_mode || 'personal'
        });
        const baseURL = `${API_ROUTE_IMAGE}`;
        const profilePicture = response.data.profile_picture
          ? `${baseURL}${response.data.profile_picture}`
          : null;
        setUserProfileImage(profilePicture);
      }
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        navigation.navigate('Login');
      }
      setUserProfileImage(null);
    }
  };

  // Fetch follow stats
  const fetchFollowStats = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = isOwnProfile ? null : route.params?.userId;
      
      let endpoint;
      if (isOwnProfile) {
        endpoint = `${API_ROUTE}/me/follow-stats/`;
      } else {
        endpoint = `${API_ROUTE}/users/${route.params?.userId}/follow-stats/`;
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setFollowStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching follow stats:', error.response?.data || error.message);
      setFollowStats({
        followers_count: 0,
        following_count: 0,
        followers: [],
        following: []
      });
    }
  };

  // Update user profile
  const updateUserProfile = async () => {
    try {
      setProfileLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const formData = new FormData();
      
      // Append text fields
      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== undefined && editForm[key] !== null) {
          formData.append(key, editForm[key]);
        }
      });

      const response = await axios.patch(`${API_ROUTE}/me/profile/update/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setUserData(response.data);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
        
        // Update AsyncStorage with new data
        const updatedUserData = {
          ...JSON.parse(await AsyncStorage.getItem('userData')),
          ...response.data
        };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      }
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Follow/Unfollow user
  const handleFollow = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`${API_ROUTE}/follow/`, {
        following_user: userId,
        follow_type: 'user'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        fetchFollowStats(); // Refresh follow stats
        Alert.alert('Success', 'User followed successfully');
      }
    } catch (error) {
      console.error('Error following user:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to follow user');
    }
  };

  const handleUnfollow = async (followId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.delete(`${API_ROUTE}/follow/${followId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchFollowStats(); // Refresh follow stats
      Alert.alert('Success', 'User unfollowed successfully');
    } catch (error) {
      console.error('Error unfollowing user:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to unfollow user');
    }
  };

  // Check if current user is following this profile
  const isFollowing = () => {
    return followStats.following.some(follow => 
      follow.following_user.id === route.params?.userId
    );
  };

  // Fetch business profile data
  const fetchBusinessProfile = async () => {
    try {
      setBusinessLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        const profile = Array.isArray(response.data) ? response.data[0] : response.data;
        setBusinessProfile(profile);
        
        if (profile.id) {
          await fetchBusinessHours(profile.id);
          await fetchBusinessCatalog();
        }
        
        setShowBusinessInfo(!!(profile.name || profile.description));
      } else {
        setBusinessProfile(null);
        setShowBusinessInfo(false);
      }
    } catch (err) {
      console.error('Failed to load business profile', err);
      setBusinessProfile(null);
      setShowBusinessInfo(false);
    } finally {
      setBusinessLoading(false);
    }
  };

  const fetchBusinessHours = async (profileId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch(`${API_ROUTE}/business-hours/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBusinessHours(data || []);
    } catch (err) {
      console.error('Error fetching business hours:', err);
      setBusinessHours([]);
    }
  };

  const fetchBusinessCatalog = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/catalogs/my/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setCatalogData(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching catalog:', error);
      setCatalogData([]);
    }
  };

  const fetchMarketplace = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = isOwnProfile ? null : route.params?.userId;
      const endpoint = userId ? `${API_ROUTE}/user-listings/${userId}/` : `${API_ROUTE}/my-listings/`;
      
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMarketplacePosts(res.data || []);
    } catch (error) {
      setMarketplacePosts([]);
      console.error('Error fetching marketplace posts:', error);
    }
  };

  const fetchTweets = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = isOwnProfile ? null : route.params?.userId;
      const endpoint = userId ? `${API_ROUTE}/user-posts/${userId}/` : `${API_ROUTE}/my-posts/`;
      
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTweets(res.data || []);
    } catch (error) {
      setTweets([]);
      console.error('Error fetching tweets:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = isOwnProfile ? null : route.params?.userId;
      const endpoint = userId ? `${API_ROUTE}/user-shorts/${userId}/` : `${API_ROUTE}/my-shorts/`;
      
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserVideos(res.data || []);
    } catch (error) {
      setUserVideos([]);
      console.error('Error fetching videos:', error);
    }
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        await fetchUserData();
        await fetchFollowStats();
        if (isOwnProfile) {
          await fetchBusinessProfile();
        }
        await Promise.all([fetchMarketplace(), fetchTweets(), fetchVideos()]);
        setLoading(false);
      };
      fetchData();
    }, [isOwnProfile, route.params?.userId])
  );

  const confirmDelete = (type, id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => handleDelete(type, id),
          style: "destructive"
        }
      ]
    );
  };

  const handleDelete = async (type, id) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      let endpoint = '';
      if (type === 'marketplace') {
        endpoint = `${API_ROUTE}/my-listings/${id}/`;
      } else if (type === 'tweets') {
        endpoint = `${API_ROUTE}/my-posts/${id}/`;
      } else {
        endpoint = `${API_ROUTE}/my-shorts/${id}/`;
      }

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (type === 'marketplace') {
        fetchMarketplace();
      } else if (type === 'tweets') {
        fetchTweets();
      } else {
        fetchVideos();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete item");
    }
    toggleModal();
  };

  const toggleModal = (item = null) => {
    setSelectedItem(item);
    if (item) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  };

  const toggleVideoPlayback = (id) => {
    if (playingVideo === id) {
      setPlayingVideo(null);
    } else {
      setPlayingVideo(id);
    }
  };

  // Navigation to followers/following screens
  const navigateToFollowers = () => {
    navigation.navigate('Followers', { 
      userId: isOwnProfile ? null : route.params?.userId,
      followers: followStats.followers 
    });
  };

  const navigateToFollowing = () => {
    navigation.navigate('Following', { 
      userId: isOwnProfile ? null : route.params?.userId,
      following: followStats.following 
    });
  };

  const handleBusinessAction = (action) => {
    if (action === 'contact') {
      if (businessProfile.phone) {
        Alert.alert('Contact Business', `Call ${businessProfile.phone}?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => console.log('Calling:', businessProfile.phone) }
        ]);
      } else if (businessProfile.email) {
        Alert.alert('Contact Business', `Email ${businessProfile.email}?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Email', onPress: () => console.log('Emailing:', businessProfile.email) }
        ]);
      }
    } else if (action === 'website' && businessProfile.website) {
      Alert.alert('Visit Website', `Open ${businessProfile.website}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => console.log('Opening:', businessProfile.website) }
      ]);
    }
  };

  const navigateToBusinessProfile = () => {
    if (businessProfile) {
      navigation.navigate('BusinessProfileScreen');
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="document-text-outline" size={60} color={colors.textSecondary} />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {isOwnProfile 
          ? "You haven't posted anything yet. Create your first post and start sharing!" 
          : "This user hasn't posted anything yet."}
      </Text>
    </View>
  );

  const currentData = () => {
    switch(selectedTab) {
      case 'marketplace': return marketplacePosts;
      case 'tweets': return tweets;
      case 'videos': return userVideos;
      default: return [];
    }
  };

  // Render Edit Profile Form
  const renderEditForm = () => (
    <View style={styles.editForm}>
      <Text style={[styles.editTitle, { color: colors.text }]}>Edit Profile</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Name</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.inputBackground || colors.surface,
            color: colors.text,
            borderColor: colors.border 
          }]}
          value={editForm.name}
          onChangeText={(text) => setEditForm({...editForm, name: text})}
          placeholder="Enter your name"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.inputBackground || colors.surface,
            color: colors.text,
            borderColor: colors.border 
          }]}
          value={editForm.email}
          onChangeText={(text) => setEditForm({...editForm, email: text})}
          placeholder="Enter your email"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Country</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.inputBackground || colors.surface,
            color: colors.text,
            borderColor: colors.border 
          }]}
          value={editForm.country}
          onChangeText={(text) => setEditForm({...editForm, country: text})}
          placeholder="Enter your country"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Active Mode</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setEditForm({...editForm, active_mode: 'personal'})}
          >
            <View style={[styles.radio, { borderColor: colors.primary }]}>
              {editForm.active_mode === 'personal' && (
                <View style={[styles.radioSelected, { backgroundColor: colors.primary }]} />
              )}
            </View>
            <Text style={[styles.radioText, { color: colors.text }]}>Personal</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.editActions}>
        <TouchableOpacity 
          style={[styles.cancelButton, { backgroundColor: colors.buttonSecondary || '#e0e0e0' }]}
          onPress={() => setIsEditing(false)}
        >
          <Text style={[styles.cancelButtonText, { color: colors.buttonSecondaryText || '#666' }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.saveButton, 
            { backgroundColor: colors.primary },
            profileLoading && styles.saveButtonDisabled
          ]}
          onPress={updateUserProfile}
          disabled={profileLoading}
        >
          {profileLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render Business Info Section
  const renderBusinessInfo = () => {
    if (!showBusinessInfo || !businessProfile) return null;

    return (
      <View style={[styles.businessContainer, { backgroundColor: colors.card || colors.surface }]}>
        <TouchableOpacity onPress={navigateToBusinessProfile} activeOpacity={0.9}>
          <View style={styles.businessHeader}>
            <Text style={[styles.businessTitle, { color: colors.text }]}>Business Information</Text>
            {businessProfile.logo && (
              <Image 
                source={{ uri: `${API_ROUTE_IMAGE}${businessProfile.logo}` }} 
                style={styles.businessLogo}
              />
            )}
          </View>

          {businessProfile.name && (
            <Text style={[styles.businessName, { color: colors.text }]}>{businessProfile.name}</Text>
          )}

          {businessProfile.categories?.length > 0 && (
            <View style={styles.businessCategory}>
              <Icon name="business-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
                {businessProfile.categories.map(cat => cat.name).join(', ')}
              </Text>
            </View>
          )}

          {businessProfile.description && (
            <Text style={[styles.businessDescription, { color: colors.text }]} numberOfLines={3}>
              {businessProfile.description}
            </Text>
          )}

          {businessHours.length > 0 && (
            <View style={styles.businessHours}>
              <Text style={[styles.sectionSubtitle, { color: colors.text }]}>Business Hours</Text>
              {businessHours.slice(0, 3).map((hour, idx) => (
                <Text key={idx} style={[styles.hourText, { color: colors.text }]}>
                  {hour.day}: {hour.open_time} - {hour.close_time}
                </Text>
              ))}
              {businessHours.length > 3 && (
                <Text style={[styles.moreText, { color: colors.primary }]}>
                  +{businessHours.length - 3} more days
                </Text>
              )}
            </View>
          )}

          {catalogData.length > 0 && (
            <View style={styles.productsPreview}>
              <Text style={[styles.sectionSubtitle, { color: colors.text }]}>
                Products ({catalogData.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
                {catalogData.slice(0, 5).map((item, index) => (
                  <View key={index} style={styles.productItem}>
                    <Image
                      source={{ uri: `${API_ROUTE_IMAGE}${item.image}` }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={[styles.productPrice, { color: colors.success || '#27ae60' }]}>
                      ₦{parseFloat(item.price).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.contactInfo}>
            {businessProfile.address && (
              <View style={styles.contactItem}>
                <Icon name="location-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.contactText, { color: colors.text }]}>{businessProfile.address}</Text>
              </View>
            )}
            
            {businessProfile.email && (
              <View style={styles.contactItem}>
                <Icon name="mail-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.contactText, { color: colors.text }]}>{businessProfile.email}</Text>
              </View>
            )}
            
            {businessProfile.phone && (
              <View style={styles.contactItem}>
                <Icon name="call-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.contactText, { color: colors.text }]}>{businessProfile.phone}</Text>
              </View>
            )}
            
            {businessProfile.website && (
              <View style={styles.contactItem}>
                <Icon name="globe-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.contactText, styles.websiteText, { color: colors.primary }]}>
                  {businessProfile.website}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.businessActions}>
            <TouchableOpacity 
              style={[styles.businessButton, { backgroundColor: colors.primary }]}
              onPress={() => handleBusinessAction('contact')}
            >
              <Icon name="call-outline" size={18} color="#fff" />
              <Text style={styles.businessButtonText}>Contact Business</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.businessButton, styles.secondaryButton, { 
                borderColor: colors.primary,
                backgroundColor: 'transparent'
              }]}
              onPress={() => handleBusinessAction('website')}
            >
              <Icon name="navigate-outline" size={18} color={colors.primary} />
              <Text style={[styles.businessButtonText, styles.secondaryButtonText, { color: colors.primary }]}>
                Visit Website
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMarketplacePost = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.card || colors.surface }]}>
      <Image 
        source={{ uri: item.images?.[0]?.image }} 
        style={styles.postImage}
      />
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={[styles.postTitle, { color: colors.text }]}>{item.title}</Text>
          {isOwnProfile && (
            <TouchableOpacity onPress={() => toggleModal(item)}>
              <Icon name="ellipsis-vertical" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.postPrice, { color: colors.success || '#27ae60' }]}>${item.price}</Text>
        <Text style={[styles.postDate, { color: colors.textTertiary }]}>{item.date}</Text>
      </View>
    </View>
  );

  const renderTweet = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.card || colors.surface }]}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={[styles.postText, { color: colors.text }]} numberOfLines={3}>{item.content}</Text>
          {isOwnProfile && (
            <TouchableOpacity onPress={() => toggleModal(item)}>
              <Icon name="ellipsis-vertical" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.postStats}>
          <Text style={[styles.postStat, { color: colors.textSecondary }]}>{item.likes} likes</Text>
          <Text style={[styles.postStat, { color: colors.textSecondary }]}>{item.comments} comments</Text>
          <Text style={[styles.postDate, { color: colors.textTertiary }]}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

  const renderVideo = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.card || colors.surface }]}>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => toggleVideoPlayback(item.id)}
        style={styles.videoContainer}
      >
        <Video
          ref={(ref) => (videoRefs.current[item.id] = ref)}
          source={{ uri: item.video }}
          style={styles.postImage}
          resizeMode="cover"
          paused={playingVideo !== item.id}
          repeat={true}
          onError={(error) => console.log('Video error:', error)}
        />
        {playingVideo !== item.id && (
          <View style={styles.playButton}>
            <Icon name="play" size={48} color="rgba(255,255,255,0.8)" />
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={[styles.postTitle, { color: colors.text }]}>{item.caption}</Text>
          {isOwnProfile && (
            <TouchableOpacity onPress={() => toggleModal(item)}>
              <Icon name="ellipsis-vertical" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.postStats}>
          <Text style={[styles.postStat, { color: colors.textSecondary }]}>{item.like_count} likes</Text>
          <Text style={[styles.postStat, { color: colors.textSecondary }]}>{item.comment_count} comments</Text>
          <Text style={[styles.postDate, { color: colors.textTertiary }]}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card || colors.surface }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        {isOwnProfile && !isEditing && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Icon name="create-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        )}
        {isEditing && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(false)}
          >
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        style={[styles.scrollContainer, { backgroundColor: colors.background }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        {userData && userData.id && (
          <View style={[styles.profileContainer, { backgroundColor: colors.card || colors.surface }]}>
            {isEditing ? (
              renderEditForm()
            ) : (
              <>
                <Image
                  source={
                    userProfileImage
                      ? { uri: userProfileImage }
                      : require('../../assets/images/dad.jpg')
                  }
                  style={[styles.profileImage, { backgroundColor: colors.surface }]}
                />
                <Text style={[styles.contactName, { color: colors.text }]}>{userData.name}</Text>
                <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>{userData.phone}</Text>
                
                {/* Business Badge */}
                {showBusinessInfo && (
                  <View style={[styles.businessBadge, { backgroundColor: colors.primary }]}>
                    <Icon name="business" size={16} color="#fff" />
                    <Text style={styles.businessBadgeText}>Business Account</Text>
                  </View>
                )}
                
                {/* Following/Followers Section */}
                <View style={styles.statsContainer}>
                  <TouchableOpacity style={styles.statItem} onPress={navigateToFollowing}>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{followStats.following_count}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Following</Text>
                  </TouchableOpacity>
                  <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                  <TouchableOpacity style={styles.statItem} onPress={navigateToFollowers}>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{followStats.followers_count}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Followers</Text>
                  </TouchableOpacity>
                  <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                  <TouchableOpacity style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{currentData().length}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
                  </TouchableOpacity>
                </View>

                {/* Follow Button for other users */}
                {!isOwnProfile && (
                  <TouchableOpacity 
                    style={[
                      styles.followButton,
                      isFollowing() ? styles.unfollowButton : styles.followButtonActive,
                      { backgroundColor: isFollowing() ? colors.buttonSecondary : colors.primary }
                    ]}
                    onPress={() => {
                      const follow = followStats.following.find(f => f.following_user.id === route.params?.userId);
                      if (isFollowing()) {
                        handleUnfollow(follow?.id);
                      } else {
                        handleFollow(route.params?.userId);
                      }
                    }}
                  >
                    <Text style={[
                      styles.followButtonText,
                      { color: isFollowing() ? colors.buttonSecondaryText : '#fff' }
                    ]}>
                      {isFollowing() ? 'Unfollow' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}

        {/* Business Information Section */}
        {isOwnProfile && businessLoading ? (
          <View style={[styles.businessLoading, { backgroundColor: colors.card || colors.surface }]}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Loading business information...
            </Text>
          </View>
        ) : (
          isOwnProfile && renderBusinessInfo()
        )}

        {/* Quick Actions */}
        {isOwnProfile && !isEditing && (
          <View style={[styles.quickActions, { backgroundColor: colors.card || colors.surface }]}>
            <TouchableOpacity style={styles.quickAction}>
              <Iconn style={[styles.quickActionIcon, { backgroundColor: colors.primary }]} 
                name="message" size={24} color="#fff" />
              <Text style={[styles.quickActionText, { color: colors.text }]}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Icon style={[styles.quickActionIcon, { backgroundColor: colors.primary }]} 
                name="call" size={24} color="#fff" />
              <Text style={[styles.quickActionText, { color: colors.text }]}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Icon style={[styles.quickActionIcon, { backgroundColor: colors.primary }]} 
                name="notifications-off" size={24} color="#fff" />
              <Text style={[styles.quickActionText, { color: colors.text }]}>Mute</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Posts Section Header */}
        {!isEditing && (
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {isOwnProfile ? 'Posts' : `${userData.name}'s Posts`}
            </Text>
          </View>
        )}

        {/* Tab Bar */}
        {!isEditing && (
          <View style={[styles.tabContainer, { backgroundColor: colors.card || colors.surface }]}>
            <TouchableOpacity 
              onPress={() => {
                setSelectedTab('marketplace');
                setPlayingVideo(null);
              }} 
              style={[
                styles.tab, 
                selectedTab === 'marketplace' && [styles.activeTab, { backgroundColor: colors.primary }]
              ]}
            >
              <Icon 
                name="cart-outline" 
                size={20} 
                color={selectedTab === 'marketplace' ? '#fff' : colors.primary} 
              />
              <Text style={[
                styles.tabText, 
                { color: selectedTab === 'marketplace' ? '#fff' : colors.primary },
                selectedTab === 'marketplace' && styles.activeTabText
              ]}>
                Marketplace
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => {
                setSelectedTab('tweets');
                setPlayingVideo(null);
              }} 
              style={[
                styles.tab, 
                selectedTab === 'tweets' && [styles.activeTab, { backgroundColor: colors.primary }]
              ]}
            >
              <Icon 
                name="chatbubble-outline" 
                size={20} 
                color={selectedTab === 'tweets' ? '#fff' : colors.primary} 
              />
              <Text style={[
                styles.tabText, 
                { color: selectedTab === 'tweets' ? '#fff' : colors.primary },
                selectedTab === 'tweets' && styles.activeTabText
              ]}>
                Posts
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => {
                setSelectedTab('videos');
              }} 
              style={[
                styles.tab, 
                selectedTab === 'videos' && [styles.activeTab, { backgroundColor: colors.primary }]
              ]}
            >
              <Icon 
                name="videocam-outline" 
                size={20} 
                color={selectedTab === 'videos' ? '#fff' : colors.primary} 
              />
              <Text style={[
                styles.tabText, 
                { color: selectedTab === 'videos' ? '#fff' : colors.primary },
                selectedTab === 'videos' && styles.activeTabText
              ]}>
                Videos
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Posts Content */}
        {!isEditing && (loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : currentData().length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={currentData()}
            renderItem={
              selectedTab === 'marketplace'
                ? renderMarketplacePost
                : selectedTab === 'tweets'
                ? renderTweet
                : renderVideo
            }
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ))}
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
        animationType="none"
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop} 
            onPress={toggleModal}
          />
          
          <Animated.View 
            style={[
              styles.modalContainer,
              { transform: [{ translateY: slideAnim }], backgroundColor: colors.card || colors.surface }
            ]}
          >
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Post Options</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => confirmDelete(selectedTab, selectedItem.id)}
            >
              <Icon name="trash-outline" size={24} color="#e74c3c" />
              <Text style={[styles.modalOptionText, { color: '#e74c3c' }]}>Delete Post</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close-circle-outline" size={24} color={colors.primary} />
              <Text style={[styles.modalOptionText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 10,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconButton: {
    padding: 4,
  },
  editButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Lato-Bold',
  },
  headerRight: {
    width: 24,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 60,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    marginTop: -60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  contactName: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Lato-Bold',
  },
  contactPhone: {
    fontSize: 16,
    marginBottom: 16,
    fontFamily: 'Lato-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Lato-Regular',
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    padding: 15,
    borderRadius: 50,
    shadowColor: '#0d64dd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Lato-SemiBold',
  },
  sectionHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Lato-Bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  activeTab: {
    shadowColor: '#0d64dd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Lato-SemiBold',
  },
  activeTabText: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  videoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  postContent: {
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
    fontFamily: 'Lato-SemiBold',
  },
  postText: {
    fontSize: 15,
    flex: 1,
    marginRight: 8,
    lineHeight: 22,
    fontFamily: 'Lato-Regular',
  },
  postPrice: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: 'Lato-Bold',
  },
  postStats: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  postStat: {
    fontSize: 13,
    marginRight: 16,
    fontFamily: 'Lato-Regular',
  },
  postDate: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
    fontFamily: 'Lato-Regular',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },

  // Edit Form Styles
  editForm: {
    width: '100%',
  },
  editTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioText: {
    fontSize: 16,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Follow Button Styles
  followButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  followButtonActive: {},
  unfollowButton: {},
  followButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  unfollowButtonText: {},

  // Business Profile Styles
  businessContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  businessTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  businessLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginLeft: 12,
  },
  businessName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  businessCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    marginLeft: 6,
  },
  businessDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  businessHours: {
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  hourText: {
    fontSize: 14,
    marginBottom: 4,
  },
  moreText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  productsPreview: {
    marginBottom: 16,
  },
  productsScroll: {
    marginTop: 8,
  },
  productItem: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 6,
  },
  productName: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '600',
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  websiteText: {},
  businessActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  businessButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  businessButtonText: {
    fontWeight: '600',
    marginLeft: 6,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  secondaryButtonText: {},
  businessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  businessBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  businessLoading: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
  },
  createBusinessPrompt: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  createBusinessButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createBusinessButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Lato-SemiBold',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 16,
    fontFamily: 'Lato-Regular',
  },
});

export default UserProfile;