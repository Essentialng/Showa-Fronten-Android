import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import PushNotification from 'react-native-push-notification';

const ContactProfile = ({ navigation }) => {
  const redirectToHomeChat = () => {
    navigation.goBack();
  };

  const [notificationSettings, setNotificationSettings] = useState({
    showNotifications: true,
    doNotDisturb: false,
  });

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      if (settings) {
        setNotificationSettings(JSON.parse(settings));
      }
    } catch (error) {
      console.log('Error loading notification settings:', error);
    }
  };

  const saveNotificationSettings = async (settings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.log('Error saving notification settings:', error);
    }
  };

  const showTestNotification = () => {
    console.log('no noti for now');
    // PushNotification.localNotification({
    //   channelId: 'showa-chat',
    //   title: 'Notifications Enabled',
    //   message: 'You will now receive notifications for new messages',
    //   playSound: true,
    //   soundName: 'default',
    // });
  };

  const toggleSwitch = async (key) => {
    const newValue = !notificationSettings[key];
    const newSettings = {
      ...notificationSettings,
      [key]: newValue,
    };
    
    setNotificationSettings(newSettings);
    await saveNotificationSettings(newSettings);
    
    // Show test notification when enabling notifications
    if (key === 'showNotifications' && newValue) {
      setTimeout(() => {
        showTestNotification();
      }, 300);
    }
  };

  const menuItems = [
    {
      key: 'showNotifications',
      label: 'Show Notifications',
      icon: 'notifications-outline',
    },
    {
      key: 'doNotDisturb',
      label: 'Do Not Disturb',
      icon: 'moon-outline',
    },
  ];

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={redirectToHomeChat}>
            <Icon name="arrow-back" size={24} color="#fff" />
            <Text style={styles.headerTitle}>Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Message Notifications</Text>
        </View>

        {/* Settings List */}
        <View style={styles.menu}>
          {menuItems.map(({ key, label, icon }) => (
            <View key={key} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconWrapper}>
                  <Icon name={icon} size={20} color="#0d64dd" />
                </View>
                <Text style={styles.menuText}>{label}</Text>
              </View>
              <View style={styles.switchWrapper}>
                <Switch
                  value={notificationSettings[key]}
                  onValueChange={() => toggleSwitch(key)}
                  thumbColor={notificationSettings[key] ? '#0d64dd' : '#ccc'}
                  trackColor={{ true: '#b3d4fc', false: '#e6e6e6' }}
                  style={styles.switch}
                />
              </View>
            </View>
          ))}
        </View>

       
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
  iconButton: {
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
  sectionHeader: {
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
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  switchWrapper: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  testButton: {
    backgroundColor: '#0d64dd',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContactProfile;