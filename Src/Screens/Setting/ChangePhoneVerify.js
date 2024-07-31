import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import colors from '../../Themes/Colors';
import { fontname, hp, wp } from '../../Themes/Fonts';
import { FontStyle } from '../../utils/commonFunction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Login_Input from '../../Components/Login_Input';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { screenName } from '../../Navigation/ScreenConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../Components/CommonButton';

export default function ChangePhoneVerify() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header title={''} showLeft onLeftPress={() => navigation.goBack()} />
      <KeyboardAwareScrollView style={{ marginHorizontal: wp(16), flex: 1 }}>
        <Text style={styles.headerText}>Change Mobile Number</Text>
        <Text style={styles.headerText1}>
          We've sent the code to your new mobile number. Please enter the code
          to proceed further.
        </Text>
        <Login_Input
          input_container_style={styles.input_con_style}
          placeholder=""
          custom_component={
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              rootStyle={{ justifyContent: 'space-between' }}
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  style={{
                    width: 42,
                    height: 42,
                    marginRight: wp(19),
                    alignSelf: 'center',
                    borderWidth: 5,
                    justifyContent: 'center',
                  }}>
                  <Text
                    key={index}
                    style={[
                      styles.cell,
                      {
                        // borderColor: isFocused ? colors.green34 : '#EEEEEE',
                        color: colors.neutral_900,
                      },
                    ]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : '')}
                  </Text>
                </View>
              )}
            />
          }
        />
        <CommonButton title={'Verify'} onPress={() => { }} extraStyle={[styles.btnView, { marginTop: 25 }]} />
        <TouchableOpacity
          style={[
            styles.btnView,
            { backgroundColor: colors.secondary_500, marginTop: 8 },
          ]}
          onPress={() => { }}>
          <Text style={[styles.btnText, { color: colors.secondary_750 }]}>
            Send again
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: colors.secondary_500,
  },
  itemView: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral_400,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: hp(12),
  },
  imageArrow: {
    transform: [{ rotate: '180deg' }],
    paddingHorizontal: hp(10),
  },
  headerText: {
    ...FontStyle(20, colors.neutral_900, '700'),
  },
  headerText1: {
    marginTop: 15,
    marginBottom: 50,
    ...FontStyle(13, colors.neutral_600, '400'),
  },
  itemText: {
    ...FontStyle(20, colors.neutral_900, '700'),
  },
  inputText: {
    ...FontStyle(16, colors.neutral_900),
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 4,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 20,
  },
  btnView: {
    backgroundColor: colors.buttonBlue,
    marginBottom: 10,
    borderRadius: 5,
    height: 55,
    justifyContent: 'center'
    // width: '48%',
  },
  btnText: {
    textAlign: 'center',
    ...FontStyle(15, colors.white),
    paddingVertical: 12,
  },
  input_con_style: {
    marginLeft: 10,
  },
  cell: {
    ...FontStyle(24, colors.white, '400'),
    borderColor: colors.black,
    color: colors?.black,
    left: 10,
    bottom: 2.5,
  },
});
