import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../Screens/HomeScreen';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { screenName } from './ScreenConstants';
import IndiansPage from '../Screens/IndiansPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DiscussionForum from '../Screens/DiscussionForum';
import MyTabbar from '../Components/MyTabbar';
import ChatScreen from '../Screens/ChatScreen';
import ProfileScreen from '../Screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator tabBar={props => <MyTabbar {...props} />}
    initialRouteName={screenName.indiansPage}
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        
      })}>
      <Tab.Screen name={screenName.homeScreen} component={HomeScreen} />
      {/* <Tab.Screen name={screenName.indiansPage} component={IndiansPage} /> */}
      <Tab.Screen name={screenName.discussionForum} component={DiscussionForum} />
      <Tab.Screen name={screenName.chatScreen} component={ChatScreen} />
      <Tab.Screen name={screenName.profileScreen} component={ProfileScreen} />
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
        {/* <Stack.Screen options={({ navigation }) => ({ ...headerStyleTransparent })} name="Home" component={MyTabs} /> */}
        <Stack.Screen
          options={({ navigation }) => ({ ...headerStyleTransparent })}
          name={screenName.indiansPage}
          component={IndiansPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
