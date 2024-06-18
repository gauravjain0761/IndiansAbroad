import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../Themes/Colors';

const Loader = ({ transparent }) => {
  return (
    <View style={[styles.modalContainer]}>
      <ActivityIndicator size={'large'} color={colors.white} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  modalContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 11111,
  },
});
