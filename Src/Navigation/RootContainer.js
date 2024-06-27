import React, { Component } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { Provider, connect, useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Navigation from './Navigation';
import store from '../Redux';
import Loader from '../Components/Loader';
import colors from '../Themes/Colors';
// Styles

export default function RootContainer() {
  const dispatch = useDispatch()
  const { preLoader } = useSelector(e => e.common)

  return (
    <View style={ApplicationStyles.applicationView}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <Navigation />
      {preLoader ? <Loader /> : null}
    </View>
  )
}

const styles = StyleSheet.create({})
