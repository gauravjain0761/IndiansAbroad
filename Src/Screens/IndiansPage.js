import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

export default function IndiansPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({type: 'PRE_LOADER', payload: {preLoader: true}});
  }, []);

  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
}
