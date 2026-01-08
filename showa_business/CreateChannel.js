import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTE } from '../api_routing/api';
import Snackbar from '../components/SnackBar';

const categories = ['Sports', 'Gaming', 'Education', 'Music', 'Technology'];

export default function CreateChannelScreen({ navigation }) {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleCreateChannel = async () => {
  if (!channelName) {
    showSnackbar('Please fill in all required fields.');
    return;
  }

  const formData = new FormData();
  formData.append('name', channelName);
  formData.append('description', description);
  formData.append('category', category);

  if (image) {
    const uri = image.startsWith('file://') ? image : `file://${image}`;
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('image', {
      uri,
      name: filename,
      type,
    });
  }

  try {
    const token = await AsyncStorage.getItem('userToken');
    const res = await axios.post(
      `${API_ROUTE}/channels/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (res.status === 201 || res.status === 200) {
      showSnackbar('Channel created successfully!');
      navigation.navigate('StatusBar');
      setChannelName('');
      setDescription('');
      setCategory('');
      setImage(null);
    } else {
      showSnackbar('Failed to create channel.');
    }
  } catch (error) {
    //console.log('Upload error', error?.response?.data || error?.message);
    showSnackbar('An error occurred.');
  }
};



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create a New Channel</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Icon name="image-outline" size={40} color="#ccc" />
              <Text style={{ color: '#aaa' }}>Pick an Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Channel Name *"
          value={channelName}
          placeholderTextColor='#777'
          onChangeText={setChannelName}
        />

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor='#777'
          multiline
        />

        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryItem,
                category === cat && styles.categorySelected,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat && { color: '#fff' },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCreateChannel}>
          <Text style={styles.buttonText}>Create Channel</Text>
        </TouchableOpacity>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'#333'
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    textAlign:'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    color:'#777',
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryItem: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  categorySelected: {
    backgroundColor: '#007bff',
  },
  categoryText: {
    color: '#007bff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
