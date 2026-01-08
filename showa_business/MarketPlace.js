// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
//   Animated,
//   Easing,
//   Modal,
//   StatusBar
// } from 'react-native';
// import axios from 'axios';
// import Colors from '../theme/colors';
// import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = (width - 36) / 2; // 36 = padding (16*2) + gap (4)

// const categories = [
//   { name: 'Gadgets', icon: 'mobile' },
//   { name: 'Fashion', icon: 'shopping-bag' },
//   { name: 'Electronics', icon: 'tv' },
//   { name: 'Vehicles', icon: 'car' },
//   { name: 'Home', icon: 'home' },
//   { name: 'More', icon: 'ellipsis-h' },
// ];



// const promoBanners = [
//   require('../assets/images/8555e2167169969.Y3JvcCwxMTAzLDg2MiwwLDM2OA.png'),
//   require('../assets/images/infinixhot605g2-1752219518.png'), 
//   // require('../assets/images/car-rental-automotive-instagram-facebook-story-template_84443-7423.png'), 
// ];

// export default function HomeScreen({ navigation }) {
//   const [listings, setListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
//   const fadeAnim = useState(new Animated.Value(1))[0];
//   const slideAnim = useState(new Animated.Value(0))[0];

//   useEffect(() => {
//     axios.get(`${API_ROUTE}/listings/`)
//       .then(res => setListings(res.data))
//       .catch(err => console.log(err))
//       .finally(() => setLoading(false));
    
//     // Set up banner rotation
//     const bannerInterval = setInterval(rotateBanner, 5000);
//     return () => clearInterval(bannerInterval);
//   }, []);

//   const rotateBanner = () => {
//     // Fade out animation
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 500,
//       easing: Easing.ease,
//       useNativeDriver: true,
//     }).start(() => {
//       // Slide animation
//       Animated.timing(slideAnim, {
//         toValue: -width,
//         duration: 0,
//         useNativeDriver: true,
//       }).start(() => {
//         setCurrentBannerIndex((prevIndex) => 
//           (prevIndex + 1) % promoBanners.length
//         );
//         slideAnim.setValue(width);
        
//         // Slide in new banner
//         Animated.timing(slideAnim, {
//           toValue: 0,
//           duration: 500,
//           easing: Easing.ease,
//           useNativeDriver: true,
//         }).start(() => {
//           // Fade in animation
//           Animated.timing(fadeAnim, {
//             toValue: 1,
//             duration: 500,
//             easing: Easing.ease,
//             useNativeDriver: true,
//           }).start();
//         });
//       });
//     });
//   };

//   const renderCard = ({ item }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => navigation.navigate('ListingDetails', { item:item.id })}
//     >
//       {item.images && item.images.length > 0 && (
//         <Image 
//           source={{ uri: `${API_ROUTE_IMAGE}${item.images[0].image}` }} 
//           style={styles.cardImage} 
//           resizeMode="cover"
//         />
//       )}
//       <View style={styles.cardContent}>
//         <Text style={styles.cardPrice}>₦{item.price.toLocaleString()}</Text>
//         <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
//         <View style={styles.locationContainer}>
//           <Icon name="location-on" size={14} color="#666" />
//           <Text style={styles.cardLocation}>{item.location || 'Lagos'}</Text>
//         </View>
//         <View style={styles.ratingContainer}>
//           <View style={styles.stars}>
//             {[1, 2, 3, 4, 5].map((i) => (
//               <Icon 
//                 key={i} 
//                 name={i <= (item.rating || 4) ? 'star' : 'star-border'} 
//                 size={14} 
//                 color="#FFD700" 
//               />
//             ))}
//           </View>
//           <Text style={styles.ratingText}>({item.reviews || Math.floor(Math.random() * 50) + 1})</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <ScrollView>
//         <View style={styles.container}>
     
//       <View style={styles.headerContainer}>
//         <Text style={styles.header}>Marketplace</Text>
//         <View style={styles.headerIcons}>
//           <TouchableOpacity style={styles.iconButton}>
//             <Icon name="search" size={24} color={Colors.primary} />
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={styles.iconButton}
//             onPress={() => navigation.navigate('CreateListing')}
//           >
//             <FontAwesome name="plus-square" size={24} color={Colors.primary} />
//           </TouchableOpacity>
//         </View>
//       </View>
      
