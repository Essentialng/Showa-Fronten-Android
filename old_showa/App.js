/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';




// edate =====================================================================

import Home from './src/apps/edate/screens/Home';
import SplashScreen from './src/apps/globalshared/components/SplashScreen';
import ExploreFeatures from './src/apps/globalshared/components/ExploreFeatures';
import SplashScreentwo from './src/apps/globalshared/components/SplashscreenTwo';
import IdeaMatch from './src/apps/edate/screens/IdeaMatch';
import Interest from './src/apps/edate/screens/Interest';
import Signup from './src/apps/globalshared/auth/Signup';
import ProfileSetup from './src/apps/edate/screens/ProfileSetup';
import MessagesList from './src/apps/edate/screens/MessagesList';
import Chat from './src/apps/edate/screens/Chat';
import EditProfile from './src/apps/edate/screens/EditProfile';
import Profile from './src/apps/edate/screens/Profile';
import SearchMatchUser from './src/apps/edate/screens/SearchMatchUser';
 // subfolder screen Matches
import Admirers from './src/apps/edate/screens/pairs/Admirers';
import Invitations from './src/apps/edate/screens/pairs/Invitations';
import Calls from './src/apps/edate/screens/pairs/Calls';


// e-companion  ========================================================================
import CompanionHome from './src/apps/e-companion/screens/Home';
import CSplash from './src/apps/e-companion/screens/Splash';
import CSetupProfile from './src/apps/e-companion/screens/SetupProfile';
import CUploadPicture from './src/apps/e-companion/screens/UploadPicture';
import CIssues from './src/apps/e-companion/screens/Issues';
import CPricing from './src/apps/e-companion/screens/Pricing';
import CTalkPreference from './src/apps/e-companion/screens/TalkPreference';
import CAvailabilty from './src/apps/e-companion/screens/Availabilty';
import CPaymentSetUp from './src/apps/e-companion/screens/PaymentSetUp';
import CSettings from './src/apps/e-companion/screens/Settings';
import CListenerProfile from './src/apps/e-companion/screens/ListenerProfile';
import CSearchTalkerAndListener from './src/apps/e-companion/screens/SearchTalkerAndListener';
import CDashboard from './src/apps/e-companion/screens/Dashboard';
import Addfund from './src/apps/e-companion/screens/wallet/Addfund';
import CreateEvent from './src/apps/e-companion/screens/events/CreateEvent';
import EventDashboard from './src/apps/e-companion/screens/events/EventDashboard';
import CPaymentMethod from './src/apps/e-companion/screens/wallet/PaymentMethod';
import WalletDashboard from './src/apps/e-companion/screens/wallet/WalletDashboard';


//// suggar-daddy ============================================
import SplashScreenSuggar from './src/apps/suggar-mummy/screens/Splash';
import SuggarHome from './src/apps/suggar-mummy/screens/SuggarDaddyHome';
import ExploreSugar from './src/apps/suggar-mummy/screens/ExploreSugar';
import SugarSetupProfile from './src/apps/suggar-mummy/screens/SetupProfile';
import SugarCompleteProfileSetup from './src/apps/suggar-mummy/screens/CompleteProfileSetup';
import SugarMatchingPreferences from './src/apps/suggar-mummy/screens/MatchingPreferences';


//// e-couple==================================
import Setupsprofiles from './src/apps/e-couples/screens/Setups';
import Welcome from './src/apps/e-couples/screens/Welcome';
import FamilyDetail from './src/apps/e-couples/screens/FamilyDetail';
import WorkDetails from './src/apps/e-couples/screens/WorkDetails';
import Habits from './src/apps/e-couples/screens/Habits';
import Medical from './src/apps/e-couples/screens/Medical';
import Apperance from './src/apps/e-couples/screens/Apperance';
import Preference from './src/apps/e-couples/screens/Preference';
import Sexuality from './src/apps/e-couples/screens/Sexuality';
import CouplesDasboard from './src/apps/e-couples/screens/Dasboard';
import AboutMe from './src/apps/e-couples/screens/AboutMe';
import UploadImages from './src/apps/e-couples/screens/UploadImages';



