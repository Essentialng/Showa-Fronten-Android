import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  Image,
  Dimensions,
  Animated,
  Easing,
  Platform,
  ScrollView
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { API_ROUTE_IMAGE } from '../api_routing/api';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export default function InviteLinkScreen({ route }) {
  const { inviteLink, profile_image, name } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.9)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my channel on Showa: ${inviteLink}`,
        title: 'Invite to Showa Channel',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the link.');
    }
  };

  const handleCopy = () => {
    Clipboard.setString(inviteLink);
    Alert.alert('Copied', 'The link has been copied to your clipboard.');
  };

  const cardTranslateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <ScrollView>
            <View style={styles.container}>
      <Animated.View 
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleValue }]
          }
        ]}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                profile_image
                  ? { uri: `${API_ROUTE_IMAGE}${profile_image}` }
                  : require('../assets/images/channelfallbackimg.png') 
              }
              style={styles.avatar}
            />
            <View style={styles.verifiedBadge}>
              <Icon name="verified" size={20} color="#007AFF" />
            </View>
          </View>
          <Text style={styles.channelName}>{name}</Text>
          <Text style={styles.subtitle}>Invite your friends to join this channel</Text>
        </View>

        <Animated.View 
          style={[
            styles.card,
            {
              opacity: cardAnim,
              transform: [{ translateY: cardTranslateY }]
            }
          ]}
        >
          <Text style={styles.title}>Invitation Link</Text>
          
          <View style={styles.linkContainer}>
            <Text style={styles.link} numberOfLines={1} ellipsizeMode="tail">
              {inviteLink}
            </Text>
          </View>

          <View style={styles.qrContainer}>
            <View style={styles.qrBackground}>
              <QRCode
                value={inviteLink}
                size={180}
                color="#2c3e50"
                backgroundColor="transparent"
              />
            </View>
            <Text style={styles.qrHint}>Scan QR code to join</Text>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.button, styles.shareButton]} 
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Icon name="share" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Share Link</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.copyButton]} 
              onPress={handleCopy}
              activeOpacity={0.7}
            >
              <Icon name="content-copy" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Copy Link</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#ddd',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 3,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  channelName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 5,
    textTransform:'capitalize',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  linkContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  link: {
    fontSize: 16,
    color: '#3498db',
    textAlign: 'center',
    fontWeight: '500',
  },
  qrContainer: {
    marginBottom: 25,
    alignItems: 'center',
  },
  qrBackground: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  qrHint: {
    marginTop: 12,
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  buttonGroup: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  shareButton: {
    backgroundColor: '#3498db',
  },
  copyButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 5,
  },
});