import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  StatusBar,
  Image,
  TextInput
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../theme/colors';

const ContactsScreen = ({ navigation, route }) => {
  const [contacts, setContacts] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  

  const fetchContacts = async () => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    
    const response = await axios.get(`${API_ROUTE}/contacts/`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000,
    });

    console.log('API Response:', response.data);

    // Get the users from the response
    const allUsers = response.data.all_users || [];
    
    // Transform the users into the format your component expects
    const formattedContacts = allUsers.map(user => ({
      id: user.id,
      name: user.name,
      phone_number: user.phone_number,
      is_app_user: true, // Since these are all app users
      user_details: {
        id: user.id,
        name: user.name,
        profile_picture: user.profile_picture,
        is_friend: user.friendship_status === 'friends'
      }
    }));

    setContacts(formattedContacts);
    setAppUsers(formattedContacts); 
  } catch (error) {
    //console.error('Error fetching contacts:', error);
  } finally {
    setLoading(false);
  }
};


  const toggleUserSelection = (user) => {
  setSelectedUsers(prev => {
    const isSelected = prev.some(u => u.id === user.id); // Changed from user.user_details.id
    if (isSelected) {
      return prev.filter(u => u.id !== user.id);
    } else {
      return [...prev, {
        id: user.id,
        username: user.name, // or another field if available
        name: user.name,
        profile_picture: user.user_details?.profile_picture
      }];
    }
  });
};
  

  const renderContactAvatar = (item) => {
    if (item.user_details?.profile_picture) {
      return (
        <Image 
          source={{ uri: item.user_details.profile_picture }} 
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

  const filteredUsers = appUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone_number.includes(searchQuery)
  );

  const renderItem = ({ item }) => {
    const isSelected = selectedUsers.some(u => u.id === item.user_details.id);
    
    return (
      <TouchableOpacity 
        style={[
          styles.contactItem,
          isSelected && styles.selectedContactItem
        ]}
        onPress={() => toggleUserSelection(item)}
      >
        <View style={styles.contactInfo}>
          {renderContactAvatar(item)}
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactPhone}>{item.phone_number}</Text>
          </View>
        </View>
        {isSelected ? (
          <Icon name="check-circle" size={24} color="#4E8AF4" />
        ) : (
          <View style={styles.circle} />
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E8AF4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon 
            style={styles.backIcon} 
            name="arrow-back" 
            size={24} 
            color="#111827" 
            onPress={() => navigation.goBack()} 
          />
          <Text style={styles.headerTitle}>New Group</Text>
        </View>
        {selectedUsers.length > 0 && (
          <TouchableOpacity
          onPress={() => navigation.navigate('GroupCreate', { 
          selectedUsers: selectedUsers.map(user => ({
            id: user.id,
            username: user.username,
            name: user.name,
            profile_picture: user.profile_picture
          }))
        })}

            
          >
            <Text style={styles.nextButton}>Next</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar ======================*/}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

    
      {selectedUsers.length > 0 && (
        <View style={styles.selectedUsersContainer}>
          <Text style={styles.selectedUsersTitle}>Selected: {selectedUsers.length}</Text>
          <FlatList
            horizontal
            data={selectedUsers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.selectedUser}>
                {item.profile_picture ? (
                  <Image 
                    source={{ uri: item.profile_picture }} 
                    style={styles.selectedUserAvatar}
                  />
                ) : (
                  <View style={[styles.selectedUserAvatar, styles.avatarPlaceholder]}>
                    <Icon name="person" size={16} color="#fff" />
                  </View>
                )}
                <Text style={styles.selectedUserName} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.selectedUsersList}
          />
        </View>
      )}

     
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || item.phone_number}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>No contacts available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  nextButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  selectedUsersContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  selectedUsersTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  selectedUsersList: {
    paddingBottom: 12,
  },
  selectedUser: {
    alignItems: 'center',
    marginRight: 12,
    width: 60,
  },
  selectedUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
  },
  selectedUserName: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  selectedContactItem: {
    backgroundColor: '#F3F4F6',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
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
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
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
//   TextInput
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ROUTE } from '../api_routing/api';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import colors from '../theme/colors';

// const ContactsScreen = ({ navigation, route }) => {
//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
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
//       console.log('API response:', response.data);

//       // Process the response data
//       const processedContacts = processContactData(response.data);
//       setContacts(processedContacts);
//     } catch (error) {
//       console.error('Error fetching contacts:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const processContactData = (data) => {
//     // Combine and normalize all contact types
//     const allContacts = [
//       ...(data.synced_contacts || []).map(contact => ({
//         ...contact,
//         id: contact.phone_number, // Use phone number as ID for non-app users
//         is_app_user: contact.is_app_user || false,
//         user_details: contact.user_details || null,
//       })),
//       ...(data.all_users || []).map(user => ({
//         id: user.id,
//         name: user.name,
//         phone_number: user.phone_number,
//         is_app_user: true,
//         is_in_contacts: user.is_in_contacts,
//         user_details: {
//           id: user.id,
//           name: user.name,
//           phone_number: user.phone_number,
//           profile_picture: user.profile_picture,
//           is_friend: user.friendship_status === 'friends'
//         }
//       }))
//     ];

//     // Remove duplicates - prioritize app users over synced contacts
//     const uniqueContacts = [];
//     const seen = new Set();

//     allContacts.forEach(contact => {
//       const key = contact.phone_number || contact.id;
//       if (!seen.has(key)) {
//         seen.add(key);
//         uniqueContacts.push(contact);
//       }
//     });

//     return uniqueContacts;
//   };

//   const toggleUserSelection = (user) => {
//     // Only allow selection of app users
//     if (!user.is_app_user) return;

//     setSelectedUsers(prev => {
//       const isSelected = prev.some(u => u.id === user.user_details?.id);
//       if (isSelected) {
//         return prev.filter(u => u.id !== user.user_details?.id);
//       } else {
//         return [...prev, user.user_details];
//       }
//     });
//   };

//   const renderContactAvatar = (item) => {
//     if (item.is_app_user && item.user_details?.profile_picture) {
//       return (
//         <Image 
//           source={{ uri: item.user_details.profile_picture }} 
//           style={styles.avatar}
//         />
//       );
//     }
//     return (
//       <View style={[styles.avatar, styles.avatarPlaceholder]}>
//         <Icon name="person" size={20} color="#fff" />
//       </View>
//     );
//   };

//   const filteredContacts = contacts.filter(contact => 
//     contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     contact.phone_number.includes(searchQuery)
//   );

//   const renderItem = ({ item }) => {
//     const isAppUser = item.is_app_user;
//     const isSelected = isAppUser && selectedUsers.some(u => u.id === item.user_details?.id);
//     const isSelectable = isAppUser && !item.user_details?.is_friend;
    
//     return (
//       <TouchableOpacity 
//         style={[
//           styles.contactItem,
//           isSelected && styles.selectedContactItem,
//           !isSelectable && styles.disabledContactItem
//         ]}
//         onPress={() => isSelectable && toggleUserSelection(item)}
//         disabled={!isSelectable}
//       >
//         <View style={styles.contactInfo}>
//           {renderContactAvatar(item)}
//           <View style={styles.contactTextContainer}>
//             <Text style={styles.contactName}>{item.name}</Text>
//             <Text style={styles.contactPhone}>{item.phone_number}</Text>
//             {!isAppUser && (
//               <Text style={styles.notAppUserText}>Not on ShowA</Text>
//             )}
//             {item.user_details?.is_friend && (
//               <Text style={styles.friendText}>Already a friend</Text>
//             )}
//           </View>
//         </View>
//         {isSelectable ? (
//           isSelected ? (
//             <Icon name="check-circle" size={24} color={colors.primary} />
//           ) : (
//             <View style={styles.circle} />
//           )
//         ) : null}
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Icon name="arrow-back" size={24} color="#111827" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>New Group</Text>
//         </View>
//         {selectedUsers.length > 0 && (
//           <TouchableOpacity
//             onPress={() => navigation.navigate('GroupCreate', { 
//               selectedUsers: selectedUsers.map(user => ({
//                 id: user.id,
//                 username: user.username,
//                 name: user.name,
//                 profile_picture: user.profile_picture
//               }))
//             })}
//           >
//             <Text style={styles.nextButton}>Next</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search contacts"
//           placeholderTextColor="#9CA3AF"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       {/* Selected Users Preview */}
//       {selectedUsers.length > 0 && (
//         <View style={styles.selectedUsersContainer}>
//           <Text style={styles.selectedUsersTitle}>Selected: {selectedUsers.length}</Text>
//           <FlatList
//             horizontal
//             data={selectedUsers}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={({ item }) => (
//               <View style={styles.selectedUser}>
//                 {item.profile_picture ? (
//                   <Image 
//                     source={{ uri: item.profile_picture }} 
//                     style={styles.selectedUserAvatar}
//                   />
//                 ) : (
//                   <View style={[styles.selectedUserAvatar, styles.avatarPlaceholder]}>
//                     <Icon name="person" size={16} color="#fff" />
//                   </View>
//                 )}
//                 <Text style={styles.selectedUserName} numberOfLines={1}>
//                   {item.name}
//                 </Text>
//               </View>
//             )}
//             contentContainerStyle={styles.selectedUsersList}
//           />
//         </View>
//       )}

//       {/* Contact List */}
//       <FlatList
//         data={filteredContacts}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id?.toString() || item.phone_number}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Icon name="people-outline" size={60} color="#D1D5DB" />
//             <Text style={styles.emptyText}>No contacts available</Text>
//           </View>
//         }
//         refreshing={refreshing}
//         onRefresh={fetchContacts}
//       />
//     </View>
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
//     padding: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   nextButton: {
//     color: colors.primary,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     margin: 16,
//     paddingHorizontal: 12,
//     height: 40,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#111827',
//   },
//   selectedUsersContainer: {
//     paddingHorizontal: 16,
//     paddingTop: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     backgroundColor: '#fff',
//   },
//   selectedUsersTitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 8,
//   },
//   selectedUsersList: {
//     paddingBottom: 12,
//   },
//   selectedUser: {
//     alignItems: 'center',
//     marginRight: 12,
//     width: 60,
//   },
//   selectedUserAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginBottom: 4,
//   },
//   selectedUserName: {
//     fontSize: 12,
//     color: '#4B5563',
//     textAlign: 'center',
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
//     marginTop: 8,
//     borderRadius: 8,
//   },
//   selectedContactItem: {
//     backgroundColor: '#F3F4F6',
//   },
//   disabledContactItem: {
//     opacity: 0.6,
//   },
//   contactInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   avatarPlaceholder: {
//     backgroundColor: '#9CA3AF',
//     justifyContent: 'center',
//     alignItems: 'center',
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
//   notAppUserText: {
//     fontSize: 12,
//     color: '#EF4444',
//     marginTop: 2,
//   },
//   friendText: {
//     fontSize: 12,
//     color: '#10B981',
//     marginTop: 2,
//   },
//   circle: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#D1D5DB',
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