// new
import Analysis from './src/apps/ai-scanner/screens/Analysis';
import AiResults from './src/apps/ai-scanner/screens/Results';
import ForYou from './src/apps/ai-scanner/screens/Foryou';
import Favorite from './src/apps/ai-scanner/screens/Favorite';
import HistoryScreen from './src/apps/ai-scanner/screens/History';
import AiHome from './src/apps/ai-scanner/screens/Home';
import AiSignup from './src/apps/ai-scanner/screens/Signup';
import AiLogin from './src/apps/ai-scanner/screens/Login';
import AiSplash from './src/apps/ai-scanner/screens/Splash';
import AiAccount from './src/apps/ai-scanner/screens/Account';
import AiProfileInfo from './src/apps/ai-scanner/screens/ProfileInfo';
import AiNotifications from './src/apps/ai-scanner/screens/Notifications';
import AiPrivacy from './src/apps/ai-scanner/screens/Privacy';
import AiPaymentHistory from './src/apps/ai-scanner/screens/PaymentHistory';
import AiForgetPassword from './src/apps/ai-scanner/screens/ForgetPassword';
import AiResetPassword from './src/apps/ai-scanner/screens/ResetPasswordScreen';
import AiPools from './src/apps/ai-scanner/screens/Pools';
import AiPoolsDetails from './src/apps/ai-scanner/screens/PoolsDetails';
import AiTopUpWallet from './src/apps/ai-scanner/screens/TopUpWallet';
// import useDeepLinkHandler from './src/apps/ai-scanner/screens/DeepLinkHandler';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['lordbetai://'],
  config: {
    screens: {
      AiResetPassword: 'reset-password',
    },
  },
};



