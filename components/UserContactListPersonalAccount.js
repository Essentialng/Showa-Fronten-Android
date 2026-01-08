
// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   TouchableOpacity, 
//   StyleSheet, 
//   ActivityIndicator, 
//   StatusBar,
//   Image,
//   SafeAreaView,
//   TextInput
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE } from '../api_routing/api';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const ContactsScreen = ({ navigation }) => {

//   const [allUsers, setAllUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [appUsers, setAppUsers] = useState([]);
//   const [nonAppUsers, setNonAppUsers] = useState([]);
//   const [pendingSent, setPendingSent] = useState(0);
//   const [pendingReceived, setPendingReceived] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('allUsers');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [contacts, setContacts] = useState([]);

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredUsers(allUsers);
//     } else {
//       const filtered = allUsers.filter(user => 
//         (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (user.phone_number?.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (user.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()))
//       ));
//       setFilteredUsers(filtered);
//     }
//   }, [searchQuery, allUsers]);

//   const fetchContacts = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
      
//       const response = await axios.get(`${API_ROUTE}/contacts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Set all users data with contact info
//       setAllUsers(response.data.all_users || []);
//       setFilteredUsers(response.data.all_users || []);
      
//       // Handle synced contacts
//       const syncedContacts = response.data.synced_contacts || [];
//       const friendsList = syncedContacts.filter(c => c.user_details?.is_friend);
//       const appUsersList = syncedContacts.filter(c => c.is_app_user && !c.user_details?.is_friend);
//       const nonAppUsersList = syncedContacts.filter(c => !c.is_app_user);

//       setContacts(syncedContacts);
//       setFriends(friendsList);
//       setAppUsers(appUsersList);
//       setNonAppUsers(nonAppUsersList);
      
//       // Update counts
//       setPendingSent(response.data.pending_sent || 0);
//       setPendingReceived(response.data.pending_received || 0);
//     } catch (error) {
//       //console.error('Error fetching contacts:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderUserAvatar = (item) => {
//     const profilePic = item.profile_picture || item.user_details?.profile_picture;
//     if (profilePic) {
//       return (
//         <Image 
//           source={{ uri: profilePic }} 
//           style={styles.avatar}
//         />
//       );
//     }
//     return (
//       <View style={styles.avatarPlaceholder}>
//         <Icon name="person" size={24} color="#fff" />
//       </View>
//     );
//   };

//   const renderUserItem = ({ item}) => (
//     <View style={styles.contactItem}>
//       <View style={styles.contactInfo}>
//         {renderUserAvatar(item)}
//         <View style={styles.contactTextContainer}>
//           <Text style={styles.contactName}>{item.name || item.phone_number}</Text>
//           <Text style={styles.contactPhone}>{item.phone_number}</Text>
//           {item.is_in_contacts && (
//             <View style={styles.contactBadge}>
//               <Text style={styles.contactBadgeText}>In your contacts</Text>
//               {item.contact_name && item.contact_name !== item.name && (
//                 <Text style={styles.contactSavedAs}>
//                   Saved as: {item.contact_name}
//                 </Text>
//               )}
//             </View>
//           )}
//         </View>
//       </View>
//       <TouchableOpacity 
//         style={styles.addButton}
//         onPress={() => {
//           const profilePic = item.profile_picture || item.user_details?.profile_picture;
//           const relativePath = profilePic ? profilePic.replace(/^https?:\/\/[^\/]+/, '') : null;

//           navigation.navigate('PrivateChat', {
//             receiverId: item.id || item.user_details?.id,
//             name: item.contact_name || item.name || item.user_details?.name || item.phone_number,
//             profile_image: relativePath || require('../assets/images/avatar/blank-profile-picture-973460_1280.png'),
//             chatType: 'single',
//           });
//         }}
//       >
//         <Text style={styles.buttonText}>Message</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderTabButton = (tabName, title, count) => (
//     <TouchableOpacity
//       style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
//       onPress={() => setActiveTab(tabName)}
//     >
//       <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>
//         {title}
//       </Text>
//       {count > 0 && (
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>{count}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Icon 
//             name="arrow-back" 
//             size={24} 
//             color="#000" 
//             onPress={() => navigation.goBack()}
//           />
//           <Text style={styles.headerTitle}>Contacts</Text>
//         </View>
//         <TouchableOpacity style={styles.searchButton}>
//           <Icon name="search" size={24} color="#4E8AF4" />
//         </TouchableOpacity>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search contacts..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="#9CA3AF"
//         />
//         {/* {loading && (
//           <ActivityIndicator size="small" color="#4E8AF4" style={styles.searchLoading} />
//         )} */}
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabContainer}>
//         {renderTabButton('allUsers', 'Users on Showa', allUsers.length)}
//         {/* {renderTabButton('friends', 'Friends', friends.length)} */}
//         {renderTabButton('appUsers', 'Suggestions', appUsers.length)}
//         {/* {renderTabButton('pending', 'Requests', pendingReceived)} */}
//       </View>

//       {/* Small Loading Indicator */}
//       {loading && (
//         <View style={styles.smallLoadingContainer}>
//           <ActivityIndicator size="small" color="#4E8AF4" />
//         </View>
//       )}

