
import React, {useState, useEffect} from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator,
  Linking
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from 'react-native-vector-icons/Ionicons';
import { API_ROUTE, API_ROUTE_IMAGE } from "../api_routing/api";
import colors from "../theme/colors";

const { width } = Dimensions.get('window');

export default function ListingDetails({navigation, route}) {
    const {item} = route.params;
    const [listData, setListing] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const [userProfileImage, setUserProfileImage] = useState('');
    

    const fetchUserData = async (sellerid) => {
    
        const userID = sellerid;
        console.log('user id', userID)
        try {
          const token = await AsyncStorage.getItem('userToken');
    
          const response = await axios.get(`${API_ROUTE}/user/${sellerid}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
    
          if (response.status === 200 || response.status === 201) {
            setUserData(response.data);
            const baseURL = `${API_ROUTE_IMAGE}`;
            const profilePicture = response.data.profile_picture
              ? `${baseURL}${response.data.profile_picture}`
              : null;
            setUserProfileImage(profilePicture);
          }
        } catch (error) {
          //console.error('Error fetching usersss:', error.response?.data || error.message);
          if (error.response?.status === 401) {
            navigation.navigate('LoginScreen');
          }
          setUserProfileImage(null);
        }
      };
    // const fetchUserBusinessProfileData = async (sellerid) => {
    
    //     const userID = sellerid;
    //     console.log('user id', userID)
    //     try {
    //       const token = await AsyncStorage.getItem('userToken');
    
    //       const response = await axios.get(`${API_ROUTE}/business-user-profile/${sellerid}/`, {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //           'Content-Type': 'application/json',
    //         },
    //       });
    
    //       if (response.status === 200 || response.status === 201) {
    //         setUserData(response.data);
    //         const baseURL = `${API_ROUTE_IMAGE}`;
    //         const profilePicture = response.data.profile_picture
    //           ? `${baseURL}${response.data.profile_picture}`
    //           : null;
    //         setUserProfileImage(profilePicture);
    //         console.log('business profile fectch', response.data)
    //       }
    //     } catch (error) {
    //       console.error('Error fetching business profile:', error.response?.data || error.message);
    //       if (error.response?.status === 401) {
    //         navigation.navigate('LoginScreen');
    //       }
    //       setUserProfileImage(null);
    //     }
    //   };

    useEffect(() => {
      const fetchListing = async() => {
        if (!item) {
           Alert.alert('Error', 'No item found');
           return;
        }
        try {
          const token = await AsyncStorage.getItem('userToken');
          const res = await axios.get(`${API_ROUTE}/listing/${item}/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
          });
          if (res.status === 200 || res.status === 201) {
            setListing(res.data);
            console.log('dataaaa',res.data.seller)
            // setSellerId(res.data.seller)
            fetchUserData(res.data.seller);
            // fetchUserBusinessProfileData(res.data.seller);
          }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch listing details');
            console.error('Error fetching listing:', error.message);
        } finally {
          setLoading(false);
        }
      };
       fetchListing();
    }, [item]);

    useEffect(()=>{
        fetchUserData();
       
    },[])

    const handleChatWithSeller = () => {

                   navigation.navigate('BPrivateChat', {
                        receiverId: userData.id,
                        name: userData.name,
                        profile_image: userData.profile_picture,
                        chatType: 'single',
                    });


       // navigation.navigate('Chat', { sellerId: listData?.seller });
    };

    const openMaps = () => {
      if (!listData?.location) {
        Alert.alert('Location not available', 'Seller has not provided location details');
        return;
      }
      
      const locationQuery = encodeURIComponent(listData.location);
      const url = `https://www.google.com/maps/search/?api=1&query=${locationQuery}`;
      
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open maps app');
        }
      }).catch(err => {
        console.error('Error opening maps:', err);
      });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0d64dd" />
            </View>
        );
    }

    if (!listData) {
        return (
            <View style={styles.errorContainer}>
                <Icon name="warning-outline" size={50} color="#FF6B6B" />
                <Text style={styles.errorText}>Failed to load listing details</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Details</Text>
                <View style={{width: 24}} />
            </View>

            <ScrollView style={styles.scrollContainer}>
                {/* Main Image */}
                <View style={styles.mainImageContainer}>
                    <Image 
                        source={{ uri: API_ROUTE_IMAGE + listData.images[activeImageIndex].image }}
                        style={styles.mainImage}
                        resizeMode="contain"
                    />
                </View>
                
                {/* Thumbnails */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.imageThumbnailContainer}
                >
                    {listData.images.map((img, index) => (
                        <TouchableOpacity 
                            key={img.id} 
                            onPress={() => setActiveImageIndex(index)}
                            style={[
                                styles.thumbnail,
                                index === activeImageIndex && styles.activeThumbnail
                            ]}
                        >
                            <Image 
                                source={{ uri: API_ROUTE_IMAGE + img.image }}
                                style={styles.thumbnailImage}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Product Info */}
                <View style={styles.contentContainer}>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>₦{parseFloat(listData.price).toLocaleString()}</Text>
                        <TouchableOpacity style={styles.favoriteButton}>
                            <Icon name="heart-outline" size={24} color="#FF6B6B" />
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.title}>{listData.title}</Text>
                    
                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <Icon name="time-outline" size={16} color="#666" />
                            <Text style={styles.metaText}>Posted {new Date(listData.created).toLocaleDateString()}</Text>
                        </View>
                        {listData.location && (
                            <View style={styles.metaItem}>
                                <Icon name="location-outline" size={16} color="#666" />
                                <Text style={styles.metaText}>{listData.location}</Text>
                            </View>
                        )}
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{listData.description}</Text>
                    
                    <View style={styles.divider} />
                    
                    <Text style={styles.sectionTitle}>Features</Text>
                    {listData.description.split('\n').filter(f => f.trim()).map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <Icon name="checkmark" size={16} color="#4CAF50" />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                    
                    {listData.location && (
    <>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Seller Information</Text>
        
        <View style={styles.sellerContainer}>
            <View style={styles.sellerProfile}>
                <Image
                    source={
                        userProfileImage 
                            ? { uri: userProfileImage }
                            : require('../assets/images/avatar/blank-profile-picture-973460_1280.png')
                    }
                    style={styles.profileImage}
                />
                <View style={styles.sellerInfo}>
                    <Text style={styles.sellerName}>{userData.name || 'Seller'}</Text>
                    <View style={styles.verificationBadge}>
                        <Icon 
                            name={userData.is_verified ? "checkmark-circle" : "close-circle"} 
                            size={16} 
                            color={userData.is_verified ? "#4CAF50" : "#F44336"} 
                        />
                        <View>
                             <Text style={styles.verificationText}>
                            {userData.is_verified ? 'Verified Seller' : 'Not Verified'}
                        </Text>
                        <Text style={styles.verificationText2}>
                        Excellent in delivery
                        </Text>
                        </View>
                       
                    </View>
                </View>
            </View>

            

            <View style={styles.sellerContact}>
                <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => Linking.openURL(`tel:${userData.phone}`)}
                >
                    <Icon name="call-outline" size={18} color="#fff" />
                    <Text style={styles.contactButtonText}>Call</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.contactButton, styles.messageButton]}
                    onPress={handleChatWithSeller}
                >
                    <Icon name="chatbubble-ellipses-outline" size={18} color="#fff" />
                    <Text style={styles.contactButtonText}>Message</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.sellerLocation}>
            <Icon name="location-outline" size={20} color="#FF6B6B" style={styles.locationIcon} />
            <Text style={styles.locationText}>{listData.location}</Text>
            <TouchableOpacity 
                style={styles.mapButton}
                onPress={openMaps}
            >
                <Text style={styles.mapButtonText}>View on Map</Text>
                <Icon name="map-outline" size={16} color="#FF6B6B" />
            </TouchableOpacity>
        </View>
        <Image source={require('../assets/images/nigeria-political-map.png')} style={styles.image}
                    resizeMode="contain" />
    </>
)}
                </View>
            </ScrollView>

            <View style={styles.actionBar}>
                <TouchableOpacity 
                    style={styles.chatButton}
                    onPress={handleChatWithSeller}
                >
                    <Icon name="chatbubble-ellipses" size={20} color="white" />
                    <Text style={styles.chatButtonText}>I am interested</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  sellerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
},
sellerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
},
profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#eee',
},
sellerInfo: {
    marginLeft: 16,
    flex: 1,
},
sellerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
},
verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
},
verificationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
},
verificationText2: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
},
sellerContact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
},
contactButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
},
messageButton: {
    backgroundColor: '#4CAF50',
},
contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
},
sellerLocation: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
},
locationIcon: {
    marginRight: 8,
},
locationText: {
    flex: 1,
    fontSize: 15,
    color: '#555',
},
mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
},
mapButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
},
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#333',
        marginVertical: 20,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    backButton: {
        padding: 8,
    },
    scrollContainer: {
        flex: 1,
    },
    mainImageContainer: {
        height: width * 0.7,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    imageThumbnailContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    activeThumbnail: {
        borderColor: colors.primary,
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        borderRadius: 6,
    },
    contentContainer: {
        padding: 16,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    favoriteButton: {
        padding: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    metaContainer: {
        marginBottom: 20,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
      profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
    metaText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
        marginBottom: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    featureText: {
        fontSize: 15,
        lineHeight: 20,
        color: '#555',
        marginLeft: 10,
        flex: 1,
    },
    locationCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    locationText: {
        fontSize: 15,
        color: '#555',
        marginLeft: 10,
        flex: 1,
    },
    viewOnMapButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewOnMapButtonText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
    },
    actionBar: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    chatButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
});