import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import Colors from '../theme/colors';
import { API_ROUTE } from '../api_routing/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateListingScreen() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImages = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 }, (response) => {
      if (!response.didCancel && response.assets) {
        setImages(response.assets);
      }
    });
  };

  const uploadListing = async () => {
    if (!title || !price || !description || images.length === 0) {
      Alert.alert('All fields are required.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);

    images.forEach((img, index) => {
      formData.append('images', {
        uri: img.uri,
        type: img.type,
        name: img.fileName || `image_${index}.jpg`,
      });
    });

    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(`${API_ROUTE}/listings/create/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Listing uploaded successfully!');
      setTitle('');
      setPrice('');
      setDescription('');
      setImages([]);
    } catch (err) {
      //console.log(err);
      Alert.alert('Failed to upload. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: Colors.primary }}>
        Create New Listing
      </Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Title"
        value={title}
        placeholderTextColor='#555'
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
         placeholderTextColor='#555'
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]} 
        placeholder="Product Description"
         placeholderTextColor='#555'
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Product Images</Text>
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImages}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Select Images</Text>
      </TouchableOpacity>

      <ScrollView horizontal style={{ marginVertical: 10 }}>
        {images.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img.uri }}
            style={{ width: 100, height: 100, marginRight: 8, borderRadius: 8 }}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={uploadListing}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadText}>Upload Listing</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color:'#555',
    backgroundColor: '#fff',
  },
  imagePickerButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
};
