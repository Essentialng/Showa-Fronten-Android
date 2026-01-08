import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTE } from '../api_routing/api';

export default function GreetingMessageScreen({ navigation }) {
 

  const [showExample, setShowExample] = useState(false);

  const [text, setText] = useState({
    greeting_text: '',
    away_text: '',
    is_away_enabled: false,
    auto_greeting_enabled: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {

      try {
        const res = await axios.get(`${API_ROUTE}/messaging-settings/`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data) {
          setText(res.data);
          //console.log('Fetched settings:', res.data);
        }else{
          setText({
            greeting_text: '',
            away_text: '',
            is_away_enabled: false,
            auto_greeting_enabled: true,
          });
        }
        
      } catch (error) {
        //console.error('Error fetching settings:', error);
        setText({
          greeting_text: '',
          away_text: '',
          is_away_enabled: false,
          auto_greeting_enabled: true,
        });
        
      }

    }
   
  };

  const saveSettings = async () => {

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return Alert.alert('You must be logged in to save settings.');
      }
      const res = await axios.post(`${API_ROUTE}/messaging-settings/`, text, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        Alert.alert('Greeting Message saved successfully!');
      } 
    } catch (error) {
      console.error('Error saving settings:', error);
      
    }
    
    
  };


  return (
    <View style={styles.container}>
      {/* <StatusBar backgroundColor="#0d64dd" barStyle="light-content" /> */}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Greeting Message</Text>
        <TouchableOpacity onPress={saveSettings}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Message</Text>

        <TextInput
          multiline
          value={text.greeting_text}
          placeholderTextColor='#555'
          onChangeText={text => setText({ ...text, greeting_text: text })}
          placeholder="Enter your message..."
          style={styles.textArea}
        />
        <View style={styles.row}>
          <TouchableOpacity>
            <Icon name="emoji-emotions" size={24} color="#777" />
          </TouchableOpacity>
          <Text style={styles.charCount}>{text.greeting_text.length}/200</Text>
        </View>

        <View style={styles.toggleRow}>
          <Text>Enable Greeting</Text>
          <Switch
            value={text.auto_greeting_enabled}
            onValueChange={val => setText({ ...text, auto_greeting_enabled: val })}
          />
        </View>

        <TouchableOpacity style={styles.exampleButton} onPress={() => setShowExample(true)}>
          <Text style={styles.exampleText}>See example</Text>
        </TouchableOpacity>
        {showExample && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Greeting Message Example</Text>
              <View style={styles.chatBubble}>
                <Text style={styles.chatText}>{text.greeting_text}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowExample(false)} style={styles.closeModalBtn}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}


      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0d64dd',
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textArea: {
    height: 120,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color:'#555',
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
  },
  exampleButton: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  exampleText: {
    fontSize: 14,
    color: '#0d64dd',
    fontWeight: '500',
  },
  modalOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
  zIndex: 10,
},
modalContent: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 10,
  width: '100%',
  maxWidth: 320,
  alignItems: 'center',
  elevation: 10,
},
modalTitle: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 10,
  color: '#333',
},
chatBubble: {
  backgroundColor: '#dcf8c6',
  padding: 12,
  borderRadius: 10,
  alignSelf: 'stretch',
  marginBottom: 20,
},
chatText: {
  fontSize: 14,
  color: '#222',
  lineHeight: 20,
},
closeModalBtn: {
  backgroundColor: '#0d64dd',
  paddingHorizontal: 20,
  paddingVertical: 8,
  borderRadius: 6,
},
closeModalText: {
  color: '#fff',
  fontWeight: '500',
  fontSize: 14,
},
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

});
