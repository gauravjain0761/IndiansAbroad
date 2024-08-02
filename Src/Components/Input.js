import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import { fontname, hp, screen_width, wp } from '../Themes/Fonts';
import RenderUserIcon from './RenderUserIcon';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from 'react-native-element-dropdown';

export default function Input({ value, onChangeText, multiline = false, label, mode = 'date', placeholder, isPassword = false, keyboardType, extraStyle = {}, type, data, valueField, labelField, showCalenderIcon = true, editable = true }) {
  const [passwordHide, setpasswordHide] = useState(true)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    onChangeText(date)
    hideDatePicker();
  };




  return (
    type && type == 'dob' ?
      <View style={extraStyle}>
        {label && <Text style={styles.labelText}>{label}</Text>}
        <TouchableOpacity onPress={showDatePicker} activeOpacity={1} style={styles.inputContainer}>
          <TextInput
            placeholder={placeholder}
            style={styles.inputText}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={colors.neutral_500}
            secureTextEntry={isPassword ? passwordHide : false}
            keyboardType={keyboardType ? keyboardType : 'default'}
            editable={false}
          />
          {showCalenderIcon && <View>
            <Image source={Icons.calender} style={styles.imageView} />
          </View>}
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={mode}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
      :
      type && type == 'dropdown' ?
        <View style={extraStyle}>
          {label && <Text style={styles.labelText}>{label}</Text>}
          <View style={styles.inputContainer}>
            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              itemTextStyle={styles.selectedTextStyle}
              // itemContainerStyle={styles.itemContainerStyle}
              // iconStyle={styles.iconStyle}
              data={data}
              search
              maxHeight={200}
              labelField={labelField}
              valueField={valueField}
              placeholder={placeholder}
              searchPlaceholder="Search..."
              value={value}
              onChange={item => {
                onChangeText(item);
              }}
              // renderLeftIcon={() => (
              //   <Image source={Icons.down_arrow} style={ImageStyle(10, 10)} />
              // )}
              renderItem={(item) => {
                return (
                  <View style={styles.itemContainerStyle}>
                    <Text style={styles.selectedTextStyle}>{item[labelField]}</Text>
                  </View>
                );
              }}
              iconColor={colors.neutral_900}
            />
          </View>
        </View>
        :


        <View style={extraStyle}>
          {label && <Text style={styles.labelText}>{label}</Text>}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={placeholder}
              style={styles.inputText}
              value={value}
              onChangeText={onChangeText}
              placeholderTextColor={colors.neutral_500}
              secureTextEntry={isPassword ? passwordHide : false}
              keyboardType={keyboardType ? keyboardType : 'default'}
              multiline={isPassword ? false : true}
              editable={editable}
            />
            {isPassword &&
              <TouchableOpacity onPress={() => setpasswordHide(!passwordHide)}>
                <Image source={passwordHide ? Icons.view : Icons.hide} style={styles.imageView} />
              </TouchableOpacity>
            }
          </View>

        </View>
  );
}

const styles = StyleSheet.create({
  labelText: {
    ...FontStyle(15, colors.neutral_900),
    // marginHorizontal: wp(20),
    marginBottom: 4,
    marginTop: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    minHeight: 56,
    justifyContent: 'center'
  },
  selectedTextStyle: {
    ...FontStyle(15, colors.neutral_900),
  },
  itemContainerStyle: {
    height: 30,
    paddingHorizontal: 20
    // backgroundColor: 'red',
    // paddingVertical: 0
  },
  placeholderStyle: {
    ...FontStyle(15, colors.neutral_500),
  },
  inputSearchStyle: {
    ...FontStyle(15, colors.neutral_500),
    height: 40
  },
  dropdown: {
    height: 56,
    width: '100%',
    paddingHorizontal: 12,
  },
  inputText: {
    ...FontStyle(15, colors.neutral_900),
    flex: 1,
    // paddingVertical: 4,

    borderRadius: 5,
    paddingHorizontal: 12,
    // paddingVertical: Platform.OS == 'ios' ? 19 : 6,
    // minHeight: 56,
    textAlignVertical: 'center',
    // maxHeight: 150,
    // backgroundColor: 'red',
    padding: 0
    // marginTop:12
  },
  imageView: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginHorizontal: 12,
    height: 56,
    tintColor: colors.primary_500
  }
});
