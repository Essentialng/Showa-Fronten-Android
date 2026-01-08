import {React, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';

const ContactProfile = ({ navigation }) => {
  
  const [userData, setUserData] = useState([]);
  const [userProfileImage, setUserProfileImage] = useState('');

 const [profileData, setProfileData] = useState({});
 const [logo, setLogo] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_ROUTE}/profiles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        const profile = Array.isArray(response.data) ? response.data[0] : response.data;
        setProfileData(profile);
        console.log('user business data', response.data);
        if (profile.logo) {
          setLogo({ uri: `${API_ROUTE_IMAGE}${profile.logo}` });
        }
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  };

   useEffect(()=>{
    fetchProfile();

  },[])

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            
            navigation.navigate('Signin_two'); 
          },
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    { label: 'Account', icon: 'person-outline' },
    { label: 'Chats', icon: 'chatbox-ellipses-outline' },
    { label: 'Notifications', icon: 'notifications-outline' },
    { label: 'Security / Privacy', icon: 'shield-checkmark-outline' },
    { label: 'Wallpaper', icon: 'images-outline' },
    { label: 'Delete account', icon: 'log-out-outline', isLogout: true },
  ];

  

  const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const json = await AsyncStorage.getItem('userData');
        const parsed = json ? JSON.parse(json) : null;
  
        if (!token || !parsed?.id) {
          console.error('Missing token or userID');
          //alert('Please log in again.');
          //navigation.navigate('Login');
          return null;
        }
  
//setUserId(parsed.id);
        const response = await axios.get(`${API_ROUTE}/user/${parsed.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          setUserData(response.data);
          const baseURL = `${API_ROUTE_IMAGE}`;
          const profilePicture = response.data.profile_picture
            ? `${baseURL}${response.data.profile_picture}`
            : null;
          setUserProfileImage(profilePicture);
          console.log('user_profile_image', profilePicture);
          console.log('res', response.data);
          return parsed.id;
          
        }
      } catch (error) {
        console.error('Error fetching user:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          navigation.navigate('Login');
        }
        setUserProfileImage(null);
        return null;
      }
    };

  useEffect(()=>{
    fetchUserData();
  },[])

  

  return (
    <ScrollView style={{backgroundColor:'#fff'}}>
      <View style={styles.container}>
       
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={()=>navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
            <Text style={styles.headerTitle}>Settings</Text>
          </TouchableOpacity>
        </View>


      {profileData && profileData.id && (
        <View style={styles.profileContainer}>
          <Image
            source={`${API_ROUTE_IMAGE}${profileData.Image}` ? { uri: `${API_ROUTE_IMAGE}${profileData.Image}`  } : require('../assets/images/dad.jpg')}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.contactName}>{profileData.name}</Text>
            <Text style={styles.contactPhone}>{profileData.phone}</Text>
          </View>
        </View>
      )}


        {/* Divider */}
        <View style={styles.actions}>
          <Divider />
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {menuItems.map(({ label, icon, isLogout }) => (
            <TouchableOpacity
              key={label}
              style={styles.menuItem}
              onPress={isLogout ? handleLogout : () => {

                if (label === 'Notifications') {
                    navigation.navigate('NotificationSetting');
                    
                } else if (label === 'Wallpaper'){
                      navigation.navigate('BWallpaperSetting');
                }else if (label === 'Account'){
                      navigation.navigate('ManageProfile');
                
                }else if (label === 'Chats'){
                      navigation.navigate('BusinessHome');
                
                }else if (label === 'Security / Privacy'){
                      navigation.navigate('BFaceSecuritySetting');
                }

              }}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconWrapper, isLogout && styles.logoutIconBackground]}>
                  <Icon
                    name={icon}
                    size={20}
                    color={isLogout ? '#fff' : '#0d64dd'}
                  />
                </View>
                <Text style={[styles.menuText, isLogout && styles.logoutText]}>
                  {label}
                </Text>
              </View>
              <Icon name="chevron-forward-outline" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 150,
    paddingHorizontal: 15,
    backgroundColor: '#0d64dd',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -20,
  },
  headerTitle: {
    fontSize: 25,
    color: '#fff',
    marginLeft: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -40,
    zIndex: 10,
    marginLeft: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  contactName: {
    marginTop: 50,
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginLeft: 20,
  },
  contactPhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    marginLeft: 20,
  },
  actions: {
    paddingVertical: 10,
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: '#e0f0ff',
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },
  logoutIconBackground: {
    backgroundColor: '#ff5c5c',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  logoutText: {
    color: '#ff5c5c',
    fontWeight: '600',
  },
});

export default ContactProfile;
