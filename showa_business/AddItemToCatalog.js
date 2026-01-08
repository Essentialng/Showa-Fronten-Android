import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api'; 

export default function AddItemScreen({navigation}) {
  const [hideItem, setHideItem] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    sale_price: '',
    description: '',
    images: [],
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };


  const handleImageUpload = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.5 },
      (response) => {
        if (response.assets) {
          const images = response.assets.map((asset) => ({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
          }));
          setForm({ ...form, images });
          setImages(images);
        }
      }
    );
  };

const handleCreateCatalog = async () => {
  if (!form.name || !form.price) {
    Alert.alert('Missing Fields', 'Please provide both name and price.');
    return;
  }

  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('price', form.price);
  formData.append('sale_price', form.sale_price || '');
  formData.append('description', form.description || '');

  if (form.images.length > 0) {
    const image = form.images[0];
    formData.append('image', {
      uri: image.uri,
      name: image.name,
      type: image.type,
    });
  }

  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(`${API_ROUTE}/catalog/create/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data', 
       
      },
    });

    if (response.status === 201) {
      Alert.alert('Success', 'Catalog created!');
      navigation.navigate('CreateCatalog');
    }
  } catch (error) {
    //console.error('Catalog creation failed:', error?.message);
    if (error.response) {
      //console.error('Response error:', error.response.data);
    } else if (error.request) {
      //console.error('No response received:', error.request);
    }
    Alert.alert('Error', 'Failed to create catalog. Please try again.');
  }
};



  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add item</Text>
        <TouchableOpacity>
          <Text style={styles.saveText}></Text>
        </TouchableOpacity>
      </View>

      {/* =============  Photo Upload ============================*/}
      <TouchableOpacity style={styles.photoBox} onPress={handleImageUpload}>
        {images.length > 0 ? (
          images.map((image, index) => (
            <Image key={index} source={{ uri: image.uri }} style={styles.imageThumbnail} />
          ))
        ) : (
          <>
            <Icon name="add-a-photo" size={32} color="#888" />
            <Text style={styles.photoText}>Add photos and videos</Text>
          </>
        )}
      </TouchableOpacity>

      {/*========================  Form Fields ========================*/}
      <TextInput
        style={styles.input}
        placeholder="Enter name (required)"
        value={form.name}
        placeholderTextColor='#777'
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Price NGN"
        keyboardType="numeric"
        placeholderTextColor='#777'
        value={form.price}
        onChangeText={(text) => handleChange('price', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Sale price NGN (optional)"
        keyboardType="numeric"
        value={form.sale_price}
        placeholderTextColor='#777'
        onChangeText={(text) => handleChange('sale_price', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        value={form.description}
        placeholderTextColor='#777'
        onChangeText={(text) => handleChange('description', text)}
      />
      <View style={styles.switchContainer}>
        <View>
          <Text style={styles.switchLabel}>Hide this item</Text>
          <Text style={styles.switchSubtext}>When you hide an item, customers won't see it in your catalog.</Text>
        </View>
        <Switch value={hideItem} onValueChange={setHideItem} />
      </View>
       <TouchableOpacity onPress={handleCreateCatalog} style={styles.savebutton}>
        <Text style={styles.savebuttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  savebutton:{
    backgroundColor: '#367BF5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,

  },
  savebuttonText:{
    fontSize: 16,
    color: '#fff',
  },
  saveText: {
    fontSize: 16,
    color: '#367BF5',
  },
  photoBox: {
    height: 160,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoText: {
    marginTop: 8,
    color: '#555',
    fontSize: 14,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingVertical: 8,
    fontSize: 16,
    color:'#555'
  },
  moreFields: {
    color: '#367BF5',
    fontSize: 14,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 16,
    marginTop: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  switchSubtext: {
    fontSize: 12,
    color: '#666',
    maxWidth: 240,
  },
  imageThumbnail:{
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginRight: 10,
    borderRadius: 8,
  }
});
