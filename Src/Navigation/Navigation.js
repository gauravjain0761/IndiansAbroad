import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../Screens/Home/HomeScreen';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { screenName } from './ScreenConstants';
import IndiansPage from '../Screens/Indian/IndiansPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DiscussionForum from '../Screens/Discussion/DiscussionForum';
import MyTabbar from '../Components/MyTabbar';
import ChatScreen from '../Screens/Chat/ChatScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';
import CustomDrawer from '../Components/CustomDrawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MyPageScreen from '../Screens/Drawer/MyPageScreen';
import InviteFriendScreen from '../Screens/Drawer/InviteFriendScreen';
import FeedBackForum from '../Screens/Drawer/FeedBackForum';
import Enquiry from '../Screens/Drawer/Enquiry';
import Terms from '../Screens/Drawer/Terms';
import Privacy from '../Screens/Drawer/Privacy';
import IndiansDetails from '../Screens/Indian/IndiansDetails';
import PostDetail from '../Screens/Home/PostDetail';
import PagesDetails from '../Screens/Indian/PagesDetails';
import Setting from '../Screens/Setting/Setting';
import EditProfile from '../Screens/Profile/EditProfile';
import PagesPostDetail from '../Screens/Indian/PagesPostDetail';
import DiscussionForumDetail from '../Screens/Discussion/DiscussionForumDetail';
import CreateDiscussion from '../Screens/Discussion/CreateDiscussion';
import MyConnections from '../Screens/Home/MyConnections';
import CreateGroup from '../Screens/Chat/CreateGroup';
import NotificationScreen from '../Screens/Home/NotificationScreen';
import IndiansPageMore from '../Screens/Indian/IndiansPageMore';
import IndiansPageUpdate from '../Screens/Indian/IndiansPageUpdate';
import ChangePasswordNew from '../Screens/Setting/ChangePasswordNew';
import ChangePasswordVerify from '../Screens/Setting/ChangePasswordVerify';
import ChangePasswordEmail from '../Screens/Setting/ChangePasswordEmail';
import Subscription from '../Screens/Setting/Subscription';
import BlockedUsers from '../Screens/Setting/BlockedUsers';
import ChangePhone from '../Screens/Setting/ChangePhone';
import ChangePhoneVerify from '../Screens/Setting/ChangePhoneVerify';
import ChatDetailsScreen from '../Screens/Chat/ChatDetailsScreen';
import LikesScreen from '../Screens/Home/LikesScreen';
import RepliesComments from '../Screens/Home/RepliesComments';
import SearchScreen from '../Screens/Home/SearchScreen';
import UpdatePostScreen from '../Screens/Home/UpdatePostScreen';
import LoginScreen from '../Screens/Auth/LoginScreen';
import SignupScreen from '../Screens/Auth/SignupScreen';
import OTPScreen from '../Screens/Auth/OTPScreen';
import CompleteProfile from '../Screens/Auth/CompleteProfile';
import Walkthrough from '../Screens/Auth/Walkthrough';
import CompleteProfile2 from '../Screens/Auth/CompleteProfile2';
import PaymentModalScreen from '../Screens/Auth/PaymentModalScreen';
import SplashScreen from '../Screens/Auth/SplashScreen';
import MediaScreen from '../Screens/Home/MediaScreen';
import SecurityScreen from '../Screens/Auth/SecurityScreen';
import Messaging from '../Screens/Chat/Messaging';
import ForgotPassword from '../Screens/Auth/ForgotPassword';
import NewPassword from '../Screens/Auth/NewPassword';
import PasswordChangeSuccess from '../Screens/Auth/PasswordChangeSuccess';
import {
  onBackgroundNotificationPress,
  onMessage,
  onNotificationPress,
} from '../Config/notificationHandle';
import EventDetailScreen from '../Screens/Events/EventDetailScreen';
import AttendanceRequestScreen from '../Screens/Events/AttendanceRequestScreen';
import EventPaymentScreen from '../Screens/Events/EventPaymentScreen';
import CreateEvent1 from '../Screens/Events/CreateEvent1';
import CreateEvent2 from '../Screens/Events/CreateEvent2';
import CreateEvent3 from '../Screens/Events/CreateEvent3';
import CreateEvent4 from '../Screens/Events/CreateEvent4';
import SavedEvents from '../Screens/Events/SavedEvents';
import EventDashboard from '../Screens/Events/EventDashboard';
import EditEventScreen from '../Screens/Events/EditEventScreen';
import ListParticipantsScreen from '../Screens/Events/ListParticipantsScreen';
import AnnouncementScreen from '../Screens/Events/AnnouncementScreen';
import QRScannerScreen from '../Screens/Events/QRScannerScreen';
import QRSuccessScreen from '../Screens/Events/QRSuccessScreen';
import PersonalUserDetailScreen from '../Screens/Chat/PersonalUserDetailScreen';
import GroupMessaging from '../Screens/Chat/GroupMessaging';
import GroupDetailScreen from '../Screens/Chat/GroupDetailScreen';
import GroupMediaScreen from '../Screens/Chat/GroupMediaScreen';
import AddMemberScreen from '../Screens/Chat/AddMemberScreen';
import MediaWithInputScreen from '../Screens/Chat/MediaWithInputScreen';
import { requestNotificationUserPermission } from '../Config/firebaseConfig';
import notifee from '@notifee/react-native';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { dispatchAction } from '../utils/apiGlobal';
import { SET_FCM_TOKEN } from '../Redux/ActionTypes';
import { useDispatch } from 'react-redux';
import PageMessaging from '../Screens/Chat/PageMessaging';
import ChatRoomUsersScreen from '../Screens/Chat/ChatRoomUsersScreen';
import MediaPreviewScreen from '../Screens/Chat/MediaPreviewScreen';
import PaymentAddressScreen from '../Screens/Auth/PaymentAddressScreen';
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'front',
        drawerStyle: { width: '75%' },
        overlayColor: 'rgba(0,0,0,0.6)',
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
        })}
        name={screenName.homeScreen}
        component={MyTabs} />
      <Drawer.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
        })}
        name={screenName.MyPageScreen}
        component={MyPageScreen} />
      <Drawer.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
        })}
        name={screenName.InviteFriendScreen}
        component={InviteFriendScreen}
      />
      <Drawer.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
        })}
        name={screenName.FeedBackForum}
        component={FeedBackForum}
      />
      <Drawer.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
        })}
        name={screenName.Enquiry}
        component={Enquiry}
      />
      <Drawer.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
        })}
        name={screenName.Terms}
        component={Terms}
      />
      <Drawer.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
        })}
        name={screenName.Privacy}
        component={Privacy}
      />
    </Drawer.Navigator>
  );
}

