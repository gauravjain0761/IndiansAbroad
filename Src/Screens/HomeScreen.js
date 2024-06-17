import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';

export default function HomeScreen() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'PRE_LOADER', payload: { preLoader: true } });
  }, []);

  return (
    <View style={ApplicationStyles.applicationView}>
      <Header title={'IndiansAbroad'} showRight={true} isHome={true} />
    </View>
  );
}
