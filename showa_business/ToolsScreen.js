import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const Metric = ({ icon, count, label }) => (
  <View style={styles.metricBox}>
    <View style={styles.metricIconContainer}>
      <Icon name={icon} size={20} color="#fff" />
    </View>
    <Text style={styles.metricCount}>{count}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const NavItem = ({ icon, label, subtitle, screen }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
      style={styles.option} 
      onPress={() => navigation.navigate(screen)}
      activeOpacity={0.7}
    >
      <View style={styles.optionIconContainer}>
        <Icon name={icon} size={20} color="#4a6cf7" />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionText}>{label}</Text>
        <Text style={styles.optionSub}>{subtitle}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#ccc" />
    </TouchableOpacity>
  );
};

export default function ToolsScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#0d64dd', '#0750b5']}
        style={styles.headerContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.header}>Tools</Text>
        <Text style={styles.subtitle}>Performance over the last 7 days</Text>
      </LinearGradient>

      <View style={styles.contentContainer}>
        <View style={styles.metricsRow}>
          <Metric icon="chat-outline" count="10" label="Conversations" />
          <Metric icon="file-document-outline" count="--" label="Catalog Views" />
          <Metric icon="progress-clock" count="30" label="Status Views" />
        </View>

        <Text style={styles.sectionHeader}>For you</Text>
        <View style={styles.draftCard}>
          <View style={styles.cardHeader}>
            <Image
              source={require('../assets/images/dad.jpg')}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Draft Ad</Text>
              <Text style={styles.cardDesc}>
                We've saved your ad progress so you can finish creating it.
              </Text>
            </View>
            <TouchableOpacity>
              <Icon name="close" size={20} color="#999" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => navigation.navigate('Advertise')}
            activeOpacity={0.8}
          >
            <Text style={styles.cardButtonText}>Continue creating ad</Text>
            <Icon name="arrow-right" size={16} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        <Section title="Grow your business">
          <NavItem icon="shopping-outline" label="Catalog" subtitle="Show products and services" screen="CreateCatalog" />
          <NavItem icon="bullhorn-outline" label="Advertise" subtitle="Create ads to promote your items" screen="Advertise" />
        </Section>

        <Section title="Organize your chats">
          <NavItem icon="label-outline" label="Labels" subtitle="Group chats and customers" screen="Labels" />
          <NavItem icon="message-alert-outline" label="Greeting message" subtitle="Welcome new customers" screen="GreetingMessage" />
          <NavItem icon="clock-outline" label="Away message" subtitle="Auto reply when unavailable" screen="AwayMessage" />
          <NavItem icon="keyboard-return" label="Quick replies" subtitle="Reuse frequently sent messages" screen="QuickReplies" />
        </Section>

        <Section title="Manage your account">
          <NavItem icon="account-outline" label="Profile" subtitle="Address, hours and more" screen="ManageProfile" />
          <NavItem icon="cellphone-message" label="Essential platforms" subtitle="Link messaging platforms" screen="EssentialPlatforms" />
          <NavItem icon="help-circle-outline" label="Help center" subtitle="Support and assistance" screen="HelpCenter" />
        </Section>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9ff',
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  metricBox: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4a6cf7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  metricIconContainer: {
    backgroundColor: '#4a6cf7',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricCount: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 4,
    color: '#333',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  draftCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  cardDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  cardButton: {
    backgroundColor: '#4a6cf7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionIconContainer: {
    backgroundColor: '#f0f4ff',
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  optionSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
});