// const StackIndiansPage = () => {
//   return (
//     <Stack.Navigator initialRouteName=''>
//       <Stack.Screen
//         options={({ navigation }) => ({ ...headerStyleTransparent })}
//         name={screenName.indiansPage}
//         component={IndiansPage}
//       />
//       <Stack.Screen
//         options={({ navigation }) => ({ ...headerStyleTransparent })}
//         name={screenName.indiansDetails}
//         component={IndiansDetails}
//       />
//     </Stack.Navigator>
//   );
// };

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabbar {...props} />}
      // initialRouteName={screenName.indiansPage}
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
      })}>
      <Tab.Screen
        options={({ navigation }) => ({ ...headerStyleTransparent, title: 'Home' })}
        name={screenName.homeScreen}
        component={HomeScreen}
      />
      <Tab.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          title: 'Indians',
        })}
        name={screenName.indiansPage}
        component={IndiansPage}
      />
      <Tab.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          title: 'Discussion',
        })}
        name={screenName.discussionForum}
        component={DiscussionForum}
      />
      <Tab.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          title: 'Chatbox',
        })}
        name={screenName.chatScreen}
        component={ChatScreen}
      />
      <Tab.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          title: 'Profile',
        })}
        name={screenName.profileScreen}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

const headerStyleTransparent = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  headerShown: false,
};

