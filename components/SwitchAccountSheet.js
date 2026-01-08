import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const SwitchAccountSheet = ({
  showConfirmSwitch,
  setShowConfirmSwitch,
  pendingSwitchTo = 'business',
  switchAccount,
  isLoading,
  setIsLoading,
}) => {
  // Animation values
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Account type configuration
  const accountTypeDetails = {
    business: {
      icon: 'business-outline',
      color: '#0750b5',
      gradient: ['#0750b5', '#0d64dd'],
      benefits: [
        'Access business tools and analytics',
        'Manage customers and products',
        'Professional profile appearance'
      ],
      displayName: 'Business'
    },
    personal: {
      icon: 'person-outline',
      color: '#3498db',
      gradient: ['#3498db', '#2980b9'],
      benefits: [
        'Connect with friends and family',
        'Share personal moments',
        'Simplified interface'
      ],
      displayName: 'Personal'
    },
    social: {
      icon: 'people-outline',
      color: '#e74c3c',
      gradient: ['#e74c3c', '#c0392b'],
      benefits: [
        'Connect with friends and communities',
        'Share your favorite moments',
        'Discover new content'
      ],
      displayName: 'Social'
    }
  };


  const accountType = pendingSwitchTo && accountTypeDetails[pendingSwitchTo] 
    ? pendingSwitchTo 
    : 'business';
  const details = accountTypeDetails[accountType];

  // Animation effects
  React.useEffect(() => {
    if (showConfirmSwitch) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showConfirmSwitch]);

  const handleSwitch = async () => {
    setIsLoading(true);
    try {
      await switchAccount(accountType);
    } finally {
      setShowConfirmSwitch(false);
    }
  };

  return (
    <Modal
      visible={showConfirmSwitch}
      transparent
      animationType="none"
      onRequestClose={() => !isLoading && setShowConfirmSwitch(false)}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={() => !isLoading && setShowConfirmSwitch(false)}
        />
        
        <Animated.View 
          style={[
            styles.sheet, 
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Header with gradient */}
          <LinearGradient
            colors={details.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradient}
          >
            <Icon 
              name={details.icon} 
              size={28} 
              color="#fff" 
              style={styles.accountIcon}
            />
            <Text style={styles.title}>
              Switch to {details.displayName} Account
            </Text>
          </LinearGradient>

          {/* Content area */}
          <View style={styles.content}>
            <Text style={styles.subtitle}>
              You'll gain access to:
            </Text>

            {/* Benefits list */}
            <View style={styles.benefitsContainer}>
              {details.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Icon name="checkmark-circle" size={18} color="#2ecc71" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
            <View style={styles.noteBox}>
              <Icon name="information-circle-outline" size={18} color="#f39c12" />
              <Text style={styles.noteText}>
                {accountType === 'business' 
                  ? 'Business features will replace some personal account options'
                  : 'Your existing data will remain accessible'}
              </Text>
            </View>

            {/* Action buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfirmSwitch(false)}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Not Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: details.color }]}
                onPress={handleSwitch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Icon 
                      name="swap-horizontal" 
                      size={18} 
                      color="#fff" 
                      style={{ marginRight: 8 }} 
                    />
                    <Text style={styles.confirmButtonText}>
                      Switch to {details.displayName}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },
  headerGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIcon: {
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    fontWeight: '600',
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  noteText: {
    fontSize: 14,
    color: '#f39c12',
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SwitchAccountSheet;


// <Modal
//   visible={showConfirmSwitch}
//   transparent
//   animationType="fade"
//   onRequestClose={() => setShowConfirmSwitch(false)}
// >
//   <View style={styles.confirmSwitchOverlay}>
//     <View style={styles.confirmSwitchContainer}>
//       {/* Header with icon */}
//       <View style={styles.switchHeader}>
//         <Icon 
//           name="swap-horizontal" 
//           size={30} 
//           color="#0d64dd" 
//           style={styles.switchIcon}
//         />
//         <Text style={styles.confirmSwitchTitle}>Account Switch</Text>
//       </View>

//       {/* Detailed explanation */}
//       <View style={styles.switchDetails}>
//         <Text style={styles.confirmSwitchSubtitle}>
//           You're switching from <Text style={styles.highlightText}>Personal</Text> to{' '}
//           <Text style={styles.highlightText}>{pendingSwitchTo === 'business' ? 'Business' : 'Social'}</Text> mode.
//         </Text>

//         <View style={styles.switchBulletPoints}>
//           <View style={styles.bulletPoint}>
//             <Icon name="checkmark-circle" size={16} color="#4CAF50" />
//             <Text style={styles.bulletText}>
//               {pendingSwitchTo === 'business' 
//                 ? 'Access business tools and analytics' 
//                 : 'Connect with friends and share moments'}
//             </Text>
//           </View>
          
//           <View style={styles.bulletPoint}>
//             <Icon name="checkmark-circle" size={16} color="#4CAF50" />
//             <Text style={styles.bulletText}>
//               {pendingSwitchTo === 'business' 
//                 ? 'Manage your business profile and customers' 
//                 : 'See personal updates and stories'}
//             </Text>
//           </View>
          
//           <View style={styles.bulletPoint}>
//             <Icon name="information-circle" size={16} color="#FFA000" />
//             <Text style={styles.bulletText}>
//               You can switch back anytime from the menu
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Action buttons */}
//       <View style={styles.switchActions}>
//         <TouchableOpacity
//           style={[styles.confirmSwitchButton, styles.confirmSwitchButtonSecondary]}
//           onPress={() => setShowConfirmSwitch(false)}
//           disabled={isLoading}
//         >
//           <Text style={[styles.confirmSwitchButtonText, styles.confirmSwitchButtonTextSecondary]}>
//             Cancel
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.confirmSwitchButton, styles.confirmSwitchButtonPrimary]}
//           onPress={async () => {
//             setIsLoading(true);
//             await switchAccount(pendingSwitchTo);
//             setShowConfirmSwitch(false);
//           }}
//           disabled={isLoading}
//         >
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             {isLoading ? (
//               <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
//             ) : (
//               <Icon 
//                 name={pendingSwitchTo === 'business' ? 'business' : 'people'} 
//                 size={18} 
//                 color="#fff" 
//                 style={{ marginRight: 8 }} 
//               />
//             )}
//             <Text style={[styles.confirmSwitchButtonText, styles.confirmSwitchButtonTextPrimary]}>
//               {isLoading ? 'Switching...' : `Switch to ${pendingSwitchTo}`}
//             </Text>
//           </View>
//         </TouchableOpacity>
//       </View>

//       {/* Footer note */}
//       <Text style={styles.switchFooterNote}>
//         Note: Some features may differ between account types
//       </Text>
//     </View>
//   </View>
// </Modal>