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
//   Dimensions,
//   RefreshControl
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE } from '../api_routing/api';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const { width } = Dimensions.get('window');

// const ContactsScreen = ({ navigation }) => {
//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const fetchContacts = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
      
//       const response = await axios.get(`${API_ROUTE}/contacts/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Combine all contact types into one array
//       const allContacts = [
//         ...(response.data.synced_contacts || []),
//         ...(response.data.all_users || [])
//       ];
      
//       // Removing duplicates =============================
//       const uniqueContacts = allContacts.filter(
//         (contact, index, self) =>
//           index === self.findIndex((c) => (
//             c.id === contact.id || 
//             c.phone_number === contact.phone_number
//           ))
//       );

//       setContacts(uniqueContacts);
//     } catch (error) {
//      // console.error('Error fetching contacts:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchContacts();
//   };

//   const handleConnect = async (userId) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       await axios.post(
//         `${API_ROUTE}/follow-user/${userId}/`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchContacts();
//     } catch (error) {
//       //console.error('Error connecting with user:', error);
//     }
//   };

//   const renderContactItem = ({ item }) => {
//     const user = item.user_details || item;
//     return (
//       <View style={styles.contactCard}>
//         <TouchableOpacity 
//           //onPress={() => navigation.navigate('UserProfile', { userId: user.id })}
//         >
//           {user.profile_picture ? (
//             <Image 
//               source={{ uri: user.profile_picture }} 
//               style={styles.contactAvatar}
//             />
//           ) : (
//             <View style={[styles.contactAvatar, styles.avatarPlaceholder]}>
//               <Ionicons name="person" size={24} color="#fff" />
//             </View>
//           )}
//         </TouchableOpacity>
        
//         <Text style={styles.contactName} numberOfLines={1}>
//           {item.name || user.username || user.phone_number}
//         </Text>

//         {!user.is_friend && (
//           <TouchableOpacity
//             style={styles.addButton}
//             onPress={() => handleConnect(user.id)}
//           >
//             <Text style={styles.addButtonText}>Add Friend</Text>
//           </TouchableOpacity>
//         )}
        
//         {user.is_friend && (
//           <View style={styles.friendBadge}>
//             <Text style={styles.friendBadgeText}>Friends</Text>
//           </View>
//         )}
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4E8AF4" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
 