//       {/* Categories horizontal scroll */}
//       <ScrollView 
//         horizontal 
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.categoriesContainer}
//       >
//         {categories.map((category, index) => (
//           <TouchableOpacity key={index} style={styles.categoryItem}>
//             <View style={styles.categoryIcon}>
//               <FontAwesome name={category.icon} size={20} color={Colors.primary} />
//             </View>
//             <Text style={[styles.categoryText, {marginBottom:0}]}>{category.name}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* Promo Banner with Animation */}
//       <View style={styles.promoBannerContainer}>
//         <Animated.View
//           style={[
//             styles.animatedBanner,
//             {
//               opacity: fadeAnim,
//               transform: [{ translateX: slideAnim }]
//             }
//           ]}
//         >
//           <Image 
//             source={promoBanners[currentBannerIndex]} 
//             style={styles.promoBanner}
//             resizeMode="cover"
//           />
//           <View style={styles.promoOverlay}>
//             <Text style={styles.promoText}>HOT DEALS</Text>
//             <Text style={styles.promoSubText}>Discover trending products</Text>
//           </View>
//         </Animated.View>
        
//         {/* Banner indicators */}
//         <View style={styles.bannerIndicators}>
//           {promoBanners.map((_, index) => (
//             <View 
//               key={index}
//               style={[
//                 styles.indicator,
//                 index === currentBannerIndex && styles.activeIndicator
//               ]}
//             />
//           ))}
//         </View>
//       </View>

//       {/* Products List */}
//       {loading ? (
//         <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 30 }} />
//       ) : (
//         <FlatList
//           data={listings}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderCard}
//           numColumns={2}
//           columnWrapperStyle={styles.row}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//           key="two-column-list"
//           ListHeaderComponent={
//             <Text style={styles.sectionTitle}>Recommended for you</Text>
//           }
//         />
//       )}
//     </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconButton: {
//     marginLeft: 15,
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: Colors.primary,
//   },
//   categoriesContainer: {
//     paddingBottom: 20,
//     marginTop: -20
//   },
//   categoryItem: {
//     alignItems: 'center',
//     marginRight: 20,
//     marginBottom: 60
//   },
//   categoryIcon: {
//     backgroundColor: '#f0f0f0',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   categoryText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#333',
//   },
//   promoBannerContainer: {
//     height: 120,
//     borderRadius: 10,
//     overflow: 'hidden',
//     marginBottom: 20,
//     position: 'relative',
//   },
//   animatedBanner: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//   },
//   promoBanner: {
//     width: '100%',
//     height: '100%',
//   },
//   promoOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: 15,
//   },
//   promoText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   promoSubText: {
//     color: '#fff',
//     fontSize: 14,
//   },
//   bannerIndicators: {
//     position: 'absolute',
//     bottom: 10,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   indicator: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: 'rgba(255,255,255,0.5)',
//     marginHorizontal: 4,
//   },
//   activeIndicator: {
//     backgroundColor: '#fff',
//     width: 12,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//     marginTop: 10,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   row: {
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     width: CARD_WIDTH,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     overflow: 'hidden',
//   },
//   cardImage: {
//     width: '100%',
//     height: CARD_WIDTH,
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   cardContent: {
//     padding: 12,
//   },
//   cardPrice: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   cardTitle: {
//     fontSize: 14,
//     color: '#444',
//     marginBottom: 6,
//     fontWeight: '500',
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   cardLocation: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 4,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   stars: {
//     flexDirection: 'row',
//     marginRight: 4,
//   },
//   ratingText: {
//     fontSize: 12,
//     color: '#888',
//   },
// });


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  Easing,
  StatusBar,
  SafeAreaView,
  TextInput,
  LayoutAnimation 
} from 'react-native';
import axios from 'axios';
import Colors from '../theme/colors';
import { API_ROUTE, API_ROUTE_IMAGE } from '../api_routing/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 48 = padding (16*3) + gap (8)

const categories = [
  { name: 'Gadgets', icon: 'mobile', color: '#4A90E2' },
  { name: 'Fashion', icon: 'shopping-bag', color: '#FF6B6B' },
  { name: 'Electronics', icon: 'tv', color: '#45B7D1' },
  { name: 'Vehicles', icon: 'car', color: '#FFA502' },
  { name: 'Home', icon: 'home', color: '#9C64A6' },
  { name: 'More', icon: 'ellipsis-h', color: '#7ED321' },
];

const promoBanners = [
  require('../assets/images/8555e2167169969.Y3JvcCwxMTAzLDg2MiwwLDM2OA.png'),
  require('../assets/images/infinixhot605g2-1752219518.png'), 
  // require('../assets/images/car-rental-automotive-instagram-facebook-story-template_84443-7423.png'), 
];

export default function HomeScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const [searchFocused, setSearchFocused] = useState(false);
  const searchAnim = useState(new Animated.Value(0))[0];
  const [searchContainerWidth, setSearchContainerWidth] = useState('85%');
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

  useEffect(() => {
    axios.get(`${API_ROUTE}/listings/`)
      .then(res => setListings(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
    
    const bannerInterval = setInterval(rotateBanner, 5000);
    return () => clearInterval(bannerInterval);
  }, []);

  const rotateBanner = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        delay: 100,
      })
    ]).start(() => {
      setCurrentBannerIndex((prevIndex) => 
        (prevIndex + 1) % promoBanners.length
      );
    });
  };

 const handleSearchFocus = () => {
  setSearchFocused(true);
  setSearchContainerWidth('100%');
};