//       {/* User List */}
//       <FlatList
//         data={
//           activeTab === 'allUsers' ? filteredUsers :
//           activeTab === 'friends' ? friends :
//           activeTab === 'appUsers' ? appUsers :
//           []
//         }
//         renderItem={renderUserItem}
//         keyExtractor={(item, index) => item.id || `${item.phone_number}-${index}`}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           !loading && (
//             <View style={styles.emptyContainer}>
//               <Icon name="people-outline" size={60} color="#D1D5DB" />
//               <Text style={styles.emptyText}>
//                 {activeTab === 'friends' ? 'No friends yet' :
//                  activeTab === 'appUsers' ? 'No suggestions available' :
//                  activeTab === 'pending' ? 'No pending requests' :
//                  'No users found'}
//               </Text>
//             </View>
//           )
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//     marginLeft: 16,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     paddingHorizontal: 12,
//     height: 48,
//     elevation: 2,
//     position: 'relative',
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: '100%',
//     fontSize: 16,
//     color: '#111827',
//   },
//   searchLoading: {
//     position: 'absolute',
//     right: 12,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     position: 'relative',
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#4E8AF4',
//   },
//   activeTabText: {
//     color: '#4E8AF4',
//     fontWeight: '500',
//   },
//   tabText: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   badge: {
//     backgroundColor: '#EF4444',
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 5,
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   contactItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginTop: 12,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   contactInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//   },
//   avatarPlaceholder: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#9CA3AF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   contactTextContainer: {
//     flex: 1,
//   },
//   contactName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#111827',
//     marginBottom: 2,
//   },
//   contactPhone: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   contactBadge: {
//     backgroundColor: '#EFF6FF',
//     borderRadius: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     alignSelf: 'flex-start',
//     marginTop: 4,
//   },
//   contactBadgeText: {
//     color: '#3B82F6',
//     fontSize: 12,
//   },
//   contactSavedAs: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   addButton: {
//     backgroundColor: '#4E8AF4',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 5,
//     minWidth: 70,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginTop: 16,
//     textAlign: 'center',
//   },
//   smallLoadingContainer: {
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

