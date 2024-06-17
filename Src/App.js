import './Config';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import RootContainer from './Navigation/RootContainer';
import {View, Text, TextInput} from 'react-native';
import ApplicationStyles from './Themes/ApplicationStyles';

function App() {
  useEffect(() => {
    // LogBox.ignoreAllLogs(true);
    // LogBox.ignoreLogs([
    //   'VirtualizedLists should never be nested',
    //   'Cannot update a component from inside the function',
    //   'You specified `onScroll` on a <ScrollView> but not `scrollEventThrottle`.',
    // ]);
    // if (!__DEV__) {
    //   console.log = () => {};
    // }
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
  }, []);

  return (
    <View style={ApplicationStyles.applicationView}>
      <RootContainer />
    </View>
  );
}
export default App;
