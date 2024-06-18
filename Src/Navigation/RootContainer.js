import React, { Component } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { Provider, connect, useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Navigation from './Navigation';
import store from '../Redux';
import Loader from '../Components/Loader';
// Styles

export default function RootContainer() {
  const dispatch = useDispatch()
  const { preLoader } = useSelector(e => e.common)

  return (
    <View style={ApplicationStyles.applicationView}>
      <StatusBar barStyle="light-content" />
      <Navigation />
      {preLoader ? <Loader /> : null}
    </View>
  )
}

const styles = StyleSheet.create({})
