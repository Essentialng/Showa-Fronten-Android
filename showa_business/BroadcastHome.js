// import axios from 'axios';
// import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   FlatList,
//   RefreshControl,
//   Image,
//   Alert,
//   Share,
//   StatusBar,
//   SafeAreaView,
//   ImageBackground,
//   Dimensions,
//   Animated,
//   LayoutAnimation,
//   ActivityIndicator,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Icontt from 'react-native-vector-icons/MaterialCommunityIcons';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import { Snackbar } from 'react-native-paper';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import Icon from 'react-native-vector-icons/Ionicons';
// import colors from '../theme/colors';
// import Icont from 'react-native-vector-icons/MaterialIcons';
// import Video from 'react-native-video';
// import FriendSuggestion from '../components/FriendSuggestion';

// dayjs.extend(relativeTime);

// const { width, height } = Dimensions.get('window');

// // Cache configuration
// const POSTS_CACHE_KEY = 'posts_cache';
// const ALL_POSTS_CACHE_KEY = 'all_posts_cache';
// const VIEWS_CACHE_KEY = 'post_views_cache';
// const SHARES_CACHE_KEY = 'post_shares_cache';
// const CACHE_EXPIRATION_TIME = 5 * 60 * 1000;

// // Views tracking system - only count when image is opened in modal
// const trackPostView = async (postId) => {
//   try {
//     const viewsData = await AsyncStorage.getItem(VIEWS_CACHE_KEY);
//     const views = viewsData ? JSON.parse(viewsData) : {};
    
//     if (!views[postId]) {
//       views[postId] = {
//         count: 1,
//         timestamp: Date.now()
//       };
//     } else {
//       // Only count unique views per day
//       const lastViewTime = views[postId].timestamp;
//       const oneDay = 24 * 60 * 60 * 1000; // 24 hours
//       if (Date.now() - lastViewTime > oneDay) {
//         views[postId].count += 1;
//         views[postId].timestamp = Date.now();
//       }
//     }
    
//     await AsyncStorage.setItem(VIEWS_CACHE_KEY, JSON.stringify(views));
//     return views[postId].count;
//   } catch (error) {
//     console.error('Error tracking view:', error);
//     return 0;
//   }
// };

// const getPostViews = async (postId) => {
//   try {
//     const viewsData = await AsyncStorage.getItem(VIEWS_CACHE_KEY);
//     const views = viewsData ? JSON.parse(viewsData) : {};
//     return views[postId]?.count || 0;
//   } catch (error) {
//     console.error('Error getting views:', error);
//     return 0;
//   }
// };

// // Shares tracking system
// const trackPostShare = async (postId) => {
//   try {
//     const sharesData = await AsyncStorage.getItem(SHARES_CACHE_KEY);
//     const shares = sharesData ? JSON.parse(sharesData) : {};
    
//     if (!shares[postId]) {
//       shares[postId] = {
//         count: 1,
//         timestamp: Date.now()
//       };
//     } else {
//       shares[postId].count += 1;
//       shares[postId].timestamp = Date.now();
//     }
    
//     await AsyncStorage.setItem(SHARES_CACHE_KEY, JSON.stringify(shares));
//     return shares[postId].count;
//   } catch (error) {
//     console.error('Error tracking share:', error);
//     return 0;
//   }
// };

// const getPostShares = async (postId) => {
//   try {
//     const sharesData = await AsyncStorage.getItem(SHARES_CACHE_KEY);
//     const shares = sharesData ? JSON.parse(sharesData) : {};
//     return shares[postId]?.count || 0;
//   } catch (error) {
//     console.error('Error getting shares:', error);
//     return 0;
//   }
// };

// // Image Modal Component
// const ImageModal = memo(({ visible, post, onClose, onView }) => {
//   const [viewsCount, setViewsCount] = useState(post?.views || 0);

//   useEffect(() => {
//     if (visible && post?.id) {
//       const trackView = async () => {
//         const newCount = await trackPostView(post.id);
//         setViewsCount(newCount);
//         if (onView) onView(post.id, newCount);
//       };
//       trackView();
//     }
//   }, [visible, post?.id]);

//   if (!post) return null;

//   return (
//     <Modal visible={visible} transparent={true} animationType="fade">
//       <View style={styles.imageModalOverlay}>
//         <TouchableOpacity 
//           style={styles.imageModalCloseButton}
//           onPress={onClose}
//         >
//           <Icon name="close" size={30} color="#fff" />
//         </TouchableOpacity>
        
//         <View style={styles.imageModalContent}>
//           <Image
//             source={{ uri: `${API_ROUTE_IMAGE}${post.image}` }}
//             style={styles.fullSizeImage}
//             resizeMode="contain"
//           />
          
//           <View style={styles.imageModalInfo}>
//             <View style={styles.imageModalUserInfo}>
//               <Image
//                 source={
//                   post.user_profile_picture
//                     ? { uri: post.user_profile_picture }
//                     : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                 }
//                 style={styles.imageModalAvatar}
//               />
//               <View style={styles.imageModalUserText}>
//                 <Text style={styles.imageModalUsername}>{post.username}</Text>
//                 <Text style={styles.imageModalTime}>{dayjs(post.created_at).fromNow()}</Text>
//               </View>
//             </View>
            
//             <Text style={styles.imageModalCaption}>{post.content}</Text>
            
//             <View style={styles.imageModalStats}>
//               <View style={styles.imageModalStat}>
//                 <Ionicons name="eye-outline" size={16} color="#666" />
//                 <Text style={styles.imageModalStatText}>{viewsCount} views</Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// });

// // Memoized Tweet Item Component
// const MemoizedTweetItem = memo(({ post, type, onReaction, onComment, onShare, onFollow, onOptions, onViewImage }) => {
//   const [isReadMore, setIsReadMore] = useState(true);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [viewsCount, setViewsCount] = useState(post.views || 0);
//   const [sharesCount, setSharesCount] = useState(post.shares || 0);
//   const postIdStr = post.id?.toString();
//   const reactions = post.reactions || {};
//   const userReaction = reactions.user_reaction;

//   // Load initial counts
//   useEffect(() => {
//     const loadCounts = async () => {
//       const [views, shares] = await Promise.all([
//         getPostViews(post.id),
//         getPostShares(post.id)
//       ]);
//       setViewsCount(views);
//       setSharesCount(shares);
//     };
//     loadCounts();
//   }, [post.id]);

//   const handleFollowPress = () => {
//     setIsFollowing(true);
//     onFollow(post.user_id);
//   };

//   const handleSharePress = async () => {
//     const newSharesCount = await onShare(post.id);
//     setSharesCount(newSharesCount);
//   };

//   return (
//     <View style={styles.tweetContainer}>
//       <TouchableOpacity onPress={() => {}}>
//         <View style={styles.avatarContainer}>
//           <Image
//             source={
//               post.user_profile_picture
//                 ? { uri: post.user_profile_picture }
//                 : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//             }
//             style={styles.avatar}
//           />
//         </View>
//       </TouchableOpacity>
      
//       <View style={styles.tweetContent}>
//         <View style={styles.tweetHeader}>
//           <Text style={styles.name}>{post.username}</Text>
//           {post.is_verified && (
//             <View
//               style={{
//                 backgroundColor: "#1877F2", 
//                 borderRadius: 50,
//                 width: 16,
//                 height: 16,
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginLeft: 4,
//               }}
//             >
//               <Icontt name="check-bold" size={11} color="#fff" />
//             </View>
//           )}
//           {post.is_verified && (
//             <View
//               style={{
//                 backgroundColor: "green",
//                 borderRadius: 50,
//                 width: 16,
//                 height: 16,
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginLeft: 4,
//               }}
//             >
//               <Icontt name="check-bold" size={11} color="#fff" />
//             </View>
//           )}
//           <Text style={styles.dot}>·</Text>
//           <Text style={styles.time}>{dayjs(post.created_at).fromNow()}</Text>
          
//           {type === 'allposts' ? (
//             <TouchableOpacity
//               style={[styles.followButton, isFollowing && styles.followingButton]}
//               onPress={handleFollowPress}
//             >
//               <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
//                 {isFollowing ? 'Following' : 'Follow'}
//               </Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={styles.optionsButton}
//               onPress={() => onOptions(post.id, post.user_id)}
//             >
//               <Icon name="ellipsis-horizontal" size={18} color="#555" />
//             </TouchableOpacity>
//           )}
//         </View>
        
//         <Text style={styles.tweetText}>
//           {post.content.length > 150 ? (
//             <>
//               {isReadMore ? post.content.slice(0, 150) + '...' : post.content}
//               <Text style={styles.readMore} onPress={() => setIsReadMore(!isReadMore)}>
//                 {isReadMore ? ' Read more' : ' Show less'}
//               </Text>
//             </>
//           ) : (
//             post.content
//           )}
//         </Text>
        
//         {post && post.image && (
//           <TouchableOpacity onPress={() => onViewImage(post)}>
//             <Image
//               source={{ uri: `${API_ROUTE_IMAGE}${post.image}` }}
//               style={styles.tweetImage}
//             />
//           </TouchableOpacity>
//         )}
        
//         <View style={styles.tweetActions}>
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => onReaction(post.id, 'like')}
//           >
//             <MaterialIcons
//               name={userReaction === 'like' ? 'thumb-up' : 'thumb-up-off-alt'}
//               size={20}
//               color={userReaction === 'like' ? colors.primary : '#555'}
//             />
//             <Text style={styles.actionCount}>{reactions.like || ''} likes</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => onComment(post.id)}
//           >
//             <Ionicons name="chatbubble-outline" size={18} color="#555" />
//             <Text style={styles.actionCount}>{post.commentCount || ''}Comments</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.actionButton}
//             onPress={handleSharePress}
//           >
//             <Ionicons name="share-social-outline" size={18} color="#555" />
//             <Text style={styles.actionCount}>{sharesCount}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.actionButton}
//             onPress={() => onViewImage(post)}
//           >
//             <Ionicons name="eye-outline" size={18} color="#555" />
//             <Text style={styles.actionCount}>{viewsCount}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// });

// // Memoized Status Preview Component
// const MemoizedStatusPreview = memo(({ userStatus, currentUserPhone, onPress, onViewers, onDelete }) => {
//   const isVideo = userStatus.status_type === 'video';
//   const isMyStatus = userStatus.user?.phone === currentUserPhone || userStatus.user === currentUserPhone;
//   const url = userStatus.statuses[0]?.media;
//   const path_img = url?.replace(/^https?:\/\/[^/]+/, '');

//   return (
//     <View style={styles.statusWrapper}>
//       <TouchableOpacity onPress={onPress}>
//         <ImageBackground
//           source={{ 
//             uri: url
//               ? `${API_ROUTE_IMAGE}${path_img}`
//               : 'https://via.placeholder.com/40' 
//           }}
//           style={styles.statusImage}
//           imageStyle={styles.statusImageStyle}
//         >
//           {isVideo && (
//             <View style={styles.videoPlayIcon}>
//               <Icon name="play" size={24} color="#fff" />
//             </View>
//           )}
          
//           <View style={styles.statusNameContainer}>
//             <Text style={styles.statusNameText}>
//               {isMyStatus ? 'My Story' : userStatus.user?.name || userStatus.user}
//             </Text>
//             {isMyStatus && userStatus.viewers_count > 0 && (
//               <TouchableOpacity onPress={() => onViewers(userStatus.viewers)}>
//                 <Text style={styles.viewCountText}>
//                   {userStatus.viewers_count} view{userStatus.viewers_count !== 1 ? 's' : ''}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </ImageBackground>
//       </TouchableOpacity>
      
//       {isMyStatus && (
//         <TouchableOpacity 
//           style={styles.deleteStatusButton}
//           onPress={() => onDelete(userStatus.statuses[0]?.id)}
//         >
//           <Icon name="close" size={16} color="#fff" />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// });

// // Suggested Friend Component
// const SuggestedFriendItem = memo(({ item, onFollow }) => {
//   const [isFollowing, setIsFollowing] = useState(false);

//   const handleFollow = () => {
//     setIsFollowing(true);
//     onFollow(item.id);
//   };

//   return (
//     <View style={styles.suggestedFriendItem}>
//       <TouchableOpacity onPress={() => {}}>
//         <View style={styles.suggestedFriendImageContainer}>
//           <Image
//             source={
//               item.profile_picture
//                 ? { uri: `${API_ROUTE_IMAGE}${item.profile_picture}` }
//                 : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//             }
//             style={styles.suggestedFriendImage}
//           />
//           {item.is_verified && (
//             <View style={styles.suggestedFriendVerified}>
//               <Icont name="verified" size={12} color="#fff" />
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//       <Text style={styles.suggestedFriendName} numberOfLines={1}>
//         {item.username}
//       </Text>
//       {item.followers_count && (
//         <Text style={styles.suggestedFriendClub} numberOfLines={1}>
//           {item.followers_count} Followers
//         </Text>
//       )}
//       <TouchableOpacity
//         style={[styles.suggestedFriendFollowButton, isFollowing && styles.suggestedFriendFollowingButton]}
//         onPress={handleFollow}
//       >
//         <Text style={[styles.suggestedFriendFollowButtonText, isFollowing && styles.suggestedFriendFollowingButtonText]}>
//           {isFollowing ? 'Following' : 'Follow'}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// });

// export default function HomePage({ navigation }) {
  
//   const [reactionCounts, setReactionCounts] = useState({});
//   const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
//   const [isReplyBottomSheetVisible, setIsReplyBottomSheetVisible] = useState(false);
//   const [isOptionsBottomSheetVisible, setIsOptionsBottomSheetVisible] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState(null);
//   const [selectedCommentId, setSelectedCommentId] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const [postById, setPostById] = useState([]);
//   const [replyToCommentId, setReplyToCommentId] = useState(null);
//   const [replyText, setReplyText] = useState('');
//   const [posts, setPosts] = useState([]);
//   const [allposts, setAllPosts] = useState([]);
//   const [addStatusModalVisible, setAddStatusModalVisible] = useState(false);
//   const [username, setUsername] = useState('');
//   const [userId, setUserId] = useState('');
//   const [userPostWithID, setUsersSelectedPostId] = useState('');
//   const [userUID, setUserUid] = useState('');
//   const [userEmail, setUserEmail] = useState('');
//   const [userprofileimage, setUserProfileImage] = useState('');
//   const [snackbarVisible, setSnackbarVisible] = useState(false);
//   const [followedUsers, setFollowedUsers] = useState([]);
//   const [commentsss, setPostsComment] = useState([]);
//   const [commentLikesCount, setCommentLikesCount] = useState({});
//   const [refreshing, setRefreshing] = useState(false);
//   const [showSuggestedFriends, setShowSuggestedFriends] = useState(false);
//   const [suggestedFriends, setSuggestedFriends] = useState([]);
//   const [groupedStatuses, setGroupedStatuses] = useState([]);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [selectedUserStatuses, setSelectedUserStatuses] = useState([]);
//   const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
//   const [currentUserPhone, setCurrentUserPhone] = useState(null);
//   const [viewersModalVisible, setViewersModalVisible] = useState(false);
//   const [currentViewers, setCurrentViewers] = useState([]);
//   const [paused, setPaused] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [liveStreams, setLiveStreams] = useState([]);
//   const [loadingLiveStreams, setLoadingLiveStreams] = useState(false);
//   const [scrollCount, setScrollCount] = useState(0);
//   const [showLiveModal, setShowLiveModal] = useState(false);
//   const [postViews, setPostViews] = useState({});
//   const [selectedImagePost, setSelectedImagePost] = useState(null);
//   const [imageModalVisible, setImageModalVisible] = useState(false);
//   const [hasShownLiveModal, setHasShownLiveModal] = useState(false);

//   const abortControllerRef = useRef(null);
//   const scrollViewRef = useRef(null);

//   // Optimized data fetching
//   const fetchLiveStreams = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken"); 
//       setLoadingLiveStreams(true);
      
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//       abortControllerRef.current = new AbortController();

//       const res = await fetch(`${API_ROUTE}/live-streams/`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`, 
//         },
//         signal: abortControllerRef.current.signal
//       });

//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

//       const data = await res.json();
//       setLiveStreams(data);
//     } catch (err) {
//       if (err.name !== 'AbortError') {
//         console.warn("Error fetching live streams:", err);
//       }
//     } finally {
//       setLoadingLiveStreams(false);
//     }
//   }, []);

//   const fetchCurrentUser = useCallback(async () => {
//     try {
//       const userData = await AsyncStorage.getItem('userData');
//       if (userData) {
//         const parsedUserData = JSON.parse(userData);
//         setCurrentUserId(parsedUserData.id);
//         setCurrentUserPhone(parsedUserData.phone);
//       }
//     } catch (error) {
//       console.error('Error fetching current user:', error);
//     }
//   }, []);

//   const fetchStatus = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       const res = await axios.get(`${API_ROUTE}/status/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.status === 200 || res.status === 201) {
//         const grouped = groupStatusesByUser(res.data);
//         setGroupedStatuses(grouped);
//       }
//     } catch (error) {
//       console.error('Error fetching status:', error);
//     }
//   }, []);

//   const groupStatusesByUser = useCallback((statuses) => {
//     const grouped = {};
    
//     statuses.forEach(status => {
//       const userKey = status.user?.id || status.user;
      
//       if (!grouped[userKey]) {
//         grouped[userKey] = {
//           user: status.user,
//           statuses: [],
//           latestTime: new Date(status.created_at),
//           viewers_count: status.viewers_count,
//           viewers: status.viewers || [],
//           status_type: status.status_type
//         };
//       }
      
//       grouped[userKey].statuses.push(status);
//       const currentTime = new Date(status.created_at);
      
//       if (currentTime > grouped[userKey].latestTime) {
//         grouped[userKey].latestTime = currentTime;
//         grouped[userKey].viewers_count = status.viewers_count;
//         grouped[userKey].viewers = status.viewers || [];
//         grouped[userKey].status_type = status.status_type;
//       }
//     });
    
//     return Object.values(grouped).sort((a, b) => b.latestTime - a.latestTime);
//   }, []);

//   const fetchPosts = useCallback(async (forceRefresh = false) => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) return;

//     try {
//       if (!forceRefresh) {
//         const cachedData = await AsyncStorage.getItem(POSTS_CACHE_KEY);
//         if (cachedData) {
//           const { data, timestamp } = JSON.parse(cachedData);
//           const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
//           if (isCacheValid) {
//             // Enhance posts with views data
//             const enhancedPosts = await Promise.all(
//               data.map(async (post) => ({
//                 ...post,
//                 views: await getPostViews(post.id),
//                 shares: await getPostShares(post.id),
//                 is_verified: Math.random() > 0.7 // Simulate verified users
//               }))
//             );
//             setPosts([...enhancedPosts].reverse());
//             return;
//           }
//         }
//       }

//       const response = await axios.get(`${API_ROUTE}/posts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200) {
//         // Enhance posts with views data
//         const enhancedPosts = await Promise.all(
//           response.data.map(async (post) => ({
//             ...post,
//             views: await getPostViews(post.id),
//             shares: await getPostShares(post.id),
//             is_verified: Math.random() > 0.7 // Simulate verified users
//           }))
//         );
        
//         const reversedData = [...enhancedPosts].reverse();
//         setPosts(reversedData);
//         await AsyncStorage.setItem(
//           POSTS_CACHE_KEY,
//           JSON.stringify({ data: response.data, timestamp: Date.now() })
//         );
//       }
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     }
//   }, []);

//   const fetchAllPosts = useCallback(async (forceRefresh = false) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       if (!forceRefresh) {
//         const cachedData = await AsyncStorage.getItem(ALL_POSTS_CACHE_KEY);
//         if (cachedData) {
//           const { data, timestamp } = JSON.parse(cachedData);
//           const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
//           if (isCacheValid) {
//             const sortedPosts = [...data].sort((a, b) => 
//               new Date(b.created_at) - new Date(a.created_at)
//             );
//             const filteredPosts = await filterUnfollowedUsers(sortedPosts);
//             // Enhance posts with views data
//             const enhancedPosts = await Promise.all(
//               filteredPosts.map(async (post) => ({
//                 ...post,
//                 views: await getPostViews(post.id),
//                 shares: await getPostShares(post.id),
//                 is_verified: Math.random() > 0.6 
//               }))
//             );
//             setAllPosts(enhancedPosts);
//             return;
//           }
//         }
//       }

//       const [postsResponse, followedUsers] = await Promise.all([
//         axios.get(`${API_ROUTE}/get-all-post/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetchFollowedUsers(),
//       ]);

//       if (postsResponse.status === 200) {
//         await AsyncStorage.setItem(
//           ALL_POSTS_CACHE_KEY,
//           JSON.stringify({ data: postsResponse.data, timestamp: Date.now() })
//         );

//         const sortedPosts = [...postsResponse.data].sort((a, b) => 
//           new Date(b.created_at) - new Date(a.created_at)
//         );
//         const filteredPosts = await filterUnfollowedUsers(sortedPosts);
//         // Enhance posts with views data
//         const enhancedPosts = await Promise.all(
//           filteredPosts.map(async (post) => ({
//             ...post,
//             views: await getPostViews(post.id),
//             shares: await getPostShares(post.id),
//             is_verified: Math.random() > 0.6 // Simulate verified users
//           }))
//         );
//         setAllPosts(enhancedPosts);
//         setFollowedUsers(followedUsers);
//       }
//     } catch (error) {
//       console.error('Error fetching all posts:', error);
//     }
//   }, []);

//   const filterUnfollowedUsers = async (posts) => {
//     const followedUsers = await fetchFollowedUsers();
//     const seenUsers = new Set();
//     const filteredPosts = [];

//     for (const post of posts) {
//       if (!seenUsers.has(post.user_id) && !followedUsers.includes(post.user_id)) {
//         seenUsers.add(post.user_id);
//         filteredPosts.push(post);
//       }
//       if (filteredPosts.length === 20) break;
//     }

//     return filteredPosts;
//   };

//   const fetchFollowedUsers = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return [];

//       const response = await axios.get(`${API_ROUTE}/followed-users/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200) {
//         return response.data.map(user => user.id);
//       }
//       return [];
//     } catch (error) {
//       console.error('Error fetching followed users:', error);
//       return [];
//     }
//   }, []);

//   const fetchReactions = useCallback(async () => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) return;

//     try {
//       const response = await axios.get(`${API_ROUTE}/all-post-reaction/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setReactionCounts(response.data.reactions);
//     } catch (error) {
//       console.error('Error fetching reactions:', error);
//     }
//   }, []);

//   const fetchSuggestedFriends = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;
      
//       const response = await axios.get(`${API_ROUTE}/suggested-friends/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       if (response.status === 200) {
//         // Enhance suggested friends with verified status
//         const enhancedFriends = response.data.map(friend => ({
//           ...friend,
//           is_verified: Math.random() > 0.8, // Simulate verified users
//           followers_count: Math.floor(Math.random() * 1000) + 100 // Simulate followers count
//         }));
//         setSuggestedFriends(enhancedFriends);
//       }
//     } catch (error) {
//       console.error('Error fetching suggested friends:', error);
//     }
//   }, []);

//   // Optimized handlers
//   const handleReactionOptimized = useCallback(async (postId, type) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       setReactionCounts((prev) => {
//         const postIdStr = postId.toString();
//         const currentReactions = prev[postIdStr] || { like: 0, love: 0, support: 0 };
//         const newReactions = { ...currentReactions };

//         if (newReactions.user_reaction === type) {
//           newReactions[type] = (newReactions[type] || 0) - 1;
//           newReactions.user_reaction = null;
//         } else {
//           if (newReactions.user_reaction) {
//             newReactions[newReactions.user_reaction] = (newReactions[newReactions.user_reaction] || 0) - 1;
//           }
//           newReactions[type] = (newReactions[type] || 0) + 1;
//           newReactions.user_reaction = type;
//         }

//         return { ...prev, [postIdStr]: newReactions };
//       });

//       axios.post(
//         `${API_ROUTE}/post-react/`,
//         { post_id: postId, reaction_type: type },
//         { headers: { Authorization: `Bearer ${token}` } }
//       ).catch(console.error);
//     } catch (error) {
//       console.error('Error handling reaction:', error);
//     }
//   }, []);

//   const handleCommentOptimized = useCallback(async (postId) => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) return;

//     try {
//       const [postResponse, commentsResponse] = await Promise.all([
//         axios.get(`${API_ROUTE}/posts/${postId}/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${API_ROUTE}/get-posts-comment/${postId}/comments/all/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//       ]);

//       if (postResponse.status === 200) {
//         setPostById(postResponse.data);
//         setSelectedPostId(postId);
        
//         if (commentsResponse.status === 200) {
//           const parentComments = commentsResponse.data.filter(comment => !comment.parent);
//           setPostsComment(prev => {
//             const otherComments = prev.filter(c => c.post !== postId);
//             return [...otherComments, ...parentComments];
//           });
//         }
        
//         setIsBottomSheetVisible(true);
//       }
//     } catch (error) {
//       console.error('Error fetching post details:', error);
//     }
//   }, []);

//   const handleShareOptimized = useCallback(async (postId) => {
//     try {
//       const post = posts.find(p => p.id === postId) || allposts.find(p => p.id === postId);
//       if (!post) return 0;

//       const shareOptions = {
//         message: `${post.content}\n\nShared from Showa`,
//         url: post.image ? `${API_ROUTE_IMAGE}${post.image}` : undefined,
//         title: `Post by ${post.username}`,
//       };

//       await Share.share(shareOptions);
      
