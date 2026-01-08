import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ContactProfile = ({ navigation }) => {
  const [settings, setSettings] = useState({
    pinSecurity: true,
    faceRecognition: false,
  });

  const toggleSwitch = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    {
      key: 'pinSecurity',
      label: 'Pin Security',
      icon: 'lock-closed-outline',
    },
    {
      key: 'faceRecognition',
      label: 'Face Recognition',
      icon: 'happy-outline',
    },
  ];

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
            <Text style={styles.headerTitle}>Settings</Text>
          </TouchableOpacity>
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
              <Switch
                value={settings[key]}
                onValueChange={() => toggleSwitch(key)}
                thumbColor={settings[key] ? '#0d64dd' : '#ccc'}
                trackColor={{ true: '#b3d4fc', false: '#e6e6e6' }}
                style={styles.switch}
              />
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
    backgroundColor: '#0d64dd',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 10,
    fontWeight: '600',
  },
  menu: {
    marginTop: 10,
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
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});

export default ContactProfile;