//  export default ContactsScreen;

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  Image,
  SafeAreaView,
  TextInput
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContactsScreen = ({ navigation }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [nonAppUsers, setNonAppUsers] = useState([]);
  const [pendingSent, setPendingSent] = useState(0);
  const [pendingReceived, setPendingReceived] = useState(0);
  const [activeTab, setActiveTab] = useState('allUsers');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState([]);
  const [usingCachedData, setUsingCachedData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadContactsInstantly();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user => 
        (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone_number?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()))
      ));
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUsers]);

  const loadContactsInstantly = async () => {
    // First, immediately load cached data if available
    const cachedContacts = await getCachedContactsData();
    if (cachedContacts) {
      applyCachedData(cachedContacts);
      setUsingCachedData(true);
    }
    
    // Then fetch fresh data in background
    fetchFreshContacts();
  };

  const applyCachedData = (cachedData) => {
    setAllUsers(cachedData.all_users || []);
    setFilteredUsers(cachedData.all_users || []);
    
    const syncedContacts = cachedData.synced_contacts || [];
    const friendsList = syncedContacts.filter(c => c.user_details?.is_friend);
    const appUsersList = syncedContacts.filter(c => c.is_app_user && !c.user_details?.is_friend);
    
    setContacts(syncedContacts);
    setFriends(friendsList);
    setAppUsers(appUsersList);
    setPendingSent(cachedData.pending_sent || 0);
    setPendingReceived(cachedData.pending_received || 0);
  };

  const fetchFreshContacts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/contacts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update with fresh data
      setAllUsers(response.data.all_users || []);
      setFilteredUsers(response.data.all_users || []);
      
      const syncedContacts = response.data.synced_contacts || [];
      const friendsList = syncedContacts.filter(c => c.user_details?.is_friend);
      const appUsersList = syncedContacts.filter(c => c.is_app_user && !c.user_details?.is_friend);

      setContacts(syncedContacts);
      setFriends(friendsList);
      setAppUsers(appUsersList);
      setPendingSent(response.data.pending_sent || 0);
      setPendingReceived(response.data.pending_received || 0);

      // Cache the fresh data
      await cacheContactsData(response.data);
      setUsingCachedData(false);

    } catch (error) {
      console.log('❌ Error fetching fresh contacts');
      // Keep using cached data if fresh fetch fails
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFreshContacts();
    setRefreshing(false);
  };

  // Cache contacts data for offline use
  const cacheContactsData = async (data) => {
    try {
      await AsyncStorage.setItem('cachedContactsData', JSON.stringify({
        ...data,
        cachedAt: Date.now()
      }));
    } catch (error) {
      console.log('❌ Error caching contacts data');
    }
  };

  // Get cached contacts data
  const getCachedContactsData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem('cachedContactsData');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        // Check if cache is less than 24 hours old
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        if (parsedData.cachedAt && parsedData.cachedAt > oneDayAgo) {
          return parsedData;
        } else {
          await AsyncStorage.removeItem('cachedContactsData');
        }
      }
    } catch (error) {
      console.log('Error getting cached contacts data');
    }
    return null;
  };

  const renderUserAvatar = (item) => {
    const profilePic = item.profile_picture || item.user_details?.profile_picture;
    if (profilePic) {
      return (
        <Image 
          source={{ uri: profilePic }} 
          style={styles.avatar}
        />
      );
    }
    return (
      <View style={styles.avatarPlaceholder}>
        <Icon name="person" size={24} color="#fff" />
      </View>
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.contactItem}>
      <View style={styles.contactInfo}>
        {renderUserAvatar(item)}
        <View style={styles.contactTextContainer}>
          <Text style={styles.contactName}>{item.name || item.phone_number}</Text>
          <Text style={styles.contactPhone}>{item.phone_number}</Text>
          {item.is_in_contacts && (
            <View style={styles.contactBadge}>
              <Text style={styles.contactBadgeText}>In your contacts</Text>
              {item.contact_name && item.contact_name !== item.name && (
                <Text style={styles.contactSavedAs}>
                  Saved as: {item.contact_name}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          const profilePic = item.profile_picture || item.user_details?.profile_picture;
          const relativePath = profilePic ? profilePic.replace(/^https?:\/\/[^\/]+/, '') : null;

          navigation.navigate('PrivateChat', {
            receiverId: item.id || item.user_details?.id,
            name: item.contact_name || item.name || item.user_details?.name || item.phone_number,
            profile_image: relativePath || require('../assets/images/avatar/blank-profile-picture-973460_1280.png'),
            chatType: 'single',
          });
        }}
      >
        <Text style={styles.buttonText}>Message</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabButton = (tabName, title, count) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>
        {title}
      </Text>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const getCurrentData = () => {
    switch (activeTab) {
      case 'allUsers': return filteredUsers;
      case 'friends': return friends;
      case 'appUsers': return appUsers;
      default: return [];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon 
            name="arrow-back" 
            size={24} 
            color="#000" 
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Contacts</Text>
          {usingCachedData && (
            <View style={styles.cachedBadge}>
              <Icon name="wifi-off" size={12} color="#92400E" />
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={onRefresh}
        >
          <Icon name="refresh" size={24} color="#4E8AF4" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {renderTabButton('allUsers', 'Users on Showa', allUsers.length)}
        {renderTabButton('appUsers', 'Suggestions', appUsers.length)}
      </View>

      {/* User List - Shows instantly */}
      <FlatList
        data={getCurrentData()}
        renderItem={renderUserItem}
        keyExtractor={(item, index) => item.id || `${item.phone_number}-${index}`}
        contentContainerStyle={[
          styles.listContent,
          getCurrentData().length === 0 && styles.emptyListContent
        ]}
        onRefresh={onRefresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>
              {activeTab === 'friends' ? 'No friends yet' :
               activeTab === 'appUsers' ? 'No suggestions available' :
               activeTab === 'pending' ? 'No pending requests' :
               'No contacts found'}
            </Text>
            <Text style={styles.emptySubtext}>
              {usingCachedData ? 'Connect to internet to sync contacts' : 'Your contacts will appear here'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 16,
  },
  cachedBadge: {
    backgroundColor: '#FEF3C7',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    height: 48,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#111827',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4E8AF4',
  },
  activeTabText: {
    color: '#4E8AF4',
    fontWeight: '500',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  contactBadgeText: {
    color: '#3B82F6',
    fontSize: 12,
  },
  contactSavedAs: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#4E8AF4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 70,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ContactsScreen;
// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   TouchableOpacity, 
//   StyleSheet, 
//   ActivityIndicator, 
//   StatusBar,
//   Image,
//   SafeAreaView,
//   TextInput
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE } from '../api_routing/api';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const ContactsScreen = ({ navigation }) => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [appUsers, setAppUsers] = useState([]);
//   const [nonAppUsers, setNonAppUsers] = useState([]);
//   const [pendingSent, setPendingSent] = useState(0);
//   const [pendingReceived, setPendingReceived] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('allUsers');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [contacts, setContacts] = useState([]);
//   const [usingCachedData, setUsingCachedData] = useState(false);

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredUsers(allUsers);
//     } else {
//       const filtered = allUsers.filter(user => 
//         (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (user.phone_number?.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (user.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()))
//       ));
//       setFilteredUsers(filtered);
//     }
//   }, [searchQuery, allUsers]);

//   const fetchContacts = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
      
//       // First try to get cached contact sync data
//       const cachedSyncData = await AsyncStorage.getItem('contactSyncSummary');
      
//       if (cachedSyncData) {
//         try {
//           const parsedData = JSON.parse(cachedSyncData);
//           console.log('📱 Using cached contact sync data:', parsedData);
//           setUsingCachedData(true);
          
//           // You can use the cached data to show some initial info
//           // For example, show the last sync time
//         } catch (e) {
//           console.log('❌ Error parsing cached sync data');
//         }
//       }

//       // Then make the API call to get fresh data
//       const response = await axios.get(`${API_ROUTE}/contacts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Set all users data with contact info
//       setAllUsers(response.data.all_users || []);
//       setFilteredUsers(response.data.all_users || []);
      
//       // Handle synced contacts
//       const syncedContacts = response.data.synced_contacts || [];
//       const friendsList = syncedContacts.filter(c => c.user_details?.is_friend);
//       const appUsersList = syncedContacts.filter(c => c.is_app_user && !c.user_details?.is_friend);
//       const nonAppUsersList = syncedContacts.filter(c => !c.is_app_user);

//       setContacts(syncedContacts);
//       setFriends(friendsList);
//       setAppUsers(appUsersList);
//       setNonAppUsers(nonAppUsersList);
      
//       // Update counts
//       setPendingSent(response.data.pending_sent || 0);
//       setPendingReceived(response.data.pending_received || 0);

//       // Cache the successful response for future use
//       await cacheContactsData(response.data);

//     } catch (error) {
//       console.log('❌ Error fetching contacts, trying cached data...', error);
      
//       // If API fails, try to load from cache
//       const cachedContacts = await getCachedContactsData();
//       if (cachedContacts) {
//         setAllUsers(cachedContacts.all_users || []);
//         setFilteredUsers(cachedContacts.all_users || []);
        
//         const syncedContacts = cachedContacts.synced_contacts || [];
//         const friendsList = syncedContacts.filter(c => c.user_details?.is_friend);
//         const appUsersList = syncedContacts.filter(c => c.is_app_user && !c.user_details?.is_friend);
        
//         setContacts(syncedContacts);
//         setFriends(friendsList);
//         setAppUsers(appUsersList);
//         setPendingSent(cachedContacts.pending_sent || 0);
//         setPendingReceived(cachedContacts.pending_received || 0);
        
//         setUsingCachedData(true);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cache contacts data for offline use
//   const cacheContactsData = async (data) => {
//     try {
//       await AsyncStorage.setItem('cachedContactsData', JSON.stringify({
//         ...data,
//         cachedAt: Date.now()
//       }));
//       console.log('✅ Contacts data cached successfully');
//     } catch (error) {
//       console.log('❌ Error caching contacts data:', error);
//     }
//   };

//   // Get cached contacts data
//   const getCachedContactsData = async () => {
//     try {
//       const cachedData = await AsyncStorage.getItem('cachedContactsData');
//       if (cachedData) {
//         const parsedData = JSON.parse(cachedData);
//         // Check if cache is less than 1 hour old
//         const oneHourAgo = Date.now() - (60 * 60 * 1000);
//         if (parsedData.cachedAt && parsedData.cachedAt > oneHourAgo) {
//           console.log('📱 Using cached contacts data');
//           return parsedData;
//         } else {
//           console.log('🕐 Cached contacts data is too old');
//           await AsyncStorage.removeItem('cachedContactsData'); // Clear old cache
//         }
//       }
//     } catch (error) {
//       console.log('❌ Error getting cached contacts data:', error);
//     }
//     return null;
//   };

//   // Pull to refresh function
//   const onRefresh = async () => {
//     setUsingCachedData(false);
//     await fetchContacts();
//   };

//   const renderUserAvatar = (item) => {
//     const profilePic = item.profile_picture || item.user_details?.profile_picture;
//     if (profilePic) {
//       return (
//         <Image 
//           source={{ uri: profilePic }} 
//           style={styles.avatar}
//         />
//       );
//     }
//     return (
//       <View style={styles.avatarPlaceholder}>
//         <Icon name="person" size={24} color="#fff" />
//       </View>
//     );
//   };

//   const renderUserItem = ({ item}) => (
//     <View style={styles.contactItem}>
//       <View style={styles.contactInfo}>
//         {renderUserAvatar(item)}
//         <View style={styles.contactTextContainer}>
//           <Text style={styles.contactName}>{item.name || item.phone_number}</Text>
//           <Text style={styles.contactPhone}>{item.phone_number}</Text>
//           {item.is_in_contacts && (
//             <View style={styles.contactBadge}>
//               <Text style={styles.contactBadgeText}>In your contacts</Text>
//               {item.contact_name && item.contact_name !== item.name && (
//                 <Text style={styles.contactSavedAs}>
//                   Saved as: {item.contact_name}
//                 </Text>
//               )}
//             </View>
//           )}
//         </View>
//       </View>
//       <TouchableOpacity 
//         style={styles.addButton}
//         onPress={() => {
//           const profilePic = item.profile_picture || item.user_details?.profile_picture;
//           const relativePath = profilePic ? profilePic.replace(/^https?:\/\/[^\/]+/, '') : null;

//           navigation.navigate('PrivateChat', {
//             receiverId: item.id || item.user_details?.id,
//             name: item.contact_name || item.name || item.user_details?.name || item.phone_number,
//             profile_image: relativePath || require('../assets/images/avatar/blank-profile-picture-973460_1280.png'),
//             chatType: 'single',
//           });
//         }}
//       >
//         <Text style={styles.buttonText}>Message</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderTabButton = (tabName, title, count) => (
//     <TouchableOpacity
//       style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
//       onPress={() => setActiveTab(tabName)}
//     >
//       <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>
//         {title}
//       </Text>
//       {count > 0 && (
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>{count}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Icon 
//             name="arrow-back" 
//             size={24} 
//             color="#000" 
//             onPress={() => navigation.goBack()}
//           />
//           <Text style={styles.headerTitle}>Contacts</Text>
//           {usingCachedData && (
//             <View style={styles.cachedBadge}>
//               <Text style={styles.cachedBadgeText}>Offline</Text>
//             </View>
//           )}
//         </View>
//         <TouchableOpacity 
//           style={styles.searchButton}
//           onPress={onRefresh}
//         >
//           <Icon name="refresh" size={24} color="#4E8AF4" />
//         </TouchableOpacity>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search contacts..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="#9CA3AF"
//         />
//         {loading && (
//           <ActivityIndicator size="small" color="#4E8AF4" style={styles.searchLoading} />
//         )}
//       </View>

//       {/* Cache Status Indicator */}
//       {usingCachedData && (
//         <View style={styles.cacheIndicator}>
//           <Icon name="wifi-off" size={16} color="#6B7280" />
//           <Text style={styles.cacheIndicatorText}>
//             Showing cached data • Pull down to refresh
//           </Text>
//         </View>
//       )}

//       {/* Tabs */}
//       <View style={styles.tabContainer}>
//         {renderTabButton('allUsers', 'Users on Showa', allUsers.length)}
//         {renderTabButton('appUsers', 'Suggestions', appUsers.length)}
//       </View>

//       {/* Small Loading Indicator */}
//       {loading && (
//         <View style={styles.smallLoadingContainer}>
//           <ActivityIndicator size="small" color="#4E8AF4" />
//           <Text style={styles.loadingText}>Loading contacts...</Text>
//         </View>
//       )}

//       {/* User List */}
//       <FlatList
//         data={
//           activeTab === 'allUsers' ? filteredUsers :
//           activeTab === 'friends' ? friends :
//           activeTab === 'appUsers' ? appUsers :
//           []
//         }
//         renderItem={renderUserItem}
//         keyExtractor={(item, index) => item.id || `${item.phone_number}-${index}`}
//         contentContainerStyle={styles.listContent}
//         onRefresh={onRefresh}
//         refreshing={loading && !usingCachedData}
//         ListEmptyComponent={
//           !loading && (
//             <View style={styles.emptyContainer}>
//               <Icon name="people-outline" size={60} color="#D1D5DB" />
//               <Text style={styles.emptyText}>
//                 {activeTab === 'friends' ? 'No friends yet' :
//                  activeTab === 'appUsers' ? 'No suggestions available' :
//                  activeTab === 'pending' ? 'No pending requests' :
//                  'No users found'}
//               </Text>
//               {usingCachedData && (
//                 <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
//                   <Text style={styles.retryButtonText}>Try Again</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//     marginLeft: 16,
//   },
//   cachedBadge: {
//     backgroundColor: '#FEF3C7',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginLeft: 8,
//   },
//   cachedBadgeText: {
//     fontSize: 12,
//     color: '#92400E',
//     fontWeight: '500',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     paddingHorizontal: 12,
//     height: 48,
//     elevation: 2,
//     position: 'relative',
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: '100%',
//     fontSize: 16,
//     color: '#111827',
//   },
//   searchLoading: {
//     position: 'absolute',
//     right: 12,
//   },
//   cacheIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F3F4F6',
//     padding: 8,
//     marginHorizontal: 16,
//     borderRadius: 8,
//     marginTop: 4,
//   },
//   cacheIndicatorText: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginLeft: 4,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     position: 'relative',
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#4E8AF4',
//   },
//   activeTabText: {
//     color: '#4E8AF4',
//     fontWeight: '500',
//   },
//   tabText: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   badge: {
//     backgroundColor: '#EF4444',
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 5,
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   contactItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginTop: 12,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   contactInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//   },
//   avatarPlaceholder: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#9CA3AF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   contactTextContainer: {
//     flex: 1,
//   },
//   contactName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#111827',
//     marginBottom: 2,
//   },
//   contactPhone: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   contactBadge: {
//     backgroundColor: '#EFF6FF',
//     borderRadius: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     alignSelf: 'flex-start',
//     marginTop: 4,
//   },
//   contactBadgeText: {
//     color: '#3B82F6',
//     fontSize: 12,
//   },
//   contactSavedAs: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   addButton: {
//     backgroundColor: '#4E8AF4',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 5,
//     minWidth: 70,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginTop: 16,
//     textAlign: 'center',
//   },
//   smallLoadingContainer: {
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   loadingText: {
//     marginTop: 8,
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   retryButton: {
//     backgroundColor: '#4E8AF4',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     marginTop: 16,
//   },
//   retryButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
// });

// export default ContactsScreen;


// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   TouchableOpacity, 
//   StyleSheet, 
//   ActivityIndicator, 
//   StatusBar,
//   Image,
//   SafeAreaView,
//   TextInput
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE } from '../api_routing/api';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const CACHE_KEY = 'contacts_cache';
// const CACHE_TIMESTAMP_KEY = 'contacts_cache_timestamp';
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

// const ContactsScreen = ({ navigation }) => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [appUsers, setAppUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('allUsers');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [contacts, setContacts] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     loadCachedData();
//     fetchContacts();
//   }, []);

//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredUsers(allUsers);
//     } else {
//       const filtered = allUsers.filter(user => 
//         (user.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//          user.phone_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//          user.name?.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//       setFilteredUsers(filtered);
//     }
//   }, [searchQuery, allUsers]);

//   // Load cached data immediately when user opens the page
//   const loadCachedData = async () => {
//     try {
//       const cachedData = await AsyncStorage.getItem(CACHE_KEY);
//       const cachedTimestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      
//       if (cachedData && cachedTimestamp) {
//         const timestamp = parseInt(cachedTimestamp);
//         const now = Date.now();
        
//         // Use cache if it's not expired
//         if (now - timestamp < CACHE_DURATION) {
//           const parsedData = JSON.parse(cachedData);
//           processAndSetData(parsedData);
//           console.log('Loaded contacts from cache');
//         }
//       }
//     } catch (error) {
//       console.error('Error loading cached data:', error);
//     }
//   };

//   // Process and set data to state
//   const processAndSetData = (data) => {
//     const syncedContacts = data.synced_contacts || [];
//     setContacts(syncedContacts);

//     // All Users Tab: Only show contacts from phonebook who are registered in the app
//     const appUserContacts = syncedContacts.filter(contact => 
//       contact.is_app_user === true
//     );
//     setAllUsers(appUserContacts);
//     setFilteredUsers(appUserContacts);

//     // Friends Tab: Show contacts who are NOT registered in the app
//     const nonAppUsers = syncedContacts.filter(contact => 
//       contact.is_app_user === false
//     );
//     setFriends(nonAppUsers);

//     // Suggestions Tab: Show the same as All Users (app users from contacts)
//     setAppUsers(appUserContacts);
//   };

//   // Save data to cache
//   const saveToCache = async (data) => {
//     try {
//       await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
//       await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
//       console.log('Contacts data saved to cache');
//     } catch (error) {
//       console.error('Error saving to cache:', error);
//     }
//   };

//   // Fetch contacts from server
//   const fetchContacts = async (isBackgroundRefresh = false) => {
//     if (!isBackgroundRefresh) {
//       setLoading(true);
//     } else {
//       setRefreshing(true);
//     }

//     try {
//       const token = await AsyncStorage.getItem('userToken');
      
//       const response = await axios.get(`${API_ROUTE}/contacts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000, // 10 second timeout
//       });

//       console.log('API Response received');

//       // Process and set the new data
//       processAndSetData(response.data);

//       // Save to cache for future use
//       await saveToCache(response.data);

//     } catch (error) {
//       console.error('Error fetching contacts:', error);
      
//       // If it's a background refresh and there's an error, don't show error to user
//       if (!isBackgroundRefresh) {
//         // You can add error handling UI here if needed
//       }
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Background refresh function
//   const refreshDataInBackground = async () => {
//     try {
//       const cachedTimestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
//       if (cachedTimestamp) {
//         const timestamp = parseInt(cachedTimestamp);
//         const now = Date.now();
        
//         // Only refresh if cache is older than 1 minute
//         if (now - timestamp > 60000) {
//           console.log('Performing background refresh...');
//           await fetchContacts(true);
//         }
//       }
//     } catch (error) {
//       console.error('Background refresh error:', error);
//     }
//   };

//   // Refresh handler for pull-to-refresh
//   const handleRefresh = () => {
//     fetchContacts();
//   };

//   // Refresh data when screen comes into focus
//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       // Refresh data when screen comes into focus
//       refreshDataInBackground();
//     });

//     return unsubscribe;
//   }, [navigation]);

//   const renderUserAvatar = (item) => {
//     const profilePic = item.profile_picture || item.user_details?.profile_picture;
//     if (profilePic) {
//       return (
//         <Image 
//           source={{ uri: profilePic }} 
//           style={styles.avatar}
//         />
//       );
//     }
//     return (
//       <View style={styles.avatarPlaceholder}>
//         <Icon name="person" size={24} color="#fff" />
//       </View>
//     );
//   };

//   const renderUserItem = ({ item }) => (
//     <View style={styles.contactItem}>
//       <View style={styles.contactInfo}>
//         {renderUserAvatar(item)}
//         <View style={styles.contactTextContainer}>
//           <Text style={styles.contactName}>
//             {item.contact_name || item.name || item.user_details?.name || 'Unknown'}
//           </Text>
//           <Text style={styles.contactSavedAs}>
//             Shows as: {item.contact_name || item.name || item.user_details?.name || 'Unknown'}
//           </Text>
//         </View>
//       </View>
      
//       {activeTab === 'friends' ? (
//         <TouchableOpacity 
//           style={styles.inviteButton}
//           onPress={() => {
//             console.log(`Invite sent to ${item.phone_number}`);
//           }}
//         >
//           <Text style={styles.buttonText}>Invite</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity 
//           style={styles.addButton}
//           onPress={() => {
//             const profilePic = `${item.profile_picture}` || `${item.user_details?.profile_picture}`;
//             const relativePath = profilePic ? profilePic.replace(/^https?:\/\/[^\/]+/, '') : null;
//             console.log('Navigating to PrivateChat with:', {
//               receiverId: item.id || item.user_details?.id,
//               name: item.contact_name || item.name || item.user_details?.name || item.phone_number,
//               profile_image: relativePath || require('../assets/images/avatar/blank-profile-picture-973460_1280.png'),
//               chatType: 'single',
//             });

//             navigation.navigate('PrivateChat', {
//               receiverId: item.id || item.user_details?.id,
//               name: item.contact_name || item.name || item.user_details?.name || item.phone_number,
//               profile_image: relativePath || require('../assets/images/avatar/blank-profile-picture-973460_1280.png'),
//               chatType: 'single',
//             });
//           }}
//         >
//           <Text style={styles.buttonText}>Message</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   const renderTabButton = (tabName, title, count) => (
//     <TouchableOpacity
//       style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
//       onPress={() => setActiveTab(tabName)}
//     >
//       <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>
//         {title}
//       </Text>
//       {count > 0 && (
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>{count}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   const getDataForCurrentTab = () => {
//     switch (activeTab) {
//       case 'allUsers':
//         return filteredUsers;
//       case 'friends':
//         return friends;
//       case 'appUsers':
//         return appUsers;
//       default:
//         return [];
//     }
//   };

//   const getEmptyText = () => {
//     switch (activeTab) {
//       case 'allUsers':
//         return 'No app users found in your contacts';
//       case 'friends':
//         return 'No contacts to invite';
//       case 'appUsers':
//         return 'No suggestions available';
//       default:
//         return 'No users found';
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Icon 
//             name="arrow-back" 
//             size={24} 
//             color="#000" 
//             onPress={() => navigation.goBack()}
//           />
//           <Text style={styles.headerTitle}>Contacts</Text>
//         </View>
//         <View style={styles.headerRight}>
//           {refreshing && (
//             <ActivityIndicator size="small" color="#4E8AF4" style={styles.refreshIndicator} />
//           )}
//           <TouchableOpacity style={styles.searchButton} onPress={handleRefresh}>
//             <Icon name="refresh" size={24} color="#4E8AF4" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search contacts..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="#9CA3AF"
//         />
//       </View>

//       <View style={styles.tabContainer}>
//         {renderTabButton('allUsers', 'Friends on Showa', allUsers.length)}
//         {renderTabButton('friends', 'Others', friends.length)}
//         {/* {renderTabButton('appUsers', 'Suggestions', appUsers.length)} */}
//       </View>

//      <FlatList
//           data={getDataForCurrentTab()}
//           renderItem={renderUserItem}
//           keyExtractor={(item, index) => `${item.id}-${item.phone_number}-${index}`}
//           contentContainerStyle={styles.listContent}
//           refreshing={refreshing}
//           onRefresh={handleRefresh}
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Icon name="people-outline" size={60} color="#D1D5DB" />
//               <Text style={styles.emptyText}>
//                 {getEmptyText()}
//               </Text>
//             </View>
//           }
//         />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   inviteButton: {
//     backgroundColor: '#10B981',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 5,
//     minWidth: 70,
//     alignItems: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   refreshIndicator: {
//     marginRight: 10,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//     marginLeft: 16,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     paddingHorizontal: 12,
//     height: 48,
//     elevation: 2,
//     position: 'relative',
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: '100%',
//     fontSize: 16,
//     color: '#111827',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     position: 'relative',
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#4E8AF4',
//   },
//   activeTabText: {
//     color: '#4E8AF4',
//     fontWeight: '500',
//   },
//   tabText: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   badge: {
//     backgroundColor: '#EF4444',
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 5,
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   listContent: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   contactItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginTop: 12,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   contactInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//   },
//   avatarPlaceholder: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#9CA3AF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   contactTextContainer: {
//     flex: 1,
//   },
//   contactName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#111827',
//     marginBottom: 2,
//   },
//   contactSavedAs: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   addButton: {
//     backgroundColor: '#4E8AF4',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 5,
//     minWidth: 70,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#6B7280',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginTop: 16,
//     textAlign: 'center',
//   },
// });

// export default ContactsScreen;

///////////////////////// working ==========================

// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   TouchableOpacity, 
//   StyleSheet, 
//   ActivityIndicator, 
//   StatusBar,
//   Image,
//   SafeAreaView,
//   TextInput,
//   Alert,
//   ToastAndroid,
//   Platform
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE } from '../api_routing/api';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const CACHE_KEY = 'contacts_cache';
// const CACHE_TIMESTAMP_KEY = 'contacts_cache_timestamp';
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

// const ContactsScreen = ({ navigation }) => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [appUsers, setAppUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('allUsers');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [contacts, setContacts] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [sendingInvites, setSendingInvites] = useState({}); // Track sending state per contact

//   useEffect(() => {
//     loadCachedData();
//     fetchContacts();
//   }, []);

//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredUsers(allUsers);
//     } else {
//       const filtered = allUsers.filter(user => 
//         (user.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//          user.phone_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//          user.name?.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//       setFilteredUsers(filtered);
//     }
//   }, [searchQuery, allUsers]);

//   const loadCachedData = async () => {
//     try {
//       const cachedData = await AsyncStorage.getItem(CACHE_KEY);
//       const cachedTimestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      
//       if (cachedData && cachedTimestamp) {
//         const timestamp = parseInt(cachedTimestamp);
//         const now = Date.now();
        
//         if (now - timestamp < CACHE_DURATION) {
//           const parsedData = JSON.parse(cachedData);
//           processAndSetData(parsedData);
//           console.log('Loaded contacts from cache');
//         }
//       }
//     } catch (error) {
//       console.error('Error loading cached data:', error);
//     }
//   };

//   const processAndSetData = (data) => {
//     const syncedContacts = data.synced_contacts || [];
//     setContacts(syncedContacts);

//     const appUserContacts = syncedContacts.filter(contact => 
//       contact.is_app_user === true
//     );
//     setAllUsers(appUserContacts);
//     setFilteredUsers(appUserContacts);

//     const nonAppUsers = syncedContacts.filter(contact => 
//       contact.is_app_user === false
//     );
//     setFriends(nonAppUsers);

//     setAppUsers(appUserContacts);
//   };

//   const saveToCache = async (data) => {
//     try {
//       await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
//       await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
//       console.log('Contacts data saved to cache');
//     } catch (error) {
//       console.error('Error saving to cache:', error);
//     }
//   };

//   const fetchContacts = async (isBackgroundRefresh = false) => {
//     if (!isBackgroundRefresh) {
//       setLoading(true);
//     } else {
//       setRefreshing(true);
//     }

//     try {
//       const token = await AsyncStorage.getItem('userToken');
      
//       const response = await axios.get(`${API_ROUTE}/contacts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000,
//       });

//       console.log('API Response received');
//       processAndSetData(response.data);
//       await saveToCache(response.data);

//     } catch (error) {
//       console.error('Error fetching contacts:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const sendInvitation = async (contact) => {
//     // Check if we have email for this contact
//     if (!contact.email) {
//       showMessage('No email address found for this contact');
//       return;
//     }

//     setSendingInvites(prev => ({ ...prev, [contact.id]: true }));

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const userData = await AsyncStorage.getItem('userData');
//       const inviterName = userData ? JSON.parse(userData).name : 'Your friend';

//       const response = await axios.post(
//         `${API_ROUTE}/send-invitation/`,
//         {
//           email: contact.email,
//           inviter_name: inviterName,
//           contact_name: contact.contact_name || contact.name
//         },
//         {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           timeout: 15000,
//         }
//       );

//       if (response.data.success) {
//         showMessage('Invitation sent successfully!');
//         console.log(`Invitation sent to ${contact.email}`);
//       } else {
//         throw new Error(response.data.error || 'Failed to send invitation');
//       }

//     } catch (error) {
//       console.error('Error sending invitation:', error);
//       showMessage('Failed to send invitation. Please try again.');
//     } finally {
//       setSendingInvites(prev => ({ ...prev, [contact.id]: false }));
//     }
//   };

//   const showMessage = (message) => {
//     if (Platform.OS === 'android') {
//       ToastAndroid.show(message, ToastAndroid.SHORT);
//     } else {
//       Alert.alert('Info', message);
//     }
//   };

//   const refreshDataInBackground = async () => {
//     try {
//       const cachedTimestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
//       if (cachedTimestamp) {
//         const timestamp = parseInt(cachedTimestamp);
//         const now = Date.now();
        
//         if (now - timestamp > 60000) {
//           console.log('Performing background refresh...');
//           await fetchContacts(true);
//         }
//       }
//     } catch (error) {
//       console.error('Background refresh error:', error);
//     }
//   };

//   const handleRefresh = () => {
//     fetchContacts();
//   };

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       refreshDataInBackground();
//     });

//     return unsubscribe;
//   }, [navigation]);

//   const renderUserAvatar = (item) => {
//     const profilePic = item.profile_picture || item.user_details?.profile_picture;
//     if (profilePic) {
//       return (
//         <Image 
//           source={{ uri: profilePic }} 
//           style={styles.avatar}
//         />
//       );
//     }
//     return (
//       <View style={styles.avatarPlaceholder}>
//         <Icon name="person" size={24} color="#fff" />
//       </View>
//     );
//   };

//   const renderUserItem = ({ item }) => {
//     console.log('Rendering item:', item);
//     const isSending = sendingInvites[item.id];
//     const hasEmail = !!item.email;
//     const hasPhone = item.phone_number

//     return (
//       <View style={styles.contactItem}>
//         <View style={styles.contactInfo}>
//           {renderUserAvatar(item)}
//           <View style={styles.contactTextContainer}>
//             <Text style={styles.contactName}>
//               {item.contact_name || item.name || item.user_details?.name || 'Unknown'}
//             </Text>
//             <Text style={styles.contactSavedAs}>
//               Shows as: {item.contact_name || item.name || item.user_details?.name || 'Unknown'}
//             </Text>
//             {hasPhone && activeTab === 'friends' && (
//               <Text style={styles.noEmailText}>{hasPhone}</Text>
//             )}
//           </View>
//         </View>
        
//         {activeTab === 'friends' ? (
//           <TouchableOpacity 
//             style={[
//               styles.inviteButton,
//               (!hasEmail || isSending) && styles.inviteButtonDisabled
//             ]}
//             onPress={() => sendInvitation(item)}
//             disabled={!hasEmail || isSending}
//           >
//             {isSending ? (
//               <ActivityIndicator size="small" color="#FFFFFF" />
//             ) : (
//               <>
//                 <Icon name="email" size={16} color="#FFFFFF" style={styles.buttonIcon} />
//                 <Text style={styles.buttonText}>Invite</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity 
//             style={styles.addButton}
//             onPress={() => {
//               const profilePic = `${item.profile_picture}` || `${item.user_details?.profile_picture}`;
//               const relativePath = profilePic ? profilePic.replace(/^https?:\/\/[^\/]+/, '') : null;
              
//               navigation.navigate('PrivateChat', {
//                 receiverId: item.id || item.user_details?.id,
//                 name: item.contact_name || item.name || item.user_details?.name || item.phone_number,
//                 profile_image: relativePath || require('../assets/images/avatar/blank-profile-picture-973460_1280.png'),
//                 chatType: 'single',
//               });
//             }}
//           >
//             <Icon name="message" size={16} color="#FFFFFF" style={styles.buttonIcon} />
//             <Text style={styles.buttonText}>Message</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   const renderTabButton = (tabName, title, count) => (
//     <TouchableOpacity
//       style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
//       onPress={() => setActiveTab(tabName)}
//     >
//       <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>
//         {title}
//       </Text>
//       {count > 0 && (
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>{count}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   const getDataForCurrentTab = () => {
//     switch (activeTab) {
//       case 'allUsers':
//         return filteredUsers;
//       case 'friends':
//         return friends;
//       case 'appUsers':
//         return appUsers;
//       default:
//         return [];
//     }
//   };

//   const getEmptyText = () => {
//     switch (activeTab) {
//       case 'allUsers':
//         return 'No app users found in your contacts';
//       case 'friends':
//         return 'No contacts to invite';
//       case 'appUsers':
//         return 'No suggestions available';
//       default:
//         return 'No users found';
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Icon 
//             name="arrow-back" 
//             size={24} 
//             color="#000" 
//             onPress={() => navigation.goBack()}
//           />
//           <Text style={styles.headerTitle}>Contacts</Text>
//         </View>
//         <View style={styles.headerRight}>
//           {refreshing && (
//             <ActivityIndicator size="small" color="#4E8AF4" style={styles.refreshIndicator} />
//           )}
//           <TouchableOpacity style={styles.searchButton} onPress={handleRefresh}>
//             <Icon name="refresh" size={24} color="#4E8AF4" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search contacts..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="#9CA3AF"
//         />
//       </View>

//       <View style={styles.tabContainer}>
//         {renderTabButton('allUsers', 'Friends on Showa', allUsers.length)}
//         {renderTabButton('friends', 'Others', friends.length)}
//       </View>

//       <FlatList
//         data={getDataForCurrentTab()}
//         renderItem={renderUserItem}
//         keyExtractor={(item, index) => `${item.id}-${item.phone_number}-${index}`}
//         contentContainerStyle={styles.listContent}
//         refreshing={refreshing}
//         onRefresh={handleRefresh}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Icon name="people-outline" size={60} color="#D1D5DB" />
//             <Text style={styles.emptyText}>
//               {getEmptyText()}
//             </Text>
//           </View>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   refreshIndicator: {
//     marginRight: 10,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//     marginLeft: 16,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     paddingHorizontal: 12,
//     height: 48,
//     elevation: 2,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: '100%',
//     fontSize: 16,
//     color: '#111827',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     position: 'relative',
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#4E8AF4',
//   },
//   activeTabText: {
//     color: '#4E8AF4',
//     fontWeight: '500',
//   },
//   tabText: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   badge: {
//     backgroundColor: '#EF4444',
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 5,
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   listContent: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   contactItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginTop: 12,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   contactInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//   },
//   avatarPlaceholder: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#9CA3AF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   contactTextContainer: {
//     flex: 1,
//   },
//   contactName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#111827',
//     marginBottom: 2,
//   },
//   contactSavedAs: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   noEmailText: {
//     fontSize: 11,
//     color: '#EF4444',
//     marginTop: 2,
//     fontStyle: 'italic',
//   },
//   inviteButton: {
//     backgroundColor: '#10B981',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 5,
//     minWidth: 80,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   inviteButtonDisabled: {
//     backgroundColor: '#9CA3AF',
//   },
//   addButton: {
//     backgroundColor: '#4E8AF4',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 5,
//     minWidth: 80,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   buttonIcon: {
//     marginRight: 4,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginTop: 16,
//     textAlign: 'center',
//   },
// });

// export default ContactsScreen;