//       // Track the share
//       const newSharesCount = await trackPostShare(postId);
//       setIsOptionsBottomSheetVisible(false);
//       setSnackbarVisible(true);
      
//       return newSharesCount;
//     } catch (error) {
//       console.error('Error sharing post:', error);
//       return 0;
//     }
//   }, [posts, allposts]);

//   const handleOptionsOptimized = useCallback((postId, userId) => {
//     setSelectedPostId(postId);
//     setUsersSelectedPostId(userId);
//     setIsOptionsBottomSheetVisible(true);
//   }, []);

//   const handleFollow = useCallback(async (userId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       await axios.post(
//         `${API_ROUTE}/follow-user/${userId}/`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setFollowedUsers((prev) => [...prev, userId]);
//       setAllPosts((prev) => prev.filter((post) => post.user_id !== userId));
//       setSuggestedFriends((prev) => prev.filter((friend) => friend.id !== userId));
//       setSnackbarVisible(true);
//     } catch (error) {
//       console.error('Error following user:', error);
//     }
//   }, []);

//   const handleViewUser = useCallback((userId) => {
//     navigation.navigate('BroadcastUserProfile', { user_ID: userId });
//   }, [navigation]);

//   const handleUnfollow = useCallback(async () => {
//     const userId = userPostWithID;
//     if (!userId) return;

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       await axios.delete(`${API_ROUTE}/unfollow-user/${userId}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setFollowedUsers((prev) => prev.filter((follower) => follower !== userId));
//       setSnackbarVisible(true);
//       setIsOptionsBottomSheetVisible(false);
//     } catch (error) {
//       console.error('Error unfollowing user:', error);
//     }
//   }, [userPostWithID]);

//   const handleBookmark = useCallback(async (postId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.post(
//         `${API_ROUTE}/bookmark-post/`,
//         { post: postId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSnackbarVisible(true);
//       setIsOptionsBottomSheetVisible(false);
//     } catch (error) {
//       console.error('Error bookmarking post:', error);
//     }
//   }, []);

//   // Status management functions
//   const openImageModal = useCallback((userStatuses) => {
//     setSelectedUserStatuses(userStatuses.statuses);
//     setCurrentStatusIndex(0);
//     setModalVisible(true);
//     setPaused(false);
//   }, []);

//   const showViewers = useCallback((viewers) => {
//     setCurrentViewers(viewers);
//     setViewersModalVisible(true);
//   }, []);

//   const deleteStatus = useCallback(async (statusId) => {
//     if (!statusId) return;

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.delete(`${API_ROUTE}/status/${statusId}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       setGroupedStatuses(prev => 
//         prev.filter(status => 
//           !status.statuses.some(s => s.id === statusId)
//         )
//       );
//       setSnackbarVisible(true);
//     } catch (error) {
//       console.error('Error deleting status:', error);
//       Alert.alert('Error', 'Failed to delete status');
//     }
//   }, []);

//   // Image modal functions
//   const handleViewImage = useCallback((post) => {
//     setSelectedImagePost(post);
//     setImageModalVisible(true);
//   }, []);

//   const handleImageModalClose = useCallback(() => {
//     setImageModalVisible(false);
//     setSelectedImagePost(null);
//   }, []);

//   const handleImageViewed = useCallback((postId, newCount) => {
//     // Update views count in the posts state
//     setPosts(prev => prev.map(post => 
//       post.id === postId ? { ...post, views: newCount } : post
//     ));
//     setAllPosts(prev => prev.map(post => 
//       post.id === postId ? { ...post, views: newCount } : post
//     ));
//   }, []);

//   // Fixed scroll handler - only show modal once
//   const handleScroll = useCallback((event) => {
//     const scrollY = event.nativeEvent.contentOffset.y;
//     const postHeight = 500;
    
//     if (scrollY > postHeight * 4 && !showSuggestedFriends) {
//       setShowSuggestedFriends(true);
//     }

//     // Only show live modal once, after scrolling past 8 posts
//     if (scrollY > postHeight * 8 && !hasShownLiveModal && liveStreams.length > 0) {
//       setShowLiveModal(true);
//       setHasShownLiveModal(true); // Mark as shown
//     }
//   }, [showSuggestedFriends, hasShownLiveModal, liveStreams.length]);

//   // Comment and Reply functionality
//   const onCommentSubmitPost = useCallback(async () => {
//     if (!newComment.trim() || !selectedPostId) {
//       console.log('Comment text is empty or no post selected.');
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         console.log('No token found, cannot post comment.');
//         return;
//       }

//       const userData = await AsyncStorage.getItem('userData');
//       const parsedUser = userData ? JSON.parse(userData) : null;
//       const loginUserId = parsedUser?.id;

//       if (!loginUserId) {
//         console.warn('User ID not found in stored data.');
//         return;
//       }

//       const tempCommentId = `temp_${Date.now()}`;
//       const newCommentData = {
//         id: tempCommentId,
//         post: selectedPostId,
//         user: {
//           id: loginUserId,
//           username: username,
//           image: userprofileimage,
//         },
//         text: newComment.trim(),
//         created_at: new Date().toISOString(),
//         image: userprofileimage,
//         replies: [],
//       };

//       setPostsComment((prev) => {
//         const updatedComments = [newCommentData, ...prev.filter((c) => c.post === selectedPostId)];
//         return [...prev.filter((c) => c.post !== selectedPostId), ...updatedComments];
//       });

//       const response = await axios.post(
//         `${API_ROUTE}/posts-comment/${selectedPostId}/comments/`,
//         {
//           text: newComment.trim(),
//           post: selectedPostId,
//           user: loginUserId,
//           image: userprofileimage,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         setPostsComment((prev) => {
//           const updatedComments = prev.map((comment) =>
//             comment.id === tempCommentId
//               ? {
//                   ...comment,
//                   id: response.data.id,
//                 }
//               : comment
//           );
//           return updatedComments;
//         });
//         setNewComment('');
//         setSnackbarVisible(true);
//       } else {
//         console.log('Failed to post comment:', response.data);
//         setPostsComment((prev) => {
//           const updatedComments = prev.filter((comment) => comment.id !== tempCommentId);
//           return updatedComments;
//         });
//       }
//     } catch (error) {
//       console.error('Failed to post comment:', error);
//       setPostsComment((prev) => {
//         const updatedComments = prev.filter((comment) => comment.id !== `temp_${Date.now()}`);
//         return updatedComments;
//       });
//     }
//   }, [newComment, selectedPostId, username, userprofileimage]);

//   const onCommentSubmitReply = useCallback(async () => {
//     if (!replyText.trim() || !selectedCommentId) {
//       console.log('Reply text is empty or no comment selected.');
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         console.log('No token found, cannot post reply.');
//         return;
//       }

//       const userData = await AsyncStorage.getItem('userData');
//       const parsedUser = userData ? JSON.parse(userData) : null;
//       const loginUserId = parsedUser?.id;

//       if (!loginUserId) {
//         console.warn('User ID not found in stored data.');
//         return;
//       }

//       const tempReplyId = `temp_reply_${Date.now()}`;
//       const newReplyData = {
//         id: tempReplyId,
//         username: username,
//         text: replyText.trim(),
//         userAvatar: userprofileimage,
//         created_at: new Date().toISOString(),
//       };

//       setPostsComment((prev) => {
//         const updatedComments = prev.map((comment) =>
//           comment.id === selectedCommentId
//             ? {
//                 ...comment,
//                 replies: comment.replies
//                   ? [...comment.replies, newReplyData]
//                   : [newReplyData],
//               }
//             : comment
//         );
//         return updatedComments;
//       });

//       const response = await axios.post(
//         `${API_ROUTE}/posts-comment/${selectedPostId}/comments/`,
//         {
//           text: replyText.trim(),
//           post: selectedPostId,
//           user: loginUserId,
//           image: userprofileimage,
//           parent: selectedCommentId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         setPostsComment((prev) => {
//           const updatedComments = prev.map((comment) =>
//             comment.id === selectedCommentId
//               ? {
//                   ...comment,
//                   replies: comment.replies.map((reply) =>
//                     reply.id === tempReplyId
//                       ? {
//                           ...reply,
//                           id: response.data.id,
//                         }
//                       : reply
//                   ),
//                 }
//               : comment
//           );
//           return updatedComments;
//         });

//         setReplyText('');
//         setReplyToCommentId(null);
//         setSnackbarVisible(true);
//       } else {
//         console.log('Failed to post reply:', response.data);
//         setPostsComment((prev) => {
//           const updatedComments = prev.map((comment) =>
//             comment.id === selectedCommentId
//               ? {
//                   ...comment,
//                   replies: comment.replies.filter((reply) => reply.id !== tempReplyId),
//                 }
//               : comment
//           );
//           return updatedComments;
//         });
//       }
//     } catch (error) {
//       console.error('Failed to post reply:', error);
//       setPostsComment((prev) => {
//         const updatedComments = prev.map((comment) =>
//           comment.id === selectedCommentId
//             ? {
//                 ...comment,
//                 replies: comment.replies.filter((reply) => reply.id !== tempReplyId),
//               }
//             : comment
//         );
//         return updatedComments;
//       });
//     }
//   }, [replyText, selectedCommentId, selectedPostId, username, userprofileimage]);

//   const handleReply = useCallback((username, commentId) => {
//     setReplyToCommentId(commentId);
//     setReplyText('');
//   }, []);

//   const onPostCommentLikes = useCallback(async (commentId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       const userData = await AsyncStorage.getItem('userData');
//       const parsedUser = userData ? JSON.parse(userData) : null;
//       const loginUserId = parsedUser?.id;

//       if (!loginUserId) return;

//       setCommentLikesCount((prev) => ({
//         ...prev,
//         [commentId]: (prev[commentId] || 0) + 1,
//       }));

//       const response = await axios.post(
//         `${API_ROUTE}/post-comments-like/${commentId}/like/`,
//         {
//           user: loginUserId,
//           comment: commentId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         setSnackbarVisible(true);
//       } else {
//         setCommentLikesCount((prev) => ({
//           ...prev,
//           [commentId]: (prev[commentId] || 1) - 1,
//         }));
//       }
//     } catch (error) {
//       console.error('Failed to like comment:', error);
//       setCommentLikesCount((prev) => ({
//         ...prev,
//         [commentId]: (prev[commentId] || 1) - 1,
//       }));
//     }
//   }, []);

//   // Refresh function
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await Promise.all([
//       fetchPosts(true),
//       fetchAllPosts(true),
//       fetchStatus(),
//       fetchSuggestedFriends(),
//       fetchLiveStreams()
//     ]);
//     setRefreshing(false);
//   }, [fetchPosts, fetchAllPosts, fetchStatus, fetchSuggestedFriends, fetchLiveStreams]);

//   // Initialize data
//   useEffect(() => {
//     const initializeData = async () => {
//       await fetchCurrentUser();
//       await fetchPosts();
//       await fetchStatus();
      
//       // Load secondary data in background
//       Promise.all([
//         fetchAllPosts(),
//         fetchReactions(),
//         fetchSuggestedFriends(),
//         fetchLiveStreams(),
//       ]).catch(console.error);
//     };

//     initializeData();

//     return () => {
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, []);

//   // Memoized data
//   const myStatus = React.useMemo(() => 
//     groupedStatuses.find(status => 
//       status.user?.phone === currentUserPhone || status.user === currentUserPhone
//     ),
//     [groupedStatuses, currentUserPhone]
//   );

//   const otherStatuses = React.useMemo(() => 
//     groupedStatuses.filter(status => 
//       status.user?.phone !== currentUserPhone && status.user !== currentUserPhone
//     ),
//     [groupedStatuses, currentUserPhone]
//   );

//   const combinedPosts = React.useMemo(() => [
//     ...posts.map(post => ({ 
//       type: 'followed', 
//       post: {
//         ...post,
//         reactions: reactionCounts[post.id?.toString()] || {},
//         commentCount: commentsss.filter(c => c.post === post.id).length
//       }
//     })),
//     ...allposts.map(post => ({ 
//       type: 'allposts', 
//       post: {
//         ...post,
//         reactions: reactionCounts[post.id?.toString()] || {},
//         commentCount: commentsss.filter(c => c.post === post.id).length
//       }
//     }))
//   ].sort((a, b) => new Date(b.post.created_at) - new Date(a.post.created_at)), 
//   [posts, allposts, reactionCounts, commentsss]);

//   // Render functions
//   const renderStatusRow = useCallback(() => {
//     const hasLiveStreams = liveStreams && liveStreams.length > 0;

//     return (
//       <View style={{ marginTop: 10, marginBottom: 20 }}>
//         <Text style={[styles.sectionTitle, {color:'#333'}]}>
//           {hasLiveStreams ? 'Live & Status' : 'Status'}
//         </Text>
        
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.statusScrollContainer}
//         >
//           {/* My Status */}
//           {myStatus && (
//             <MemoizedStatusPreview 
//               userStatus={myStatus}
//               currentUserPhone={currentUserPhone}
//               onPress={() => openImageModal(myStatus)}
//               onViewers={() => showViewers(myStatus.viewers)}
//               onDelete={deleteStatus}
//             />
//           )}

//           {/* Live Streams */}
//           {hasLiveStreams && liveStreams.map((liveStream) => (
//             <TouchableOpacity 
//               key={liveStream.id}
//               style={styles.liveStreamWrapper}
//               onPress={() => {
//                 navigation.navigate('LiveStreamViewer', { streamId: liveStream.stream_id });
//               }}
//             >
//               <View style={styles.liveStreamContainer}>
//                 <Image
//                   source={{ 
//                     uri: liveStream.broadcaster_image 
//                       ? `${API_ROUTE_IMAGE}${liveStream.broadcaster_image.replace(/^https?:\/\/[^/]+/, '')}`
//                       : 'https://via.placeholder.com/40' 
//                   }}
//                   style={styles.liveStreamImage}
//                 />
//                 <View style={styles.liveStreamOverlay}>
//                   <View style={styles.liveIndicator}>
//                     <View style={styles.liveDot} />
//                     <Text style={styles.liveText}>LIVE</Text>
//                   </View>
//                   <Text style={styles.liveStreamName} numberOfLines={1}>
//                     {liveStream.broadcaster_name}
//                   </Text>
//                   <Text style={styles.liveStreamStats}>
//                     {liveStream.likes} likes
//                   </Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}
          
//           {/* Other Statuses */}
//           {otherStatuses.map((userStatus) => (
//             <MemoizedStatusPreview 
//               key={userStatus.user?.id}
//               userStatus={userStatus}
//               currentUserPhone={currentUserPhone}
//               onPress={() => openImageModal(userStatus)}
//               onViewers={() => showViewers(userStatus.viewers)}
//               onDelete={deleteStatus}
//             />
//           ))}
//         </ScrollView>
//       </View>
//     );
//   }, [myStatus, otherStatuses, liveStreams, currentUserPhone, openImageModal, showViewers, deleteStatus]);

//   const renderLiveModal = () => (
//     <Modal visible={showLiveModal} animationType="slide" transparent>
//       <View style={styles.liveModalOverlay}>
//         <View style={styles.liveModal}>
//           <View style={styles.liveModalHeader}>
//             <Text style={styles.liveModalTitle}>Live Now 🔴</Text>
//             <TouchableOpacity onPress={() => setShowLiveModal(false)}>
//               <Icon name="close" size={24} color="#333" />
//             </TouchableOpacity>
//           </View>
          
//           <FlatList
//             data={liveStreams}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={({ item }) => (
//               <TouchableOpacity 
//                 style={styles.liveModalItem}
//                 onPress={() => {
//                   setShowLiveModal(false);
//                   navigation.navigate('LiveStreamViewer', { streamId: item.stream_id });
//                 }}
//               >
//                 <Image
//                   source={{ 
//                     uri: item.broadcaster_image 
//                       ? `${API_ROUTE_IMAGE}${item.broadcaster_image.replace(/^https?:\/\/[^/]+/, '')}`
//                       : 'https://via.placeholder.com/40' 
//                   }}
//                   style={styles.liveModalAvatar}
//                 />
//                 <View style={styles.liveModalInfo}>
//                   <Text style={styles.liveModalName}>{item.broadcaster_name}</Text>
//                   <View style={styles.liveIndicator}>
//                     <View style={styles.liveDot} />
//                     <Text style={styles.liveText}>LIVE NOW</Text>
//                   </View>
//                 </View>
//                 <Text style={styles.liveModalStats}>{item.likes} likes</Text>
//               </TouchableOpacity>
//             )}
//             ListEmptyComponent={
//               <View style={styles.emptyLive}>
//                 <Text style={styles.emptyLiveText}>No one is live right now</Text>
//               </View>
//             }
//           />
          
//           <TouchableOpacity 
//             style={styles.closeLiveModalButton}
//             onPress={() => setShowLiveModal(false)}
//           >
//             <Text style={styles.closeLiveModalText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );

//   const renderViewersModal = () => (
//     <Modal visible={viewersModalVisible} animationType="slide" transparent>
//       <View style={styles.viewersModalOverlay}>
//         <View style={styles.viewersModal}>
//           <View style={styles.viewersModalHeader}>
//             <Text style={styles.viewersModalTitle}>Viewers</Text>
//             <TouchableOpacity onPress={() => setViewersModalVisible(false)}>
//               <Icon name="close" size={24} color="#333" />
//             </TouchableOpacity>
//           </View>
          
//           <FlatList
//             data={currentViewers}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({ item }) => (
//               <View style={styles.viewerItem}>
//                 <Image
//                   source={{ 
//                     uri: item.profile_picture 
//                       ? `${API_ROUTE_IMAGE}${item.profile_picture}`
//                       : 'https://via.placeholder.com/40' 
//                   }}
//                   style={styles.viewerAvatar}
//                 />
//                 <Text style={styles.viewerName}>{item.username || 'Unknown User'}</Text>
//               </View>
//             )}
//             ListEmptyComponent={
//               <View style={styles.emptyViewers}>
//                 <Text style={styles.emptyViewersText}>No viewers yet</Text>
//               </View>
//             }
//           />
//         </View>
//       </View>
//     </Modal>
//   );

//   const renderComment = useCallback(({ item }) => {
//     const replyCount = item.replies ? item.replies.length : 0;

//     return (
//       <View style={styles.commentContainer}>
//         <View style={styles.commentRow}>
//           <Image
//             source={
//               item.image
//                 ? { uri: item.image }
//                 : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//             }
//             style={styles.commentAvatar}
//           />
//           <View style={styles.commentContent}>
//             <Text style={styles.commentUsername}>
//               {item.user?.username || item.username}
//             </Text>
//             <Text style={styles.commentText}>{item.text}</Text>
//             <View style={styles.commentActions}>
//               <Text style={styles.commentTimestamp}>{dayjs(item.created_at).fromNow()}</Text>
//               <TouchableOpacity onPress={() => onPostCommentLikes(item.id)}>
//                 <Text style={styles.actionText}>{commentLikesCount[item.id] || 0} Like</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleReply(item.user?.username || item.username, item.id)}>
//                 <Text style={styles.actionText}>Reply</Text>
//               </TouchableOpacity>
//             </View>
            
//             {/* Replies */}
//             {replyCount > 0 && (
//               <View style={styles.repliesWrapper}>
//                 {item.replies.slice(0, 3).map((reply, index) => (
//                   <View key={index} style={styles.replyContainer}>
//                     <Image
//                       source={
//                         reply.userAvatar
//                           ? { uri: reply.userAvatar }
//                           : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                       }
//                       style={styles.replyAvatar}
//                     />
//                     <View style={styles.replyContent}>
//                       <Text style={styles.replyUsername}>{reply.username}</Text>
//                       <Text style={styles.replyText}>{reply.text}</Text>
//                       <Text style={styles.replyTimestamp}>{dayjs(reply.created_at).fromNow()}</Text>
//                     </View>
//                   </View>
//                 ))}
//                 {replyCount > 3 && (
//                   <TouchableOpacity
//                     onPress={() => {
//                       setSelectedCommentId(item.id);
//                       setIsReplyBottomSheetVisible(true);
//                     }}
//                   >
//                     <Text style={styles.viewMoreReplies}>View {replyCount - 3} more replies</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             )}

//             {/* Reply Input */}
//             {replyToCommentId === item.id && (
//               <View style={styles.replyInputContainer}>
//                 <TextInput
//                   placeholder={`Replying to ${item.user?.username || item.username}...`}
//                   value={replyText}
//                   onChangeText={setReplyText}
//                   style={styles.replyInput}
//                   placeholderTextColor='#666'
//                   multiline
//                 />
//                 <TouchableOpacity
//                   onPress={onCommentSubmitReply}
//                   style={styles.replySendButton}
//                 >
//                   <Text style={styles.replySendButtonText}>Reply</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         </View>
//       </View>
//     );
//   }, [replyToCommentId, replyText, onCommentSubmitReply, handleReply, onPostCommentLikes, commentLikesCount]);

//   const renderSuggestedFriend = useCallback(({ item }) => (
//     <SuggestedFriendItem item={item} onFollow={handleFollow} />
//   ), [handleFollow]);
  
//    {/* Friend Suggestion Section - Strategic Placement */}
//         <View style={styles.friendSuggestionWrapper}>
//           <FriendSuggestion />
//         </View>


  // const promoBanners = [
  //   require('../assets/images/gdgdg.jpg'), 
  //   require('../assets/images/how-much-won-prize-bonds-752x501.jpg'), 
  // ];

//   const renderContent = useCallback(() => {
//     const middleIndex = Math.floor(combinedPosts.length / 2);
//     const firstHalf = combinedPosts.slice(0, middleIndex);
//     const secondHalf = combinedPosts.slice(middleIndex);

//     // Calculate position for FriendSuggestion - show after 2-3 posts in first half
//     const friendSuggestionIndex = Math.min(2, firstHalf.length - 1);
//     const firstPart = firstHalf.slice(0, friendSuggestionIndex);
//     const secondPart = firstHalf.slice(friendSuggestionIndex);

//     return (
//       <>
//         {/* Status Section */}
//         {renderStatusRow()}

//         {/* Promo Banner */}
//         <View style={styles.promoContainer}>
//           <Image
//             source={promoBanners[0]} 
//             style={styles.promoBanner}
//             resizeMode="cover"
//           />
//           <View style={styles.promoContent}>
//             <Text style={styles.promoTitle}>Earn Massive Income</Text>
//             <Text style={styles.promoSubtitle}>Up to 5m instantly</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Earnings')} style={styles.promoButton}>
//               <Text style={styles.promoButtonText}>Get Started Now</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* First Part of Posts (2-3 posts) */}
//         <FlatList
//           data={firstPart}
//           keyExtractor={(item, index) => `${item.type}-${item.post.id?.toString() || index.toString()}`}
//           renderItem={({ item }) => (
//             <MemoizedTweetItem 
//               post={item.post} 
//               type={item.type}
//               onReaction={handleReactionOptimized}
//               onComment={handleCommentOptimized}
//               onShare={handleShareOptimized}
//               onFollow={handleFollow}
//               onOptions={handleOptionsOptimized}
//               onViewImage={handleViewImage}
//             />
//           )}
//           scrollEnabled={false}
//           initialNumToRender={3}
//           maxToRenderPerBatch={5}
//           windowSize={5}
//         />

       

//         {/* Second Part of First Half Posts */}
//         <FlatList
//           data={secondPart}
//           keyExtractor={(item, index) => `${item.type}-${item.post.id?.toString() || index.toString()}`}
//           renderItem={({ item }) => (
//             <MemoizedTweetItem 
//               post={item.post} 
//               type={item.type}
//               onReaction={handleReactionOptimized}
//               onComment={handleCommentOptimized}
//               onShare={handleShareOptimized}
//               onFollow={handleFollow}
//               onOptions={handleOptionsOptimized}
//               onViewImage={handleViewImage}
//             />
//           )}
//           scrollEnabled={false}
//           initialNumToRender={3}
//           maxToRenderPerBatch={5}
//           windowSize={5}
//         />

//         {/* Suggested Friends Section */}
//         {showSuggestedFriends && suggestedFriends.length > 0 && (
//           <View style={styles.suggestedFriendsContainer}>
//             <View style={styles.suggestedFriendsHeader}>
//               <Text style={[styles.sectionTitle, {color:'#777', fontSize:18}]}>People to follow</Text>
//             </View>
//             <FlatList
//               data={suggestedFriends}
//               renderItem={renderSuggestedFriend}
//               keyExtractor={(item, index) => index.toString()}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.suggestedFriendsList}
//               initialNumToRender={3}
//             />
//           </View>
//         )}

//         {/* Second Half of Posts */}
//         <FlatList
//           data={secondHalf}
//           keyExtractor={(item, index) => `${item.type}-${item.post.id?.toString() || index.toString()}`}
//           renderItem={({ item }) => (
//             <MemoizedTweetItem 
//               post={item.post} 
//               type={item.type}
//               onReaction={handleReactionOptimized}
//               onComment={handleCommentOptimized}
//               onShare={handleShareOptimized}
//               onFollow={handleFollow}
//               onOptions={handleOptionsOptimized}
//               onViewImage={handleViewImage}
//             />
//           )}
//           scrollEnabled={false}
//           initialNumToRender={3}
//           maxToRenderPerBatch={5}
//           windowSize={5}
//         />

//         {/* Additional Friend Suggestion at the end for better visibility */}
//         {combinedPosts.length > 8 && (
//           <View style={styles.friendSuggestionBottom}>
//             <FriendSuggestion />
//           </View>
//         )}
//       </>
//     );
//   }, [combinedPosts, showSuggestedFriends, suggestedFriends, renderStatusRow, handleReactionOptimized, handleCommentOptimized, handleShareOptimized, handleFollow, handleOptionsOptimized, handleViewImage]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Broadcast</Text>
//         <View style={styles.headerActions}>
//           <TouchableOpacity 
//             onPress={() => {
//               navigation.navigate('Broadcaster', {
//                 roomName: 'match-123',
//                 streamId: 'stream-1',
//               });
//             }}
//             style={styles.goLiveButton}
//           >
//             <Ionicons name="radio" size={20} color="#333" />
//             <Text style={styles.goLiveText}>Go Live</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity onPress={() => navigation.navigate('CreateBroadcastPost')}>
//             <Ionicons name="add-circle-outline" size={34} color='#333' />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView
//         ref={scrollViewRef}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         removeClippedSubviews={true}
//         showsVerticalScrollIndicator={false}
//       >
//         {renderContent()}
//       </ScrollView>

//       {/* Floating Action Button */}
//       <TouchableOpacity 
//         style={styles.fab}
//         onPress={() => navigation.navigate('CreateBroadcastPost')}
//       >
//         <Icon name="add" size={24} color="#fff" />
//       </TouchableOpacity>

//       {/* Image Modal */}
//       <ImageModal
//         visible={imageModalVisible}
//         post={selectedImagePost}
//         onClose={handleImageModalClose}
//         onView={handleImageViewed}
//       />

//       {/* Live Modal */}
//       {renderLiveModal()}

//       {/* Viewers Modal */}
//       {renderViewersModal()}

//       {/* Comment Modal */}
//       <Modal visible={isBottomSheetVisible} animationType="slide" transparent>
//         <View style={styles.overlay}>
//           <View style={styles.commentModal}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Comments</Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setIsBottomSheetVisible(false);
//                   setReplyToCommentId(null);
//                   setNewComment('');
//                 }}
//                 style={styles.closeButton}
//               >
//                 <Ionicons name="close" size={26} color="#333" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView contentContainerStyle={styles.modalContent}>
//               {postById && (
//                 <View style={styles.postPreview}>
//                   <View style={styles.postHeader}>
//                     <Image
//                       source={
//                         postById.user_profile_picture
//                           ? { uri: postById.user_profile_picture }
//                           : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                       }
//                       style={styles.postAvatar}
//                     />
//                     <View style={styles.postInfo}>
//                       <Text style={styles.postUsername}>
//                         {postById.username || 'Anonymous'}
//                       </Text>
//                       <Text style={styles.postTimestamp}>
//                         {dayjs(postById.created_at).fromNow()}
//                       </Text>
//                     </View>
//                   </View>
//                   <Text style={styles.postContent}>{postById.content}</Text>
//                   {postById.image && (
//                     <Image
//                       source={{ uri: `${API_ROUTE_IMAGE}${postById.image}` }}
//                       style={styles.postImagePreview}
//                       resizeMode="cover"
//                     />
//                   )}
//                 </View>
//               )}

//               <View style={styles.divider} />

//               {/* Comments List */}
//               <FlatList
//                 data={commentsss.filter((c) => c.post === selectedPostId && !c.parent)}
//                 keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//                 scrollEnabled={false}
//                 renderItem={renderComment}
//                 ListEmptyComponent={
//                   <View style={styles.emptyComments}>
//                     <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
//                   </View>
//                 }
//               />

//               {/* Comment Input */}
//               <View style={styles.commentInputContainer}>
//                 <TextInput
//                   placeholder="Write a comment..."
//                   value={newComment}
//                   onChangeText={setNewComment}
//                   style={styles.commentInput}
//                   placeholderTextColor='#666'
//                   multiline
//                 />
//                 <TouchableOpacity
//                   onPress={onCommentSubmitPost}
//                   style={styles.sendButton}
//                   disabled={!newComment.trim()}
//                 >
//                   <Text style={[styles.sendButtonText, !newComment.trim() && styles.sendButtonDisabled]}>
//                     Post
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {/* Reply Modal */}
//       <Modal visible={isReplyBottomSheetVisible} animationType="slide" transparent>
//         <View style={styles.overlay}>
//           <View style={styles.replyModal}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Replies</Text>
//               <TouchableOpacity
//                 onPress={() => setIsReplyBottomSheetVisible(false)}
//                 style={styles.closeButton}
//               >
//                 <Ionicons name="close" size={26} color="#333" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView contentContainerStyle={styles.modalContent}>
//               {selectedCommentId && (
//                 <View style={styles.commentContainer}>
//                   <View style={styles.commentRow}>
//                     <Image
//                       source={
//                         commentsss.find(c => c.id === selectedCommentId)?.image
//                           ? { uri: commentsss.find(c => c.id === selectedCommentId)?.image }
//                           : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                       }
//                       style={styles.commentAvatar}
//                     />
//                     <View style={styles.commentContent}>
//                       <Text style={styles.commentUsername}>
//                         {commentsss.find(c => c.id === selectedCommentId)?.user?.username || commentsss.find(c => c.id === selectedCommentId)?.username}
//                       </Text>
//                       <Text style={styles.commentText}>
//                         {commentsss.find(c => c.id === selectedCommentId)?.text}
//                       </Text>
//                       <Text style={styles.commentTimestamp}>
//                         {dayjs(commentsss.find(c => c.id === selectedCommentId)?.created_at).fromNow()}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               )}
//               <View style={styles.repliesWrapper}>
//                 <FlatList
//                   data={commentsss.find((comment) => comment.id === selectedCommentId)?.replies || []}
//                   keyExtractor={(item, index) => index.toString()}
//                   scrollEnabled={false}
//                   renderItem={({ item }) => (
//                     <View style={styles.replyContainer}>
//                       <Image
//                         source={
//                           item.userAvatar
//                             ? { uri: item.userAvatar }
//                             : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                         }
//                         style={styles.replyAvatar}
//                       />
//                       <View style={styles.replyContent}>
//                         <Text style={styles.replyUsername}>{item.username}</Text>
//                         <Text style={styles.replyText}>{item.text}</Text>
//                         <Text style={styles.replyTimestamp}>{dayjs(item.created_at).fromNow()}</Text>
//                       </View>
//                     </View>
//                   )}
//                   ListEmptyComponent={
//                     <View style={styles.emptyComments}>
//                       <Text style={styles.emptyText}>No replies yet.</Text>
//                     </View>
//                   }
//                 />
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {/* Options Modal */}
//       <Modal visible={isOptionsBottomSheetVisible} animationType="slide" transparent>
//         <View style={styles.overlay}>
//           <View style={styles.optionsModal}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Post Options</Text>
//               <TouchableOpacity
//                 onPress={() => setIsOptionsBottomSheetVisible(false)}
//                 style={styles.closeButton}
//               >
//                 <Ionicons name="close" size={26} color="#333" />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.optionsContainer}>
//               <TouchableOpacity
//                 style={styles.optionItem}
//                 onPress={() => handleShareOptimized(selectedPostId)}
//               >
//                 <Ionicons name="share-social-outline" size={24} color="#333" />
//                 <Text style={styles.optionText}>Share</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.optionItem}
//                 onPress={() => handleBookmark(selectedPostId)}
//               >
//                 <Ionicons name="bookmark-outline" size={24} color="#333" />
//                 <Text style={styles.optionText}>Bookmark</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.optionItem}
//                 onPress={()=>{
//                   setIsOptionsBottomSheetVisible(false);
//                   handleUnfollow();
//                 }}
//               >
//                 <Ionicons name="person-remove-outline" size={24} color="#333" />
//                 <Text style={styles.optionText}>Unfollow</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.optionItem}
//                 onPress={() => navigation.navigate('ReportPost', {postId: selectedPostId})}
//               >
//                 <Ionicons name="flag-outline" size={24} color="#333" />
//                 <Text style={styles.optionText}>Report Post</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Snackbar
//         visible={snackbarVisible}
//         onDismiss={() => setSnackbarVisible(false)}
//         duration={3000}
//       >
//         Action completed successfully!
//       </Snackbar>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: "#fff" 
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#ddd",
//     backgroundColor: '#fff',
//     elevation: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   headerTitle: {
//     fontSize: 30,
//     color: colors.primary,
//     fontWeight: 'bold',
//   },
//   headerActions: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   goLiveButton: {
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   goLiveText: {
//     fontSize: 10,
//     color: '#333',
//     marginTop: 2,
//   },
  
//   // Friend Suggestion Styles
//   friendSuggestionWrapper: {
//     marginVertical: 16,
//     paddingHorizontal: 8,
//     backgroundColor: '#FAFBFC',
//     borderRadius: 12,
//     marginHorizontal: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   friendSuggestionBottom: {
//     marginVertical: 20,
//     paddingHorizontal: 8,
//     backgroundColor: '#FAFBFC',
//     borderRadius: 12,
//     marginHorizontal: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },

//   tweetContainer: {
//     flexDirection: "row",
//     padding: 15,
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#eee",
//     backgroundColor: '#fff',
//   },
//   avatarContainer: {
//     position: 'relative',
//   },
//   avatar: { 
//     width: 40, 
//     height: 40, 
//     borderRadius: 20,
//   },
//   verifiedBadge: {
//     position: 'absolute',
//     bottom: -2,
//     right: -2,
//     backgroundColor: '#1DA1F2',
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   verifiedBadgeSmall: {
//     marginLeft: 4,
//     backgroundColor: '#1DA1F2',
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tweetContent: { 
//     flex: 1, 
//     marginLeft: 12,
//   },
//   tweetHeader: { 
//     flexDirection: "row", 
//     alignItems: "center", 
//     flexWrap: "wrap",
//     marginBottom: 8,
//   },
//   name: { 
//     fontWeight: "bold", 
//     fontSize: 16,
//     color: '#333',
//   },
//   dot: { 
//     marginHorizontal: 6, 
//     color: "#555",
//     fontSize: 16,
//   },
//   time: { 
//     color: "#666",
//     fontSize: 14,
//   },
//   tweetText: { 
//     fontSize: 15, 
//     lineHeight: 20,
//     color: "#333",
//     marginBottom: 8,
//   },
//   tweetImage: {
//     width: "100%",
//     borderRadius: 12,
//     marginBottom: 8,
//     resizeMode: "cover", 
//     maxHeight: 700,      
//     minHeight: 300,      
//   },
//   tweetActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 0,
//   },
//   actionButton: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     borderRadius: 10,
//     padding: 0,
//     paddingHorizontal: 12,
//     minWidth: 60,
//     justifyContent: 'center',
//   },
//   actionCount: {
//     marginLeft: 6,
//     fontSize: 14,
//     color: '#555',
//   },
//   readMore: {
//     color: colors.primary,
//     fontWeight: '600',
//   },
//   followButton: {
//     backgroundColor: colors.primary,
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginLeft: 'auto',
//   },
//   followButtonText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   followingButton: {
//     backgroundColor: '#f0f0f0',
//   },
//   followingButtonText: {
//     color: '#333',
//   },
//   optionsButton: {
//     marginLeft: 'auto',
//     padding: 4,
//   },
//   fab: {
//     position: "absolute",
//     bottom: 30,
//     right: 20,
//     backgroundColor: colors.primary,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'flex-end',
//   },
//   commentModal: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     maxHeight: '90%',
//   },
//   optionsModal: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     paddingBottom: 20,
//   },
//   replyModal: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     maxHeight: '70%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   modalContent: {
//     paddingBottom: 20,
//   },
//   optionsContainer: {
//     paddingHorizontal: 16,
//   },
//   optionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   optionText: {
//     fontSize: 16,
//     color: '#333',
//     marginLeft: 12,
//   },
//   postPreview: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   postHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   postAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   postInfo: {
//     flex: 1,
//   },
//   postUsername: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   postTimestamp: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   postContent: {
//     fontSize: 15,
//     color: '#333',
//     lineHeight: 20,
//     marginBottom: 12,
//   },
//   postImagePreview: {
//     width: '100%',
//     height: 200,
//     borderRadius: 12,
//   },
//   commentInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   commentInput: {
//     flex: 1,
//     fontSize: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 24,
//     marginRight: 12,
//     color: '#333',
//   },
//   sendButton: {
//     backgroundColor: colors.primary,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 24,
//   },
//   sendButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   sendButtonDisabled: {
//     opacity: 0.5,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginLeft: 16,
//     marginBottom: 12,
//   },
//   statusScrollContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   statusWrapper: {
//     alignItems: 'center',
//     marginRight: 12,
//     position: 'relative',
//   },
//   statusImage: {
//     width: 80,
//     height: 120,
//     borderRadius: 20,
//     overflow: 'hidden',
//     justifyContent: 'flex-end',
//   },
//   statusImageStyle: {
//     borderRadius: 20,
//   },
//   videoPlayIcon: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginLeft: -12,
//     marginTop: -12,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 12,
//     padding: 4,
//   },
//   statusNameContainer: {
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 8,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   statusNameText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   viewCountText: {
//     color: '#fff',
//     fontSize: 10,
//     textAlign: 'center',
//     marginTop: 2,
//   },
//   deleteStatusButton: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     backgroundColor: '#ff4444',
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   liveStreamWrapper: {
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   liveStreamContainer: {
//     width: 80,
//     height: 120,
//     borderRadius: 20,
//     overflow: 'hidden',
//     backgroundColor: '#000',
//     position: 'relative',
//   },
//   liveStreamImage: {
//     width: '100%',
//     height: '100%',
//   },
//   liveStreamOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     padding: 8,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   liveIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   liveDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#FF0000',
//     marginRight: 4,
//   },
//   liveText: {
//     color: '#FF0000',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   liveStreamName: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   liveStreamStats: {
//     color: '#ccc',
//     fontSize: 10,
//   },
//   liveModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   liveModal: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     width: '90%',
//     maxHeight: '70%',
//     padding: 20,
//   },
//   liveModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   liveModalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   liveModalItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   liveModalAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   liveModalInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   liveModalName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   liveModalStats: {
//     fontSize: 14,
//     color: '#666',
//   },
//   emptyLive: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyLiveText: {
//     color: '#666',
//     fontSize: 16,
//   },
//   closeLiveModalButton: {
//     backgroundColor: colors.primary,
//     padding: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   closeLiveModalText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   viewersModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   viewersModal: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     width: '90%',
//     maxHeight: '70%',
//     padding: 20,
//   },
//   viewersModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   viewersModalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   viewerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   viewerAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   viewerName: {
//     fontSize: 16,
//     color: '#333',
//   },
//   emptyViewers: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyViewersText: {
//     color: '#666',
//     fontSize: 16,
//   },
//   promoContainer: {
//     height: 160,
//     borderRadius: 12,
//     overflow: 'hidden',
//     margin: 16,
//     marginTop: 8,
//     position: 'relative',
//   },
//   promoBanner: {
//     width: '100%',
//     height: '100%',
//   },
//   promoContent: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   promoTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 4,
//   },
//   promoSubtitle: {
//     fontSize: 16,
//     color: '#fff',
//     marginBottom: 12,
//   },
//   promoButton: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     alignSelf: 'flex-start',
//   },
//   promoButtonText: {
//     color: colors.primary,
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   suggestedFriendsContainer: {
//     backgroundColor: '#FAFAFA',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#E4E4E4',
//   },
//   suggestedFriendsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   suggestedFriendsList: {
//     paddingRight: 16,
//   },
//   suggestedFriendItem: {
//     width: 150,
//     alignItems: 'center',
//     marginRight: 12,
//     borderWidth:1,
//     borderColor:'#ddd',
//     borderStyle:'solid',
//     padding:15,
//     borderRadius:5,
//     backgroundColor:'#fff'
//   },
//   suggestedFriendImageContainer: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     borderWidth: 2,
//     borderColor: '#E4E4E4',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     position: 'relative',
//   },
//   suggestedFriendImage: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//   },
//   suggestedFriendVerified: {
//     position: 'absolute',
//     bottom: -2,
//     right: -2,
//     backgroundColor: '#1DA1F2',
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   suggestedFriendName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginTop: 8,
//     textAlign: 'center',
//     width: '100%',
//   },
//   suggestedFriendClub: {
//     fontSize: 12,
//     color: '#8E8E8E',
//     marginTop: 4,
//     textAlign: 'center',
//     width: '100%',
//   },
//   suggestedFriendFollowButton: {
//     backgroundColor: colors.primary,
//     paddingVertical: 6,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginTop: 8,
//     width: '100%',
//     alignItems: 'center',
//   },
//   suggestedFriendFollowButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   suggestedFriendFollowingButton: {
//     backgroundColor: '#f0f0f0',
//   },
//   suggestedFriendFollowingButtonText: {
//     color: '#333',
//   },
//   // Image Modal Styles
//   imageModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageModalCloseButton: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     zIndex: 10,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 8,
//   },
//   imageModalContent: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//   },
//   fullSizeImage: {
//     width: '100%',
//     height: '70%',
//   },
//   imageModalInfo: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     marginTop: -20,
//   },
//   imageModalUserInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   imageModalAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   imageModalUserText: {
//     flex: 1,
//   },
//   imageModalUsername: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   imageModalTime: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   imageModalCaption: {
//     fontSize: 15,
//     color: '#333',
//     lineHeight: 20,
//     marginBottom: 12,
//   },
//   imageModalStats: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   imageModalStat: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   imageModalStatText: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 6,
//   },
//   // Comment Styles
//   commentContainer: {
//     marginBottom: 20,
//     paddingHorizontal: 16,
//   },
//   commentRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   commentAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     marginRight: 12,
//   },
//   commentContent: {
//     flex: 1,
//   },
//   commentUsername: {
//     fontWeight: '600',
//     color: '#333',
//     fontSize: 14,
//   },
//   commentText: {
//     fontSize: 14,
//     color: '#333',
//     marginTop: 4,
//     lineHeight: 18,
//   },
//   commentActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   commentTimestamp: {
//     color: '#999',
//     fontSize: 12,
//     marginRight: 16,
//   },
//   actionText: {
//     color: colors.primary,
//     fontSize: 12,
//     marginRight: 16,
//   },
//   repliesWrapper: {
//     marginLeft: 0,
//     marginTop: 12,
//     paddingLeft: 12,
//     borderLeftWidth: 2,
//     borderLeftColor: '#f0f0f0',
//   },
//   replyContainer: {
//     flexDirection: 'row',
//     marginBottom: 12,
//   },
//   replyAvatar: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     marginRight: 8,
//   },
//   replyContent: {
//     flex: 1,
//     backgroundColor: '#f8f8f8',
//     padding: 8,
//     borderRadius: 12,
//   },
//   replyUsername: {
//     fontWeight: '600',
//     color: '#333',
//     fontSize: 12,
//   },
//   replyText: {
//     fontSize: 12,
//     color: '#333',
//     marginTop: 2,
//   },
//   replyTimestamp: {
//     color: '#999',
//     fontSize: 10,
//     marginTop: 4,
//   },
//   viewMoreReplies: {
//     color: colors.primary,
//     fontSize: 12,
//     fontWeight: '500',
//     marginTop: 8,
//   },
//   replyInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 12,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 20,
//     padding: 8,
//   },
//   replyInput: {
//     flex: 1,
//     fontSize: 14,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     color: '#333',
//   },
//   replySendButton: {
//     backgroundColor: colors.primary,
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   replySendButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 12,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#eee',
//     marginVertical: 16,
//   },
//   emptyComments: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyText: {
//     color: '#999',
//     fontSize: 14,
//   },
// });

// import axios from 'axios';
// import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   FlatList,
//   RefreshControl,
//   Image,
//   Alert,
//   Share,
//   StatusBar,
//   SafeAreaView,
//   ImageBackground,
//   Dimensions,
//   Animated,
//   LayoutAnimation,
//   ActivityIndicator,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Icontt from 'react-native-vector-icons/MaterialCommunityIcons';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import { Snackbar } from 'react-native-paper';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import Icon from 'react-native-vector-icons/Ionicons';
// import colors from '../theme/colors';
// import Icont from 'react-native-vector-icons/MaterialIcons';
// import Video from 'react-native-video';
// import FriendSuggestion from '../components/FriendSuggestion';
// // NEW: For skeleton loading (install: npm install react-native-skeleton-content)
// import SkeletonContent from 'react-native-skeleton-content';
// // NEW: For faster image loading (install: npm install react-native-fast-image)
// import FastImage from 'react-native-fast-image';

// dayjs.extend(relativeTime);

// const { width, height } = Dimensions.get('window');

// // Cache configuration
// const POSTS_CACHE_KEY = 'posts_cache_v2'; // Added version
// const ALL_POSTS_CACHE_KEY = 'all_posts_cache_v2';
// const VIEWS_CACHE_KEY = 'post_views_cache';
// const SHARES_CACHE_KEY = 'post_shares_cache';
// const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes
// const CACHE_VERSION = '2.0'; // For cache invalidation

// // Views tracking system - only count when image is opened in modal
// const trackPostView = async (postId) => {
//   try {
//     const viewsData = await AsyncStorage.getItem(VIEWS_CACHE_KEY);
//     const views = viewsData ? JSON.parse(viewsData) : {};
    
//     if (!views[postId]) {
//       views[postId] = {
//         count: 1,
//         timestamp: Date.now()
//       };
//     } else {
//       // Only count unique views per day
//       const lastViewTime = views[postId].timestamp;
//       const oneDay = 24 * 60 * 60 * 1000; // 24 hours
//       if (Date.now() - lastViewTime > oneDay) {
//         views[postId].count += 1;
//         views[postId].timestamp = Date.now();
//       }
//     }
    
//     await AsyncStorage.setItem(VIEWS_CACHE_KEY, JSON.stringify(views));
//     return views[postId].count;
//   } catch (error) {
//     console.error('Error tracking view:', error);
//     return 0;
//   }
// };

// const promoBanners = [
//   require('../assets/images/gdgdg.jpg'), 
//   require('../assets/images/how-much-won-prize-bonds-752x501.jpg'), 
// ];

// const getPostViews = async (postId) => {
//   try {
//     const viewsData = await AsyncStorage.getItem(VIEWS_CACHE_KEY);
//     const views = viewsData ? JSON.parse(viewsData) : {};
//     return views[postId]?.count || 0;
//   } catch (error) {
//     console.error('Error getting views:', error);
//     return 0;
//   }
// };

// // Shares tracking system
// const trackPostShare = async (postId) => {
//   try {
//     const sharesData = await AsyncStorage.getItem(SHARES_CACHE_KEY);
//     const shares = sharesData ? JSON.parse(sharesData) : {};
    
//     if (!shares[postId]) {
//       shares[postId] = {
//         count: 1,
//         timestamp: Date.now()
//       };
//     } else {
//       shares[postId].count += 1;
//       shares[postId].timestamp = Date.now();
//     }
    
//     await AsyncStorage.setItem(SHARES_CACHE_KEY, JSON.stringify(shares));
//     return shares[postId].count;
//   } catch (error) {
//     console.error('Error tracking share:', error);
//     return 0;
//   }
// };

// const getPostShares = async (postId) => {
//   try {
//     const sharesData = await AsyncStorage.getItem(SHARES_CACHE_KEY);
//     const shares = sharesData ? JSON.parse(sharesData) : {};
//     return shares[postId]?.count || 0;
//   } catch (error) {
//     console.error('Error getting shares:', error);
//     return 0;
//   }
// };

// // Image Modal Component
// const ImageModal = memo(({ visible, post, onClose, onView }) => {
//   const [viewsCount, setViewsCount] = useState(post?.views || 0);

//   useEffect(() => {
//     if (visible && post?.id) {
//       const trackView = async () => {
//         const newCount = await trackPostView(post.id);
//         setViewsCount(newCount);
//         if (onView) onView(post.id, newCount);
//       };
//       trackView();
//     }
//   }, [visible, post?.id]);

//   if (!post) return null;

//   return (
//     <Modal visible={visible} transparent={true} animationType="fade">
//       <View style={styles.imageModalOverlay}>
//         <TouchableOpacity 
//           style={styles.imageModalCloseButton}
//           onPress={onClose}
//         >
//           <Icon name="close" size={30} color="#fff" />
//         </TouchableOpacity>
        
//         <View style={styles.imageModalContent}>
//           {/* NEW: Use FastImage for faster loading */}
//           <FastImage
//             source={{ uri: `${API_ROUTE_IMAGE}${post.image}` }}
//             style={styles.fullSizeImage}
//             resizeMode={FastImage.resizeMode.contain}
//             priority={FastImage.priority.high}
//           />
          
//           <View style={styles.imageModalInfo}>
//             <View style={styles.imageModalUserInfo}>
//               {/* NEW: Use FastImage */}
//               <FastImage
//                 source={
//                   post.user_profile_picture
//                     ? { uri: post.user_profile_picture }
//                     : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                 }
//                 style={styles.imageModalAvatar}
//                 priority={FastImage.priority.normal}
//               />
//               <View style={styles.imageModalUserText}>
//                 <Text style={styles.imageModalUsername}>{post.username}</Text>
//                 <Text style={styles.imageModalTime}>{dayjs(post.created_at).fromNow()}</Text>
//               </View>
//             </View>
            
//             <Text style={styles.imageModalCaption}>{post.content}</Text>
            
//             <View style={styles.imageModalStats}>
//               <View style={styles.imageModalStat}>
//                 <Ionicons name="eye-outline" size={16} color="#666" />
//                 <Text style={styles.imageModalStatText}>{viewsCount} views</Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// });

// // Memoized Tweet Item Component
// const MemoizedTweetItem = memo(({ post, type, onReaction, onComment, onShare, onFollow, onOptions, onViewImage }) => {
//   const [isReadMore, setIsReadMore] = useState(true);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [viewsCount, setViewsCount] = useState(post.views || 0);
//   const [sharesCount, setSharesCount] = useState(post.shares || 0);
//   const postIdStr = post.id?.toString();
//   const reactions = post.reactions || {};
//   const userReaction = reactions.user_reaction;

//   // Load initial counts
//   useEffect(() => {
//     const loadCounts = async () => {
//       const [views, shares] = await Promise.all([
//         getPostViews(post.id),
//         getPostShares(post.id)
//       ]);
//       setViewsCount(views);
//       setSharesCount(shares);
//     };
//     loadCounts();
//   }, [post.id]);

//   const handleFollowPress = () => {
//     setIsFollowing(true);
//     onFollow(post.user_id);
//   };

//   const handleSharePress = async () => {
//     const newSharesCount = await onShare(post.id);
//     setSharesCount(newSharesCount);
//   };

//   return (
//     <View style={styles.tweetContainer}>
//       <TouchableOpacity onPress={() => {}}>
//         <View style={styles.avatarContainer}>
//           {/* NEW: Use FastImage */}
//           <FastImage
//             source={
//               post.user_profile_picture
//                 ? { uri: post.user_profile_picture }
//                 : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//             }
//             style={styles.avatar}
//             priority={FastImage.priority.normal}
//           />
//         </View>
//       </TouchableOpacity>
      
//       <View style={styles.tweetContent}>
//         <View style={styles.tweetHeader}>
//           <Text style={styles.name}>{post.username}</Text>
//           {post.is_verified && (
//             <View
//               style={{
//                 backgroundColor: "#1877F2", 
//                 borderRadius: 50,
//                 width: 16,
//                 height: 16,
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginLeft: 4,
//               }}
//             >
//               <Icontt name="check-bold" size={11} color="#fff" />
//             </View>
//           )}
//           {post.is_verified && (
//             <View
//               style={{
//                 backgroundColor: "green",
//                 borderRadius: 50,
//                 width: 16,
//                 height: 16,
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginLeft: 4,
//               }}
//             >
//               <Icontt name="check-bold" size={11} color="#fff" />
//             </View>
//           )}
//           <Text style={styles.dot}>·</Text>
//           <Text style={styles.time}>{dayjs(post.created_at).fromNow()}</Text>
          
//           {type === 'allposts' ? (
//             <TouchableOpacity
//               style={[styles.followButton, isFollowing && styles.followingButton]}
//               onPress={handleFollowPress}
//             >
//               <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
//                 {isFollowing ? 'Following' : 'Follow'}
//               </Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={styles.optionsButton}
//               onPress={() => onOptions(post.id, post.user_id)}
//             >
//               <Icon name="ellipsis-horizontal" size={18} color="#555" />
//             </TouchableOpacity>
//           )}
//         </View>
        
//         <Text style={styles.tweetText}>
//           {post.content.length > 150 ? (
//             <>
//               {isReadMore ? post.content.slice(0, 150) + '...' : post.content}
//               <Text style={styles.readMore} onPress={() => setIsReadMore(!isReadMore)}>
//                 {isReadMore ? ' Read more' : ' Show less'}
//               </Text>
//             </>
//           ) : (
//             post.content
//           )}
//         </Text>
        
//         {post && post.image && (
//           <TouchableOpacity onPress={() => onViewImage(post)}>
//             {/* NEW: Use FastImage */}
//             <FastImage
//               source={{ uri: `${API_ROUTE_IMAGE}${post.image}` }}
//               style={styles.tweetImage}
//               resizeMode={FastImage.resizeMode.cover}
//               priority={FastImage.priority.high}
//             />
//           </TouchableOpacity>
//         )}
        
//         <View style={styles.tweetActions}>
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => onReaction(post.id, 'like')}
//           >
//             <MaterialIcons
//               name={userReaction === 'like' ? 'thumb-up' : 'thumb-up-off-alt'}
//               size={20}
//               color={userReaction === 'like' ? colors.primary : '#555'}
//             />
//             <Text style={styles.actionCount}>{reactions.like || ''} likes</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => onComment(post.id)}
//           >
//             <Ionicons name="chatbubble-outline" size={18} color="#555" />
//             <Text style={styles.actionCount}>{post.commentCount || ''}Comments</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.actionButton}
//             onPress={handleSharePress}
//           >
//             <Ionicons name="share-social-outline" size={18} color="#555" />
//             <Text style={styles.actionCount}>{sharesCount}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.actionButton}
//             onPress={() => onViewImage(post)}
//           >
//             <Ionicons name="eye-outline" size={18} color="#555" />
//             <Text style={styles.actionCount}>{viewsCount}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// });

// // Memoized Status Preview Component
// const MemoizedStatusPreview = memo(({ userStatus, currentUserPhone, onPress, onViewers, onDelete }) => {
//   const isVideo = userStatus.status_type === 'video';
//   const isMyStatus = userStatus.user?.phone === currentUserPhone || userStatus.user === currentUserPhone;
//   const url = userStatus.statuses[0]?.media;
//   const path_img = url?.replace(/^https?:\/\/[^/]+/, '');

//   return (
//     <View style={styles.statusWrapper}>
//       <TouchableOpacity onPress={onPress}>
//         {/* NEW: Use FastImage */}
//         <FastImage
//           source={{ 
//             uri: url
//               ? `${API_ROUTE_IMAGE}${path_img}`
//               : 'https://via.placeholder.com/40' 
//           }}
//           style={styles.statusImage}
//           resizeMode={FastImage.resizeMode.cover}
//           priority={FastImage.priority.normal}
//         >
//           {isVideo && (
//             <View style={styles.videoPlayIcon}>
//               <Icon name="play" size={24} color="#fff" />
//             </View>
//           )}
          
//           <View style={styles.statusNameContainer}>
//             <Text style={styles.statusNameText}>
//               {isMyStatus ? 'My Story' : userStatus.user?.name || userStatus.user}
//             </Text>
//             {isMyStatus && userStatus.viewers_count > 0 && (
//               <TouchableOpacity onPress={() => onViewers(userStatus.viewers)}>
//                 <Text style={styles.viewCountText}>
//                   {userStatus.viewers_count} view{userStatus.viewers_count !== 1 ? 's' : ''}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </FastImage>
//       </TouchableOpacity>
      
//       {isMyStatus && (
//         <TouchableOpacity 
//           style={styles.deleteStatusButton}
//           onPress={() => onDelete(userStatus.statuses[0]?.id)}
//         >
//           <Icon name="close" size={16} color="#fff" />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// });

// // Suggested Friend Component
// const SuggestedFriendItem = memo(({ item, onFollow }) => {
//   const [isFollowing, setIsFollowing] = useState(false);

//   const handleFollow = () => {
//     setIsFollowing(true);
//     onFollow(item.id);
//   };

//   return (
//     <View style={styles.suggestedFriendItem}>
//       <TouchableOpacity onPress={() => {}}>
//         <View style={styles.suggestedFriendImageContainer}>
//           {/* NEW: Use FastImage */}
//           <FastImage
//             source={
//               item.profile_picture
//                 ? { uri: `${API_ROUTE_IMAGE}${item.profile_picture}` }
//                 : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//             }
//             style={styles.suggestedFriendImage}
//             priority={FastImage.priority.normal}
//           />
//           {item.is_verified && (
//             <View style={styles.suggestedFriendVerified}>
//               <Icont name="verified" size={12} color="#fff" />
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//       <Text style={styles.suggestedFriendName} numberOfLines={1}>
//         {item.username}
//       </Text>
//       {item.followers_count && (
//         <Text style={styles.suggestedFriendClub} numberOfLines={1}>
//           {item.followers_count} Followers
//         </Text>
//       )}
//       <TouchableOpacity
//         style={[styles.suggestedFriendFollowButton, isFollowing && styles.suggestedFriendFollowingButton]}
//         onPress={handleFollow}
//       >
//         <Text style={[styles.suggestedFriendFollowButtonText, isFollowing && styles.suggestedFriendFollowingButtonText]}>
//           {isFollowing ? 'Following' : 'Follow'}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// });

// export default function HomePage({ navigation }) {
  
//   const [reactionCounts, setReactionCounts] = useState({});
//   const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
//   const [isReplyBottomSheetVisible, setIsReplyBottomSheetVisible] = useState(false);
//   const [isOptionsBottomSheetVisible, setIsOptionsBottomSheetVisible] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState(null);
//   const [selectedCommentId, setSelectedCommentId] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const [postById, setPostById] = useState([]);
//   const [replyToCommentId, setReplyToCommentId] = useState(null);
//   const [replyText, setReplyText] = useState('');
//   const [posts, setPosts] = useState([]);
//   const [allposts, setAllPosts] = useState([]);
//   const [addStatusModalVisible, setAddStatusModalVisible] = useState(false);
//   const [username, setUsername] = useState('');
//   const [userId, setUserId] = useState('');
//   const [userPostWithID, setUsersSelectedPostId] = useState('');
//   const [userUID, setUserUid] = useState('');
//   const [userEmail, setUserEmail] = useState('');
//   const [userprofileimage, setUserProfileImage] = useState('');
//   const [snackbarVisible, setSnackbarVisible] = useState(false);
//   const [followedUsers, setFollowedUsers] = useState([]);
//   const [commentsss, setPostsComment] = useState([]);
//   const [commentLikesCount, setCommentLikesCount] = useState({});
//   const [refreshing, setRefreshing] = useState(false);
//   const [showSuggestedFriends, setShowSuggestedFriends] = useState(false);
//   const [suggestedFriends, setSuggestedFriends] = useState([]);
//   const [groupedStatuses, setGroupedStatuses] = useState([]);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [selectedUserStatuses, setSelectedUserStatuses] = useState([]);
//   const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
//   const [currentUserPhone, setCurrentUserPhone] = useState(null);
//   const [viewersModalVisible, setViewersModalVisible] = useState(false);
//   const [currentViewers, setCurrentViewers] = useState([]);
//   const [paused, setPaused] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [liveStreams, setLiveStreams] = useState([]);
//   const [loadingLiveStreams, setLoadingLiveStreams] = useState(false);
//   const [scrollCount, setScrollCount] = useState(0);
//   const [showLiveModal, setShowLiveModal] = useState(false);
//   const [postViews, setPostViews] = useState({});
//   const [selectedImagePost, setSelectedImagePost] = useState(null);
//   const [imageModalVisible, setImageModalVisible] = useState(false);
//   const [hasShownLiveModal, setHasShownLiveModal] = useState(false);
  
//   // NEW: Cache loading states
//   const [isCacheLoading, setIsCacheLoading] = useState(true);
//   const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

//   const abortControllerRef = useRef(null);
//   const scrollViewRef = useRef(null);

//   // NEW: Enhanced cache loading functions with version check
//   const loadPostsFromCache = useCallback(async () => {
//     try {
//       const cachedData = await AsyncStorage.getItem(POSTS_CACHE_KEY);
//       if (cachedData) {
//         const { data, timestamp, version } = JSON.parse(cachedData);
//         if (version !== CACHE_VERSION) {
//           await AsyncStorage.removeItem(POSTS_CACHE_KEY);
//           return false;
//         }
//         const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
//         if (isCacheValid) {
//           const enhancedPosts = await Promise.all(
//             data.map(async (post) => ({
//               ...post,
//               views: await getPostViews(post.id),
//               shares: await getPostShares(post.id),
//               is_verified: Math.random() > 0.7
//             }))
//           );
//           setPosts([...enhancedPosts].reverse());
//           return true;
//         }
//       }
//     } catch (error) {
//       console.error('Error loading posts from cache:', error);
//     }
//     return false;
//   }, []);

//   const loadAllPostsFromCache = useCallback(async () => {
//     try {
//       const cachedData = await AsyncStorage.getItem(ALL_POSTS_CACHE_KEY);
//       if (cachedData) {
//         const { data, timestamp, version } = JSON.parse(cachedData);
//         if (version !== CACHE_VERSION) {
//           await AsyncStorage.removeItem(ALL_POSTS_CACHE_KEY);
//           return false;
//         }
//         const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
//         if (isCacheValid) {
//           const sortedPosts = [...data].sort((a, b) => 
//             new Date(b.created_at) - new Date(a.created_at)
//           );
//           const filteredPosts = await filterUnfollowedUsers(sortedPosts);
//           const enhancedPosts = await Promise.all(
//             filteredPosts.map(async (post) => ({
//               ...post,
//               views: await getPostViews(post.id),
//               shares: await getPostShares(post.id),
//               is_verified: Math.random() > 0.6
//             }))
//           );
//           setAllPosts(enhancedPosts);
//           return true;
//         }
//       }
//     } catch (error) {
//       console.error('Error loading all posts from cache:', error);
//     }
//     return false;
//   }, []);

//   // Optimized data fetching with pagination
//   const fetchLiveStreams = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken"); 
//       setLoadingLiveStreams(true);
      
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//       abortControllerRef.current = new AbortController();

//       const res = await fetch(`${API_ROUTE}/live-streams/`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`, 
//         },
//         signal: abortControllerRef.current.signal
//       });

//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

//       const data = await res.json();
//       setLiveStreams(data);
//     } catch (err) {
//       if (err.name !== 'AbortError') {
//         console.warn("Error fetching live streams:", err);
//       }
//     } finally {
//       setLoadingLiveStreams(false);
//     }
//   }, []);

//   const fetchCurrentUser = useCallback(async () => {
//     try {
//       const userData = await AsyncStorage.getItem('userData');
//       if (userData) {
//         const parsedUserData = JSON.parse(userData);
//         setCurrentUserId(parsedUserData.id);
//         setCurrentUserPhone(parsedUserData.phone);
//       }
//     } catch (error) {
//       console.error('Error fetching current user:', error);
//     }
//   }, []);

//   const fetchStatus = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       const res = await axios.get(`${API_ROUTE}/status/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.status === 200 || res.status === 201) {
//         const grouped = groupStatusesByUser(res.data);
//         setGroupedStatuses(grouped);
//       }
//     } catch (error) {
//       console.error('Error fetching status:', error);
//     }
//   }, []);

//   const groupStatusesByUser = useCallback((statuses) => {
//     const grouped = {};
    
//     statuses.forEach(status => {
//       const userKey = status.user?.id || status.user;
      
//       if (!grouped[userKey]) {
//         grouped[userKey] = {
//           user: status.user,
//           statuses: [],
//           latestTime: new Date(status.created_at),
//           viewers_count: status.viewers_count,
//           viewers: status.viewers || [],
//           status_type: status.status_type
//         };
//       }
      
//       grouped[userKey].statuses.push(status);
//       const currentTime = new Date(status.created_at);
      
//       if (currentTime > grouped[userKey].latestTime) {
//         grouped[userKey].latestTime = currentTime;
//         grouped[userKey].viewers_count = status.viewers_count;
//         grouped[userKey].viewers = status.viewers || [];
//         grouped[userKey].status_type = status.status_type;
//       }
//     });
    
//     return Object.values(grouped).sort((a, b) => b.latestTime - a.latestTime);
//   }, []);

//   // NEW: Enhanced fetchPosts with pagination and cache
//   const fetchPosts = useCallback(async (forceRefresh = false, page = 1, deltaParams = {}) => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) {
//       setIsCacheLoading(false);
//       return;
//     }

//     try {
//       // Always try cache first for immediate display
//       if (!forceRefresh) {
//         const cacheLoaded = await loadPostsFromCache();
//         if (cacheLoaded) {
//           // Don't return here - still fetch fresh data in background
//         }
//       }

//       // Build query params for pagination and delta
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: '10',
//         ...deltaParams
//       });
      
//       const response = await axios.get(`${API_ROUTE}/posts/?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200) {
//         const rawData = response.data.results || response.data;
//         // Enhance posts with views data
//         const enhancedPosts = await Promise.all(
//           rawData.map(async (post) => ({
//             ...post,
//             views: await getPostViews(post.id),
//             shares: await getPostShares(post.id),
//             is_verified: Math.random() > 0.7
//           }))
//         );
        
//         const reversedData = [...enhancedPosts].reverse();
//         setPosts(prev => page === 1 ? reversedData : [...prev, ...reversedData]);
//         await AsyncStorage.setItem(
//           POSTS_CACHE_KEY,
//           JSON.stringify({ 
//             data: rawData, 
//             timestamp: Date.now(), 
//             version: CACHE_VERSION 
//           })
//         );
//       }
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     } finally {
//       setIsCacheLoading(false);
//     }
//   }, [loadPostsFromCache]);

//   // NEW: Enhanced fetchAllPosts with pagination and cache
//   const fetchAllPosts = useCallback(async (forceRefresh = false, page = 1, deltaParams = {}) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       // Try cache first for immediate display
//       if (!forceRefresh) {
//         const cacheLoaded = await loadAllPostsFromCache();
//         if (cacheLoaded) {
//           // Continue to fetch fresh data
//         }
//       }

//       // Build query params
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: '10',
//         ...deltaParams
//       });

//       const [postsResponse, followedUsers] = await Promise.all([
//         axios.get(`${API_ROUTE}/get-all-post/?${params.toString()}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetchFollowedUsers(),
//       ]);

//       if (postsResponse.status === 200) {
//         const rawData = postsResponse.data.results || postsResponse.data;
//         await AsyncStorage.setItem(
//           ALL_POSTS_CACHE_KEY,
//           JSON.stringify({ 
//             data: rawData, 
//             timestamp: Date.now(), 
//             version: CACHE_VERSION 
//           })
//         );

//         const sortedPosts = [...rawData].sort((a, b) => 
//           new Date(b.created_at) - new Date(a.created_at)
//         );
//         const filteredPosts = await filterUnfollowedUsers(sortedPosts);
//         // Enhance posts with views data
//         const enhancedPosts = await Promise.all(
//           filteredPosts.map(async (post) => ({
//             ...post,
//             views: await getPostViews(post.id),
//             shares: await getPostShares(post.id),
//             is_verified: Math.random() > 0.6
//           }))
//         );
//         setAllPosts(prev => page === 1 ? enhancedPosts : [...prev, ...enhancedPosts]);
//         setFollowedUsers(followedUsers);
//       }
//     } catch (error) {
//       console.error('Error fetching all posts:', error);
//     }
//   }, [loadAllPostsFromCache]);

//   const filterUnfollowedUsers = async (posts) => {
//     const followedUsers = await fetchFollowedUsers();
//     const seenUsers = new Set();
//     const filteredPosts = [];

//     for (const post of posts) {
//       if (!seenUsers.has(post.user_id) && !followedUsers.includes(post.user_id)) {
//         seenUsers.add(post.user_id);
//         filteredPosts.push(post);
//       }
//       if (filteredPosts.length === 20) break;
//     }

//     return filteredPosts;
//   };

//   const fetchFollowedUsers = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return [];

//       const response = await axios.get(`${API_ROUTE}/followed-users/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 200) {
//         return response.data.map(user => user.id);
//       }
//       return [];
//     } catch (error) {
//       console.error('Error fetching followed users:', error);
//       return [];
//     }
//   }, []);

//   const fetchReactions = useCallback(async () => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) return;

//     try {
//       const response = await axios.get(`${API_ROUTE}/all-post-reaction/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setReactionCounts(response.data.reactions);
//     } catch (error) {
//       console.error('Error fetching reactions:', error);
//     }
//   }, []);

//   const fetchSuggestedFriends = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;
      
//       const response = await axios.get(`${API_ROUTE}/suggested-friends/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       if (response.status === 200) {
//         // Enhance suggested friends with verified status
//         const enhancedFriends = response.data.map(friend => ({
//           ...friend,
//           is_verified: Math.random() > 0.8, // Simulate verified users
//           followers_count: Math.floor(Math.random() * 1000) + 100 // Simulate followers count
//         }));
//         setSuggestedFriends(enhancedFriends);
//       }
//     } catch (error) {
//       console.error('Error fetching suggested friends:', error);
//     }
//   }, []);

//   // Optimized handlers
//   const handleReactionOptimized = useCallback(async (postId, type) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       setReactionCounts((prev) => {
//         const postIdStr = postId.toString();
//         const currentReactions = prev[postIdStr] || { like: 0, love: 0, support: 0 };
//         const newReactions = { ...currentReactions };

//         if (newReactions.user_reaction === type) {
//           newReactions[type] = (newReactions[type] || 0) - 1;
//           newReactions.user_reaction = null;
//         } else {
//           if (newReactions.user_reaction) {
//             newReactions[newReactions.user_reaction] = (newReactions[newReactions.user_reaction] || 0) - 1;
//           }
//           newReactions[type] = (newReactions[type] || 0) + 1;
//           newReactions.user_reaction = type;
//         }

//         return { ...prev, [postIdStr]: newReactions };
//       });

//       axios.post(
//         `${API_ROUTE}/post-react/`,
//         { post_id: postId, reaction_type: type },
//         { headers: { Authorization: `Bearer ${token}` } }
//       ).catch(console.error);
//     } catch (error) {
//       console.error('Error handling reaction:', error);
//     }
//   }, []);

//   const handleCommentOptimized = useCallback(async (postId) => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (!token) return;

//     try {
//       const [postResponse, commentsResponse] = await Promise.all([
//         axios.get(`${API_ROUTE}/posts/${postId}/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${API_ROUTE}/get-posts-comment/${postId}/comments/all/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//       ]);

//       if (postResponse.status === 200) {
//         setPostById(postResponse.data);
//         setSelectedPostId(postId);
        
//         if (commentsResponse.status === 200) {
//           const parentComments = commentsResponse.data.filter(comment => !comment.parent);
//           setPostsComment(prev => {
//             const otherComments = prev.filter(c => c.post !== postId);
//             return [...otherComments, ...parentComments];
//           });
//         }
        
//         setIsBottomSheetVisible(true);
//       }
//     } catch (error) {
//       console.error('Error fetching post details:', error);
//     }
//   }, []);

//   const handleShareOptimized = useCallback(async (postId) => {
//     try {
//       const post = posts.find(p => p.id === postId) || allposts.find(p => p.id === postId);
//       if (!post) return 0;

//       const shareOptions = {
//         message: `${post.content}\n\nShared from Showa`,
//         url: post.image ? `${API_ROUTE_IMAGE}${post.image}` : undefined,
//         title: `Post by ${post.username}`,
//       };

//       await Share.share(shareOptions);
      
//       // Track the share
//       const newSharesCount = await trackPostShare(postId);
//       setIsOptionsBottomSheetVisible(false);
//       setSnackbarVisible(true);
      
//       return newSharesCount;
//     } catch (error) {
//       console.error('Error sharing post:', error);
//       return 0;
//     }
//   }, [posts, allposts]);

//   const handleOptionsOptimized = useCallback((postId, userId) => {
//     setSelectedPostId(postId);
//     setUsersSelectedPostId(userId);
//     setIsOptionsBottomSheetVisible(true);
//   }, []);

//   const handleFollow = useCallback(async (userId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       await axios.post(
//         `${API_ROUTE}/follow-user/${userId}/`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setFollowedUsers((prev) => [...prev, userId]);
//       setAllPosts((prev) => prev.filter((post) => post.user_id !== userId));
//       setSuggestedFriends((prev) => prev.filter((friend) => friend.id !== userId));
//       setSnackbarVisible(true);
//     } catch (error) {
//       console.error('Error following user:', error);
//     }
//   }, []);

//   const handleViewUser = useCallback((userId) => {
//     navigation.navigate('BroadcastUserProfile', { user_ID: userId });
//   }, [navigation]);

//   const handleUnfollow = useCallback(async () => {
//     const userId = userPostWithID;
//     if (!userId) return;

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       await axios.delete(`${API_ROUTE}/unfollow-user/${userId}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setFollowedUsers((prev) => prev.filter((follower) => follower !== userId));
//       setSnackbarVisible(true);
//       setIsOptionsBottomSheetVisible(false);
//     } catch (error) {
//       console.error('Error unfollowing user:', error);
//     }
//   }, [userPostWithID]);

//   const handleBookmark = useCallback(async (postId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.post(
//         `${API_ROUTE}/bookmark-post/`,
//         { post: postId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSnackbarVisible(true);
//       setIsOptionsBottomSheetVisible(false);
//     } catch (error) {
//       console.error('Error bookmarking post:', error);
//     }
//   }, []);

//   // Status management functions
//   const openImageModal = useCallback((userStatuses) => {
//     setSelectedUserStatuses(userStatuses.statuses);
//     setCurrentStatusIndex(0);
//     setModalVisible(true);
//     setPaused(false);
//   }, []);

//   const showViewers = useCallback((viewers) => {
//     setCurrentViewers(viewers);
//     setViewersModalVisible(true);
//   }, []);

//   const deleteStatus = useCallback(async (statusId) => {
//     if (!statusId) return;

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.delete(`${API_ROUTE}/status/${statusId}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       setGroupedStatuses(prev => 
//         prev.filter(status => 
//           !status.statuses.some(s => s.id === statusId)
//         )
//       );
//       setSnackbarVisible(true);
//     } catch (error) {
//       console.error('Error deleting status:', error);
//       Alert.alert('Error', 'Failed to delete status');
//     }
//   }, []);

//   // Image modal functions
//   const handleViewImage = useCallback((post) => {
//     setSelectedImagePost(post);
//     setImageModalVisible(true);
//   }, []);

//   const handleImageModalClose = useCallback(() => {
//     setImageModalVisible(false);
//     setSelectedImagePost(null);
//   }, []);

//   const handleImageViewed = useCallback((postId, newCount) => {
//     // Update views count in the posts state
//     setPosts(prev => prev.map(post => 
//       post.id === postId ? { ...post, views: newCount } : post
//     ));
//     setAllPosts(prev => prev.map(post => 
//       post.id === postId ? { ...post, views: newCount } : post
//     ));
//   }, []);

//   // NEW: Debounced scroll handler (requires lodash: npm install lodash)
//   // For simplicity, using a simple throttle here
//   const handleScroll = useCallback((event) => {
//     const scrollY = event.nativeEvent.contentOffset.y;
//     const postHeight = 500;
    
//     if (scrollY > postHeight * 4 && !showSuggestedFriends) {
//       setShowSuggestedFriends(true);
//     }

//     // Only show live modal once, after scrolling past 8 posts
//     if (scrollY > postHeight * 8 && !hasShownLiveModal && liveStreams.length > 0) {
//       setShowLiveModal(true);
//       setHasShownLiveModal(true); // Mark as shown
//     }
//   }, [showSuggestedFriends, hasShownLiveModal, liveStreams.length]);

//   // Comment and Reply functionality
//   const onCommentSubmitPost = useCallback(async () => {
//     if (!newComment.trim() || !selectedPostId) {
//       console.log('Comment text is empty or no post selected.');
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         console.log('No token found, cannot post comment.');
//         return;
//       }

//       const userData = await AsyncStorage.getItem('userData');
//       const parsedUser = userData ? JSON.parse(userData) : null;
//       const loginUserId = parsedUser?.id;

//       if (!loginUserId) {
//         console.warn('User ID not found in stored data.');
//         return;
//       }

//       const tempCommentId = `temp_${Date.now()}`;
//       const newCommentData = {
//         id: tempCommentId,
//         post: selectedPostId,
//         user: {
//           id: loginUserId,
//           username: username,
//           image: userprofileimage,
//         },
//         text: newComment.trim(),
//         created_at: new Date().toISOString(),
//         image: userprofileimage,
//         replies: [],
//       };

//       setPostsComment((prev) => {
//         const updatedComments = [newCommentData, ...prev.filter((c) => c.post === selectedPostId)];
//         return [...prev.filter((c) => c.post !== selectedPostId), ...updatedComments];
//       });

//       const response = await axios.post(
//         `${API_ROUTE}/posts-comment/${selectedPostId}/comments/`,
//         {
//           text: newComment.trim(),
//           post: selectedPostId,
//           user: loginUserId,
//           image: userprofileimage,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         setPostsComment((prev) => {
//           const updatedComments = prev.map((comment) =>
//             comment.id === tempCommentId
//               ? {
//                   ...comment,
//                   id: response.data.id,
//                 }
//               : comment
//           );
//           return updatedComments;
//         });
//         setNewComment('');
//         setSnackbarVisible(true);
//       } else {
//         console.log('Failed to post comment:', response.data);
//         setPostsComment((prev) => {
//           const updatedComments = prev.filter((comment) => comment.id !== tempCommentId);
//           return updatedComments;
//         });
//       }
//     } catch (error) {
//       console.error('Failed to post comment:', error);
//       setPostsComment((prev) => {
//         const updatedComments = prev.filter((comment) => comment.id !== `temp_${Date.now()}`);
//         return updatedComments;
//       });
//     }
//   }, [newComment, selectedPostId, username, userprofileimage]);

//   const onCommentSubmitReply = useCallback(async () => {
//     if (!replyText.trim() || !selectedCommentId) {
//       console.log('Reply text is empty or no comment selected.');
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         console.log('No token found, cannot post reply.');
//         return;
//       }

//       const userData = await AsyncStorage.getItem('userData');
//       const parsedUser = userData ? JSON.parse(userData) : null;
//       const loginUserId = parsedUser?.id;

//       if (!loginUserId) {
//         console.warn('User ID not found in stored data.');
//         return;
//       }

//       const tempReplyId = `temp_reply_${Date.now()}`;
//       const newReplyData = {
//         id: tempReplyId,
//         username: username,
//         text: replyText.trim(),
//         userAvatar: userprofileimage,
//         created_at: new Date().toISOString(),
//       };

//       setPostsComment((prev) => {
//         const updatedComments = prev.map((comment) =>
//           comment.id === selectedCommentId
//             ? {
//                 ...comment,
//                 replies: comment.replies
//                   ? [...comment.replies, newReplyData]
//                   : [newReplyData],
//               }
//             : comment
//         );
//         return updatedComments;
//       });

//       const response = await axios.post(
//         `${API_ROUTE}/posts-comment/${selectedPostId}/comments/`,
//         {
//           text: replyText.trim(),
//           post: selectedPostId,
//           user: loginUserId,
//           image: userprofileimage,
//           parent: selectedCommentId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         setPostsComment((prev) => {
//           const updatedComments = prev.map((comment) =>
//             comment.id === selectedCommentId
//               ? {
//                   ...comment,
//                   replies: comment.replies.map((reply) =>
//                     reply.id === tempReplyId
//                       ? {
//                           ...reply,
//                           id: response.data.id,
//                         }
//                       : reply
//                   ),
//                 }
//               : comment
//           );
//           return updatedComments;
//         });

//         setReplyText('');
//         setReplyToCommentId(null);
//         setSnackbarVisible(true);
//       } else {
//         console.log('Failed to post reply:', response.data);
//         setPostsComment((prev) => {
//           const updatedComments = prev.map((comment) =>
//             comment.id === selectedCommentId
//               ? {
//                   ...comment,
//                   replies: comment.replies.filter((reply) => reply.id !== tempReplyId),
//                 }
//               : comment
//           );
//           return updatedComments;
//         });
//       }
//     } catch (error) {
//       console.error('Failed to post reply:', error);
//       setPostsComment((prev) => {
//         const updatedComments = prev.map((comment) =>
//           comment.id === selectedCommentId
//             ? {
//                 ...comment,
//                 replies: comment.replies.filter((reply) => reply.id !== tempReplyId),
//               }
//             : comment
//         );
//         return updatedComments;
//       });
//     }
//   }, [replyText, selectedCommentId, selectedPostId, username, userprofileimage]);

//   const handleReply = useCallback((username, commentId) => {
//     setReplyToCommentId(commentId);
//     setReplyText('');
//   }, []);

//   const onPostCommentLikes = useCallback(async (commentId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       const userData = await AsyncStorage.getItem('userData');
//       const parsedUser = userData ? JSON.parse(userData) : null;
//       const loginUserId = parsedUser?.id;

//       if (!loginUserId) return;

//       setCommentLikesCount((prev) => ({
//         ...prev,
//         [commentId]: (prev[commentId] || 0) + 1,
//       }));

//       const response = await axios.post(
//         `${API_ROUTE}/post-comments-like/${commentId}/like/`,
//         {
//           user: loginUserId,
//           comment: commentId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         setSnackbarVisible(true);
//       } else {
//         setCommentLikesCount((prev) => ({
//           ...prev,
//           [commentId]: (prev[commentId] || 1) - 1,
//         }));
//       }
//     } catch (error) {
//       console.error('Failed to like comment:', error);
//       setCommentLikesCount((prev) => ({
//         ...prev,
//         [commentId]: (prev[commentId] || 1) - 1,
//       }));
//     }
//   }, []);

//   // NEW: Enhanced refresh function with delta updates
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       const lastFetchTime = await AsyncStorage.getItem('last_fetch_time');
//       const deltaParams = lastFetchTime ? { since: lastFetchTime } : {};
      
//       await Promise.all([
//         fetchPosts(true, 1, deltaParams),
//         fetchAllPosts(true, 1, deltaParams),
//         fetchStatus(),
//         fetchSuggestedFriends(),
//         fetchLiveStreams()
//       ]);
      
//       await AsyncStorage.setItem('last_fetch_time', new Date().toISOString());
//     } catch (error) {
//       console.error('Error refreshing data:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   }, [fetchPosts, fetchAllPosts, fetchStatus, fetchSuggestedFriends, fetchLiveStreams]);

//   // NEW: Load more posts on scroll end
//   const handleLoadMore = useCallback(() => {
//     if (!isCacheLoading) {
//       const nextPage = Math.ceil(posts.length / 10) + 1;
//       const nextAllPage = Math.ceil(allposts.length / 10) + 1;
//       fetchPosts(false, nextPage);
//       fetchAllPosts(false, nextAllPage);
//     }
//   }, [isCacheLoading, posts.length, allposts.length, fetchPosts, fetchAllPosts]);

//   // NEW: Initialize data with cache-first approach and staggered fetches
//   useEffect(() => {
//     const initializeData = async () => {
//       setIsCacheLoading(true);
      
//       // Load cached data first for immediate display
//       await Promise.all([
//         loadPostsFromCache(),
//         loadAllPostsFromCache(),
//         fetchCurrentUser(),
//         fetchStatus(),
//       ]);
      
//       setIsInitialLoadComplete(true);
//       setIsCacheLoading(false);
      
//       // Load secondary data in background with delay
//       setTimeout(() => {
//         Promise.all([
//           fetchPosts(true),
//           fetchAllPosts(true),
//           fetchReactions(),
//           fetchSuggestedFriends(),
//           fetchLiveStreams(),
//         ]).catch(console.error);
//       }, 1000);
//     };

//     initializeData();

//     return () => {
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, [loadPostsFromCache, loadAllPostsFromCache, fetchCurrentUser, fetchStatus, fetchPosts, fetchAllPosts, fetchReactions, fetchSuggestedFriends, fetchLiveStreams]);

//   // NEW: Preload images for first few posts
//   useEffect(() => {
//     if (posts.length > 0) {
//       const images = posts
//         .slice(0, 5)
//         .map((post) => post.image ? { uri: `${API_ROUTE_IMAGE}${post.image}` } : null)
//         .filter((img) => img);
//       if (images.length > 0) {
//         FastImage.preload(images);
//       }
//     }
//   }, [posts]);

//   // NEW: Preload cache on app start
//   useFocusEffect(
//     useCallback(() => {
//       // Pre-warm the cache when screen comes into focus
//       const preloadCache = async () => {
//         try {
//           // Just accessing the cache to ensure it's ready
//           await AsyncStorage.getItem(POSTS_CACHE_KEY);
//           await AsyncStorage.getItem(ALL_POSTS_CACHE_KEY);
//         } catch (error) {
//           console.error('Error preloading cache:', error);
//         }
//       };
      
//       preloadCache();
//     }, [])
//   );

//   // Memoized data
//   const myStatus = React.useMemo(() => 
//     groupedStatuses.find(status => 
//       status.user?.phone === currentUserPhone || status.user === currentUserPhone
//     ),
//     [groupedStatuses, currentUserPhone]
//   );

//   const otherStatuses = React.useMemo(() => 
//     groupedStatuses.filter(status => 
//       status.user?.phone !== currentUserPhone && status.user !== currentUserPhone
//     ),
//     [groupedStatuses, currentUserPhone]
//   );

//   const combinedPosts = React.useMemo(() => [
//     ...posts.map(post => ({ 
//       type: 'followed', 
//       post: {
//         ...post,
//         reactions: reactionCounts[post.id?.toString()] || {},
//         commentCount: commentsss.filter(c => c.post === post.id).length
//       }
//     })),
//     ...allposts.map(post => ({ 
//       type: 'allposts', 
//       post: {
//         ...post,
//         reactions: reactionCounts[post.id?.toString()] || {},
//         commentCount: commentsss.filter(c => c.post === post.id).length
//       }
//     }))
//   ].sort((a, b) => new Date(b.post.created_at) - new Date(a.post.created_at)), 
//   [posts, allposts, reactionCounts, commentsss]);

//   // NEW: Enhanced render functions
//   const renderStatusRow = useCallback(() => {
//     const hasLiveStreams = liveStreams && liveStreams.length > 0;

//     return (
//       <View style={{ marginTop: 10, marginBottom: 20 }}>
//         <Text style={[styles.sectionTitle, {color:'#333'}]}>
//           {hasLiveStreams ? 'Live & Status' : 'Status'}
//         </Text>
        
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.statusScrollContainer}
//         >
//           {/* My Status */}
//           {myStatus && (
//             <MemoizedStatusPreview 
//               userStatus={myStatus}
//               currentUserPhone={currentUserPhone}
//               onPress={() => openImageModal(myStatus)}
//               onViewers={() => showViewers(myStatus.viewers)}
//               onDelete={deleteStatus}
//             />
//           )}

//           {/* Live Streams */}
//           {hasLiveStreams && liveStreams.map((liveStream) => (
//             <TouchableOpacity 
//               key={liveStream.id}
//               style={styles.liveStreamWrapper}
//               onPress={() => {
//                 navigation.navigate('LiveStreamViewer', { streamId: liveStream.stream_id });
//               }}
//             >
//               <View style={styles.liveStreamContainer}>
//                 {/* NEW: Use FastImage */}
//                 <FastImage
//                   source={{ 
//                     uri: liveStream.broadcaster_image 
//                       ? `${API_ROUTE_IMAGE}${liveStream.broadcaster_image.replace(/^https?:\/\/[^/]+/, '')}`
//                       : 'https://via.placeholder.com/40' 
//                   }}
//                   style={styles.liveStreamImage}
//                   priority={FastImage.priority.normal}
//                 />
//                 <View style={styles.liveStreamOverlay}>
//                   <View style={styles.liveIndicator}>
//                     <View style={styles.liveDot} />
//                     <Text style={styles.liveText}>LIVE</Text>
//                   </View>
//                   <Text style={styles.liveStreamName} numberOfLines={1}>
//                     {liveStream.broadcaster_name}
//                   </Text>
//                   <Text style={styles.liveStreamStats}>
//                     {liveStream.likes} likes
//                   </Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}
          
//           {/* Other Statuses */}
//           {otherStatuses.map((userStatus) => (
//             <MemoizedStatusPreview 
//               key={userStatus.user?.id}
//               userStatus={userStatus}
//               currentUserPhone={currentUserPhone}
//               onPress={() => openImageModal(userStatus)}
//               onViewers={() => showViewers(userStatus.viewers)}
//               onDelete={deleteStatus}
//             />
//           ))}
//         </ScrollView>
//       </View>
//     );
//   }, [myStatus, otherStatuses, liveStreams, currentUserPhone, openImageModal, showViewers, deleteStatus]);

//   const renderLiveModal = () => (
//     <Modal visible={showLiveModal} animationType="slide" transparent>
//       <View style={styles.liveModalOverlay}>
//         <View style={styles.liveModal}>
//           <View style={styles.liveModalHeader}>
//             <Text style={styles.liveModalTitle}>Live Now 🔴</Text>
//             <TouchableOpacity onPress={() => setShowLiveModal(false)}>
//               <Icon name="close" size={24} color="#333" />
//             </TouchableOpacity>
//           </View>
          
//           <FlatList
//             data={liveStreams}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={({ item }) => (
//               <TouchableOpacity 
//                 style={styles.liveModalItem}
//                 onPress={() => {
//                   setShowLiveModal(false);
//                   navigation.navigate('LiveStreamViewer', { streamId: item.stream_id });
//                 }}
//               >
//                 {/* NEW: Use FastImage */}
//                 <FastImage
//                   source={{ 
//                     uri: item.broadcaster_image 
//                       ? `${API_ROUTE_IMAGE}${item.broadcaster_image.replace(/^https?:\/\/[^/]+/, '')}`
//                       : 'https://via.placeholder.com/40' 
//                   }}
//                   style={styles.liveModalAvatar}
//                   priority={FastImage.priority.normal}
//                 />
//                 <View style={styles.liveModalInfo}>
//                   <Text style={styles.liveModalName}>{item.broadcaster_name}</Text>
//                   <View style={styles.liveIndicator}>
//                     <View style={styles.liveDot} />
//                     <Text style={styles.liveText}>LIVE NOW</Text>
//                   </View>
//                 </View>
//                 <Text style={styles.liveModalStats}>{item.likes} likes</Text>
//               </TouchableOpacity>
//             )}
//             ListEmptyComponent={
//               <View style={styles.emptyLive}>
//                 <Text style={styles.emptyLiveText}>No one is live right now</Text>
//               </View>
//             }
//           />
          
//           <TouchableOpacity 
//             style={styles.closeLiveModalButton}
//             onPress={() => setShowLiveModal(false)}
//           >
//             <Text style={styles.closeLiveModalText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );

//   const renderViewersModal = () => (
//     <Modal visible={viewersModalVisible} animationType="slide" transparent>
//       <View style={styles.viewersModalOverlay}>
//         <View style={styles.viewersModal}>
//           <View style={styles.viewersModalHeader}>
//             <Text style={styles.viewersModalTitle}>Viewers</Text>
//             <TouchableOpacity onPress={() => setViewersModalVisible(false)}>
//               <Icon name="close" size={24} color="#333" />
//             </TouchableOpacity>
//           </View>
          
//           <FlatList
//             data={currentViewers}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({ item }) => (
//               <View style={styles.viewerItem}>
//                 {/* NEW: Use FastImage */}
//                 <FastImage
//                   source={{ 
//                     uri: item.profile_picture 
//                       ? `${API_ROUTE_IMAGE}${item.profile_picture}`
//                       : 'https://via.placeholder.com/40' 
//                   }}
//                   style={styles.viewerAvatar}
//                   priority={FastImage.priority.normal}
//                 />
//                 <Text style={styles.viewerName}>{item.username || 'Unknown User'}</Text>
//               </View>
//             )}
//             ListEmptyComponent={
//               <View style={styles.emptyViewers}>
//                 <Text style={styles.emptyViewersText}>No viewers yet</Text>
//               </View>
//             }
//           />
//         </View>
//       </View>
//     </Modal>
//   );

//   const renderComment = useCallback(({ item }) => {
//     const replyCount = item.replies ? item.replies.length : 0;

//     return (
//       <View style={styles.commentContainer}>
//         <View style={styles.commentRow}>
//           {/* NEW: Use FastImage */}
//           <FastImage
//             source={
//               item.image
//                 ? { uri: item.image }
//                 : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//             }
//             style={styles.commentAvatar}
//             priority={FastImage.priority.normal}
//           />
//           <View style={styles.commentContent}>
//             <Text style={styles.commentUsername}>
//               {item.user?.username || item.username}
//             </Text>
//             <Text style={styles.commentText}>{item.text}</Text>
//             <View style={styles.commentActions}>
//               <Text style={styles.commentTimestamp}>{dayjs(item.created_at).fromNow()}</Text>
//               <TouchableOpacity onPress={() => onPostCommentLikes(item.id)}>
//                 <Text style={styles.actionText}>{commentLikesCount[item.id] || 0} Like</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleReply(item.user?.username || item.username, item.id)}>
//                 <Text style={styles.actionText}>Reply</Text>
//               </TouchableOpacity>
//             </View>
            
//             {/* Replies */}
//             {replyCount > 0 && (
//               <View style={styles.repliesWrapper}>
//                 {item.replies.slice(0, 3).map((reply, index) => (
//                   <View key={index} style={styles.replyContainer}>
//                     {/* NEW: Use FastImage */}
//                     <FastImage
//                       source={
//                         reply.userAvatar
//                           ? { uri: reply.userAvatar }
//                           : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                       }
//                       style={styles.replyAvatar}
//                       priority={FastImage.priority.low}
//                     />
//                     <View style={styles.replyContent}>
//                       <Text style={styles.replyUsername}>{reply.username}</Text>
//                       <Text style={styles.replyText}>{reply.text}</Text>
//                       <Text style={styles.replyTimestamp}>{dayjs(reply.created_at).fromNow()}</Text>
//                     </View>
//                   </View>
//                 ))}
//                 {replyCount > 3 && (
//                   <TouchableOpacity
//                     onPress={() => {
//                       setSelectedCommentId(item.id);
//                       setIsReplyBottomSheetVisible(true);
//                     }}
//                   >
//                     <Text style={styles.viewMoreReplies}>View {replyCount - 3} more replies</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             )}

//             {/* Reply Input */}
//             {replyToCommentId === item.id && (
//               <View style={styles.replyInputContainer}>
//                 <TextInput
//                   placeholder={`Replying to ${item.user?.username || item.username}...`}
//                   value={replyText}
//                   onChangeText={setReplyText}
//                   style={styles.replyInput}
//                   placeholderTextColor='#666'
//                   multiline
//                 />
//                 <TouchableOpacity
//                   onPress={onCommentSubmitReply}
//                   style={styles.replySendButton}
//                 >
//                   <Text style={styles.replySendButtonText}>Reply</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         </View>
//       </View>
//     );
//   }, [replyToCommentId, replyText, onCommentSubmitReply, handleReply, onPostCommentLikes, commentLikesCount]);

//   const renderSuggestedFriend = useCallback(({ item }) => (
//     <SuggestedFriendItem item={item} onFollow={handleFollow} />
//   ), [handleFollow]);

//   // NEW: Enhanced content render with skeleton loading and load more
//   const renderContent = useCallback(() => {
//     // Show skeleton only if no cached data
//     if (isCacheLoading && combinedPosts.length === 0) {
//       return (
//         <SkeletonContent
//           containerStyle={styles.loadingContainer}
//           isLoading={true}
//           layout={[
//             { key: 'status', width: '100%', height: 120, marginBottom: 16 },
//             { key: 'promo', width: '100%', height: 160, marginBottom: 16 },
//             { key: 'post1', width: '100%', height: 400, marginBottom: 16 },
//             { key: 'post2', width: '100%', height: 400, marginBottom: 16 },
//             { key: 'friend', width: '100%', height: 100, marginBottom: 16 },
//             { key: 'post3', width: '100%', height: 400, marginBottom: 16 },
//           ]}
//         />
//       );
//     }

//     const middleIndex = Math.floor(combinedPosts.length / 2);
//     const firstHalf = combinedPosts.slice(0, middleIndex);
//     const secondHalf = combinedPosts.slice(middleIndex);

//     // Calculate position for FriendSuggestion - show after 2-3 posts in first half
//     const friendSuggestionIndex = Math.min(2, firstHalf.length - 1);
//     const firstPart = firstHalf.slice(0, friendSuggestionIndex);
//     const secondPart = firstHalf.slice(friendSuggestionIndex);

//     return (
//       <>
//         {/* Status Section */}
//         {renderStatusRow()}

//         {/* Show refresh indicator if loading fresh data but we have cached content */}
//         {isCacheLoading && combinedPosts.length > 0 && (
//           <View style={styles.refreshingIndicator}>
//             <ActivityIndicator size="small" color={colors.primary} />
//             <Text style={styles.refreshingText}>Updating feed...</Text>
//           </View>
//         )}

//         {/* Promo Banner */}
//         <View style={styles.promoContainer}>
//           <FastImage
//             source={promoBanners[0]} 
//             style={styles.promoBanner}
//             resizeMode={FastImage.resizeMode.cover}
//           />
//           <View style={styles.promoContent}>
//             <Text style={styles.promoTitle}>Earn Massive Income</Text>
//             <Text style={styles.promoSubtitle}>Up to 5m instantly</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Earnings')} style={styles.promoButton}>
//               <Text style={styles.promoButtonText}>Get Started Now</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* First Part of Posts (2-3 posts) */}
//         <FlatList
//           data={firstPart}
//           keyExtractor={(item, index) => `${item.type}-${item.post.id?.toString() || index.toString()}`}
//           renderItem={({ item }) => (
//             <MemoizedTweetItem 
//               post={item.post} 
//               type={item.type}
//               onReaction={handleReactionOptimized}
//               onComment={handleCommentOptimized}
//               onShare={handleShareOptimized}
//               onFollow={handleFollow}
//               onOptions={handleOptionsOptimized}
//               onViewImage={handleViewImage}
//             />
//           )}
//           scrollEnabled={false}
//           initialNumToRender={3}
//           maxToRenderPerBatch={5}
//           windowSize={5}
//         />

//         {/* Friend Suggestion Section - Strategic Placement */}
//         <View style={styles.friendSuggestionWrapper}>
//           <FriendSuggestion />
//         </View>

//         {/* Second Part of First Half Posts */}
//         <FlatList
//           data={secondPart}
//           keyExtractor={(item, index) => `${item.type}-${item.post.id?.toString() || index.toString()}`}
//           renderItem={({ item }) => (
//             <MemoizedTweetItem 
//               post={item.post} 
//               type={item.type}
//               onReaction={handleReactionOptimized}
//               onComment={handleCommentOptimized}
//               onShare={handleShareOptimized}
//               onFollow={handleFollow}
//               onOptions={handleOptionsOptimized}
//               onViewImage={handleViewImage}
//             />
//           )}
//           scrollEnabled={false}
//           initialNumToRender={3}
//           maxToRenderPerBatch={5}
//           windowSize={5}
//         />

//         {/* Suggested Friends Section */}
//         {showSuggestedFriends && suggestedFriends.length > 0 && (
//           <View style={styles.suggestedFriendsContainer}>
//             <View style={styles.suggestedFriendsHeader}>
//               <Text style={[styles.sectionTitle, {color:'#777', fontSize:18}]}>People to follow</Text>
//             </View>
//             <FlatList
//               data={suggestedFriends}
//               renderItem={renderSuggestedFriend}
//               keyExtractor={(item, index) => index.toString()}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.suggestedFriendsList}
//               initialNumToRender={3}
//             />
//           </View>
//         )}

//         {/* Second Half of Posts with load more */}
//         <FlatList
//           data={secondHalf}
//           keyExtractor={(item, index) => `${item.type}-${item.post.id?.toString() || index.toString()}`}
//           renderItem={({ item }) => (
//             <MemoizedTweetItem 
//               post={item.post} 
//               type={item.type}
//               onReaction={handleReactionOptimized}
//               onComment={handleCommentOptimized}
//               onShare={handleShareOptimized}
//               onFollow={handleFollow}
//               onOptions={handleOptionsOptimized}
//               onViewImage={handleViewImage}
//             />
//           )}
//           scrollEnabled={false}
//           initialNumToRender={3}
//           maxToRenderPerBatch={5}
//           windowSize={5}
//           onEndReached={handleLoadMore}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={
//             isCacheLoading ? (
//               <View style={{ padding: 20, alignItems: 'center' }}>
//                 <ActivityIndicator size="small" color={colors.primary} />
//                 <Text style={{ marginTop: 8, color: '#666' }}>Loading more...</Text>
//               </View>
//             ) : null
//           }
//         />

//         {/* Additional Friend Suggestion at the end for better visibility */}
//         {combinedPosts.length > 8 && (
//           <View style={styles.friendSuggestionBottom}>
//             <FriendSuggestion />
//           </View>
//         )}
//       </>
//     );
//   }, [combinedPosts, isCacheLoading, showSuggestedFriends, suggestedFriends, renderStatusRow, handleReactionOptimized, handleCommentOptimized, handleShareOptimized, handleFollow, handleOptionsOptimized, handleViewImage, handleLoadMore]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Broadcast</Text>
//         <View style={styles.headerActions}>
//           <TouchableOpacity 
//             onPress={() => {
//               navigation.navigate('Broadcaster', {
//                 roomName: 'match-123',
//                 streamId: 'stream-1',
//               });
//             }}
//             style={styles.goLiveButton}
//           >
//             <Ionicons name="radio" size={20} color="#333" />
//             <Text style={styles.goLiveText}>Go Live</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity onPress={() => navigation.navigate('CreateBroadcastPost')}>
//             <Ionicons name="add-circle-outline" size={34} color='#333' />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView
//         ref={scrollViewRef}
//         refreshControl={
//           <RefreshControl 
//             refreshing={refreshing} 
//             onRefresh={onRefresh}
//             colors={[colors.primary]}
//             tintColor={colors.primary}
//           />
//         }
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         removeClippedSubviews={true}
//         showsVerticalScrollIndicator={false}
//       >
//         {renderContent()}
//       </ScrollView>

//       {/* Floating Action Button */}
//       <TouchableOpacity 
//         style={styles.fab}
//         onPress={() => navigation.navigate('CreateBroadcastPost')}
//       >
//         <Icon name="add" size={24} color="#fff" />
//       </TouchableOpacity>

//       {/* Image Modal */}
//       <ImageModal
//         visible={imageModalVisible}
//         post={selectedImagePost}
//         onClose={handleImageModalClose}
//         onView={handleImageViewed}
//       />

//       {/* Live Modal */}
//       {renderLiveModal()}

//       {/* Viewers Modal */}
//       {renderViewersModal()}

//       {/* Comment Modal */}
//       <Modal visible={isBottomSheetVisible} animationType="slide" transparent>
//         <View style={styles.overlay}>
//           <View style={styles.commentModal}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Comments</Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setIsBottomSheetVisible(false);
//                   setReplyToCommentId(null);
//                   setNewComment('');
//                 }}
//                 style={styles.closeButton}
//               >
//                 <Ionicons name="close" size={26} color="#333" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView contentContainerStyle={styles.modalContent}>
//               {postById && (
//                 <View style={styles.postPreview}>
//                   <View style={styles.postHeader}>
//                     {/* NEW: Use FastImage */}
//                     <FastImage
//                       source={
//                         postById.user_profile_picture
//                           ? { uri: postById.user_profile_picture }
//                           : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                       }
//                       style={styles.postAvatar}
//                       priority={FastImage.priority.normal}
//                     />
//                     <View style={styles.postInfo}>
//                       <Text style={styles.postUsername}>
//                         {postById.username || 'Anonymous'}
//                       </Text>
//                       <Text style={styles.postTimestamp}>
//                         {dayjs(postById.created_at).fromNow()}
//                       </Text>
//                     </View>
//                   </View>
//                   <Text style={styles.postContent}>{postById.content}</Text>
//                   {postById.image && (
//                     // NEW: Use FastImage
//                     <FastImage
//                       source={{ uri: `${API_ROUTE_IMAGE}${postById.image}` }}
//                       style={styles.postImagePreview}
//                       resizeMode={FastImage.resizeMode.cover}
//                       priority={FastImage.priority.high}
//                     />
//                   )}
//                 </View>
//               )}

//               <View style={styles.divider} />

//               {/* Comments List */}
//               <FlatList
//                 data={commentsss.filter((c) => c.post === selectedPostId && !c.parent)}
//                 keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//                 scrollEnabled={false}
//                 renderItem={renderComment}
//                 ListEmptyComponent={
//                   <View style={styles.emptyComments}>
//                     <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
//                   </View>
//                 }
//               />

//               {/* Comment Input */}
//               <View style={styles.commentInputContainer}>
//                 <TextInput
//                   placeholder="Write a comment..."
//                   value={newComment}
//                   onChangeText={setNewComment}
//                   style={styles.commentInput}
//                   placeholderTextColor='#666'
//                   multiline
//                 />
//                 <TouchableOpacity
//                   onPress={onCommentSubmitPost}
//                   style={styles.sendButton}
//                   disabled={!newComment.trim()}
//                 >
//                   <Text style={[styles.sendButtonText, !newComment.trim() && styles.sendButtonDisabled]}>
//                     Post
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {/* Reply Modal */}
//       <Modal visible={isReplyBottomSheetVisible} animationType="slide" transparent>
//         <View style={styles.overlay}>
//           <View style={styles.replyModal}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Replies</Text>
//               <TouchableOpacity
//                 onPress={() => setIsReplyBottomSheetVisible(false)}
//                 style={styles.closeButton}
//               >
//                 <Ionicons name="close" size={26} color="#333" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView contentContainerStyle={styles.modalContent}>
//               {selectedCommentId && (
//                 <View style={styles.commentContainer}>
//                   <View style={styles.commentRow}>
//                     {/* NEW: Use FastImage */}
//                     <FastImage
//                       source={
//                         commentsss.find(c => c.id === selectedCommentId)?.image
//                           ? { uri: commentsss.find(c => c.id === selectedCommentId)?.image }
//                           : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                       }
//                       style={styles.commentAvatar}
//                       priority={FastImage.priority.normal}
//                     />
//                     <View style={styles.commentContent}>
//                       <Text style={styles.commentUsername}>
//                         {commentsss.find(c => c.id === selectedCommentId)?.user?.username || commentsss.find(c => c.id === selectedCommentId)?.username}
//                       </Text>
//                       <Text style={styles.commentText}>
//                         {commentsss.find(c => c.id === selectedCommentId)?.text}
//                       </Text>
//                       <Text style={styles.commentTimestamp}>
//                         {dayjs(commentsss.find(c => c.id === selectedCommentId)?.created_at).fromNow()}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               )}
//               <View style={styles.repliesWrapper}>
//                 <FlatList
//                   data={commentsss.find((comment) => comment.id === selectedCommentId)?.replies || []}
//                   keyExtractor={(item, index) => index.toString()}
//                   scrollEnabled={false}
//                   renderItem={({ item }) => (
//                     <View style={styles.replyContainer}>
//                       {/* NEW: Use FastImage */}
//                       <FastImage
//                         source={
//                           item.userAvatar
//                             ? { uri: item.userAvatar }
//                             : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
//                         }
//                         style={styles.replyAvatar}
//                         priority={FastImage.priority.low}
//                       />
//                       <View style={styles.replyContent}>
//                         <Text style={styles.replyUsername}>{item.username}</Text>
//                         <Text style={styles.replyText}>{item.text}</Text>
//                         <Text style={styles.replyTimestamp}>{dayjs(item.created_at).fromNow()}</Text>
//                       </View>
//                     </View>
//                   )}
//                   ListEmptyComponent={
//                     <View style={styles.emptyComments}>
//                       <Text style={styles.emptyText}>No replies yet.</Text>
//                     </View>
//                   }
//                 />
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {/* Options Modal */}
//       <Modal visible={isOptionsBottomSheetVisible} animationType="slide" transparent>
//         <View style={styles.overlay}>
//           <View style={styles.optionsModal}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Post Options</Text>
//               <TouchableOpacity
//                 onPress={() => setIsOptionsBottomSheetVisible(false)}
//                 style={styles.closeButton}
//               >
//                 <Ionicons name="close" size={26} color="#333" />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.optionsContainer}>
//               <TouchableOpacity
//                 style={styles.optionItem}
//                 onPress={() => handleShareOptimized(selectedPostId)}
//               >
//                 <Ionicons name="share-social-outline" size={24} color="#333" />
//                 <Text style={styles.optionText}>Share</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.optionItem}
//                 onPress={() => handleBookmark(selectedPostId)}
//               >
//                 <Ionicons name="bookmark-outline" size={24} color="#333" />
//                 <Text style={styles.optionText}>Bookmark</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.optionItem}
//                 onPress={()=>{
//                   setIsOptionsBottomSheetVisible(false);
//                   handleUnfollow();
//                 }}
//               >
//                 <Ionicons name="person-remove-outline" size={24} color="#333" />
//                 <Text style={styles.optionText}>Unfollow</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.optionItem}
//                 onPress={() => navigation.navigate('ReportPost', {postId: selectedPostId})}
//               >
//                 <Ionicons name="flag-outline" size={24} color="#333" />
//                 <Text style={styles.optionText}>Report Post</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Snackbar
//         visible={snackbarVisible}
//         onDismiss={() => setSnackbarVisible(false)}
//         duration={3000}
//       >
//         Action completed successfully!
//       </Snackbar>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: "#fff" 
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#ddd",
//     backgroundColor: '#fff',
//     elevation: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   headerTitle: {
//     fontSize: 30,
//     color: colors.primary,
//     fontWeight: 'bold',
//   },
//   headerActions: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   goLiveButton: {
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   goLiveText: {
//     fontSize: 10,
//     color: '#333',
//     marginTop: 2,
//   },
  
//   // NEW: Loading styles
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 100,
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#666',
//   },
//   refreshingIndicator: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#f8f8f8',
//   },
//   refreshingText: {
//     marginLeft: 8,
//     fontSize: 14,
//     color: '#666',
//   },
  
//   // Friend Suggestion Styles
//   friendSuggestionWrapper: {
//     marginVertical: 16,
//     paddingHorizontal: 8,
//     backgroundColor: '#FAFBFC',
//     borderRadius: 12,
//     marginHorizontal: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   friendSuggestionBottom: {
//     marginVertical: 20,
//     paddingHorizontal: 8,
//     backgroundColor: '#FAFBFC',
//     borderRadius: 12,
//     marginHorizontal: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },

//   tweetContainer: {
//     flexDirection: "row",
//     padding: 15,
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#eee",
//     backgroundColor: '#fff',
//   },
//   avatarContainer: {
//     position: 'relative',
//   },
//   avatar: { 
//     width: 40, 
//     height: 40, 
//     borderRadius: 20,
//   },
//   verifiedBadge: {
//     position: 'absolute',
//     bottom: -2,
//     right: -2,
//     backgroundColor: '#1DA1F2',
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   verifiedBadgeSmall: {
//     marginLeft: 4,
//     backgroundColor: '#1DA1F2',
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tweetContent: { 
//     flex: 1, 
//     marginLeft: 12,
//   },
//   tweetHeader: { 
//     flexDirection: "row", 
//     alignItems: "center", 
//     flexWrap: "wrap",
//     marginBottom: 8,
//   },
//   name: { 
//     fontWeight: "bold", 
//     fontSize: 16,
//     color: '#333',
//   },
//   dot: { 
//     marginHorizontal: 6, 
//     color: "#555",
//     fontSize: 16,
//   },
//   time: { 
//     color: "#666",
//     fontSize: 14,
//   },
//   tweetText: { 
//     fontSize: 15, 
//     lineHeight: 20,
//     color: "#333",
//     marginBottom: 8,
//   },
//   tweetImage: {
//     width: "100%",
//     borderRadius: 12,
//     marginBottom: 8,
//     resizeMode: "cover", 
//     maxHeight: 700,      
//     minHeight: 300,      
//   },
//   tweetActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 0,
//   },
//   actionButton: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     borderRadius: 10,
//     padding: 0,
//     paddingHorizontal: 12,
//     minWidth: 60,
//     justifyContent: 'center',
//   },
//   actionCount: {
//     marginLeft: 6,
//     fontSize: 14,
//     color: '#555',
//   },
//   readMore: {
//     color: colors.primary,
//     fontWeight: '600',
//   },
//   followButton: {
//     backgroundColor: colors.primary,
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginLeft: 'auto',
//   },
//   followButtonText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   followingButton: {
//     backgroundColor: '#f0f0f0',
//   },
//   followingButtonText: {
//     color: '#333',
//   },
//   optionsButton: {
//     marginLeft: 'auto',
//     padding: 4,
//   },
//   fab: {
//     position: "absolute",
//     bottom: 30,
//     right: 20,
//     backgroundColor: colors.primary,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'flex-end',
//   },
//   commentModal: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     maxHeight: '90%',
//   },
//   optionsModal: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     paddingBottom: 20,
//   },
//   replyModal: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     maxHeight: '70%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   modalContent: {
//     paddingBottom: 20,
//   },
//   optionsContainer: {
//     paddingHorizontal: 16,
//   },
//   optionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   optionText: {
//     fontSize: 16,
//     color: '#333',
//     marginLeft: 12,
//   },
//   postPreview: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   postHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   postAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   postInfo: {
//     flex: 1,
//   },
//   postUsername: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   postTimestamp: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   postContent: {
//     fontSize: 15,
//     color: '#333',
//     lineHeight: 20,
//     marginBottom: 12,
//   },
//   postImagePreview: {
//     width: '100%',
//     height: 200,
//     borderRadius: 12,
//   },
//   commentInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   commentInput: {
//     flex: 1,
//     fontSize: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 24,
//     marginRight: 12,
//     color: '#333',
//   },
//   sendButton: {
//     backgroundColor: colors.primary,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 24,
//   },
//   sendButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   sendButtonDisabled: {
//     opacity: 0.5,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginLeft: 16,
//     marginBottom: 12,
//   },
//   statusScrollContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   statusWrapper: {
//     alignItems: 'center',
//     marginRight: 12,
//     position: 'relative',
//   },
//   statusImage: {
//     width: 80,
//     height: 120,
//     borderRadius: 20,
//     overflow: 'hidden',
//     justifyContent: 'flex-end',
//   },
//   statusImageStyle: {
//     borderRadius: 20,
//   },
//   videoPlayIcon: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginLeft: -12,
//     marginTop: -12,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 12,
//     padding: 4,
//   },
//   statusNameContainer: {
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 8,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   statusNameText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   viewCountText: {
//     color: '#fff',
//     fontSize: 10,
//     textAlign: 'center',
//     marginTop: 2,
//   },
//   deleteStatusButton: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     backgroundColor: '#ff4444',
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   liveStreamWrapper: {
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   liveStreamContainer: {
//     width: 80,
//     height: 120,
//     borderRadius: 20,
//     overflow: 'hidden',
//     backgroundColor: '#000',
//     position: 'relative',
//   },
//   liveStreamImage: {
//     width: '100%',
//     height: '100%',
//   },
//   liveStreamOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     padding: 8,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   liveIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   liveDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#FF0000',
//     marginRight: 4,
//   },
//   liveText: {
//     color: '#FF0000',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   liveStreamName: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   liveStreamStats: {
//     color: '#ccc',
//     fontSize: 10,
//   },
//   liveModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   liveModal: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     width: '90%',
//     maxHeight: '70%',
//     padding: 20,
//   },
//   liveModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   liveModalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   liveModalItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   liveModalAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   liveModalInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   liveModalName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   liveModalStats: {
//     fontSize: 14,
//     color: '#666',
//   },
//   emptyLive: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyLiveText: {
//     color: '#666',
//     fontSize: 16,
//   },
//   closeLiveModalButton: {
//     backgroundColor: colors.primary,
//     padding: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   closeLiveModalText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   viewersModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   viewersModal: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     width: '90%',
//     maxHeight: '70%',
//     padding: 20,
//   },
//   viewersModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   viewersModalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   viewerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   viewerAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   viewerName: {
//     fontSize: 16,
//     color: '#333',
//   },
//   emptyViewers: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyViewersText: {
//     color: '#666',
//     fontSize: 16,
//   },
//   promoContainer: {
//     height: 160,
//     borderRadius: 12,
//     overflow: 'hidden',
//     margin: 16,
//     marginTop: 8,
//     position: 'relative',
//   },
//   promoBanner: {
//     width: '100%',
//     height: '100%',
//   },
//   promoContent: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   promoTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 4,
//   },
//   promoSubtitle: {
//     fontSize: 16,
//     color: '#fff',
//     marginBottom: 12,
//   },
//   promoButton: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     alignSelf: 'flex-start',
//   },
//   promoButtonText: {
//     color: colors.primary,
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   suggestedFriendsContainer: {
//     backgroundColor: '#FAFAFA',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#E4E4E4',
//   },
//   suggestedFriendsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   suggestedFriendsList: {
//     paddingRight: 16,
//   },
//   suggestedFriendItem: {
//     width: 150,
//     alignItems: 'center',
//     marginRight: 12,
//     borderWidth:1,
//     borderColor:'#ddd',
//     borderStyle:'solid',
//     padding:15,
//     borderRadius:5,
//     backgroundColor:'#fff'
//   },
//   suggestedFriendImageContainer: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     borderWidth: 2,
//     borderColor: '#E4E4E4',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     position: 'relative',
//   },
//   suggestedFriendImage: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//   },
//   suggestedFriendVerified: {
//     position: 'absolute',
//     bottom: -2,
//     right: -2,
//     backgroundColor: '#1DA1F2',
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   suggestedFriendName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginTop: 8,
//     textAlign: 'center',
//     width: '100%',
//   },
//   suggestedFriendClub: {
//     fontSize: 12,
//     color: '#8E8E8E',
//     marginTop: 4,
//     textAlign: 'center',
//     width: '100%',
//   },
//   suggestedFriendFollowButton: {
//     backgroundColor: colors.primary,
//     paddingVertical: 6,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginTop: 8,
//     width: '100%',
//     alignItems: 'center',
//   },
//   suggestedFriendFollowButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   suggestedFriendFollowingButton: {
//     backgroundColor: '#f0f0f0',
//   },
//   suggestedFriendFollowingButtonText: {
//     color: '#333',
//   },
//   // Image Modal Styles
//   imageModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageModalCloseButton: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     zIndex: 10,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 8,
//   },
//   imageModalContent: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//   },
//   fullSizeImage: {
//     width: '100%',
//     height: '70%',
//   },
//   imageModalInfo: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     marginTop: -20,
//   },
//   imageModalUserInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   imageModalAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   imageModalUserText: {
//     flex: 1,
//   },
//   imageModalUsername: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   imageModalTime: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   imageModalCaption: {
//     fontSize: 15,
//     color: '#333',
//     lineHeight: 20,
//     marginBottom: 12,
//   },
//   imageModalStats: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   imageModalStat: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   imageModalStatText: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 6,
//   },
//   // Comment Styles
//   commentContainer: {
//     marginBottom: 20,
//     paddingHorizontal: 16,
//   },
//   commentRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   commentAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     marginRight: 12,
//   },
//   commentContent: {
//     flex: 1,
//   },
//   commentUsername: {
//     fontWeight: '600',
//     color: '#333',
//     fontSize: 14,
//   },
//   commentText: {
//     fontSize: 14,
//     color: '#333',
//     marginTop: 4,
//     lineHeight: 18,
//   },
//   commentActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   commentTimestamp: {
//     color: '#999',
//     fontSize: 12,
//     marginRight: 16,
//   },
//   actionText: {
//     color: colors.primary,
//     fontSize: 12,
//     marginRight: 16,
//   },
//   repliesWrapper: {
//     marginLeft: 0,
//     marginTop: 12,
//     paddingLeft: 12,
//     borderLeftWidth: 2,
//     borderLeftColor: '#f0f0f0',
//   },
//   replyContainer: {
//     flexDirection: 'row',
//     marginBottom: 12,
//   },
//   replyAvatar: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     marginRight: 8,
//   },
//   replyContent: {
//     flex: 1,
//     backgroundColor: '#f8f8f8',
//     padding: 8,
//     borderRadius: 12,
//   },
//   replyUsername: {
//     fontWeight: '600',
//     color: '#333',
//     fontSize: 12,
//   },
//   replyText: {
//     fontSize: 12,
//     color: '#333',
//     marginTop: 2,
//   },
//   replyTimestamp: {
//     color: '#999',
//     fontSize: 10,
//     marginTop: 4,
//   },
//   viewMoreReplies: {
//     color: colors.primary,
//     fontSize: 12,
//     fontWeight: '500',
//     marginTop: 8,
//   },
//   replyInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 12,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 20,
//     padding: 8,
//   },
//   replyInput: {
//     flex: 1,
//     fontSize: 14,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     color: '#333',
//   },
//   replySendButton: {
//     backgroundColor: colors.primary,
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   replySendButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 12,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#eee',
//     marginVertical: 16,
//   },
//   emptyComments: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   emptyText: {
//     color: '#999',
//     fontSize: 14,
//   },
// });
///////////////////////////// FASTER FETCH FROM CACHE THEN RUNNING BACKGROUND UPDATE /////////////////////////////////


import axios from 'axios';
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  RefreshControl,
  Image,
  Alert,
  Share,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Animated,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icontt from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colorscustom';
import Icont from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import FriendSuggestion from '../components/FriendSuggestion';
import backgroundFetchService from '../src/services/BackgroundFetchService';

dayjs.extend(relativeTime);

const { width, height } = Dimensions.get('window');

// Cache configuration
const POSTS_CACHE_KEY = 'posts_cache';
const ALL_POSTS_CACHE_KEY = 'all_posts_cache';
const VIEWS_CACHE_KEY = 'post_views_cache';
const SHARES_CACHE_KEY = 'post_shares_cache';
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes




// Views tracking system
const trackPostView = async (postId) => {
  try {
    const viewsData = await AsyncStorage.getItem(VIEWS_CACHE_KEY);
    const views = viewsData ? JSON.parse(viewsData) : {};
    
    if (!views[postId]) {
      views[postId] = {
        count: 1,
        timestamp: Date.now()
      };
    } else {
      const lastViewTime = views[postId].timestamp;
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - lastViewTime > oneDay) {
        views[postId].count += 1;
        views[postId].timestamp = Date.now();
      }
    }
    
    await AsyncStorage.setItem(VIEWS_CACHE_KEY, JSON.stringify(views));
    return views[postId].count;
  } catch (error) {
    console.error('Error tracking view:', error);
    return 0;
  }
};

const getPostViews = async (postId) => {
  try {
    const viewsData = await AsyncStorage.getItem(VIEWS_CACHE_KEY);
    const views = viewsData ? JSON.parse(viewsData) : {};
    return views[postId]?.count || 0;
  } catch (error) {
    console.error('Error getting views:', error);
    return 0;
  }
};

// Shares tracking system
const trackPostShare = async (postId) => {
  try {
    const sharesData = await AsyncStorage.getItem(SHARES_CACHE_KEY);
    const shares = sharesData ? JSON.parse(sharesData) : {};
    
    if (!shares[postId]) {
      shares[postId] = {
        count: 1,
        timestamp: Date.now()
      };
    } else {
      shares[postId].count += 1;
      shares[postId].timestamp = Date.now();
    }
    
    await AsyncStorage.setItem(SHARES_CACHE_KEY, JSON.stringify(shares));
    return shares[postId].count;
  } catch (error) {
    console.error('Error tracking share:', error);
    return 0;
  }
};

const getPostShares = async (postId) => {
  try {
    const sharesData = await AsyncStorage.getItem(SHARES_CACHE_KEY);
    const shares = sharesData ? JSON.parse(sharesData) : {};
    return shares[postId]?.count || 0;
  } catch (error) {
   // console.error('Error getting shares:', error);
    return 0;
  }
};

// Image Modal Component
const ImageModal = memo(({ visible, post, onClose, onView }) => {
  const [viewsCount, setViewsCount] = useState(post?.views || 0);

  useEffect(() => {
    if (visible && post?.id) {
      const trackView = async () => {
        const newCount = await trackPostView(post.id);
        setViewsCount(newCount);
        if (onView) onView(post.id, newCount);
      };
      trackView();
    }
  }, [visible, post?.id]);

  if (!post) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.imageModalOverlay}>
        <TouchableOpacity 
          style={styles.imageModalCloseButton}
          onPress={onClose}
        >
          <Icon name="close" size={30} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.imageModalContent}>
          <Image
            source={{ uri: `${API_ROUTE_IMAGE}${post.image}` }}
            style={styles.fullSizeImage}
            resizeMode="contain"
          />
          
          <View style={styles.imageModalInfo}>
            <View style={styles.imageModalUserInfo}>
              <Image
                source={
                  post.user_profile_picture
                    ? { uri: post.user_profile_picture }
                    : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                }
                style={styles.imageModalAvatar}
              />
              <View style={styles.imageModalUserText}>
                <Text style={styles.imageModalUsername}>{post.username}</Text>
                <Text style={styles.imageModalTime}>{dayjs(post.created_at).fromNow()}</Text>
              </View>
            </View>
            
            <Text style={styles.imageModalCaption}>{post.content}</Text>
            
            <View style={styles.imageModalStats}>
              <View style={styles.imageModalStat}>
                <Ionicons name="eye-outline" size={16} color="#666" />
                <Text style={styles.imageModalStatText}>{viewsCount} views</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
});

// Memoized Tweet Item Component
const MemoizedTweetItem = memo(({ post, type, onReaction, onComment, onShare, onFollow, onOptions, onViewImage, }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewsCount, setViewsCount] = useState(post.views || 0);
  const [sharesCount, setSharesCount] = useState(post.shares || 0);
  const postIdStr = post.id?.toString();
  const reactions = post.reactions || {};
  const userReaction = reactions.user_reaction;

  const navigation = useNavigation();



  // Load initial counts
  useEffect(() => {
    const loadCounts = async () => {
      const [views, shares] = await Promise.all([
        getPostViews(post.id),
        getPostShares(post.id)
      ]);
      setViewsCount(views);
      setSharesCount(shares);
    };
    loadCounts();
  }, [post.id]);

  const handleFollowPress = () => {
    setIsFollowing(true);
    onFollow(post.user_id);
  };

  const handleSharePress = async () => {
    const newSharesCount = await onShare(post.id);
    setSharesCount(newSharesCount);
    handleShare(post);
  };

const handleShare = async (post) => {
  try {

    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_ROUTE}/post-react/`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        post_id: post.id,
        reaction_type: 'share'
      }),
    });
    
    const data = await response.json();
    
    // 2. Show reward notification
    // if (data.reward?.coins) {
    //   console.log(`Earned ${data.reward.coins} coins!`);
    // }
    
    // 3. Return the share count for UI update
   // return data.share_count || (post.share_count + 1);
    
  } catch (error) {
    console.error('Share failed:', error);
    //return post.share_count; // Return original count on error
  }
};

// Usage in component:
const [shares, setShares] = useState(post.share_count);

{/* <TouchableOpacity onPress={async () => {
  const newCount = await handleShare(post);
  setShares(newCount);
}}>
  <Text>Share ({shares})</Text>
</TouchableOpacity> */}

  return (
    <View style={styles.tweetContainer}>
      <TouchableOpacity  onPress={() => navigation.navigate('OtherUserProfile', { userId: post.id })}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              post.user_profile_picture
                ? { uri: post.user_profile_picture }
                : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
            }
            style={styles.avatar}
          />
        </View>
      </TouchableOpacity>
      
      <View style={styles.tweetContent}>
        <View style={styles.tweetHeader}>
          <Text style={styles.name}>{post.username}</Text>
          {post.is_verified && (
            <View
              style={{
                backgroundColor: "#1877F2", 
                borderRadius: 50,
                width: 16,
                height: 16,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 4,
              }}
            >
              <Icontt name="check-bold" size={11} color="#fff" />
            </View>
          )}
          {post.is_verified && (
            <View
              style={{
                backgroundColor: "green",
                borderRadius: 50,
                width: 16,
                height: 16,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 4,
              }}
            >
              <Icontt name="check-bold" size={11} color="#fff" />
            </View>
          )}
          <Text style={styles.dot}>·</Text>
          <Text style={styles.time}>{dayjs(post.created_at).fromNow()}</Text>
          
          {type === 'allposts' ? (
            <TouchableOpacity
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={handleFollowPress}
            >
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => onOptions(post.id, post.user_id)}
            >
              <Icon name="ellipsis-horizontal" size={18} color="#555" />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.tweetText}>
          {post.content.length > 150 ? (
            <>
              {isReadMore ? post.content.slice(0, 150) + '...' : post.content}
              <Text style={styles.readMore} onPress={() => setIsReadMore(!isReadMore)}>
                {isReadMore ? ' Read more' : ' Show less'}
              </Text>
            </>
          ) : (
            post.content
          )}
        </Text>
        
        {post && post.image && (
          <TouchableOpacity onPress={() => onViewImage(post)}>
            <Image
              source={{ uri: `${API_ROUTE_IMAGE}${post.image}` }}
              style={styles.tweetImage}
            />
          </TouchableOpacity>
        )}
        
        <View style={styles.tweetActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onReaction(post.id, 'like')}
          >
            <MaterialIcons
              name={userReaction === 'like' ? 'thumb-up' : 'thumb-up-off-alt'}
              size={20}
              color={userReaction === 'like' ? colors.primary : '#555'}
            />
            <Text style={styles.actionCount}>{reactions.like || ''} likes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onComment(post.id)}
          >
            <Ionicons name="chatbubble-outline" size={18} color="#555" />
            <Text style={styles.actionCount}>{post.commentCount || ''}Comments</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleSharePress}
          >
            <Ionicons name="share-social-outline" size={18} color="#555" />
            <Text style={styles.actionCount}>{sharesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onViewImage(post)}
          >
            <Ionicons name="eye-outline" size={18} color="#555" />
            <Text style={styles.actionCount}>{viewsCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});


// Memoized Status Preview Component
const MemoizedStatusPreview = memo(({ userStatus, currentUserPhone, onPress, onViewers, onDelete }) => {
  const isVideo = userStatus.status_type === 'video';
  const isMyStatus = userStatus.user?.phone === currentUserPhone || userStatus.user === currentUserPhone;
  const url = userStatus.statuses[0]?.media;
  const path_img = url?.replace(/^https?:\/\/[^/]+/, '');

  return (
    <View style={styles.statusWrapper}>
      <TouchableOpacity onPress={onPress}>
        <ImageBackground
          source={{ 
            uri: url
              ? `${API_ROUTE_IMAGE}${path_img}`
              : 'https://via.placeholder.com/40' 
          }}
          style={styles.statusImage}
          imageStyle={styles.statusImageStyle}
        >
          {isVideo && (
            <View style={styles.videoPlayIcon}>
              <Icon name="play" size={24} color="#fff" />
            </View>
          )}
          
          <View style={styles.statusNameContainer}>
            <Text style={styles.statusNameText}>
              {isMyStatus ? 'My Story' : userStatus.user?.name || userStatus.user}
            </Text>
            {isMyStatus && userStatus.viewers_count > 0 && (
              <TouchableOpacity onPress={() => onViewers(userStatus.viewers)}>
                <Text style={styles.viewCountText}>
                  {userStatus.viewers_count} view{userStatus.viewers_count !== 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      </TouchableOpacity>
      
      {isMyStatus && (
        <TouchableOpacity 
          style={styles.deleteStatusButton}
          onPress={() => onDelete(userStatus.statuses[0]?.id)}
        >
          <Icon name="close" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
});

// Suggested Friend Component
const SuggestedFriendItem = memo(({ item, onFollow }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(true);
    onFollow(item.id);
  };

  return (
    <View style={styles.suggestedFriendItem}>
      <TouchableOpacity onPress={() => {}}>
        <View style={styles.suggestedFriendImageContainer}>
          <Image
            source={
              item.profile_picture
                ? { uri: `${API_ROUTE_IMAGE}${item.profile_picture}` }
                : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
            }
            style={styles.suggestedFriendImage}
          />
          {item.is_verified && (
            <View style={styles.suggestedFriendVerified}>
              <Icont name="verified" size={12} color="#fff" />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <Text style={styles.suggestedFriendName} numberOfLines={1}>
        {item.username}
      </Text>
      {item.followers_count && (
        <Text style={styles.suggestedFriendClub} numberOfLines={1}>
          {item.followers_count} Followers
        </Text>
      )}
      <TouchableOpacity
        style={[styles.suggestedFriendFollowButton, isFollowing && styles.suggestedFriendFollowingButton]}
        onPress={handleFollow}
      >
        <Text style={[styles.suggestedFriendFollowButtonText, isFollowing && styles.suggestedFriendFollowingButtonText]}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export default function HomePage({ navigation }) {
  
  const [reactionCounts, setReactionCounts] = useState({});
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isReplyBottomSheetVisible, setIsReplyBottomSheetVisible] = useState(false);
  const [isOptionsBottomSheetVisible, setIsOptionsBottomSheetVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [postById, setPostById] = useState([]);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [posts, setPosts] = useState([]);
  const [allposts, setAllPosts] = useState([]);
  const [addStatusModalVisible, setAddStatusModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [userPostWithID, setUsersSelectedPostId] = useState('');
  const [userUID, setUserUid] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userprofileimage, setUserProfileImage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [commentsss, setPostsComment] = useState([]);
  const [commentLikesCount, setCommentLikesCount] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [showSuggestedFriends, setShowSuggestedFriends] = useState(false);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [groupedStatuses, setGroupedStatuses] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedUserStatuses, setSelectedUserStatuses] = useState([]);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [currentUserPhone, setCurrentUserPhone] = useState(null);
  const [viewersModalVisible, setViewersModalVisible] = useState(false);
  const [currentViewers, setCurrentViewers] = useState([]);
  const [paused, setPaused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [liveStreams, setLiveStreams] = useState([]);
  const [loadingLiveStreams, setLoadingLiveStreams] = useState(false);
  const [scrollCount, setScrollCount] = useState(0);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [postViews, setPostViews] = useState({});
  const [selectedImagePost, setSelectedImagePost] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [hasShownLiveModal, setHasShownLiveModal] = useState(false);

  const abortControllerRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [userName, setUserName] = useState('');

  useEffect(()=>{
  
        const fetUserdata = async()=>{
          try {
  
          const userDataString = await AsyncStorage.getItem('userData');
                        const userData = userDataString ? JSON.parse(userDataString) : null;
                        //console.log('User Dataaaaaa:', userData);
                        const userId = userData?.id || 'unknown';
                        const username = userData?.name || 'unknown';
                        setUserName(username)
                       // console.log('usernamennnn', username)
          
        } catch (error) {
          
          
        }
        }

        fetUserdata()
        
      },[])

  // Cache management functions
  const loadPostsFromCache = useCallback(async () => {
    try {
      const cachedData = await AsyncStorage.getItem(POSTS_CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
        if (isCacheValid) {
          const enhancedPosts = await Promise.all(
            data.map(async (post) => ({
              ...post,
              views: await getPostViews(post.id),
              shares: await getPostShares(post.id),
              is_verified: Math.random() > 0.7
            }))
          );
          setPosts([...enhancedPosts].reverse());
          return true;
        }
      }
    } catch (error) {
      console.error('Error loading posts from cache:', error);
    }
    return false;
  }, []);

  const loadAllPostsFromCache = useCallback(async () => {
    try {
      const cachedData = await AsyncStorage.getItem(ALL_POSTS_CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const isCacheValid = Date.now() - timestamp < CACHE_EXPIRATION_TIME;
        
        if (isCacheValid) {
          const sortedPosts = [...data].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          const filteredPosts = await filterUnfollowedUsers(sortedPosts);
          const enhancedPosts = await Promise.all(
            filteredPosts.map(async (post) => ({
              ...post,
              views: await getPostViews(post.id),
              shares: await getPostShares(post.id),
              is_verified: Math.random() > 0.6
            }))
          );
          setAllPosts(enhancedPosts);
          return true;
        }
      }
    } catch (error) {
      console.error('Error loading all posts from cache:', error);
    }
    return false;
  }, []);

  const savePostsToCache = useCallback(async (postsData) => {
    try {
      await AsyncStorage.setItem(
        POSTS_CACHE_KEY,
        JSON.stringify({ data: postsData, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Error saving posts to cache:', error);
    }
  }, []);

  const saveAllPostsToCache = useCallback(async (postsData) => {
    try {
      await AsyncStorage.setItem(
        ALL_POSTS_CACHE_KEY,
        JSON.stringify({ data: postsData, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Error saving all posts to cache:', error);
    }
  }, []);

  // Optimized data fetching
  const fetchLiveStreams = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); 
      setLoadingLiveStreams(true);
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const res = await fetch(`${API_ROUTE}/live-streams/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setLiveStreams(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn("Error fetching live streams:", err);
      }
    } finally {
      setLoadingLiveStreams(false);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setCurrentUserId(parsedUserData.id);
        setCurrentUserPhone(parsedUserData.phone);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const res = await axios.get(`${API_ROUTE}/status/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 || res.status === 201) {
        const grouped = groupStatusesByUser(res.data);
        setGroupedStatuses(grouped);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  }, []);

  const groupStatusesByUser = useCallback((statuses) => {
    const grouped = {};
    
    statuses.forEach(status => {
      const userKey = status.user?.id || status.user;
      
      if (!grouped[userKey]) {
        grouped[userKey] = {
          user: status.user,
          statuses: [],
          latestTime: new Date(status.created_at),
          viewers_count: status.viewers_count,
          viewers: status.viewers || [],
          status_type: status.status_type
        };
      }
      
      grouped[userKey].statuses.push(status);
      const currentTime = new Date(status.created_at);
      
      if (currentTime > grouped[userKey].latestTime) {
        grouped[userKey].latestTime = currentTime;
        grouped[userKey].viewers_count = status.viewers_count;
        grouped[userKey].viewers = status.viewers || [];
        grouped[userKey].status_type = status.status_type;
        
      }
    });
    
    return Object.values(grouped).sort((a, b) => b.latestTime - a.latestTime);
  }, []);

  const fetchPosts = useCallback(async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    try {
      const response = await axios.get(`${API_ROUTE}/posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const enhancedPosts = await Promise.all(
          response.data.map(async (post) => ({
            ...post,
            views: await getPostViews(post.id),
            shares: await getPostShares(post.id),
            is_verified: Math.random() > 0.7
          }))
        );
        
        const reversedData = [...enhancedPosts].reverse();
        setPosts(reversedData);
        await savePostsToCache(response.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [savePostsToCache]);

  const fetchAllPosts = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const [postsResponse, followedUsers] = await Promise.all([
        axios.get(`${API_ROUTE}/get-all-post/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetchFollowedUsers(),
      ]);

      if (postsResponse.status === 200) {
        const sortedPosts = [...postsResponse.data].sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        const filteredPosts = await filterUnfollowedUsers(sortedPosts);
        const enhancedPosts = await Promise.all(
          filteredPosts.map(async (post) => ({
            ...post,
            views: await getPostViews(post.id),
            shares: await getPostShares(post.id),
            is_verified: Math.random() > 0.6
          }))
        );
        setAllPosts(enhancedPosts);
        setFollowedUsers(followedUsers);
        await saveAllPostsToCache(postsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching all posts:', error);
    }
  }, [saveAllPostsToCache]);

  const filterUnfollowedUsers = async (posts) => {
    const followedUsers = await fetchFollowedUsers();
    const seenUsers = new Set();
    const filteredPosts = [];

    for (const post of posts) {
      if (!seenUsers.has(post.user_id) && !followedUsers.includes(post.user_id)) {
        seenUsers.add(post.user_id);
        filteredPosts.push(post);
      }
      if (filteredPosts.length === 20) break;
    }

    return filteredPosts;
  };

  const fetchFollowedUsers = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return [];

      const response = await axios.get(`${API_ROUTE}/followed-users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        return response.data.map(user => user.id);
      }
      return [];
    } catch (error) {
      console.error('Error fetching followed users:', error);
      return [];
    }
  }, []);

  const fetchReactions = useCallback(async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    try {
      const response = await axios.get(`${API_ROUTE}/all-post-reaction/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReactionCounts(response.data.reactions);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  }, []);

  const fetchSuggestedFriends = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      
      const response = await axios.get(`${API_ROUTE}/suggested-friends/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 200) {
        const enhancedFriends = response.data.map(friend => ({
          ...friend,
          is_verified: Math.random() > 0.8,
          followers_count: Math.floor(Math.random() * 1000) + 100
        }));
        setSuggestedFriends(enhancedFriends);
      }
    } catch (error) {
      console.error('Error fetching suggested friends:', error);
    }
  }, []);

  // Optimized handlers
  const handleReactionOptimized = useCallback(async (postId, type) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      setReactionCounts((prev) => {
        const postIdStr = postId.toString();
        const currentReactions = prev[postIdStr] || { like: 0, love: 0, support: 0 };
        const newReactions = { ...currentReactions };

        if (newReactions.user_reaction === type) {
          newReactions[type] = (newReactions[type] || 0) - 1;
          newReactions.user_reaction = null;
        } else {
          if (newReactions.user_reaction) {
            newReactions[newReactions.user_reaction] = (newReactions[newReactions.user_reaction] || 0) - 1;
          }
          newReactions[type] = (newReactions[type] || 0) + 1;
          newReactions.user_reaction = type;
        }

        return { ...prev, [postIdStr]: newReactions };
      });

      axios.post(
        `${API_ROUTE}/post-react/`,
        { post_id: postId, reaction_type: type },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(console.error);
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  }, []);

  const handleCommentOptimized = useCallback(async (postId) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    try {
      const [postResponse, commentsResponse] = await Promise.all([
        axios.get(`${API_ROUTE}/posts/${postId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_ROUTE}/get-posts-comment/${postId}/comments/all/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (postResponse.status === 200) {
        setPostById(postResponse.data);
        setSelectedPostId(postId);
        
        if (commentsResponse.status === 200) {
          const parentComments = commentsResponse.data.filter(comment => !comment.parent);
          setPostsComment(prev => {
            const otherComments = prev.filter(c => c.post !== postId);
            return [...otherComments, ...parentComments];
          });
        }
        
        setIsBottomSheetVisible(true);
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  }, []);

  const handleShareOptimized = useCallback(async (postId) => {
    try {
      const post = posts.find(p => p.id === postId) || allposts.find(p => p.id === postId);
      if (!post) return 0;

      const shareOptions = {
        message: `${post.content}\n\nShared from Showa`,
        url: post.image ? `${API_ROUTE_IMAGE}${post.image}` : undefined,
        title: `Post by ${post.username}`,
      };

      await Share.share(shareOptions);
      
      const newSharesCount = await trackPostShare(postId);
      setIsOptionsBottomSheetVisible(false);
      setSnackbarVisible(true);
      
      return newSharesCount;
    } catch (error) {
      console.error('Error sharing post:', error);
      return 0;
    }
  }, [posts, allposts]);

  const handleOptionsOptimized = useCallback((postId, userId) => {
    setSelectedPostId(postId);
    setUsersSelectedPostId(userId);
    setIsOptionsBottomSheetVisible(true);
  }, []);

  const handleFollow = useCallback(async (userId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      await axios.post(
        `${API_ROUTE}/follow-user/${userId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFollowedUsers((prev) => [...prev, userId]);
      setAllPosts((prev) => prev.filter((post) => post.user_id !== userId));
      setSuggestedFriends((prev) => prev.filter((friend) => friend.id !== userId));
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  }, []);

  const handleViewUser = useCallback((userId) => {
    navigation.navigate('BroadcastUserProfile', { user_ID: userId });
  }, [navigation]);

  const handleUnfollow = useCallback(async () => {
    const userId = userPostWithID;
    if (!userId) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      await axios.delete(`${API_ROUTE}/unfollow-user/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFollowedUsers((prev) => prev.filter((follower) => follower !== userId));
      setSnackbarVisible(true);
      setIsOptionsBottomSheetVisible(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  }, [userPostWithID]);

  const handleBookmark = useCallback(async (postId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `${API_ROUTE}/bookmark-post/`,
        { post: postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbarVisible(true);
      setIsOptionsBottomSheetVisible(false);
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  }, []);

  // Status management functions
  const openImageModal = useCallback((userStatuses) => {
    setSelectedUserStatuses(userStatuses.statuses);
    setCurrentStatusIndex(0);
    setModalVisible(true);
    setPaused(false);
  }, []);

  const showViewers = useCallback((viewers) => {
    setCurrentViewers(viewers);
    setViewersModalVisible(true);
  }, []);

  const deleteStatus = useCallback(async (statusId) => {
    if (!statusId) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.delete(`${API_ROUTE}/status/${statusId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setGroupedStatuses(prev => 
        prev.filter(status => 
          !status.statuses.some(s => s.id === statusId)
        )
      );
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error deleting status:', error);
      Alert.alert('Error', 'Failed to delete status');
    }
  }, []);

  // Image modal functions
  const handleViewImage = useCallback((post) => {
    setSelectedImagePost(post);
    setImageModalVisible(true);
  }, []);

  const handleImageModalClose = useCallback(() => {
    setImageModalVisible(false);
    setSelectedImagePost(null);
  }, []);

  const handleImageViewed = useCallback((postId, newCount) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, views: newCount } : post
    ));
    setAllPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, views: newCount } : post
    ));
  }, []);

  // Fixed scroll handler
  const handleScroll = useCallback((event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const postHeight = 500;
    
    if (scrollY > postHeight * 4 && !showSuggestedFriends) {
      setShowSuggestedFriends(true);
    }

    if (scrollY > postHeight * 8 && !hasShownLiveModal && liveStreams.length > 0) {
      setShowLiveModal(true);
      setHasShownLiveModal(true);
    }
  }, [showSuggestedFriends, hasShownLiveModal, liveStreams.length]);

  // Comment and Reply functionality
  const onCommentSubmitPost = useCallback(async () => {
    if (!newComment.trim() || !selectedPostId) {
      //console.log('Comment text is empty or no post selected.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        //console.log('No token found, cannot post comment.');
        return;
      }

      const userData = await AsyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;
      const loginUserId = parsedUser?.id;

      if (!loginUserId) {
        console.warn('User ID not found in stored data.');
        return;
      }

      const tempCommentId = `temp_${Date.now()}`;
      const newCommentData = {
        id: tempCommentId,
        post: selectedPostId,
        user: {
          id: loginUserId,
          username: username,
          image: userprofileimage,
        },
        text: newComment.trim(),
        created_at: new Date().toISOString(),
        image: userprofileimage,
        replies: [],
      };

      setPostsComment((prev) => {
        const updatedComments = [newCommentData, ...prev.filter((c) => c.post === selectedPostId)];
        return [...prev.filter((c) => c.post !== selectedPostId), ...updatedComments];
      });

      const response = await axios.post(
        `${API_ROUTE}/posts-comment/${selectedPostId}/comments/`,
        {
          text: newComment.trim(),
          post: selectedPostId,
          user: loginUserId,
          image: userprofileimage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setPostsComment((prev) => {
          const updatedComments = prev.map((comment) =>
            comment.id === tempCommentId
              ? {
                  ...comment,
                  id: response.data.id,
                }
              : comment
          );
          return updatedComments;
        });
        setNewComment('');
        setSnackbarVisible(true);
      } else {
        //console.log('Failed to post comment:', response.data);
        setPostsComment((prev) => {
          const updatedComments = prev.filter((comment) => comment.id !== tempCommentId);
          return updatedComments;
        });
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
      setPostsComment((prev) => {
        const updatedComments = prev.filter((comment) => comment.id !== `temp_${Date.now()}`);
        return updatedComments;
      });
    }
  }, [newComment, selectedPostId, username, userprofileimage]);

  const onCommentSubmitReply = useCallback(async () => {
    if (!replyText.trim() || !selectedCommentId) {
      //console.log('Reply text is empty or no comment selected.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        //console.log('No token found, cannot post reply.');
        return;
      }

      const userData = await AsyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;
      const loginUserId = parsedUser?.id;

      if (!loginUserId) {
        console.warn('User ID not found in stored data.');
        return;
      }

      const tempReplyId = `temp_reply_${Date.now()}`;
      const newReplyData = {
        id: tempReplyId,
        username: username,
        text: replyText.trim(),
        userAvatar: userprofileimage,
        created_at: new Date().toISOString(),
      };

      setPostsComment((prev) => {
        const updatedComments = prev.map((comment) =>
          comment.id === selectedCommentId
            ? {
                ...comment,
                replies: comment.replies
                  ? [...comment.replies, newReplyData]
                  : [newReplyData],
              }
            : comment
        );
        return updatedComments;
      });

      const response = await axios.post(
        `${API_ROUTE}/posts-comment/${selectedPostId}/comments/`,
        {
          text: replyText.trim(),
          post: selectedPostId,
          user: loginUserId,
          image: userprofileimage,
          parent: selectedCommentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setPostsComment((prev) => {
          const updatedComments = prev.map((comment) =>
            comment.id === selectedCommentId
              ? {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === tempReplyId
                      ? {
                          ...reply,
                          id: response.data.id,
                        }
                      : reply
                  ),
                }
              : comment
          );
          return updatedComments;
        });

        setReplyText('');
        setReplyToCommentId(null);
        setSnackbarVisible(true);
      } else {
        //console.log('Failed to post reply:', response.data);
        setPostsComment((prev) => {
          const updatedComments = prev.map((comment) =>
            comment.id === selectedCommentId
              ? {
                  ...comment,
                  replies: comment.replies.filter((reply) => reply.id !== tempReplyId),
                }
              : comment
          );
          return updatedComments;
        });
      }
    } catch (error) {
      console.error('Failed to post reply:', error);
      setPostsComment((prev) => {
        const updatedComments = prev.map((comment) =>
          comment.id === selectedCommentId
            ? {
                ...comment,
                replies: comment.replies.filter((reply) => reply.id !== tempReplyId),
              }
            : comment
        );
        return updatedComments;
      });
    }
  }, [replyText, selectedCommentId, selectedPostId, username, userprofileimage]);

  const handleReply = useCallback((username, commentId) => {
    setReplyToCommentId(commentId);
    setReplyText('');
  }, []);

  const onPostCommentLikes = useCallback(async (commentId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const userData = await AsyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;
      const loginUserId = parsedUser?.id;

      if (!loginUserId) return;

      setCommentLikesCount((prev) => ({
        ...prev,
        [commentId]: (prev[commentId] || 0) + 1,
      }));

      const response = await axios.post(
        `${API_ROUTE}/post-comments-like/${commentId}/like/`,
        {
          user: loginUserId,
          comment: commentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSnackbarVisible(true);
      } else {
        setCommentLikesCount((prev) => ({
          ...prev,
          [commentId]: (prev[commentId] || 1) - 1,
        }));
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
      setCommentLikesCount((prev) => ({
        ...prev,
        [commentId]: (prev[commentId] || 1) - 1,
      }));
    }
  }, []);

  // Simplified refresh function
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchPosts(),
      fetchAllPosts(),
      fetchStatus(),
      fetchSuggestedFriends(),
      fetchLiveStreams()
    ]);
    setRefreshing(false);
  }, [fetchPosts, fetchAllPosts, fetchStatus, fetchSuggestedFriends, fetchLiveStreams]);

  // Twitter-like initialization: Load cache immediately, fetch fresh in background
  useEffect(() => {
    // Load from cache for instant display
    Promise.all([
      loadPostsFromCache(),
      loadAllPostsFromCache(),
      fetchCurrentUser(),
      fetchStatus(),
    ]).catch(console.error);

    // Fetch fresh data in background
    Promise.all([
      fetchPosts(),
      fetchAllPosts(),
      fetchReactions(),
      fetchSuggestedFriends(),
      fetchLiveStreams(),
    ]).catch(console.error);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadPostsFromCache, loadAllPostsFromCache, fetchCurrentUser, fetchStatus, fetchPosts, fetchAllPosts, fetchReactions, fetchSuggestedFriends, fetchLiveStreams]);

  // Memoized data
  const myStatus = React.useMemo(() => 
    groupedStatuses.find(status => 
      status.user?.phone === currentUserPhone || status.user === currentUserPhone
    ),
    [groupedStatuses, currentUserPhone]
  );

  const otherStatuses = React.useMemo(() => 
    groupedStatuses.filter(status => 
      status.user?.phone !== currentUserPhone && status.user !== currentUserPhone
    ),
    [groupedStatuses, currentUserPhone]
  );

  const combinedPosts = React.useMemo(() => [
    ...posts.map(post => ({ 
      type: 'followed', 
      post: {
        ...post,
        reactions: reactionCounts[post.id?.toString()] || {},
        commentCount: commentsss.filter(c => c.post === post.id).length
      }
    })),
    ...allposts.map(post => ({ 
      type: 'allposts', 
      post: {
        ...post,
        reactions: reactionCounts[post.id?.toString()] || {},
        commentCount: commentsss.filter(c => c.post === post.id).length
      }
    }))
  ].sort((a, b) => new Date(b.post.created_at) - new Date(a.post.created_at)), 
  [posts, allposts, reactionCounts, commentsss]);

  // Optimized render functions
  const renderStatusRow = useCallback(() => {
    const hasLiveStreams = liveStreams && liveStreams.length > 0;

    return (
      <View style={{ marginTop: 10, marginBottom: 20 }}>
        <Text style={[styles.sectionTitle, {color:'#333'}]}>
          {hasLiveStreams ? 'Live & Status' : ''}
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusScrollContainer}
        >
          {/* My Status */}
          {myStatus && (
            <MemoizedStatusPreview 
              userStatus={myStatus}
              currentUserPhone={currentUserPhone}
              onPress={() => openImageModal(myStatus)}
              onViewers={() => showViewers(myStatus.viewers)}
              onDelete={deleteStatus}
            />
          )}

          {/* Live Streams */}
          {hasLiveStreams && liveStreams.map((liveStream) => (
            <TouchableOpacity 
              key={liveStream.id}
              style={styles.liveStreamWrapper}
              onPress={() => {
                navigation.navigate('LiveStreamViewer', { streamId: liveStream.stream_id });
              }}
            >
              <View style={styles.liveStreamContainer}>
                <Image
                  source={{ 
                    uri: liveStream.broadcaster_image 
                      ? `${API_ROUTE_IMAGE}${liveStream.broadcaster_image.replace(/^https?:\/\/[^/]+/, '')}`
                      : 'https://via.placeholder.com/40' 
                  }}
                  style={styles.liveStreamImage}
                />
                <View style={styles.liveStreamOverlay}>
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                  <Text style={styles.liveStreamName} numberOfLines={1}>
                    {liveStream.broadcaster_name}
                  </Text>
                  <Text style={styles.liveStreamStats}>
                    {liveStream.likes} likes
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          {/* Other Statuses */}
          {otherStatuses.map((userStatus) => (
            <MemoizedStatusPreview 
              key={userStatus.user?.id}
              userStatus={userStatus}
              currentUserPhone={currentUserPhone}
              onPress={() => openImageModal(userStatus)}
              onViewers={() => showViewers(userStatus.viewers)}
              onDelete={deleteStatus}
            />
          ))}
        </ScrollView>
      </View>
    );
  }, [myStatus, otherStatuses, liveStreams, currentUserPhone, openImageModal, showViewers, deleteStatus]);

  const renderLiveModal = () => (
    <Modal visible={showLiveModal} animationType="slide" transparent>
      <View style={styles.liveModalOverlay}>
        <View style={styles.liveModal}>
          <View style={styles.liveModalHeader}>
            <Text style={styles.liveModalTitle}>Live Now 🔴</Text>
            <TouchableOpacity onPress={() => setShowLiveModal(false)}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={liveStreams}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.liveModalItem}
                onPress={() => {
                  setShowLiveModal(false);
                  navigation.navigate('LiveStreamViewer', { streamId: item.stream_id });
                }}
              >
                <Image
                  source={{ 
                    uri: item.broadcaster_image 
                      ? `${API_ROUTE_IMAGE}${item.broadcaster_image.replace(/^https?:\/\/[^/]+/, '')}`
                      : 'https://via.placeholder.com/40' 
                  }}
                  style={styles.liveModalAvatar}
                />
                <View style={styles.liveModalInfo}>
                  <Text style={styles.liveModalName}>{item.broadcaster_name}</Text>
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE NOW</Text>
                  </View>
                </View>
                <Text style={styles.liveModalStats}>{item.likes} likes</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyLive}>
                <Text style={styles.emptyLiveText}>No one is live right now</Text>
              </View>
            }
          />
          
          <TouchableOpacity 
            style={styles.closeLiveModalButton}
            onPress={() => setShowLiveModal(false)}
          >
            <Text style={styles.closeLiveModalText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderViewersModal = () => (
    <Modal visible={viewersModalVisible} animationType="slide" transparent>
      <View style={styles.viewersModalOverlay}>
        <View style={styles.viewersModal}>
          <View style={styles.viewersModalHeader}>
            <Text style={styles.viewersModalTitle}>Viewers</Text>
            <TouchableOpacity onPress={() => setViewersModalVisible(false)}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={currentViewers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.viewerItem}>
                <Image
                  source={{ 
                    uri: item.profile_picture 
                      ? `${API_ROUTE_IMAGE}${item.profile_picture}`
                      : 'https://via.placeholder.com/40' 
                  }}
                  style={styles.viewerAvatar}
                />
                <Text style={styles.viewerName}>{item.username || 'Unknown User'}</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyViewers}>
                <Text style={styles.emptyViewersText}>No viewers yet</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );

  const renderComment = useCallback(({ item }) => {
    const replyCount = item.replies ? item.replies.length : 0;

    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentRow}>
          <Image
            source={
              item.image
                ? { uri: item.image }
                : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
            }
            style={styles.commentAvatar}
          />
          <View style={styles.commentContent}>
            <Text style={styles.commentUsername}>
              {item.user?.username || item.username}
            </Text>
            <Text style={styles.commentText}>{item.text}</Text>
            <View style={styles.commentActions}>
              <Text style={styles.commentTimestamp}>{dayjs(item.created_at).fromNow()}</Text>
              <TouchableOpacity onPress={() => onPostCommentLikes(item.id)}>
                <Text style={styles.actionText}>{commentLikesCount[item.id] || 0} Like</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleReply(item.user?.username || item.username, item.id)}>
                <Text style={styles.actionText}>Reply</Text>
              </TouchableOpacity>
            </View>
            
            {/* Replies */}
            {replyCount > 0 && (
              <View style={styles.repliesWrapper}>
                {item.replies.slice(0, 3).map((reply, index) => (
                  <View key={index} style={styles.replyContainer}>
                    <Image
                      source={
                        reply.userAvatar
                          ? { uri: reply.userAvatar }
                          : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                      }
                      style={styles.replyAvatar}
                    />
                    <View style={styles.replyContent}>
                      <Text style={styles.replyUsername}>{reply.username}</Text>
                      <Text style={styles.replyText}>{reply.text}</Text>
                      <Text style={styles.replyTimestamp}>{dayjs(reply.created_at).fromNow()}</Text>
                    </View>
                  </View>
                ))}
                {replyCount > 3 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCommentId(item.id);
                      setIsReplyBottomSheetVisible(true);
                    }}
                  >
                    <Text style={styles.viewMoreReplies}>View {replyCount - 3} more replies</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Reply Input */}
            {replyToCommentId === item.id && (
              <View style={styles.replyInputContainer}>
                <TextInput
                  placeholder={`Replying to ${item.user?.username || item.username}...`}
                  value={replyText}
                  onChangeText={setReplyText}
                  style={styles.replyInput}
                  placeholderTextColor='#666'
                  multiline
                />
                <TouchableOpacity
                  onPress={onCommentSubmitReply}
                  style={styles.replySendButton}
                >
                  <Text style={styles.replySendButtonText}>Reply</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }, [replyToCommentId, replyText, onCommentSubmitReply, handleReply, onPostCommentLikes, commentLikesCount]);

  const renderSuggestedFriend = useCallback(({ item }) => (
    <SuggestedFriendItem item={item} onFollow={handleFollow} />
  ), [handleFollow]);

  // Optimized content render: Always render content instantly, show empty state if no posts
  const renderContent = useCallback(() => {
    const middleIndex = Math.floor(combinedPosts.length / 2);
    const firstHalf = combinedPosts.slice(0, middleIndex);
    const secondHalf = combinedPosts.slice(middleIndex);

    const friendSuggestionIndex = Math.min(2, firstHalf.length - 1);
    const firstPart = firstHalf.slice(0, friendSuggestionIndex);
    const secondPart = firstHalf.slice(friendSuggestionIndex);

    return (
      <>
        {/* Status Section */}
        {(groupedStatuses.length > 0 || liveStreams.length > 0) && renderStatusRow()}

        {/* Refreshing indicator - non-blocking */}
        {refreshing && combinedPosts.length > 0 && (
          <View style={styles.refreshingIndicator}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.refreshingText}>Updating feed...</Text>
          </View>
        )}

        {/* Promo Banner */}
        <View style={styles.promoContainer}>
          <Image
            source={require('../assets/images/gdgdg.jpg')} 
            style={styles.promoBanner}
            resizeMode="cover"
          />
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Earn Massive Income</Text>
            <Text style={styles.promoSubtitle}>Up to 5m instantly</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Earnings')} style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Get Started Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* First Part of Posts (2-3 posts) */}
        {firstPart.length > 0 && (
          <FlatList
            data={firstPart}
            keyExtractor={(item, index) => `${item.type}-${item.post.id?.toString() || index.toString()}`}
            renderItem={({ item }) => (
              <MemoizedTweetItem 
                post={item.post} 
                type={item.type}
                onReaction={handleReactionOptimized}
                onComment={handleCommentOptimized}
                onShare={handleShareOptimized}
                onFollow={handleFollow}
                onOptions={handleOptionsOptimized}
                onViewImage={handleViewImage}
              />
            )}
            scrollEnabled={false}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={5}
            ListEmptyComponent={null}
          />
        )}

        {/* Second Part of First Half Posts */}
        {secondPart.length > 0 && (
          <FlatList
            data={secondPart}
            keyExtractor={(item, index) => `${item.type}-${item.post.id?.toString() || index.toString()}`}
            renderItem={({ item }) => (
              <MemoizedTweetItem 
                post={item.post} 
                type={item.type}
                onReaction={handleReactionOptimized}
                onComment={handleCommentOptimized}
                onShare={handleShareOptimized}
                onFollow={handleFollow}
                onOptions={handleOptionsOptimized}
                onViewImage={handleViewImage}
              />
            )}
            scrollEnabled={false}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={5}
            ListEmptyComponent={null}
          />
        )}

        {/* Friend Suggestion Section */}
        <View style={styles.friendSuggestionWrapper}>
          <FriendSuggestion />
        </View>

        {/* Suggested Friends Section */}
        {showSuggestedFriends && suggestedFriends.length > 0 && (
          <View style={styles.suggestedFriendsContainer}>
            <View style={styles.suggestedFriendsHeader}>
              <Text style={[styles.sectionTitle, {color:'#777', fontSize:18}]}>People to follow</Text>
            </View>
            <FlatList
              data={suggestedFriends}
              renderItem={renderSuggestedFriend}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestedFriendsList}
              initialNumToRender={3}
            />
          </View>
        )}

        {/* Second Half of Posts */}
        {secondHalf.length > 0 && (
          <FlatList
            data={secondHalf}
            keyExtractor={(item, index) => `${item.type}-${item.post.id?.toString() || index.toString()}`}
            renderItem={({ item }) => (
              <MemoizedTweetItem 
                post={item.post} 
                type={item.type}
                onReaction={handleReactionOptimized}
                onComment={handleCommentOptimized}
                onShare={handleShareOptimized}
                onFollow={handleFollow}
                onOptions={handleOptionsOptimized}
                onViewImage={handleViewImage}
              />
            )}
            scrollEnabled={false}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={5}
            ListEmptyComponent={null}
          />
        )}

        {/* Empty state - shown instantly if no posts */}
        {combinedPosts.length === 0 && (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>No posts yet</Text>
            <Text style={styles.emptyStateText}>
              Follow some users or create your first post to see content here
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => navigation.navigate('CreateBroadcastPost')}
            >
              <Text style={styles.emptyStateButtonText}>Create First Post</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Additional Friend Suggestion at the end */}
        {combinedPosts.length > 8 && (
          <View style={styles.friendSuggestionBottom}>
            <FriendSuggestion />
          </View>
        )}
      </>
    );
  }, [
    combinedPosts,
    groupedStatuses,
    liveStreams,
    refreshing,
    showSuggestedFriends,
    suggestedFriends,
    renderStatusRow,
    renderSuggestedFriend,
    handleReactionOptimized,
    handleCommentOptimized,
    handleShareOptimized,
    handleFollow,
    handleOptionsOptimized,
    handleViewImage,
    navigation
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Broadcast</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => {
              // navigation.navigate('Broadcaster', {
              //   roomName: 'match-123',
              //   streamId: 'stream-1',
              // });
               navigation.navigate('Broadcaster', {
                        roomName: `user-${userName}`,
                        streamId: `stream-${userName}`,
                        userName: `${userName}` || 'User',
                        userId: userId
                      });
            }}
            style={styles.goLiveButton}
          >
            <Ionicons name="radio" size={20} color="#333" />
            <Text style={styles.goLiveText}>Go Live</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('CreateBroadcastPost')}>
            <Ionicons name="add-circle-outline" size={34} color='#333' />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreateBroadcastPost')}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Image Modal */}
      <ImageModal
        visible={imageModalVisible}
        post={selectedImagePost}
        onClose={handleImageModalClose}
        onView={handleImageViewed}
      />

      {/* Live Modal */}
      {renderLiveModal()}

      {/* Viewers Modal */}
      {renderViewersModal()}

      {/* Comment Modal */}
      <Modal visible={isBottomSheetVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.commentModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsBottomSheetVisible(false);
                  setReplyToCommentId(null);
                  setNewComment('');
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={26} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              {postById && (
                <View style={styles.postPreview}>
                  <View style={styles.postHeader}>
                    <Image
                      source={
                        postById.user_profile_picture
                          ? { uri: postById.user_profile_picture }
                          : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                      }
                      style={styles.postAvatar}
                    />
                    <View style={styles.postInfo}>
                      <Text style={styles.postUsername}>
                        {postById.username || 'Anonymous'}
                      </Text>
                      <Text style={styles.postTimestamp}>
                        {dayjs(postById.created_at).fromNow()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.postContent}>{postById.content}</Text>
                  {postById.image && (
                    <Image
                      source={{ uri: `${API_ROUTE_IMAGE}${postById.image}` }}
                      style={styles.postImagePreview}
                      resizeMode="cover"
                    />
                  )}
                </View>
              )}

              <View style={styles.divider} />

              {/* Comments List */}
              <FlatList
                data={commentsss.filter((c) => c.post === selectedPostId && !c.parent)}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                scrollEnabled={false}
                renderItem={renderComment}
                ListEmptyComponent={
                  <View style={styles.emptyComments}>
                    <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
                  </View>
                }
              />

              {/* Comment Input */}
              <View style={styles.commentInputContainer}>
                <TextInput
                  placeholder="Write a comment..."
                  value={newComment}
                  onChangeText={setNewComment}
                  style={styles.commentInput}
                  placeholderTextColor='#666'
                  multiline
                />
                <TouchableOpacity
                  onPress={onCommentSubmitPost}
                  style={styles.sendButton}
                  disabled={!newComment.trim()}
                >
                  <Text style={[styles.sendButtonText, !newComment.trim() && styles.sendButtonDisabled]}>
                    Post
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Reply Modal */}
      <Modal visible={isReplyBottomSheetVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.replyModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Replies</Text>
              <TouchableOpacity
                onPress={() => setIsReplyBottomSheetVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={26} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              {selectedCommentId && (
                <View style={styles.commentContainer}>
                  <View style={styles.commentRow}>
                    <Image
                      source={
                        commentsss.find(c => c.id === selectedCommentId)?.image
                          ? { uri: commentsss.find(c => c.id === selectedCommentId)?.image }
                          : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                      }
                      style={styles.commentAvatar}
                    />
                    <View style={styles.commentContent}>
                      <Text style={styles.commentUsername}>
                        {commentsss.find(c => c.id === selectedCommentId)?.user?.username || commentsss.find(c => c.id === selectedCommentId)?.username}
                      </Text>
                      <Text style={styles.commentText}>
                        {commentsss.find(c => c.id === selectedCommentId)?.text}
                      </Text>
                      <Text style={styles.commentTimestamp}>
                        {dayjs(commentsss.find(c => c.id === selectedCommentId)?.created_at).fromNow()}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              <View style={styles.repliesWrapper}>
                <FlatList
                  data={commentsss.find((comment) => comment.id === selectedCommentId)?.replies || []}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={styles.replyContainer}>
                      <Image
                        source={
                          item.userAvatar
                            ? { uri: item.userAvatar }
                            : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                        }
                        style={styles.replyAvatar}
                      />
                      <View style={styles.replyContent}>
                        <Text style={styles.replyUsername}>{item.username}</Text>
                        <Text style={styles.replyText}>{item.text}</Text>
                        <Text style={styles.replyTimestamp}>{dayjs(item.created_at).fromNow()}</Text>
                      </View>
                    </View>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyComments}>
                      <Text style={styles.emptyText}>No replies yet.</Text>
                    </View>
                  }
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Options Modal */}
      <Modal visible={isOptionsBottomSheetVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.optionsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post Options</Text>
              <TouchableOpacity
                onPress={() => setIsOptionsBottomSheetVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={26} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handleShareOptimized(selectedPostId)}
              >
                <Ionicons name="share-social-outline" size={24} color="#333" />
                <Text style={styles.optionText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handleBookmark(selectedPostId)}
              >
                <Ionicons name="bookmark-outline" size={24} color="#333" />
                <Text style={styles.optionText}>Bookmark</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={()=>{
                  setIsOptionsBottomSheetVisible(false);
                  handleUnfollow();
                }}
              >
                <Ionicons name="person-remove-outline" size={24} color="#333" />
                <Text style={styles.optionText}>Unfollow</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => navigation.navigate('ReportPost', {postId: selectedPostId})}
              >
                <Ionicons name="flag-outline" size={24} color="#333" />
                <Text style={styles.optionText}>Report Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        Action completed successfully!
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    backgroundColor: '#fff',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 30,
    color: colors.primary,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  goLiveButton: {
    alignItems: 'center',
    marginRight: 20,
  },
  goLiveText: {
    fontSize: 10,
    color: '#333',
    marginTop: 2,
  },
  
  // Empty state styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Refreshing indicator
  refreshingIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  refreshingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  
  // Friend Suggestion Styles
  friendSuggestionWrapper: {
    marginVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#FAFBFC',
    borderRadius: 12,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  friendSuggestionBottom: {
    marginVertical: 20,
    paddingHorizontal: 8,
    backgroundColor: '#FAFBFC',
    borderRadius: 12,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  tweetContainer: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#1DA1F2',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  verifiedBadgeSmall: {
    marginLeft: 4,
    backgroundColor: '#1DA1F2',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tweetContent: { 
    flex: 1, 
    marginLeft: 12,
  },
  tweetHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    flexWrap: "wrap",
    marginBottom: 8,
  },
  name: { 
    fontWeight: "bold", 
    fontSize: 16,
    color: '#333',
  },
  dot: { 
    marginHorizontal: 6, 
    color: "#555",
    fontSize: 16,
  },
  time: { 
    color: "#666",
    fontSize: 14,
  },
  tweetText: { 
    fontSize: 15, 
    lineHeight: 20,
    color: "#333",
    marginBottom: 8,
  },
  tweetImage: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: "cover", 
    maxHeight: 700,      
    minHeight: 300,      
  },
  tweetActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
    padding: 0,
    paddingHorizontal: 12,
    minWidth: 60,
    justifyContent: 'center',
  },
  actionCount: {
    marginLeft: 6,
    fontSize: 14,
    color: '#555',
  },
  readMore: {
    color: colors.primary,
    fontWeight: '600',
  },
  followButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  followingButton: {
    backgroundColor: '#f0f0f0',
  },
  followingButtonText: {
    color: '#333',
  },
  optionsButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  commentModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  optionsModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },
  replyModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    paddingBottom: 20,
  },
  optionsContainer: {
    paddingHorizontal: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  postPreview: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInfo: {
    flex: 1,
  },
  postUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  postTimestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  postContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  postImagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  commentInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 24,
    marginRight: 12,
    color: '#333',
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginLeft: 16,
    marginBottom: 12,
  },
  statusScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusWrapper: {
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  statusImage: {
    width: 80,
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  statusImageStyle: {
    borderRadius: 20,
  },
  videoPlayIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  statusNameContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  statusNameText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  viewCountText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  deleteStatusButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  liveStreamWrapper: {
    alignItems: 'center',
    marginRight: 12,
  },
  liveStreamContainer: {
    width: 80,
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  liveStreamImage: {
    width: '100%',
    height: '100%',
  },
  liveStreamOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
    marginRight: 4,
  },
  liveText: {
    color: '#FF0000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  liveStreamName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  liveStreamStats: {
    color: '#ccc',
    fontSize: 10,
  },
  liveModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '70%',
    padding: 20,
  },
  liveModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  liveModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  liveModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  liveModalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  liveModalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  liveModalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  liveModalStats: {
    fontSize: 14,
    color: '#666',
  },
  emptyLive: {
    padding: 20,
    alignItems: 'center',
  },
  emptyLiveText: {
    color: '#666',
    fontSize: 16,
  },
  closeLiveModalButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeLiveModalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  viewersModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewersModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '70%',
    padding: 20,
  },
  viewersModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewersModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  viewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  viewerName: {
    fontSize: 16,
    color: '#333',
  },
  emptyViewers: {
    padding: 20,
    alignItems: 'center',
  },
  emptyViewersText: {
    color: '#666',
    fontSize: 16,
  },
  promoContainer: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    margin: 16,
    marginTop: 8,
    position: 'relative',
  },
  promoBanner: {
    width: '100%',
    height: '100%',
  },
  promoContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  promoButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  suggestedFriendsContainer: {
    backgroundColor: '#FAFAFA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  suggestedFriendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestedFriendsList: {
    paddingRight: 16,
  },
  suggestedFriendItem: {
    width: 150,
    alignItems: 'center',
    marginRight: 12,
    borderWidth:1,
    borderColor:'#ddd',
    borderStyle:'solid',
    padding:15,
    borderRadius:5,
    backgroundColor:'#fff'
  },
  suggestedFriendImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#E4E4E4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
  },
  suggestedFriendImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  suggestedFriendVerified: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#1DA1F2',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  suggestedFriendName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
    width: '100%',
  },
  suggestedFriendClub: {
    fontSize: 12,
    color: '#8E8E8E',
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  suggestedFriendFollowButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  suggestedFriendFollowButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  suggestedFriendFollowingButton: {
    backgroundColor: '#f0f0f0',
  },
  suggestedFriendFollowingButtonText: {
    color: '#333',
  },
  // Image Modal Styles
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  imageModalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  fullSizeImage: {
    width: '100%',
    height: '70%',
  },
  imageModalInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  imageModalUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  imageModalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  imageModalUserText: {
    flex: 1,
  },
  imageModalUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  imageModalTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  imageModalCaption: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  imageModalStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageModalStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  imageModalStatText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  // Comment Styles
  commentContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: '600',
    color: '#333',
    fontSize: 14,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    lineHeight: 18,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  commentTimestamp: {
    color: '#999',
    fontSize: 12,
    marginRight: 16,
  },
  actionText: {
    color: colors.primary,
    fontSize: 12,
    marginRight: 16,
  },
  repliesWrapper: {
    marginLeft: 0,
    marginTop: 12,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#f0f0f0',
  },
  replyContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  replyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderRadius: 12,
  },
  replyUsername: {
    fontWeight: '600',
    color: '#333',
    fontSize: 12,
  },
  replyText: {
    fontSize: 12,
    color: '#333',
    marginTop: 2,
  },
  replyTimestamp: {
    color: '#999',
    fontSize: 10,
    marginTop: 4,
  },
  viewMoreReplies: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 8,
  },
  replyInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    color: '#333',
  },
  replySendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  replySendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  emptyComments: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});
