import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { ColorPicker } from 'react-native-color-picker';

const ContactProfile = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response?.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  const handlePickColor = () => {
    setColorPickerVisible(true);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setColorPickerVisible(false);
  };

  const options = [
    {
      key: 'pickImage',
      label: 'Choose wallpaper from Gallery',
      icon: 'image-outline',
      onPress: handlePickImage,
    },
    {
      key: 'pickColor',
      label: 'Set color theme',
      icon: 'color-palette-outline',
      onPress: handlePickColor,
    },
  ];

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Icon name="arrow-back" size={24} color="#fff" />
            <Text style={styles.headerTitle}>Wallpaper</Text>
          </TouchableOpacity>
        </View>

        {/* Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chat Wallpaper Options</Text>
        </View>

        {/* Options */}
        <View style={styles.menu}>
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

        {/* Display Image */}
        {selectedImage && (
          <View style={styles.preview}>
            <Text style={styles.previewText}>Selected Wallpaper:</Text>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          </View>
        )}

        {/* Display Color */}
        <View style={styles.preview}>
          <Text style={styles.previewText}>Selected Color:</Text>
          <View style={[styles.colorBox, { backgroundColor: selectedColor }]} />
        </View>

        {/* Color Picker Modal */}
        <Modal visible={colorPickerVisible} animationType="slide">
          <View style={{ flex: 1, padding: 20 }}>
            <Text style={styles.colorTitle}>Pick a Color</Text>
            <ColorPicker
              onColorSelected={handleColorSelect}
              style={{ flex: 1 }}
            />
            <TouchableOpacity onPress={() => setColorPickerVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 15,
    backgroundColor: '#0d64dd',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
  },
  headerTitle: {
    fontSize: 22,
    color: '#fff',
    marginLeft: 10,
    fontWeight: '600',
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d64dd',
  },
  menu: {
    marginTop: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: '#e0f0ff',
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  preview: {
    padding: 20,
    alignItems: 'flex-start',
  },
  previewText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
    color: '#333',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  colorBox: {
    width: 100,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#0d64dd',
  },
  closeButton: {
    backgroundColor: '#0d64dd',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ContactProfile;
