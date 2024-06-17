import React from 'react';
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
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'front',
        drawerStyle: {width: '80%'},
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

const StackIndiansPage = () => {
  return (
    <Stack.Navigator initialRouteName=''>
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.indiansPage}
        component={IndiansPage}
      />
      <Stack.Screen
        options={({navigation}) => ({...headerStyleTransparent})}
        name={screenName.indiansDetails}
        component={IndiansDetails}
      />
    </Stack.Navigator>
  );
};

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
        component={StackIndiansPage}
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
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
