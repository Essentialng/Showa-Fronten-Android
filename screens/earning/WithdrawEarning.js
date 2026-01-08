import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert,
  ActivityIndicator, Modal, Switch,
  Linking, Platform, Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_ROUTE } from './api_routing/api';

const BRAND_COLOR = '#0d64dd';

// API Service
const createApiService = () => {
  const baseURL = `https://showa.essential.com.ng/api/showa`;
  
  const api = {
    interceptors: {
      request: { use: () => {} },
      response: { use: () => {} }
    },
    defaults: {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  api.request = async (config) => {
    try {
      const mergedConfig = {
        ...api.defaults,
        ...config,
        headers: {
          ...api.defaults.headers,
          ...config.headers,
        },
      };

      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        mergedConfig.headers.Authorization = `Bearer ${token}`;
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), mergedConfig.timeout);
      
      const response = await fetch(
        `${baseURL}${mergedConfig.url}`.replace(/([^:]\/)\/+/g, "$1"),
        {
          method: mergedConfig.method || 'GET',
          headers: mergedConfig.headers,
          body: mergedConfig.data ? JSON.stringify(mergedConfig.data) : null,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.removeItem('userToken');
          throw new Error('Unauthorized');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status, headers: response.headers };
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  api.get = (url, config) => api.request({ ...config, url, method: 'GET' });
  api.post = (url, data, config) => api.request({ ...config, url, data, method: 'POST' });

  return api;
};

const api = createApiService();

const WithdrawScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [balance, setBalance] = useState(0);
  const [limits, setLimits] = useState(null);
  const [methods, setMethods] = useState([]);
  const [history, setHistory] = useState([]);
  
  // Withdrawal form state
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [currency, setCurrency] = useState('USD');
  
  // Method details
  const [paypalEmail, setPaypalEmail] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cryptoWallet, setCryptoWallet] = useState('');
  const [cryptoNetwork, setCryptoNetwork] = useState('USDT');
  
  // Terms and conditions
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [allTermsAccepted, setAllTermsAccepted] = useState({
    terms: false,
    privacy: false,
    tax: false,
    verification: false,
    agreement: false
  });
  
  // Modals
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showMethodDetails, setShowMethodDetails] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Animation
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  
  useEffect(() => {
    fetchWithdrawalData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchWithdrawalData = async () => {
    try {
      setLoading(true);
      const [balanceRes, limitsRes, methodsRes, historyRes] = await Promise.all([
        api.get('/earn/enhanced/'),
        api.get('/withdraw/limits'),
        api.get('/withdraw/methods'),
        api.get('/withdraw/history')
      ]);
      
      setBalance(balanceRes.data.stats?.usd_available || 0);
      setLimits(limitsRes.data);
      setMethods(methodsRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error('Error fetching withdrawal data:', error);
      Alert.alert('Error', 'Failed to load withdrawal data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const calculateFee = () => {
    const amountNum = parseFloat(amount) || 0;
    const feePercent = 5.0;
    const feeMin = 1.00;
    let fee = (amountNum * feePercent) / 100;
    if (fee < feeMin) fee = feeMin;
    return fee;
  };

  const calculateNetAmount = () => {
    const amountNum = parseFloat(amount) || 0;
    const fee = calculateFee();
    return amountNum - fee;
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setShowMethodDetails(true);
    
    // Set default currency based on method
    if (method === 'paypal') setCurrency('USD');
    if (method === 'bank_transfer') setCurrency('USD');
    if (method === 'mobile_money') setCurrency('USD');
    if (method === 'crypto') setCurrency('USDT');
  };

  const validateWithdrawal = () => {
    const amountNum = parseFloat(amount) || 0;
    
    if (amountNum < (limits?.minimum_usd || 10)) {
      Alert.alert('Minimum Amount', `Minimum withdrawal amount is ${formatCurrency(limits?.minimum_usd || 10)}`);
      return false;
    }
    
    if (amountNum > balance) {
      Alert.alert('Insufficient Balance', `You only have ${formatCurrency(balance)} available`);
      return false;
    }
    
    if (!selectedMethod) {
      Alert.alert('Select Method', 'Please select a withdrawal method');
      return false;
    }
    
    // Validate method-specific details
    if (selectedMethod === 'paypal' && !paypalEmail.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid PayPal email');
      return false;
    }
    
    if (selectedMethod === 'bank_transfer' && (!bankAccount || !bankName)) {
      Alert.alert('Bank Details Required', 'Please enter your bank account details');
      return false;
    }
    
    if (selectedMethod === 'mobile_money' && !mobileNumber) {
      Alert.alert('Mobile Number Required', 'Please enter your mobile money number');
      return false;
    }
    
    if (selectedMethod === 'crypto' && !cryptoWallet) {
      Alert.alert('Wallet Required', 'Please enter your crypto wallet address');
      return false;
    }
    
    if (!allTermsAccepted.terms || !allTermsAccepted.privacy || 
        !allTermsAccepted.tax || !allTermsAccepted.verification || 
        !allTermsAccepted.agreement) {
      Alert.alert('Terms Required', 'You must accept all terms and conditions');
      return false;
    }
    
    return true;
  };

  const handleWithdrawalSubmit = async () => {
    if (!validateWithdrawal()) return;
    
    try {
      setSubmitting(true);
      
      const withdrawalData = {
        amount: parseFloat(amount),
        method: selectedMethod,
        currency,
        terms_accepted: 'true'
      };
      
      // Add method-specific details
      if (selectedMethod === 'paypal') {
        withdrawalData.paypal_email = paypalEmail;
      } else if (selectedMethod === 'bank_transfer') {
        withdrawalData.bank_account_number = bankAccount;
        withdrawalData.bank_name = bankName;
        withdrawalData.routing_number = routingNumber;
      } else if (selectedMethod === 'mobile_money') {
        withdrawalData.mobile_money_number = mobileNumber;
      } else if (selectedMethod === 'crypto') {
        withdrawalData.crypto_wallet = cryptoWallet;
        withdrawalData.crypto_network = cryptoNetwork;
      }
      
      const response = await api.post('/withdraw/request', withdrawalData);
      
      if (response.data.success) {
        setShowSuccessModal(true);
        // Reset form
        setAmount('');
        setPaypalEmail('');
        setBankAccount('');
        setBankName('');
        setRoutingNumber('');
        setMobileNumber('');
        setCryptoWallet('');
        setAllTermsAccepted({
          terms: false,
          privacy: false,
          tax: false,
          verification: false,
          agreement: false
        });
        // Refresh data
        fetchWithdrawalData();
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to process withdrawal');
    } finally {
      setSubmitting(false);
    }
  };

  const renderMethodIcon = (method) => {
    switch(method) {
      case 'paypal': return <Icon2 name="paypal" size={24} color="#003087" />;
      case 'bank_transfer': return <Icon name="account-balance" size={24} color="#4CAF50" />;
      case 'mobile_money': return <Icon name="smartphone" size={24} color="#2196F3" />;
      case 'crypto': return <Icon2 name="bitcoin" size={24} color="#FF9800" />;
      default: return <Icon name="payment" size={24} color="#666" />;
    }
  };

  const renderMethodDetails = () => {
    if (!selectedMethod) return null;
    
    const methodInfo = methods[selectedMethod];
    
    return (
      <View style={styles.methodDetailsCard}>
        <Text style={styles.methodDetailsTitle}>
          {selectedMethod === 'paypal' ? 'PayPal Details' :
           selectedMethod === 'bank_transfer' ? 'Bank Transfer Details' :
           selectedMethod === 'mobile_money' ? 'Mobile Money Details' :
           'Crypto Wallet Details'}
        </Text>
        
        {selectedMethod === 'paypal' && (
          <>
            <Text style={styles.inputLabel}>PayPal Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              value={paypalEmail}
              onChangeText={setPaypalEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.methodNote}>
              ⚠️ Ensure your PayPal email is correct. Withdrawals cannot be reversed.
            </Text>
          </>
        )}
        
        {selectedMethod === 'bank_transfer' && (
          <>
            <Text style={styles.inputLabel}>Bank Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234567890"
              value={bankAccount}
              onChangeText={setBankAccount}
              keyboardType="number-pad"
            />
            
            <Text style={styles.inputLabel}>Bank Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Chase Bank, Bank of America"
              value={bankName}
              onChangeText={setBankName}
            />
            
            <Text style={styles.inputLabel}>Routing Number (USA only)</Text>
            <TextInput
              style={styles.input}
              placeholder="021000021"
              value={routingNumber}
              onChangeText={setRoutingNumber}
              keyboardType="number-pad"
            />
            
            <Text style={styles.methodNote}>
              ⏱️ Bank transfers take 3-7 business days. Double-check your account details.
            </Text>
          </>
        )}
        
        {selectedMethod === 'mobile_money' && (
          <>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., +254712345678"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
            />
            
            <Text style={styles.inputLabel}>Network Provider</Text>
            <View style={styles.networkSelector}>
              {['M-Pesa', 'MTN', 'Airtel', 'Orange', 'Vodafone'].map(network => (
                <TouchableOpacity
                  key={network}
                  style={[
                    styles.networkOption,
                    mobileNumber.includes('+254') && network === 'M-Pesa' && styles.networkSelected
                  ]}
                >
                  <Text style={styles.networkText}>{network}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.methodNote}>
              📱 Ensure your mobile number is registered with the mobile money service.
            </Text>
          </>
        )}
        
        {selectedMethod === 'crypto' && (
          <>
            <Text style={styles.inputLabel}>Crypto Wallet Address</Text>
            <TextInput
              style={styles.input}
              placeholder="0x742d35Cc6634C0532925a3b844B..."
              value={cryptoWallet}
              onChangeText={setCryptoWallet}
              autoCapitalize="none"
            />
            
            <Text style={styles.inputLabel}>Select Network & Currency</Text>
            <View style={styles.cryptoSelector}>
              {[
                { symbol: 'USDT', name: 'Tether (ERC20)', color: '#26A17B' },
                { symbol: 'USDC', name: 'USD Coin (ERC20)', color: '#2775CA' },
                { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
                { symbol: 'ETH', name: 'Ethereum', color: '#627EEA' }
              ].map(token => (
                <TouchableOpacity
                  key={token.symbol}
                  style={[
                    styles.cryptoOption,
                    cryptoNetwork === token.symbol && styles.cryptoSelected
                  ]}
                  onPress={() => setCryptoNetwork(token.symbol)}
                >
                  <View style={[styles.cryptoIcon, { backgroundColor: token.color }]}>
                    <Text style={styles.cryptoIconText}>{token.symbol.charAt(0)}</Text>
                  </View>
                  <View style={styles.cryptoInfo}>
                    <Text style={styles.cryptoSymbol}>{token.symbol}</Text>
                    <Text style={styles.cryptoName}>{token.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.methodNote}>
              ⚠️ Send only {cryptoNetwork} to this address. Sending other assets may result in permanent loss.
            </Text>
          </>
        )}
        
        <TouchableOpacity
          style={styles.closeDetailsButton}
          onPress={() => setShowMethodDetails(false)}
        >
          <Text style={styles.closeDetailsText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHistoryItem = (item) => (
    <View key={item._id} style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <View style={styles.historyMethod}>
          {renderMethodIcon(item.method)}
          <Text style={styles.historyMethodText}>
            {item.method === 'paypal' ? 'PayPal' :
             item.method === 'bank_transfer' ? 'Bank Transfer' :
             item.method === 'mobile_money' ? 'Mobile Money' : 'Crypto'}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: 
            item.status === 'completed' ? '#4CAF50' :
            item.status === 'pending' ? '#FF9800' :
            item.status === 'processing' ? '#2196F3' :
            item.status === 'rejected' ? '#F44336' : '#9E9E99'
          }
        ]}>
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.historyDetails}>
        <View>
          <Text style={styles.historyAmount}>{formatCurrency(item.amount_usd)}</Text>
          <Text style={styles.historyDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.historyNet}>
          <Text style={styles.historyNetText}>Net: {formatCurrency(item.net_amount_usd)}</Text>
          <Text style={styles.historyFeeText}>Fee: {formatCurrency(item.fee_usd)}</Text>
        </View>
      </View>
      
      {item.status === 'rejected' && item.rejection_reason && (
        <View style={styles.rejectionReason}>
          <Icon name="warning" size={16} color="#F44336" />
          <Text style={styles.rejectionText}>Reason: {item.rejection_reason}</Text>
        </View>
      )}
    </View>
  );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={BRAND_COLOR} />
//         <Text style={styles.loadingText}>Loading withdrawal details...</Text>
//       </View>
//     );
//   }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[BRAND_COLOR, '#0a53b9']}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Withdraw Funds</Text>
          <TouchableOpacity 
            style={styles.historyButton}
            onPress={() => setShowHistoryModal(true)}
          >
            <Icon name="history" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Balance Card */}
        <Animated.View 
          style={[
            styles.balanceCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          
          <View style={styles.balanceInfo}>
            <View style={styles.infoItem}>
              <Icon name="error-outline" size={16} color="#FF9800" />
              <Text style={styles.infoText}>
                Min: {formatCurrency(limits?.minimum_usd || 10)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="attach-money" size={16} color="#4CAF50" />
              <Text style={styles.infoText}>
                Fee: {limits?.fee_percent || 5}% (min {formatCurrency(limits?.fee_minimum_usd || 1)})
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Amount Input */}
        <View style={styles.amountCard}>
          <Text style={styles.sectionTitle}>Withdrawal Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
            <Text style={styles.currencyText}>USD</Text>
          </View>
          
          {/* Quick Amount Buttons */}
          <View style={styles.quickAmounts}>
            {[10, 25, 50, 100, 250].map(quickAmount => (
              <TouchableOpacity
                key={quickAmount}
                style={[
                  styles.quickAmountButton,
                  amount === quickAmount.toString() && styles.quickAmountSelected
                ]}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={[
                  styles.quickAmountText,
                  amount === quickAmount.toString() && styles.quickAmountTextSelected
                ]}>
                  ${quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.quickAmountButton}
              onPress={() => setAmount(balance.toString())}
            >
              <Text style={styles.quickAmountText}>Max</Text>
            </TouchableOpacity>
          </View>
          
          {/* Fee & Net Amount Preview */}
          {amount && (
            <View style={styles.previewCard}>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Amount:</Text>
                <Text style={styles.previewValue}>{formatCurrency(parseFloat(amount) || 0)}</Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Processing Fee ({limits?.fee_percent || 5}%):</Text>
                <Text style={styles.previewValue}>-{formatCurrency(calculateFee())}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.previewRow}>
                <Text style={styles.netAmountLabel}>You Receive:</Text>
                <Text style={styles.netAmountValue}>
                  {formatCurrency(calculateNetAmount())}
                </Text>
              </View>
              <Text style={styles.previewNote}>
                Estimated processing: 3-7 business days
              </Text>
            </View>
          )}
        </View>

        {/* Withdrawal Methods */}
        <View style={styles.methodsCard}>
          <Text style={styles.sectionTitle}>Choose Withdrawal Method</Text>
          
          <View style={styles.methodsGrid}>
            {Object.entries(methods).map(([method, info]) => (
              info.available && (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.methodButton,
                    selectedMethod === method && styles.methodSelected
                  ]}
                  onPress={() => handleMethodSelect(method)}
                >
                  <View style={styles.methodIconContainer}>
                    {renderMethodIcon(method)}
                  </View>
                  <Text style={styles.methodName}>
                    {method === 'paypal' ? 'PayPal' :
                     method === 'bank_transfer' ? 'Bank Transfer' :
                     method === 'mobile_money' ? 'Mobile Money' : 'Crypto'}
                  </Text>
                  <Text style={styles.methodTime}>{info.processing_time}</Text>
                  <Text style={styles.methodFee}>{info.fee}</Text>
                </TouchableOpacity>
              )
            ))}
          </View>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.termsCard}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          
          <TouchableOpacity 
            style={styles.viewTermsButton}
            onPress={() => setShowTermsModal(true)}
          >
            <Icon name="description" size={20} color={BRAND_COLOR} />
            <Text style={styles.viewTermsText}>View Complete Terms & Conditions</Text>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
          
          {/* Required Consents */}
          <View style={styles.consentsContainer}>
            <View style={styles.consentItem}>
              <Switch
                value={allTermsAccepted.terms}
                onValueChange={(value) => setAllTermsAccepted({...allTermsAccepted, terms: value})}
                trackColor={{ false: '#ddd', true: BRAND_COLOR }}
              />
              <Text style={styles.consentText}>
                I agree to the <Text style={styles.consentLink}>Terms of Service</Text>
              </Text>
            </View>
            
            <View style={styles.consentItem}>
              <Switch
                value={allTermsAccepted.privacy}
                onValueChange={(value) => setAllTermsAccepted({...allTermsAccepted, privacy: value})}
                trackColor={{ false: '#ddd', true: BRAND_COLOR }}
              />
              <Text style={styles.consentText}>
                I agree to the <Text style={styles.consentLink}>Privacy Policy</Text>
              </Text>
            </View>
            
            <View style={styles.consentItem}>
              <Switch
                value={allTermsAccepted.tax}
                onValueChange={(value) => setAllTermsAccepted({...allTermsAccepted, tax: value})}
                trackColor={{ false: '#ddd', true: BRAND_COLOR }}
              />
              <Text style={styles.consentText}>
                I confirm that I am responsible for any applicable taxes on my earnings
              </Text>
            </View>
            
            <View style={styles.consentItem}>
              <Switch
                value={allTermsAccepted.verification}
                onValueChange={(value) => setAllTermsAccepted({...allTermsAccepted, verification: value})}
                trackColor={{ false: '#ddd', true: BRAND_COLOR }}
              />
              <Text style={styles.consentText}>
                I agree to provide verification documents if requested (KYC/AML)
              </Text>
            </View>
            
            <View style={styles.consentItem}>
              <Switch
                value={allTermsAccepted.agreement}
                onValueChange={(value) => setAllTermsAccepted({...allTermsAccepted, agreement: value})}
                trackColor={{ false: '#ddd', true: BRAND_COLOR }}
              />
              <Text style={styles.consentText}>
                I agree that withdrawal decisions are final and at Showa's discretion
              </Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!amount || !selectedMethod || submitting || 
             !Object.values(allTermsAccepted).every(v => v)) && styles.submitButtonDisabled
          ]}
          onPress={handleWithdrawalSubmit}
          disabled={!amount || !selectedMethod || submitting || 
                   !Object.values(allTermsAccepted).every(v => v)}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="send" size={22} color="#fff" />
              <Text style={styles.submitButtonText}>Request Withdrawal</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Important Notes */}
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>⚠️ Important Information</Text>
          <View style={styles.noteItem}>
            <Icon name="check-circle" size={16} color="#4CAF50" />
            <Text style={styles.noteText}>
              First withdrawal requires identity verification (KYC)
            </Text>
          </View>
          <View style={styles.noteItem}>
            <Icon name="timer" size={16} color="#FF9800" />
            <Text style={styles.noteText}>
              Processing times vary by method (1-7 business days)
            </Text>
          </View>
          <View style={styles.noteItem}>
            <Icon name="security" size={16} color="#2196F3" />
            <Text style={styles.noteText}>
              All transactions are monitored for fraud and security
            </Text>
          </View>
          <View style={styles.noteItem}>
            <Icon name="warning" size={16} color="#F44336" />
            <Text style={styles.noteText}>
              Incorrect payment details may result in permanent loss of funds
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Terms & Conditions Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms & Conditions</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowTermsModal(false)}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.termsContent}>
              <Text style={styles.termsHeading}>SHOWA WITHDRAWAL TERMS & CONDITIONS</Text>
              
              <Text style={styles.termsSection}>1. ELIGIBILITY</Text>
              <Text style={styles.termsText}>
                1.1. You must be at least 18 years old to withdraw funds.{'\n'}
                1.2. Your account must be verified with valid government-issued ID.{'\n'}
                1.3. Minimum withdrawal amount is $10.00 USD.{'\n'}
                1.4. You must have earned funds through legitimate platform use.{'\n'}
              </Text>
              
              <Text style={styles.termsSection}>2. PROCESSING TIME & FEES</Text>
              <Text style={styles.termsText}>
                2.1. Processing times: PayPal (1-3 days), Bank Transfer (3-7 days), Mobile Money (24-48 hours), Crypto (1-2 hours).{'\n'}
                2.2. Processing fee: 5% of withdrawal amount (minimum $1.00).{'\n'}
                2.3. Additional network fees may apply for crypto withdrawals.{'\n'}
                2.4. Currency conversion fees apply for non-USD withdrawals.{'\n'}
              </Text>
              
              <Text style={styles.termsSection}>3. VERIFICATION REQUIREMENTS</Text>
              <Text style={styles.termsText}>
                3.1. First withdrawal requires full KYC verification.{'\n'}
                3.2. You must provide valid government-issued photo ID.{'\n'}
                3.3. Proof of address (utility bill, bank statement) may be required.{'\n'}
                3.4. Selfie verification with ID may be requested.{'\n'}
                3.5. We reserve the right to request additional documentation.{'\n'}
              </Text>
              
              <Text style={styles.termsSection}>4. ANTI-FRAUD & COMPLIANCE</Text>
              <Text style={styles.termsText}>
                4.1. All withdrawals are subject to fraud review.{'\n'}
                4.2. We monitor for suspicious activity and money laundering.{'\n'}
                4.3. We may delay or reject withdrawals for security reasons.{'\n'}
                4.4. You must not use the service for illegal activities.{'\n'}
                4.5. We comply with all applicable laws and regulations.{'\n'}
              </Text>
              
              <Text style={styles.termsSection}>5. LIMITATIONS & RESTRICTIONS</Text>
              <Text style={styles.termsText}>
                5.1. Daily withdrawal limit: $1,000 USD.{'\n'}
                5.2. Weekly withdrawal limit: $5,000 USD.{'\n'}
                5.3. Monthly withdrawal limit: $10,000 USD.{'\n'}
                5.4. Limits may vary based on account verification level.{'\n'}
                5.5. We reserve the right to modify limits at any time.{'\n'}
              </Text>
              
              <Text style={styles.termsSection}>6. TAX RESPONSIBILITIES</Text>
              <Text style={styles.termsText}>
                6.1. You are solely responsible for reporting earnings to tax authorities.{'\n'}
                6.2. We may be required to report earnings to tax authorities.{'\n'}
                6.3. You must provide accurate tax information when requested.{'\n'}
                6.4. Consult a tax professional for advice on your situation.{'\n'}
              </Text>
              
              <Text style={styles.termsSection}>7. DISPUTES & CANCELLATIONS</Text>
              <Text style={styles.termsText}>
                7.1. Withdrawals cannot be cancelled once processing begins.{'\n'}
                7.2. Incorrect payment details may result in permanent loss.{'\n'}
                7.3. Disputes must be submitted within 7 days of withdrawal.{'\n'}
                7.4. Our decisions regarding withdrawals are final.{'\n'}
              </Text>
              
              <Text style={styles.termsSection}>8. TERMINATION</Text>
              <Text style={styles.termsText}>
                8.1. We may terminate withdrawal privileges for violations.{'\n'}
                8.2. Fraudulent activity will result in permanent ban.{'\n'}
                8.3. Remaining balance may be forfeited upon termination.{'\n'}
              </Text>
              
              <Text style={styles.termsNote}>
                By proceeding with withdrawal, you acknowledge that you have read, understood, and agree to all terms and conditions above.
              </Text>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.termsAcceptButton}
              onPress={() => setShowTermsModal(false)}
            >
              <Text style={styles.termsAcceptText}>I Understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* History Modal */}
      <Modal
        visible={showHistoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Withdrawal History</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowHistoryModal(false)}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.historyContainer}>
              {history.length > 0 ? (
                history.map(renderHistoryItem)
              ) : (
                <View style={styles.emptyHistory}>
                  <Icon name="history" size={50} color="#ddd" />
                  <Text style={styles.emptyHistoryText}>No withdrawal history yet</Text>
                  <Text style={styles.emptyHistorySubtext}>
                    Your withdrawal requests will appear here
                  </Text>
                </View>
              )}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeHistoryButton}
              onPress={() => setShowHistoryModal(false)}
            >
              <Text style={styles.closeHistoryText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Method Details Modal */}
      <Modal
        visible={showMethodDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMethodDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.methodModalContainer}>
            {renderMethodDetails()}
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Icon name="check-circle" size={80} color="#4CAF50" />
            </View>
            <Text style={styles.successTitle}>Withdrawal Request Submitted!</Text>
            <Text style={styles.successMessage}>
              Your withdrawal request for {formatCurrency(parseFloat(amount) || 0)} has been received.
            </Text>
            
            <View style={styles.successDetails}>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Net Amount:</Text>
                <Text style={styles.successValue}>{formatCurrency(calculateNetAmount())}</Text>
              </View>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Processing Fee:</Text>
                <Text style={styles.successValue}>{formatCurrency(calculateFee())}</Text>
              </View>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Method:</Text>
                <Text style={styles.successValue}>
                  {selectedMethod === 'paypal' ? 'PayPal' :
                   selectedMethod === 'bank_transfer' ? 'Bank Transfer' :
                   selectedMethod === 'mobile_money' ? 'Mobile Money' : 'Crypto'}
                </Text>
              </View>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Estimated Processing:</Text>
                <Text style={styles.successValue}>3-7 business days</Text>
              </View>
            </View>
            
            <Text style={styles.successNote}>
              We'll notify you via email when your withdrawal is processed. You can check the status in your withdrawal history.
            </Text>
            
            <TouchableOpacity 
              style={styles.successButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: BRAND_COLOR,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 35,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#fff',
  },
  historyButton: {
    padding: 5,
  },
  balanceCard: {
    marginHorizontal: 20,
    marginTop: -20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  amountCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: BRAND_COLOR,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    padding: 0,
  },
  currencyText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  quickAmountButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  quickAmountSelected: {
    backgroundColor: BRAND_COLOR,
  },
  quickAmountText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  quickAmountTextSelected: {
    color: '#fff',
  },
  previewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  netAmountLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  netAmountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  previewNote: {
    fontSize: 12,
    color: '#FF9800',
    marginTop: 10,
    fontStyle: 'italic',
  },
  methodsCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  methodButton: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodSelected: {
    borderColor: BRAND_COLOR,
    backgroundColor: '#E3F2FD',
  },
  methodIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  methodName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  methodTime: {
    fontSize: 11,
    color: '#666',
    marginBottom: 3,
  },
  methodFee: {
    fontSize: 11,
    color: BRAND_COLOR,
    fontWeight: '500',
  },
  termsCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  viewTermsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  viewTermsText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  consentsContainer: {
    marginTop: 10,
  },
  consentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  consentText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    marginLeft: 10,
    lineHeight: 20,
  },
  consentLink: {
    color: BRAND_COLOR,
    textDecorationLine: 'underline',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND_COLOR,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: BRAND_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  notesCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    marginLeft: 10,
    lineHeight: 18,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 5,
  },
  termsContent: {
    padding: 20,
    maxHeight: 500,
  },
  termsHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BRAND_COLOR,
    marginBottom: 20,
    textAlign: 'center',
  },
  termsSection: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 10,
  },
  termsNote: {
    fontSize: 12,
    color: '#FF9800',
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
  },
  termsAcceptButton: {
    backgroundColor: BRAND_COLOR,
    margin: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  termsAcceptText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    padding: 20,
    maxHeight: 500,
  },
  historyItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyMethodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  historyNet: {
    alignItems: 'flex-end',
  },
  historyNetText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  historyFeeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rejectionReason: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  rejectionText: {
    fontSize: 12,
    color: '#D32F2F',
    marginLeft: 8,
    flex: 1,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 5,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  closeHistoryButton: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  closeHistoryText: {
    fontSize: 16,
    color: BRAND_COLOR,
    fontWeight: '500',
  },
  methodModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  methodDetailsCard: {
    paddingBottom: 30,
  },
  methodDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  methodNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    fontStyle: 'italic',
  },
  networkSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  networkOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  networkSelected: {
    backgroundColor: BRAND_COLOR,
  },
  networkText: {
    fontSize: 12,
    color: '#666',
  },
  cryptoSelector: {
    marginBottom: 15,
  },
  cryptoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cryptoSelected: {
    borderColor: BRAND_COLOR,
    backgroundColor: '#E3F2FD',
  },
  cryptoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cryptoIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoSymbol: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cryptoName: {
    fontSize: 12,
    color: '#666',
  },
  closeDetailsButton: {
    backgroundColor: BRAND_COLOR,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  closeDetailsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  successDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  successLabel: {
    fontSize: 14,
    color: '#666',
  },
  successValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  successNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  successButton: {
    backgroundColor: BRAND_COLOR,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WithdrawScreen;