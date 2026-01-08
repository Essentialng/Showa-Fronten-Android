import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const topicData = {
  account: `
**Account & Profile**
You can manage your account by changing your profile photo, name, and about section from Settings > Profile. You can also delete your account or change your phone number from Settings > Account.`,
  
  chats: `
**Chats**
You can send text, voice notes, images, videos, and files in chats. Long press a message to reply, delete, or forward. You can also pin chats and archive them for better organization.`,
  
  notifications: `
**Notifications**
Manage message, group, and call notifications from Settings > Notifications. Customize tones, vibration, popup notifications, and LED color (on supported devices).`,
  
  privacy: `
**Privacy & Security**
Control who sees your Last Seen, Profile Photo, About, and Status. Enable two-step verification for added security. End-to-end encryption is always on.`,
  
  payments: `
**Payments**
Send and receive money securely through WhatsApp if supported in your country. Go to Settings > Payments to link your bank account.`,
  
  backup: `
**Backup & Restore**
Enable chat backups in Settings > Chats > Chat Backup. You can back up to Google Drive or iCloud and restore them when reinstalling Showa.`,
  
  web: `
**Using Showa Web**
Open https://web.showa.com and scan the QR code from Showa > Menu > Linked Devices. Stay connected while your phone has internet access.`,
};

export default function HelpTopicScreen({ route, navigation }) {
  const { topicKey, title } = route.params;
  const content = topicData[topicKey];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.contentText}>{content.trim()}</Text>
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
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  content: { padding: 20 },
  contentText: { fontSize: 15, color: '#444', lineHeight: 22 },
});
