import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const topics = [
  { title: 'Account & Profile', key: 'account' },
  { title: 'Chats', key: 'chats' },
  { title: 'Notifications', key: 'notifications' },
  { title: 'Privacy & Security', key: 'privacy' },
  { title: 'Payments', key: 'payments' },
  { title: 'Backup & Restore', key: 'backup' },
  { title: 'Using Showa Web', key: 'web' },
];

export default function HelpCenterScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {topics.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.topicItem}
            onPress={() => navigation.navigate('HelpTopic', { topicKey: item.key, title: item.title })}
          >
            <Text style={styles.topicText}>{item.title}</Text>
            <Icon name="keyboard-arrow-right" size={22} color="#888" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: { paddingVertical: 10 },
  topicItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  topicText: { fontSize: 16, color: '#333' },
});