const Stack = createStackNavigator();
export default function Navigation() {
  const dispatch = useDispatch()

  useEffect(() => {
    messaging().setAutoInitEnabled(true);
    setNotification();
  }, []);
  const setNotification = async () => {
    let authStatus = await firebase.messaging().hasPermission();

    if (authStatus !== firebase.messaging.AuthorizationStatus.AUTHORIZED) {
      requestPermission();
    }

    if (authStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED) {
      getToken();
    }
  };
  const requestPermission = () => {
    messaging()
      .requestPermission({
        alert: true,
        announcement: false,
        badge: true,
        carPlay: true,
        provisional: false,
        sound: true,
      })
      .then(() => {
        getToken();
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  const getToken = async () => {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          console.log('fcm--', fcmToken);
          dispatchAction(dispatch, SET_FCM_TOKEN, fcmToken)
        } else {
          console.log('[FCMService] User does not have a device token');
        }
      })
      .catch(error => {
        let err = `FCm token get error${error}`;
        console.log(err);
      });
  };


  useEffect(() => {
    onNotificationPress();
    onBackgroundNotificationPress();
    onMessage();
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.SplashScreen} component={SplashScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.LoginScreen} component={LoginScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.SignupScreen} component={SignupScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.OTPScreen} component={OTPScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.SecurityScreen} component={SecurityScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.ForgotPassword} component={ForgotPassword} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.NewPassword} component={NewPassword} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.PasswordChangeSuccess} component={PasswordChangeSuccess} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.CompleteProfile} component={CompleteProfile} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.CompleteProfile2} component={CompleteProfile2} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.PaymentModalScreen} component={PaymentModalScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.PaymentAddressScreen} component={PaymentAddressScreen} />

      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.Walkthrough} component={Walkthrough} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name="Home" component={MyDrawer} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.indiansPage} component={IndiansPage} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.PostDetail} component={PostDetail} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.indiansDetails} component={IndiansDetails} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.pagesDetails} component={PagesDetails} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.Setting} component={Setting} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.EditProfile} component={EditProfile} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.PagesPostDetail} component={PagesPostDetail} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.DiscussionForumDetail} component={DiscussionForumDetail} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.CreateDiscussion} component={CreateDiscussion} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.MyConnections} component={MyConnections} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.CreateGroup} component={CreateGroup} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.NotificationScreen} component={NotificationScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.IndiansPageMore} component={IndiansPageMore} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.IndiansPageUpdate} component={IndiansPageUpdate} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.ChangePasswordEmail} component={ChangePasswordEmail} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.ChangePasswordVerify} component={ChangePasswordVerify} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.ChangePasswordNew} component={ChangePasswordNew} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.Subscription} component={Subscription} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.BlockedUsers} component={BlockedUsers} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.ChangePhone} component={ChangePhone} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.ChangePhoneVerify} component={ChangePhoneVerify} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.ChatDetailsScreen} component={ChatDetailsScreen} />
      <Stack.Screen options={({ navigation }) => ({ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation, headerShown: false, })} name={screenName.LikesScreen} component={LikesScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.RepliesComments} component={RepliesComments} />
      <Stack.Screen options={({ navigation }) => ({ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation, headerShown: false, })} name={screenName.SearchScreen} component={SearchScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.UpdatePostScreen} component={UpdatePostScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.MediaScreen} component={MediaScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.Messaging} component={Messaging} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.EventDetailScreen} component={EventDetailScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.AttendanceRequestScreen} component={AttendanceRequestScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.EventPaymentScreen} component={EventPaymentScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.CreateEvent1} component={CreateEvent1} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.CreateEvent2} component={CreateEvent2} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.CreateEvent3} component={CreateEvent3} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.CreateEvent4} component={CreateEvent4} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.SavedEvents} component={SavedEvents} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.EventDashboard} component={EventDashboard} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.EditEventScreen} component={EditEventScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.ListParticipantsScreen} component={ListParticipantsScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.AnnouncementScreen} component={AnnouncementScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.QRScannerScreen} component={QRScannerScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.QRSuccessScreen} component={QRSuccessScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.PersonalUserDetailScreen} component={PersonalUserDetailScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.GroupMessaging} component={GroupMessaging} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.PageMessaging} component={PageMessaging} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.ChatRoomUsersScreen} component={ChatRoomUsersScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.MediaPreviewScreen} component={MediaPreviewScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.GroupDetailScreen} component={GroupDetailScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.GroupMediaScreen} component={GroupMediaScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.AddMemberScreen} component={AddMemberScreen} />
      <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name={screenName.MediaWithInputScreen} component={MediaWithInputScreen} />


    </Stack.Navigator>
  );
}
