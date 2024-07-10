import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../Screens/HomeScreen';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {screenName} from './ScreenConstants';
import IndiansPage from '../Screens/IndiansPage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DiscussionForum from '../Screens/DiscussionForum';
import MyTabbar from '../Components/MyTabbar';
import ChatScreen from '../Screens/ChatScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import CustomDrawer from '../Components/CustomDrawer';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MyPageScreen from '../Screens/MyPageScreen';
import InviteFriendScreen from '../Screens/InviteFriendScreen';
import FeedBackForum from '../Screens/FeedBackForum';
import Enquiry from '../Screens/Enquiry';
import Terms from '../Screens/Terms';
import Privacy from '../Screens/Privacy';
import IndiansDetails from '../Screens/IndiansDetails';
import PostDetail from '../Screens/PostDetail';
import PagesDetails from '../Screens/PagesDetails';
import Setting from '../Screens/Setting';
import EditProfile from '../Screens/EditProfile';
import PagesPostDetail from '../Screens/PagesPostDetail';
import DiscussionForumDetail from '../Screens/DiscussionForumDetail';
import CreateDiscussion from '../Screens/CreateDiscussion';
import MyConnections from '../Screens/MyConnections';
import CreateGroup from '../Screens/CreateGroup';
import NotificationScreen from '../Screens/NotificationScreen';
import IndiansPageMore from '../Screens/IndiansPageMore';
import IndiansPageUpdate from '../Screens/IndiansPageUpdate';
import ChangePasswordNew from '../Screens/Setting/ChangePasswordNew';
import ChangePasswordVerify from '../Screens/Setting/ChangePasswordVerify';
import ChangePasswordEmail from '../Screens/Setting/ChangePasswordEmail';
import Subscription from '../Screens/Setting/Subscription';
import BlockedUsers from '../Screens/Setting/BlockedUsers';
import ChangePhone from '../Screens/Setting/ChangePhone';
import ChangePhoneVerify from '../Screens/Setting/ChangePhoneVerify';
import ChatDetailsScreen from '../Screens/ChatDetailsScreen';
import LikesScreen from '../Screens/LikesScreen';
import RepliesComments from '../Screens/RepliesComments';
import SearchScreen from '../Screens/SearchScreen';
import UpdatePostScreen from '../Screens/UpdatePostScreen';
import LoginScreen from '../Screens/LoginScreen';
import SignupScreen from '../Screens/SignupScreen';
import OTPScreen from '../Screens/OTPScreen';
import CompleteProfile from '../Screens/CompleteProfile';
import Walkthrough from '../Screens/Walkthrough';
import CompleteProfile2 from '../Screens/CompleteProfile2';
import PaymentModalScreen from '../Screens/PaymentModalScreen';
import SplashScreen from '../Screens/SplashScreen';
import MediaScreen from '../Screens/MediaScreen';
import SecurityScreen from '../Screens/SecurityScreen';
import Messaging from '../Screens/Setting/Messaging';
import ForgotPassword from '../Screens/ForgotPassword';
import NewPassword from '../Screens/NewPassword';
import PasswordChangeSuccess from '../Screens/PasswordChangeSuccess';
import {
  onBackgroundNotificationPress,
  onMessage,
  onNotificationPress,
} from '../Config/notificationHandle';
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'front',
        drawerStyle: {width: '75%'},
        overlayColor: 'rgba(0,0,0,0.6)',
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        options={({navigation}) => ({
          ...headerStyleTransparent,
        })}
        name={screenName.homeScreen}
        component={MyTabs}
      />
      <Drawer.Screen
        options={({navigation}) => ({
          ...headerStyleTransparent,
        })}
        name={screenName.MyPageScreen}
        component={MyPageScreen}
      />
      <Drawer.Screen
        options={({navigation}) => ({
          ...headerStyleTransparent,
        })}
        name={screenName.InviteFriendScreen}
        component={InviteFriendScreen}
      />
      <Drawer.Screen
        options={({navigation}) => ({
          ...headerStyleTransparent,
        })}
        name={screenName.FeedBackForum}
        component={FeedBackForum}
      />
      <Drawer.Screen
        options={({navigation}) => ({
          ...headerStyleTransparent,
        })}
        name={screenName.Enquiry}
        component={Enquiry}
      />
      <Drawer.Screen
        options={({navigation}) => ({
          ...headerStyleTransparent,
        })}
        name={screenName.Terms}
        component={Terms}
      />
      <Drawer.Screen
        options={({navigation}) => ({
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
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
      })}>
      <Tab.Screen
        options={({navigation}) => ({...headerStyleTransparent, title: 'Home'})}
        name={screenName.homeScreen}
        component={HomeScreen}
      />
      <Tab.Screen
        options={({navigation}) => ({
          ...headerStyleTransparent,
          title: 'Indians',
        })}
        name={screenName.indiansPage}
        component={IndiansPage}
      />
      <Tab.Screen
        options={({navigation}) => ({
          ...headerStyleTransparent,
          title: 'Discussion',
        })}
        name={screenName.discussionForum}
        component={DiscussionForum}
      />
      <Tab.Screen
        options={({navigation}) => ({
          ...headerStyleTransparent,
          title: 'Chatbox',
        })}
        name={screenName.chatScreen}
        component={ChatScreen}
      />
      <Tab.Screen
        options={({navigation}) => ({
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
  useEffect(() => {
    onNotificationPress();
    onBackgroundNotificationPress();
    onMessage();
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.SplashScreen}
        component={SplashScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.LoginScreen}
        component={LoginScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.SignupScreen}
        component={SignupScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.OTPScreen}
        component={OTPScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.SecurityScreen}
        component={SecurityScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.ForgotPassword}
        component={ForgotPassword}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.NewPassword}
        component={NewPassword}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.PasswordChangeSuccess}
        component={PasswordChangeSuccess}
      />

      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.CompleteProfile}
        component={CompleteProfile}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.CompleteProfile2}
        component={CompleteProfile2}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.PaymentModalScreen}
        component={PaymentModalScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.Walkthrough}
        component={Walkthrough}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name="Home"
        component={MyDrawer}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.indiansPage}
        component={IndiansPage}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.PostDetail}
        component={PostDetail}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.indiansDetails}
        component={IndiansDetails}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.pagesDetails}
        component={PagesDetails}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.Setting}
        component={Setting}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.EditProfile}
        component={EditProfile}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.PagesPostDetail}
        component={PagesPostDetail}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.DiscussionForumDetail}
        component={DiscussionForumDetail}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.CreateDiscussion}
        component={CreateDiscussion}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.MyConnections}
        component={MyConnections}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.CreateGroup}
        component={CreateGroup}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.NotificationScreen}
        component={NotificationScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.IndiansPageMore}
        component={IndiansPageMore}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.IndiansPageUpdate}
        component={IndiansPageUpdate}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.ChangePasswordEmail}
        component={ChangePasswordEmail}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.ChangePasswordVerify}
        component={ChangePasswordVerify}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.ChangePasswordNew}
        component={ChangePasswordNew}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.Subscription}
        component={Subscription}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.BlockedUsers}
        component={BlockedUsers}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.ChangePhone}
        component={ChangePhone}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.ChangePhoneVerify}
        component={ChangePhoneVerify}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.ChatDetailsScreen}
        component={ChatDetailsScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.LikesScreen}
        component={LikesScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.RepliesComments}
        component={RepliesComments}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.SearchScreen}
        component={SearchScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.UpdatePostScreen}
        component={UpdatePostScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.MediaScreen}
        component={MediaScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.Messaging}
        component={Messaging}
      />
    </Stack.Navigator>
  );
}