//       {/* Contacts Count */}
//       <View style={styles.countContainer}>
//         <Text style={styles.countText}>
//          People you may Know
//         </Text>
//       </View>
      
      
//       <FlatList
//         horizontal
//         data={contacts}
//         renderItem={renderContactItem}
//         keyExtractor={(item) => item.id?.toString() || item.phone_number}
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#4E8AF4']}
//             tintColor="#4E8AF4"
//           />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="people-outline" size={60} color="#D1D5DB" />
//             <Text style={styles.emptyText}>
//               No contacts found
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
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
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
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   syncButton: {
//     padding: 8,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginHorizontal: 16,
//     marginVertical: 12,
//     paddingHorizontal: 16,
//     height: 48,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   searchIcon: {
//     marginRight: 12,
//   },
//   searchInput: {
//     flex: 1,
//     height: '100%',
//     fontSize: 16,
//     color: '#111827',
//   },
//   countContainer: {
//     paddingHorizontal: 16,
//     marginBottom: 12,
//   },
//   countText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#40444bff',
//   },
//   listContent: {
//     paddingLeft: 16,
//     paddingRight: 8,
//     paddingBottom: 16,
//   },
//   contactCard: {
//     width: 120,
//     marginRight: 16,
//     alignItems: 'center',
//   },
//   contactAvatar: {
//     width: 125,
//     height: 160,
//     borderRadius: 5,
//     margin:10,
//     marginBottom: 8,
//   },
//   contactName: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#111827',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   addButton: {
//     backgroundColor: '#4E8AF4',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     width: '100%',
//     alignItems: 'center',
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   friendBadge: {
//     backgroundColor: '#E5E7EB',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     width: '100%',
//     alignItems: 'center',
//   },
//   friendBadgeText: {
//     color: '#6B7280',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   avatarPlaceholder: {
//     backgroundColor: '#9CA3AF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     width: width - 32,
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

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView,
  Image,
  Dimensions,
  RefreshControl,
  Animated
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const ContactsScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [buttonStates, setButtonStates] = useState({});

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.get(`${API_ROUTE}/contacts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Combine all contact types into one array
      const allContacts = [
        ...(response.data.synced_contacts || []),
        ...(response.data.all_users || [])
      ];
      
      // Remove duplicates
      const uniqueContacts = allContacts.filter(
        (contact, index, self) =>
          index === self.findIndex((c) => (
            c.id === contact.id || 
            c.phone_number === contact.phone_number
          ))
      );

      setContacts(uniqueContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchContacts();
  };

  const handleConnect = async (userId) => {
    try {
      // Set loading state for this specific button
      setButtonStates(prev => ({ ...prev, [userId]: 'loading' }));
      
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `${API_ROUTE}/follow-user/${userId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Set to "invite sent" state
      setButtonStates(prev => ({ ...prev, [userId]: 'sent' }));
      
    } catch (error) {
      console.error('Error connecting with user:', error);
      // Reset on error
      setButtonStates(prev => ({ ...prev, [userId]: 'add' }));
    }
  };

  const getButtonState = (user) => {
    if (user.is_friend) return 'friends';
    return buttonStates[user.id] || 'add';
  };

  const renderButton = (user) => {
    const buttonState = getButtonState(user);
    
    switch (buttonState) {
      case 'loading':
        return (
          <TouchableOpacity style={[styles.actionButton, styles.loadingButton]} disabled>
            <ActivityIndicator size="small" color="#FFFFFF" />
          </TouchableOpacity>
        );
      
      case 'sent':
        return (
          <TouchableOpacity style={[styles.actionButton, styles.sentButton]}>
            <Text style={styles.sentButtonText}>Invite Sent</Text>
          </TouchableOpacity>
        );
      
      case 'friends':
        return (
          <View style={[styles.actionButton, styles.friendsButton]}>
            <Text style={styles.friendsButtonText}>Friends</Text>
          </View>
        );
      
      case 'add':
      default:
        return (
          <TouchableOpacity 
            style={[styles.actionButton, styles.addButton]}
            onPress={() => handleConnect(user.id)}
          >
            <Text style={styles.addButtonText}>Add Friend</Text>
          </TouchableOpacity>
        );
    }
  };

  const renderContactItem = ({ item }) => {
    const user = item.user_details || item;
    
    return (
      <View style={styles.contactCard}>
        <View style={styles.avatarContainer}>
          {user.profile_picture ? (
            <Image 
              source={{ uri: user.profile_picture }} 
              style={styles.contactAvatar}
            />
          ) : (
            <View style={[styles.contactAvatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={28} color="#FFFFFF" />
            </View>
          )}
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactName} numberOfLines={1}>
            {item.name || user.username || user.phone_number}
          </Text>
          
          {renderButton(user)}
        </View>
      </View>
    );
  };

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#6366F1" />
  //       <Text style={styles.loadingText}>Loading connections...</Text>
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover People</Text>
        <Text style={styles.headerSubtitle}>Connect with friends and contacts</Text>
      </View>
      
      {/* Contacts Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>People You May Know</Text>
        <Text style={styles.contactsCount}>{contacts.length} contacts</Text>
      </View>
      
      <FlatList
        horizontal
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id?.toString() || item.phone_number}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6366F1']}
            tintColor="#6366F1"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={80} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>No contacts found</Text>
            <Text style={styles.emptySubtitle}>
              Your contacts will appear here once they join
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
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  contactsCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  contactCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  contactAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
  },
  avatarPlaceholder: {
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    alignItems: 'center',
    width: '100%',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
    width: '100%',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  addButton: {
    backgroundColor: '#6366F1',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingButton: {
    backgroundColor: '#9CA3AF',
  },
  sentButton: {
    backgroundColor: '#10B981',
  },
  sentButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  friendsButton: {
    backgroundColor: '#E5E7EB',
  },
  friendsButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    width: width - 64,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ContactsScreen;