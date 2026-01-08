import React, { useState,useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import { Share } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


export default function CatalogScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState([]);
  const [userProfileImage, setUserProfileImage] = useState('');
  const [catalogData, setCatalogData] = useState([]);

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
        //console.log('user business data', response.data);
        if (profile.logo) {
          setLogo({ uri: `${API_ROUTE_IMAGE}${profile.logo}` });
        }
      }
    } catch (err) {
      //console.error('Failed to load profile', err);
    }
  };


  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      fetchCatalogData();
    }, [])
  );

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this catalog by ${userData.name}: ${API_ROUTE}/catalog/`,
      });
      if (result.action === Share.sharedAction) {
        //console.log('Catalog shared successfully');
      }
    } catch (error) {
      //console.error('Error sharing catalog:', error);
    }
  };

  
    const fetchCatalogData = async () => {
   
      try {
        const token = await AsyncStorage.getItem('userToken');
    
        if (!token) {
          //console.log('No token found');
          return;
        }
        const response = await axios.get(`${API_ROUTE}/catalogs/my/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
        
          setCatalogData(response.data);
          
        }
      } catch (error) {
       // console.error('Error fetching catalog:', error);
      }
    };




 
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0750b5" barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient colors={['#0d64dd', '#0d64dd']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Catalog Manager</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Modal Menu */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalMenu}>
            {['Share',  'Catalog Settings'].map((item, i) => {
              if (item === 'Share') {
                return <Text key={i} style={styles.menuItem} onPress={handleShare}>Share</Text>;
              } else if (item === 'Catalog Settings') {
                return <Text key={i} style={styles.menuItem} onPress={() => navigation.navigate('AddItemToCatalog')}>Add New Item </Text>;
              } else if (item === 'Boost') {
                return <Text key={i} style={styles.menuItem} onPress={() => navigation.navigate('Boost')}>Boost</Text>;
              } else if (item === 'Collections') {
                return <Text key={i} style={styles.menuItem} onPress={() => navigation.navigate('Collections')}>Collections</Text>;
              }
              return null;
            })}
          </View>
        </Pressable>
      </Modal>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Top image & name */}
        {profileData && profileData.id && (
         
            <View style={styles.topImageContainer}>
              <Image
                          source={
                            profileData
                              ? { uri: `${API_ROUTE_IMAGE}${profileData.image}` }
                              : require('../assets/images/dad.jpg')
                          }
                          style={styles.bannerImage}
                        />

              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.nameOverlay} />
            
                <Text style={styles.fname}>
                  {profileData.name}
                </Text>
            
            </View>
          
     )}
        <Text style={styles.title}>Create a Catalog</Text>
        <Text style={styles.description}>
          Send products and services to your customers and save space on your phone.
        </Text>

        <Text style={styles.note}>
          By using this feature, you are using a Showa Product and agree that the
          <Text style={styles.link}> Showa Terms </Text>
          and
          <Text style={styles.link}> Essential Commerce Policies </Text>
          apply.
        </Text>

        {/* Add item */}
        <TouchableOpacity onPress={() => navigation.navigate('AddItemToCatalog')}>
      
          <View style={styles.addItemBox}>
            <Icon name="add" size={30} color="#999" />
            <Text style={styles.addItemText}>Add new item</Text>
          </View>
        </TouchableOpacity>

       
        {catalogData.length === 0 ? (
          <View style={styles.placeholderItem}>
            
          </View>
        ) : (
            catalogData.map((item, index) => (
              // <TouchableOpacity onPress={() => navigation.navigate('ProductDetails')} >
              <Pressable key={index} >
            <View style={styles.catalogCard}>
              <Image
                source={{ uri: `${API_ROUTE_IMAGE}${item.image}` }}
                style={styles.catalogImage}
              />
              <View style={styles.catalogInfo}>
                <Text style={styles.catalogName}>{item.name}</Text>
                {item.price > 0 && (
                   <Text style={styles.catalogDesc}>{item.description}</Text>
                  
                )}
                {item.description ? (
                  <Text style={styles.catalogPrice}>₦{parseFloat(item.price).toFixed(2)}</Text>
                 
                ) : null}
              </View>
            </View>
            </Pressable>
          ))

        )}
        
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: '#0d64dd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop:-10,
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalMenu: {
    backgroundColor: '#fff',
    marginTop: 80,
    marginRight: 10,
    borderRadius: 8,
    paddingVertical: 8,
    width: 180,
    elevation: 4,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    color: '#333',
  },

  content: {
    padding: 16,
  },
  topImageContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  bannerImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  nameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderRadius: 12,
  },
  fname: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#222',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 12,
  },
  note: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  link: {
    color: '#367BF5',
  },

  addItemBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: '80%',
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  addItemText: {
    marginTop: 6,
    fontSize: 16,
    color: '#777',
  },
  placeholderItem: {
    height: 60,
    width: '80%',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
    alignSelf: 'center',
  },
  catalogCard: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  backgroundColor: '#fff',
  borderRadius: 10,
  elevation: 1,
  marginBottom: 14,
  padding: 10,
  width: '100%',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
},

catalogImage: {
  width: 70,
  height: 70,
  borderRadius: 10,
  marginRight: 12,
  backgroundColor: '#ddd',
},

catalogInfo: {
  flex: 1,
},

catalogName: {
  fontSize: 16,
  fontWeight: '600',
  color: '#222',
},

catalogPrice: {
  fontSize: 14,
  color: '#0a8',
  marginVertical: 4,
},

catalogDesc: {
  fontSize: 13,
  color: '#666',
},

});
