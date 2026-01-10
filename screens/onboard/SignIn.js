

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
//   ActivityIndicator,
//   Alert
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { Picker } from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';

// const COUNTRIES = [
//   { code: 'NG', name: 'Nigeria', dial: '+234' },
//   { code: 'GH', name: 'Ghana', dial: '+233' },
//   { code: 'KE', name: 'Kenya', dial: '+254' },
//   { code: 'US', name: 'United States', dial: '+1' },
//   { code: 'GB', name: 'United Kingdom', dial: '+44' },
//   { code: 'ZA', name: 'South Africa', dial: '+27' },
//   { code: 'CM', name: 'Cameroon', dial: '+237' },
//   { code: 'UG', name: 'Uganda', dial: '+256' },
//   { code: 'CA', name: 'Canada', dial: '+1' },
//   { code: 'DE', name: 'Germany', dial: '+49' },
//   { code: 'FR', name: 'France', dial: '+33' },
//   { code: 'IT', name: 'Italy', dial: '+39' },
//   { code: 'IN', name: 'India', dial: '+91' },
//   { code: 'BR', name: 'Brazil', dial: '+55' },
//   { code: 'SA', name: 'Saudi Arabia', dial: '+966' },
//   { code: 'AE', name: 'UAE', dial: '+971' },
//   { code: 'TR', name: 'Turkey', dial: '+90' },
//   { code: 'RU', name: 'Russia', dial: '+7' },
//   { code: 'PK', name: 'Pakistan', dial: '+92' },
//   { code: 'BD', name: 'Bangladesh', dial: '+880' },
// ];

// const PRIMARY_COLOR = '#0d64dd';
// const BORDER_COLOR = '#ddd';
// const TEXT_PRIMARY = '#333';
// const TEXT_SECONDARY = '#666';
// const PLACEHOLDER_COLOR = '#999';

