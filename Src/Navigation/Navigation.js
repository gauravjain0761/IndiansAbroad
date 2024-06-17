import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../Screens/HomeScreen';
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import {screenName} from './ScreenConstants';
import IndiansPage from '../Screens/IndiansPage';

const Stack = createStackNavigator();
export default function Navigation() {
  const headerStyleTransparent = {
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerShown: false,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        <Stack.Screen
          options={({navigation}) => ({...headerStyleTransparent})}
          name={screenName.indiansPage}
          component={IndiansPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
