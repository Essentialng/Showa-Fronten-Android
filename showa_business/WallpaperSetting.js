import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const defaultWallpapers = [
  require('../assets/backroundsplash.png'),
  require('../assets/wallpaper/spring-5016266_1280.jpg'),
  require('../assets/wallpaper/8a91c94c-a725-41fc-b65a-69237c6b12f2.png'),
  require('../assets/wallpaper/whitebkpattern.jpg'),
  require('../assets/wallpaper/ggg.jpg'),
  require('../assets/wallpaper/3013e3495a1ce2ddc938f75fb3c50c86.jpg'),
  require('../assets/wallpaper/8379d5e75849275387025f8745f7701a.png'),
  require('../assets/wallpaper/76406.jpg'),
  require('../assets/wallpaper/b91dc2113881469c07ac99ad9a024a01.jpg'),
  require('../assets/wallpaper/fon-dlya-vatsap-3.jpg'),
  require('../assets/wallpaper/whatsapp_bg_chat_img.jpeg'),
 
];

const Wallpaper = ({ navigation }) => {
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePickImage = () => {
    launchImageLibrary({ 
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    }, (response) => {
      if (response?.assets && response.assets.length > 0) {
        const selected = response.assets[0].uri;
        setSelectedWallpaper(selected);
        AsyncStorage.setItem('chatBackground', JSON.stringify({ 
          type: 'image', 
          value: selected 
        })).then(() => {
          navigation.goBack(); 
        });
      }
    });
  };

  const handleSelectDefault = (wallpaper) => {
    const uri = Image.resolveAssetSource(wallpaper).uri;
    setSelectedWallpaper(uri);
    AsyncStorage.setItem('chatBackground', JSON.stringify({ 
      type: 'image', 
      value: uri 
    })).then(() => {
      navigation.goBack(); 
    });
  };

  const options = [
    {
      key: 'pickImage',
      label: 'Choose from Gallery',
      icon: 'image-outline',
      onPress: handlePickImage,
    },
  ];

  const renderWallpaperItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectDefault(item)}>
    <View style={styles.phoneFrame}>
      <Image 
        source={item} 
        style={styles.wallpaperPreview}
        resizeMode="cover"
      />
      <TouchableOpacity 
        style={styles.selectButton}
        
      >
        {selectedWallpaper === Image.resolveAssetSource(item).uri && (
          <Icon name="checkmark-circle" size={30} color="#0d64dd" />
        )}
      </TouchableOpacity>
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="#fff" />
          <Text style={styles.headerTitle}>Chat Wallpaper</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Gallery Option */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Wallpaper</Text>
          {options.map(({ key, label, icon, onPress }) => (
            <TouchableOpacity key={key} style={styles.menuItem} onPress={onPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconBox}>
                  <Icon name={icon} size={20} color="#0d64dd" />
                </View>
                <Text style={styles.menuText}>{label}</Text>
              </View>
              <Icon name="chevron-forward-outline" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Default Wallpapers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Wallpapers</Text>
          <FlatList
            data={defaultWallpapers}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderWallpaperItem}
            contentContainerStyle={styles.wallpaperList}
            scrollEnabled={false}
          />
        </View>

        {/* Preview Section */}
        {selectedWallpaper && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Selection</Text>
            <View style={[styles.phoneFrame, styles.previewFrame]}>
              <Image 
                source={{ uri: selectedWallpaper }} 
                style={styles.wallpaperPreview}
                resizeMode="cover"
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 15,
    backgroundColor: '#0d64dd',
    elevation: 3,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 15,
    fontWeight: '600',
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: '#e8f2ff',
    padding: 8,
    borderRadius: 8,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  wallpaperList: {
    paddingBottom: 20,
  },
  phoneFrame: {
    width: width / 2 - 40,
    height: (width / 2 - 20) * 1.8, // Phone aspect ratio
    margin: 10,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#f3f1f1ff',
    backgroundColor: '#5b5a5aff',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  wallpaperPreview: {
    width: '100%',
    height: '100%',
  },
  selectButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 5,
  },
  previewFrame: {
    alignSelf: 'center',
    width: width - 60,
    height: (width - 60) * 1.8,
    marginTop: 10,
  },
});

export default Wallpaper;