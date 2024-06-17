import React, {Component} from 'react';
import {View, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Navigation from './Navigation';
// Styles
class RootContainer extends Component {
  componentDidMount() {}
  render() {
    return (
      <View style={ApplicationStyles.applicationView}>
        <StatusBar barStyle="light-content" />
        <Navigation />
      </View>
    );
  }
}
// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = dispatch => ({});
export default connect(null, mapDispatchToProps)(RootContainer);