const handleSearchBlur = () => {
  setSearchFocused(false);
  setSearchContainerWidth('85%');
};

  const searchWidth = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['85%', '100%']
  });

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ListingDetails', { item: item.id })}
    >
      <View style={styles.cardImageContainer}>
        {item.images && item.images.length > 0 && (
          <Image 
            source={{ uri: `${API_ROUTE_IMAGE}${item.images[0].image}` }} 
            style={styles.cardImage} 
            resizeMode="cover"
          />
        )}
        <View style={styles.favoriteButton}>
          <Icon name="favorite-border" size={20} color="#fff" />
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardPrice}>₦{item.price.toLocaleString()}</Text>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={14} color="#888" />
            <Text style={styles.cardLocation}>{item.location || 'Lagos'}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating || '4.5'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Animated.View style={[styles.searchContainer, { width: searchWidth }]}>
            <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              placeholder="Search products..."
              placeholderTextColor="#888"
              style={styles.searchInput}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {!searchFocused && (
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={() => navigation.navigate('CreateListing')}
              >
                <Icon name="photo-camera" size={20} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </Animated.View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('CreateListing')}
          >
            <Icon name="add" size={24} color={Colors.primary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <Text style={styles.sectionHeader}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.categoryItem}
              //onPress={() => navigation.navigate('Category', { category: category.name })}
            >
              <LinearGradient
                colors={[category.color, lightenColor(category.color, 20)]}
                style={styles.categoryIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome name={category.icon} size={20} color="#fff" />
              </LinearGradient>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Promo Banner */}
        <View style={styles.promoContainer}>
          <Animated.Image
            source={promoBanners[currentBannerIndex]} 
            style={[styles.promoBanner, { opacity: fadeAnim }]}
            resizeMode="cover"
          />
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Summer Sale</Text>
            <Text style={styles.promoSubtitle}>Up to 50% off</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerIndicators}>
            {promoBanners.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.indicator,
                  index === currentBannerIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllProducts')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loading} />
        ) : (
          <FlatList
            data={listings.slice(0, 6)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        )}

        {/* Daily Deals */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>Daily Deals</Text>
          <View style={styles.timerContainer}>
            <Icon name="access-time" size={16} color={Colors.primary} />
            <Text style={styles.timerText}>05:32:14</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {listings.slice(0, 4).map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.horizontalCard}
              onPress={() => navigation.navigate('ListingDetails', { item: item.id })}
            >
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-20%</Text>
              </View>
              <Image 
                source={{ uri: `${API_ROUTE_IMAGE}${item.images?.[0]?.image}` }} 
                style={styles.horizontalImage}
              />
              <View style={styles.horizontalContent}>
                <Text style={styles.horizontalPrice}>₦{(item.price * 0.8).toLocaleString()}</Text>
                <Text style={styles.originalPrice}>₦{item.price.toLocaleString()}</Text>
                <Text style={styles.horizontalTitle} numberOfLines={2}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to lighten colors
function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)}`;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 48,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  cameraButton: {
    padding: 8,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  promoContainer: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
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
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  promoSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  promoButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  bannerIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: CARD_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  cardImageContainer: {
    width: '100%',
    height: CARD_WIDTH,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 12,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLocation: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 2,
    fontWeight: '500',
  },
  loading: {
    marginVertical: 40,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  horizontalScroll: {
    marginHorizontal: -16,
    paddingLeft: 16,
  },
  horizontalCard: {
    width: width * 0.6,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  horizontalImage: {
    width: '100%',
    height: width * 0.5,
  },
  horizontalContent: {
    padding: 12,
  },
  horizontalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  originalPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  horizontalTitle: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
});