// export default function PhoneNumberScreen({ navigation }) {
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleBackNavigation = () => {
//     navigation.navigate('Loginscreen');
//   };

//   const validateInput = () => {
//     if (!selectedCountry) {
//       Alert.alert('Selection Required', 'Please select your country/region.');
//       return false;
//     }
    
//     if (!phoneNumber.trim()) {
//       Alert.alert('Input Required', 'Please enter your phone number.');
//       return false;
//     }

//     // Basic phone number validation (digits only)
//     const phoneRegex = /^\d+$/;
//     if (!phoneRegex.test(phoneNumber.trim())) {
//       Alert.alert('Invalid Format', 'Please enter a valid phone number containing only digits.');
//       return false;
//     }

//     return true;
//   };

//   const handleContinue = () => {
//     if (validateInput()) {
//       setIsLoading(true);
//       // Simulate API call or navigation delay
//       setTimeout(() => {
//         setIsLoading(false);
//         navigation.navigate('Signin_two', { 
//           phoneNumberID: `${selectedCountry}${phoneNumber}` 
//         });
//       }, 500);
//     }
//   };

//   const getFlagEmoji = (countryCode) => {
//     return countryCode
//       .toUpperCase()
//       .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
//   };

//   const formatPhoneNumber = (text) => {
//     // Remove non-digit characters
//     const cleaned = text.replace(/\D/g, '');
//     setPhoneNumber(cleaned);
//   };

//   return (
//     <View style={styles.container}>
//       <LinearGradient 
//         colors={[PRIMARY_COLOR, PRIMARY_COLOR]} 
//         style={styles.header}
//       >
//         <TouchableOpacity 
//           onPress={handleBackNavigation}
//           style={styles.headerButton}
//           accessibilityLabel="Go back"
//         >
//           <Icon name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           onPress={handleBackNavigation}
//           style={styles.headerButton}
//           accessibilityLabel="Close"
//         >
//           <Icon name="close" size={24} color="#fff" />
//         </TouchableOpacity>
//       </LinearGradient>

//       {/* Content Section */}
//       <View style={styles.content}>
//         <Text style={styles.title}>Enter Phone Number</Text>
//         <Text style={styles.subtitle}>
//           Select your country and enter your Showa phone number
//         </Text>

//         {/* Country Selection */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Country/Region</Text>
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={selectedCountry}
//               onValueChange={setSelectedCountry}
//               style={styles.picker}
//               dropdownIconColor={TEXT_PRIMARY}
//             >
//               <Picker.Item 
//                 label="Select country/region" 
//                 value="" 
//                 color={PLACEHOLDER_COLOR}
//               />
//               {COUNTRIES.map((country, index) => (
//                 <Picker.Item
//                   key={`${country.code}-${index}`}
//                   label={`${getFlagEmoji(country.code)} ${country.name} (${country.dial})`}
//                   value={country.dial}
//                   color={TEXT_PRIMARY}
//                 />
//               ))}
//             </Picker>
//           </View>
//         </View>

//         {/* Phone Number Input */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Phone Number</Text>
//           <TextInput
//             placeholder="Enter your phone number"
//             style={styles.input}
//             keyboardType="phone-pad"
//             placeholderTextColor={PLACEHOLDER_COLOR}
//             value={phoneNumber}
//             onChangeText={formatPhoneNumber}
//             editable={!isLoading}
//             maxLength={15} 
//           />
//         </View>

//         {/* Action Button */}
//         <TouchableOpacity 
//           onPress={handleContinue}
//           style={[
//             styles.primaryButton,
//             isLoading && styles.buttonDisabled
//           ]}
//           disabled={isLoading}
//           accessibilityLabel="Continue to next step"
//         >
//           {isLoading ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <Text style={styles.primaryButtonText}>Continue</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#fff' 
//   },
//   header: {
//     height: 100,
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//     paddingHorizontal: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerButton: {
//     padding: 8,
//   },
//   content: {
//     flex: 1,
//     padding: 24,
//   },
//   title: {
//     fontSize: 24,
//     color: TEXT_PRIMARY,
//     textAlign: 'center',
//     marginTop: 20,
//     marginBottom: 8,
//     fontFamily: 'Lato-Black',
//     fontWeight: '700',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: TEXT_SECONDARY,
//     marginBottom: 32,
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   inputContainer: {
//     marginBottom: 24,
//   },
//   label: {
//     fontSize: 14,
//     color: TEXT_PRIMARY,
//     marginBottom: 8,
//     fontWeight: '500',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#fafafa',
//   },
//   picker: {
//     height: 52,
//   },
//   input: {
//     height: 52,
//     borderColor: BORDER_COLOR,
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     color: TEXT_PRIMARY,
//     backgroundColor: '#fafafa',
//   },
//   primaryButton: {
//     backgroundColor: PRIMARY_COLOR,
//     paddingVertical: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   primaryButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },


// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
//   ActivityIndicator,
//   Alert,
//   Modal,
//   FlatList,
//   StatusBar,
//   KeyboardAvoidingView,
//   ScrollView,
//   Dimensions,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';

// const COUNTRIES = [
//   { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
//   { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
//   { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
//   { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
//   { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
//   { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
// ];

// const COLORS = {
//   primary: '#0d64dd',
//   primaryLight: '#4a90e2',
//   border: '#ddd',
//   textPrimary: '#333',
//   textSecondary: '#666',
//   placeholder: '#999',
//   white: '#fff',
// };

// const SPACING = { sm: 8, md: 16, lg: 24, xl: 40 };
// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// export default function PhoneNumberScreen({ navigation }) {
//   const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const phoneRef = useRef(null);

//   const [currentTime, setCurrentTime] = useState('');

//   useEffect(() => {
//     const updateTime = () => {
//       const now = new Date();
//       const formatted = `${String(now.getHours()).padStart(2, '0')}:${String(
//         now.getMinutes()
//       ).padStart(2, '0')}`;
//       setCurrentTime(formatted);
//     };
//     updateTime();
//     const interval = setInterval(updateTime, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   const validate = () => {
//     if (!phoneNumber.trim()) {
//       Alert.alert('Error', 'Enter your phone number');
//       return false;
//     }
//     if (!/^\d+$/.test(phoneNumber.trim())) {
//       Alert.alert('Error', 'Only digits allowed');
//       return false;
//     }
//     if (selectedCountry.code === 'NG' && phoneNumber.length < 10) {
//       Alert.alert('Error', 'Nigerian numbers must be at least 10 digits');
//       return false;
//     }
//     return true;
//   };

//   const handleContinue = () => {
//     if (!validate()) return;
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       navigation.navigate('Signin_two', {
//         phoneNumberID: `${selectedCountry.dial}${phoneNumber}`,
//       });
//     }, 500);
//   };

//   const filteredCountries = COUNTRIES.filter(
//     (c) =>
//       c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.dial.includes(searchQuery)
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* Status Bar */}
//       <StatusBar
//         barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
//         backgroundColor={Platform.OS === 'android' ? COLORS.primary : 'transparent'}
//         translucent={Platform.OS === 'ios'}
//       />

//       {/* Header / Navbar */}
//       <LinearGradient
//         colors={[COLORS.primary, COLORS.primary]}
//         style={styles.header}
//       >
//         <View style={styles.headerRow}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.headerButton}
//           >
//             <Icon name="arrow-back" size={22} color={COLORS.white} />
//           </TouchableOpacity>

//           <Text style={styles.headerTitle}>Phone Number</Text>

//           <View style={{ width: 40 }} /> {/* placeholder for alignment */}
//         </View>
//       </LinearGradient>

//       {/* Content */}
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//       >
//         <ScrollView
//           contentContainerStyle={styles.contentContainer}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View style={styles.logoCircle}>
//             <Icon name="call-outline" size={40} color={COLORS.primary} />
//           </View>

//           <Text style={styles.title}>Enter Phone Number</Text>
//           <Text style={styles.subtitle}>
//             Select your country and enter your phone number to continue
//           </Text>

//           {/* Country Selector */}
//           <TouchableOpacity
//             style={styles.countrySelector}
//             onPress={() => setShowDropdown(true)}
//           >
//             <Text style={styles.flag}>{selectedCountry.flag}</Text>
//             <Text style={styles.countryText}>
//               {selectedCountry.name} ({selectedCountry.dial})
//             </Text>
//             <Icon
//               name={showDropdown ? 'chevron-up' : 'chevron-down'}
//               size={20}
//               color={COLORS.textSecondary}
//             />
//           </TouchableOpacity>

//           {/* Phone Input */}
//           <View
//             style={[
//               styles.phoneInputContainer,
//               Platform.OS === 'ios'
//                 ? styles.inputShadowIOS
//                 : styles.inputShadowAndroid,
//             ]}
//           >
//             <View style={styles.dialCodeContainer}>
//               <Text style={styles.dialCodeText}>{selectedCountry.dial}</Text>
//             </View>
//             <TextInput
//               ref={phoneRef}
//               placeholder="Phone number"
//               style={styles.phoneInput}
//               keyboardType="phone-pad"
//               placeholderTextColor={COLORS.placeholder}
//               value={phoneNumber}
//               onChangeText={(text) => setPhoneNumber(text.replace(/\D/g, ''))}
//               maxLength={15}
//               returnKeyType="done"
//               autoComplete="tel"
//               textContentType="telephoneNumber"
//             />
//           </View>

//           {/* Continue Button */}
//           <TouchableOpacity
//             onPress={handleContinue}
//             style={[
//               styles.button,
//               Platform.OS === 'ios'
//                 ? styles.buttonShadowIOS
//                 : styles.buttonShadowAndroid,
//               loading && { opacity: 0.6 },
//             ]}
//           >
//             {loading ? (
//               <ActivityIndicator size="small" color={COLORS.white} />
//             ) : (
//               <Text style={styles.buttonText}>Continue</Text>
//             )}
//           </TouchableOpacity>
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {/* Country Dropdown Modal */}
//       <Modal
//         visible={showDropdown}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowDropdown(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Select Country</Text>
//               <TouchableOpacity onPress={() => setShowDropdown(false)}>
//                 <Icon name="close" size={24} color={COLORS.textPrimary} />
//               </TouchableOpacity>
//             </View>
//             <TextInput
//               placeholder="Search..."
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               style={styles.searchInput}
//               placeholderTextColor={COLORS.placeholder}
//             />
//             <FlatList
//               data={filteredCountries}
//               keyExtractor={(item) => item.code}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.countryItem}
//                   onPress={() => {
//                     setSelectedCountry(item);
//                     setShowDropdown(false);
//                   }}
//                 >
//                   <Text style={styles.flag}>{item.flag}</Text>
//                   <Text style={styles.countryText}>
//                     {item.name} ({item.dial})
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: COLORS.white },

//   header: {
//     paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight,
//     paddingBottom: 15,
//     backgroundColor: COLORS.primary,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: SPACING.md,
//     height: 50,
//   },
//   headerButton: { padding: 8, borderRadius: 22,marginTop:-0, backgroundColor: 'rgba(255,255,255,0.1)' },
//   headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: '600' },

//   contentContainer: { padding: SPACING.lg },
//   logoCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(13,100,221,0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginBottom: SPACING.lg,
//   },
//   title: { fontSize: 28, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center', marginBottom: SPACING.sm },
//   subtitle: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl },

//   countrySelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: COLORS.border,
//     borderRadius: 12,
//     paddingHorizontal: SPACING.md,
//     height: 56,
//     marginBottom: SPACING.lg,
//     justifyContent: 'space-between',
//   },
//   flag: { fontSize: 24 },
//   countryText: { fontSize: 16, flex: 1, marginLeft: SPACING.sm },

//   phoneInputContainer: { flexDirection: 'row', height: 56, marginBottom: SPACING.md },
//   dialCodeContainer: {
//     width: 90,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderRightWidth: 0,
//     borderColor: COLORS.border,
//     borderTopLeftRadius: 12,
//     borderBottomLeftRadius: 12,
//     backgroundColor: '#f8f9fa',
//   },
//   dialCodeText: { fontSize: 16, fontWeight: '500', color: COLORS.textPrimary },
//   phoneInput: {
//     flex: 1,
//     borderWidth: 1.5,
//     borderColor: COLORS.border,
//     borderTopRightRadius: 12,
//     borderBottomRightRadius: 12,
//     paddingHorizontal: SPACING.md,
//     fontSize: 16,
//     color: COLORS.textPrimary,
//     backgroundColor: COLORS.white,
//   },

//   inputShadowIOS: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
//   inputShadowAndroid: { elevation: 2 },

//   button: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: SPACING.md },
//   buttonShadowIOS: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
//   buttonShadowAndroid: { elevation: 6 },
//   buttonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },

//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
//   modalContainer: { flex: 1, backgroundColor: COLORS.white, marginTop: Platform.OS === 'ios' ? 60 : 0, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
//   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.md, alignItems: 'center' },
//   modalTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary },
//   searchInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, marginHorizontal: SPACING.md, paddingHorizontal: SPACING.md, height: 44, marginBottom: SPACING.md },
//   countryItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md },
// });

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
//   ActivityIndicator,
//   Alert,
//   Modal,
//   FlatList,
//   StatusBar,
//   KeyboardAvoidingView,
//   ScrollView,
//   Dimensions,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';

// const COUNTRIES = [
//   { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
//   { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
//   { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
//   { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
//   { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
//   { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
// ];

// const COLORS = {
//   primary: '#0d64dd',
//   primaryLight: '#4a90e2',
//   border: '#ddd',
//   textPrimary: '#333',
//   textSecondary: '#666',
//   placeholder: '#999',
//   white: '#fff',
//   grayLight: '#f7f7f7',
// };

// const SPACING = { sm: 8, md: 16, lg: 24, xl: 40 };
// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// export default function PhoneNumberScreen({ navigation }) {
//   const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const phoneRef = useRef(null);

//   useEffect(() => {
//     if (showDropdown) phoneRef.current?.blur();
//   }, [showDropdown]);

//   const validate = () => {
//     if (!phoneNumber.trim()) {
//       Alert.alert('Error', 'Enter your phone number');
//       return false;
//     }
//     if (!/^\d+$/.test(phoneNumber.trim())) {
//       Alert.alert('Error', 'Only digits allowed');
//       return false;
//     }
//     if (selectedCountry.code === 'NG' && phoneNumber.length < 10) {
//       Alert.alert('Error', 'Nigerian numbers must be at least 10 digits');
//       return false;
//     }
//     return true;
//   };

//   const handleContinue = () => {
//     if (!validate()) return;
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       navigation.navigate('Signin_two', {
//         phoneNumberID: `${selectedCountry.dial}${phoneNumber}`,
//       });
//     }, 500);
//   };

//   const filteredCountries = COUNTRIES.filter(
//     (c) =>
//       c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.dial.includes(searchQuery)
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor="transparent"
//         translucent
//       />

//       {/* Header */}
//       <LinearGradient
//         colors={[COLORS.primary, COLORS.primaryLight]}
//         style={styles.header}
//       >
//         <View style={styles.headerRow}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={[styles.headerButton,{marginBottom:30}]}
//           >
//             <Icon name="arrow-back" size={22} color={COLORS.white} />
//           </TouchableOpacity>

//           <View style={{ alignItems: 'center' }}>
//             <Text style={styles.headerTitle}>Phone Number</Text>
//             <Text style={[styles.headerSubtitle,{marginBottom:30}]}>Enter your details</Text>
//           </View>

//           <View style={{ width: 40 }} /> {/* placeholder */}
//         </View>
//       </LinearGradient>

//       {/* Content */}
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // iOS padding for keyboard
//         style={{ flex: 1 }}
//       >
//         <ScrollView
//           contentContainerStyle={styles.contentContainer}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Uncomment for iOS professional gradient logo background */}
//           {Platform.OS === 'ios' && (
//             <LinearGradient
//               colors={['rgba(33, 88, 166, 0.1)', 'rgba(13,100,221,0.05)']}
//               style={styles.logoCircle}
//             >
//               <Icon name="call-outline" size={40} color={COLORS.primary} />
//             </LinearGradient>
//           )}

//           {/* Android fallback */}
//           {Platform.OS !== 'ios' && (
//             <View style={styles.logoCircle}>
//               <Icon name="call-outline" size={40} color={COLORS.primary} />
//             </View>
//           )}

//           <Text style={styles.title}>Enter Your Phone Number</Text>
//           <Text style={styles.subtitle}>
//             Select your country and enter your phone number to continue
//           </Text>

//           {/* Country Selector */}
//           <TouchableOpacity
//             style={styles.countrySelector}
//             onPress={() => setShowDropdown(true)}
//           >
//             <Text style={styles.flag}>{selectedCountry.flag}</Text>
//             <Text style={styles.countryText}>
//               {selectedCountry.name} ({selectedCountry.dial})
//             </Text>
//             <Icon
//               name={showDropdown ? 'chevron-up' : 'chevron-down'}
//               size={20}
//               color={COLORS.textSecondary}
//             />
//           </TouchableOpacity>

//           {/* Phone Input */}
//           <View style={[styles.phoneInputContainer, /* iOS shadow */ Platform.OS === 'ios' && styles.inputShadowIOS]}>
//             <View style={styles.dialCodeContainer}>
//               <Text style={styles.dialCodeText}>{selectedCountry.dial}</Text>
//             </View>
//             <TextInput
//               ref={phoneRef}
//               placeholder="Phone number"
//               style={styles.phoneInput}
//               keyboardType="phone-pad"
//               placeholderTextColor={COLORS.placeholder}
//               value={phoneNumber}
//               onChangeText={(text) => setPhoneNumber(text.replace(/\D/g, ''))}
//               maxLength={15}
//             />
//           </View>

//           {/* Continue Button */}
//           <TouchableOpacity
//             onPress={handleContinue}
//             style={[
//               styles.button,
//               /* iOS shadow */ Platform.OS === 'ios' && styles.buttonShadowIOS,
//               loading && { opacity: 0.6 },
//             ]}
//           >
//             {loading ? (
//               <ActivityIndicator size="small" color={COLORS.white} />
//             ) : (
//               <Text style={styles.buttonText}>Continue</Text>
//             )}
//           </TouchableOpacity>
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {/* Country Dropdown Modal */}
//       <Modal
//         visible={showDropdown}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowDropdown(false)}
//       >
//         {/* iOS blur example */}
//         {/* {Platform.OS === 'ios' ? (
//           <BlurView style={styles.modalOverlay} blurType="light" blurAmount={10}>
//             <View style={styles.modalContainer}>
//         ) : ( */}
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Select Country</Text>
//               <TouchableOpacity onPress={() => setShowDropdown(false)}>
//                 <Icon name="close" size={24} color={COLORS.textPrimary} />
//               </TouchableOpacity>
//             </View>

//             <TextInput
//               placeholder="Search..."
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               style={styles.searchInput}
//               placeholderTextColor={COLORS.placeholder}
//               autoFocus
//             />

//             <FlatList
//               data={filteredCountries}
//               keyExtractor={(item) => item.code}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.countryItem}
//                   onPress={() => {
//                     setSelectedCountry(item);
//                     setShowDropdown(false);
//                   }}
//                 >
//                   <Text style={styles.flag}>{item.flag}</Text>
//                   <Text style={styles.countryText}>
//                     {item.name} ({item.dial})
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//         {/* )} */}
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: COLORS.white },

//   /* Header */
//   header: {
//     paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight, // iOS safe area
//     paddingBottom: SPACING.md,
//     backgroundColor: COLORS.primary,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: SPACING.md,
//     height: 70,
//   },
//   headerButton: {
//     padding: 8,
//     borderRadius: 22,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//   },
//   headerTitle: { color: COLORS.white, fontSize: 22, fontWeight: '700' },
//   headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },

//   /* Content */
//   contentContainer: { padding: SPACING.lg, paddingBottom: SPACING.xl },

//   logoCircle: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginBottom: SPACING.lg,
//     backgroundColor: 'rgba(13,100,221,0.1)',
//     /* iOS shadow */
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//   },

//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//     textAlign: 'center',
//     marginBottom: SPACING.sm,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//     marginBottom: SPACING.xl,
//   },

//   /* Country selector */
//   countrySelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: COLORS.border,
//     borderRadius: 14,
//     paddingHorizontal: SPACING.md,
//     height: 56,
//     marginBottom: SPACING.lg,
//     justifyContent: 'space-between',
//     backgroundColor: COLORS.grayLight,
//   },
//   flag: { fontSize: 24 },
//   countryText: { fontSize: 16, flex: 1, marginLeft: SPACING.sm },

//   /* Phone input */
//   phoneInputContainer: {
//     flexDirection: 'row',
//     height: 56,
//     marginBottom: SPACING.md,
//     borderRadius: 14,
//     overflow: 'hidden',
//   },
//   dialCodeContainer: {
//     width: 90,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.grayLight,
//   },
//   dialCodeText: { fontSize: 16, fontWeight: '500', color: COLORS.textPrimary },
//   phoneInput: {
//     flex: 1,
//     fontSize: 16,
//     color: COLORS.textPrimary,
//     paddingHorizontal: SPACING.md,
//     backgroundColor: COLORS.white,
//   },

//   inputShadowIOS: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },

//   /* Button */
//   button: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 18,
//     borderRadius: 14,
//     alignItems: 'center',
//     marginTop: SPACING.md,
//   },
//   buttonShadowIOS: {
//     // shadowColor: '#000',
//     // shadowOffset: { width: 0, height: 6 },
//     // shadowOpacity: 0.3,
//     // shadowRadius: 8,
//   },
//   buttonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },

//   /* Modal */
//   modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
//   modalContainer: {
//     backgroundColor: COLORS.white,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: SCREEN_HEIGHT * 0.75,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: SPACING.md,
//     alignItems: 'center',
//   },
//   modalTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 14,
//     marginHorizontal: SPACING.md,
//     paddingHorizontal: SPACING.md,
//     height: 44,
//     marginBottom: SPACING.md,
//   },
//   countryItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: SPACING.md,
//     borderBottomWidth: 0.5,
//     borderBottomColor: COLORS.border,
//   },
// });

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

// Constants
const COUNTRIES = [
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
];

const COLORS = {
  primary: '#0d64dd',
  primaryLight: '#4a90e2',
  primaryDark: '#0a4fa3',
  border: '#e1e5e9',
  textPrimary: '#1a1a1a',
  textSecondary: '#6b7280',
  placeholder: '#9ca3af',
  white: '#ffffff',
  grayLight: '#f8fafc',
  gray: '#f1f5f9',
  overlay: 'rgba(0, 0, 0, 0.5)',
  success: '#10b981',
  error: '#ef4444',
};

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40 };
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Typography constants
const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  h2: { fontSize: 20, fontWeight: '600', lineHeight: 24 },
  body1: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  body2: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
};

export default function PhoneNumberScreen({ navigation }) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const phoneRef = useRef(null);

  useEffect(() => {
    if (showDropdown) phoneRef.current?.blur();
  }, [showDropdown]);

  const validatePhoneNumber = () => {
    const trimmedPhone = phoneNumber.trim();
    
    if (!trimmedPhone) {
      Alert.alert('Phone Number Required', 'Please enter your phone number to continue.');
      return false;
    }
    
    if (!/^\d+$/.test(trimmedPhone)) {
      Alert.alert('Invalid Format', 'Phone number can only contain digits.');
      return false;
    }
    
    if (selectedCountry.code === 'NG' && trimmedPhone.length < 10) {
      Alert.alert('Invalid Number', 'Nigerian phone numbers must be at least 10 digits.');
      return false;
    }
    
    if (trimmedPhone.length < 7) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number.');
      return false;
    }
    
    return true;
  };

  const handleContinue = () => {
    if (!validatePhoneNumber()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Signin_two', {
        phoneNumberID: `${selectedCountry.dial}${phoneNumber.trim()}`,
        countryCode: selectedCountry.code,
      });
    }, 800);
  };

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dial.includes(searchQuery)
  );

  const renderHeader = () => (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Icon name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Phone Verification</Text>
          <Text style={styles.headerSubtitle}>Secure sign-in with your number</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>
    </LinearGradient>
  );

  const renderPhoneIcon = () => (
    <LinearGradient
      colors={['rgba(13, 100, 221, 0.1)', 'rgba(74, 144, 226, 0.05)']}
      style={[
        styles.phoneIconContainer,
        Platform.OS === 'ios' && styles.iosPhoneIconShadow,
      ]}
    >
      <Icon name="phone-portrait-outline" size={42} color={COLORS.primary} />
    </LinearGradient>
  );

  const renderCountrySelector = () => (
    <TouchableOpacity
      style={[
        styles.countrySelector,
        Platform.OS === 'ios' && styles.iosCountrySelectorShadow,
      ]}
      onPress={() => setShowDropdown(true)}
      activeOpacity={0.8}
    >
      <Text style={styles.flagIcon}>{selectedCountry.flag}</Text>
      <View style={styles.countryTextContainer}>
        <Text style={styles.countryName}>{selectedCountry.name}</Text>
        <Text style={styles.countryDialCode}>{selectedCountry.dial}</Text>
      </View>
      <Icon
        name="chevron-down"
        size={20}
        color={COLORS.textSecondary}
        style={styles.chevronIcon}
      />
    </TouchableOpacity>
  );

  const renderPhoneInput = () => (
    <View style={[
      styles.phoneInputWrapper,
      Platform.OS === 'ios' && styles.iosPhoneInputShadow,
    ]}>
      <View style={styles.dialCodeWrapper}>
        <Text style={styles.dialCode}>{selectedCountry.dial}</Text>
      </View>
      <View style={styles.inputDivider} />
      <TextInput
        ref={phoneRef}
        placeholder="Enter phone number"
        style={styles.phoneInput}
        keyboardType="phone-pad"
        placeholderTextColor={COLORS.placeholder}
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text.replace(/\D/g, ''))}
        maxLength={15}
        editable={!loading}
        selectionColor={COLORS.primary}
      />
    </View>
  );

  const renderContinueButton = () => (
    <TouchableOpacity
      onPress={handleContinue}
      style={[
        styles.continueButton,
        Platform.OS === 'ios' && styles.iosButtonShadow,
        loading && styles.buttonDisabled,
      ]}
      activeOpacity={0.9}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.white} />
      ) : (
        <>
          <Text style={styles.buttonText}>Continue</Text>
          <Icon name="arrow-forward" size={20} color={COLORS.white} style={styles.buttonIcon} />
        </>
      )}
    </TouchableOpacity>
  );

  const renderCountryModal = () => (
    <Modal
      visible={showDropdown}
      transparent
      animationType="slide"
      onRequestClose={() => setShowDropdown(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowDropdown(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity
              onPress={() => setShowDropdown(false)}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={COLORS.placeholder} style={styles.searchIcon} />
            <TextInput
              placeholder="Search country or code..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor={COLORS.placeholder}
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => {
                  setSelectedCountry(item);
                  setShowDropdown(false);
                  setSearchQuery('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.countryFlag}>{item.flag}</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryItemName}>{item.name}</Text>
                  <Text style={styles.countryItemDial}>{item.dial}</Text>
                </View>
                {item.code === selectedCountry.code && (
                  <Icon name="checkmark-circle" size={20} color={COLORS.success} />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
        translucent={Platform.OS === 'android'}
      />
      
      {renderHeader()}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {renderPhoneIcon()}
            
            <Text style={styles.title}>Enter Your Phone Number</Text>
            <Text style={styles.subtitle}>
              We'll send a verification code to this number
            </Text>

            {renderCountrySelector()}
            {renderPhoneInput()}
            {renderContinueButton()}

            <Text style={styles.privacyNote}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {renderCountryModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? SPACING.xs : StatusBar.currentHeight + SPACING.xs,
    paddingBottom: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    height: 72,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  headerSpacer: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  phoneIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.grayLight,
  },
  iosPhoneIconShadow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.md,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    height: 60,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.grayLight,
  },
  iosCountrySelectorShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  flagIcon: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  countryTextContainer: {
    flex: 1,
  },
  countryName: {
    ...TYPOGRAPHY.body1,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  countryDialCode: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  chevronIcon: {
    marginLeft: SPACING.xs,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  iosPhoneInputShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dialCodeWrapper: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray,
  },
  dialCode: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  inputDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  phoneInput: {
    flex: 1,
    ...TYPOGRAPHY.body1,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 0,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: 16,
    marginBottom: SPACING.lg,
  },
  iosButtonShadow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    color: COLORS.white,
  },
  buttonIcon: {
    marginLeft: SPACING.sm,
  },
  privacyNote: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: SPACING.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.8,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body1,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: SPACING.md,
    width: 32,
  },
  countryInfo: {
    flex: 1,
  },
  countryItemName: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  countryItemDial: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
  },
});