function App() {
   //useDeepLinkHandler();

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      {/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}  /> */}

      <NavigationContainer linking={linking}>
        {/* <Stack.Navigator initialRouteName="ExploreFeatures">  */}
        <Stack.Navigator initialRouteName="AiLogin">
          <Stack.Screen name="splashScreen" component={SplashScreen} options={{headerShown:false}} />
          <Stack.Screen name="Home" component={Home} options={{headerShown:false}} />
          <Stack.Screen name="splashScreentwo" component={SplashScreentwo} options={{headerShown:false}} />
          <Stack.Screen name="interest" component={Interest} options={{headerShown:false}} />
          <Stack.Screen name="ideaMatch" component={IdeaMatch} options={{headerShown:false}} />
          <Stack.Screen name="signup" component={Signup} options={{headerShown:false}} />
          <Stack.Screen name="profileSetup" component={ProfileSetup} options={{headerShown:false}} />
          <Stack.Screen name="MessagesList" component={MessagesList} options={{headerShown:false}} />
          <Stack.Screen name="Chat" component={Chat} options={{headerShown:false}} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown:false}} />
          <Stack.Screen name="Profile" component={Profile} options={{headerShown:false}} />
          <Stack.Screen name="ExploreFeatures" component={ExploreFeatures} options={{headerShown:false}} />
          <Stack.Screen name="Admirers" component={Admirers} options={{headerShown:false}} />
          <Stack.Screen name="Calls" component={Calls} options={{headerShown:false}} />
          <Stack.Screen name="Invitations" component={Invitations} options={{headerShown:false}} />
          <Stack.Screen name="CompanionHome" component={CompanionHome} options={{headerShown:false}} />
          <Stack.Screen name="CSplash" component={CSplash} options={{headerShown:false}} />
          <Stack.Screen name="CSetupProfile" component={CSetupProfile} options={{headerShown:false}} />
          <Stack.Screen name="CUploadPicture" component={CUploadPicture} options={{headerShown:false}} />
          <Stack.Screen name="CTalkPreference" component={CTalkPreference} options={{headerShown:false}} />
          <Stack.Screen name="CIssues" component={CIssues} options={{headerShown:false}} />
          <Stack.Screen name="CPricing" component={CPricing} options={{headerShown:false}} />
          <Stack.Screen name="CAvailabilty" component={CAvailabilty} options={{headerShown:false}} />
          <Stack.Screen name="WalletDashboard" component={WalletDashboard} options={{headerShown:false}} />
          <Stack.Screen name="Addfund" component={Addfund} options={{headerShown:false}} />
          <Stack.Screen name="CDashboard" component={CDashboard} options={{headerShown:false}} />
          <Stack.Screen name="CPaymentSetUp" component={CPaymentSetUp} options={{headerShown:false}} />
          <Stack.Screen name="CPaymentMethod" component={CPaymentMethod} options={{headerShown:false}} />
          <Stack.Screen name="CListenerProfile" component={CListenerProfile} options={{headerShown:false}} />
          <Stack.Screen name="CSettings" component={CSettings} options={{headerShown:true}} />
          <Stack.Screen name="CSearchTalkerAndListener" component={CSearchTalkerAndListener} options={{headerShown:false}} />
          <Stack.Screen name="EventDashboard" component={EventDashboard} options={{headerShown:false}} />
          <Stack.Screen name="CreateEvent" component={CreateEvent} options={{headerShown:false}} />
          <Stack.Screen name="SearchMatchUser" component={SearchMatchUser} options={{headerShown:false}} />
          <Stack.Screen name="Setupsprofiles" component={Setupsprofiles} options={{headerShown:false}} />
          <Stack.Screen name="Welcome" component={Welcome} options={{headerShown:false}} />
          <Stack.Screen name="WorkDetails" component={WorkDetails} options={{headerShown:false}} />
          <Stack.Screen name="FamilyDetails" component={FamilyDetail} options={{headerShown:false}} />
          <Stack.Screen name="Habits" component={Habits} options={{headerShown:false}} />
          <Stack.Screen name="Medical" component={Medical} options={{headerShown:false}} />
          <Stack.Screen name="Apperance" component={Apperance} options={{headerShown:false}} />
          <Stack.Screen name="Preference" component={Preference} options={{headerShown:false}} />
          <Stack.Screen name="Sexuality" component={Sexuality} options={{headerShown:false}} />
          <Stack.Screen name="CouplesDasboard" component={CouplesDasboard} options={{headerShown:false}} />
          <Stack.Screen name="AboutMe" component={AboutMe} options={{headerShown:false}} />
          <Stack.Screen name="UploadImages" component={UploadImages} options={{headerShown:false}} />





          {/*===================================== Suggar-Daddy Screen ================================================*/}
          <Stack.Screen name="SplashScreenSuggar" component={SplashScreenSuggar} options={{headerShown:false}} />
          <Stack.Screen name="SuggarHome" component={SuggarHome} options={{headerShown:false}} />
          <Stack.Screen name="ExploreSugar" component={ExploreSugar} options={{headerShown:false}} />
          <Stack.Screen name="SugarSetupProfile" component={SugarSetupProfile} options={{headerShown:false}} />
          <Stack.Screen name="SugarCompleteProfileSetup" component={SugarCompleteProfileSetup} options={{headerShown:false}} />
          <Stack.Screen name="SugarMatchingPreferences" component={SugarMatchingPreferences} options={{headerShown:false}} />
          





          {/*===================================== AI Screen ================================================*/}


          <Stack.Screen name="AiSplash" component={AiSplash} options={{headerShown:false}} />
          <Stack.Screen name="AiSignup" component={AiSignup} options={{headerShown:false}} />
          <Stack.Screen name="AiLogin" component={AiLogin} options={{headerShown:false}} />
          <Stack.Screen name="AiHome" component={AiHome} options={{headerShown:false}} />
          <Stack.Screen name="ForYou" component={ForYou} options={{headerShown:false}} />
          <Stack.Screen name="Favorite" component={Favorite} options={{headerShown:false}} />
          <Stack.Screen name="HistoryScreen" component={HistoryScreen} options={{headerShown:false}} />
          <Stack.Screen name="Analysis" component={Analysis} options={{headerShown:false}} />
          <Stack.Screen name="AiResults" component={AiResults} options={{headerShown:false}} />
          <Stack.Screen name="AiAccount" component={AiAccount} options={{headerShown:false}} />
          <Stack.Screen name="AiProfileInfo" component={AiProfileInfo} options={{headerShown:false}} />
          <Stack.Screen name="AiNotifications" component={AiNotifications} options={{headerShown:false}} />
          <Stack.Screen name="AiPrivacy" component={AiPrivacy} options={{headerShown:false}} />
          <Stack.Screen name="AiPaymentHistory" component={AiPaymentHistory} options={{headerShown:false}} />
          <Stack.Screen name="AiForgetPassword" component={AiForgetPassword} options={{headerShown:false}} />
          <Stack.Screen name="AiResetPassword" component={AiResetPassword} options={{headerShown:false}} />
          <Stack.Screen name="AiPools" component={AiPools} options={{headerShown:false}} />
          <Stack.Screen name="AiPoolsDetails" component={AiPoolsDetails} options={{headerShown:false}} />
          <Stack.Screen name="AiTopUpWallet" component={AiTopUpWallet} options={{headerShown:false}} />
          
          
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
