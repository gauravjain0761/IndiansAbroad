import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import { errorToast, FontStyle, ImageStyle } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { screenName } from '../../Navigation/ScreenConstants';
import { SCREEN_WIDTH, wp } from '../../Themes/Fonts';
import { Icons } from '../../Themes/Icons';
import CommonButton from '../../Components/CommonButton';
import ImageCropPicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../../Components/Input';
import { currenciesArray } from '../../utils/constants';
import RenderUserIcon from '../../Components/RenderUserIcon';
import { announcementCountAction, announcementCreateAction } from '../../Services/PostServices';

export default function AnnouncementScreen() {
  const navigation = useNavigation();
  const { user } = useSelector(e => e.common);
  const dispatch = useDispatch();
  const [discription, setdiscription] = useState('');
  const [count, setCount] = useState(0);

  const { activeEvent } = useSelector(e => e.common);

  const announcementCount = () => {
    let obj = {
      data: {
        event_id: activeEvent?._id,
      },
      onSuccess: res => {

        setCount(res?.count)
      },
      onFailure: err => {
        errorToast(err.data?.msg);
      },
    };
    dispatch(announcementCountAction(obj));
  }

  useEffect(() => {
    announcementCount()
  }, [])

  const onNextPress = () => {
    if (discription.trim().length == 0) {
      errorToast('Please enter your announcements');
    } else {
      let obj = {
        data: {
          event_id: activeEvent?._id,
          announcementContent: discription,
        },
        onSuccess: res => {
          setdiscription("")
          announcementCount()
        },
        onFailure: err => {
          errorToast(err.data?.msg);
        },
      };
      dispatch(announcementCreateAction(obj));
    }
  };

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header
        title={''}
        showLeft={true}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.row}>
        <Image
          source={Icons.megaphone}
          style={[ImageStyle(26, 26), { tintColor: colors.primary_500 }]}
        />
        <Text style={styles.totalText}>Announcement</Text>
      </View>
      <View style={ApplicationStyles.flex}>
        <KeyboardAvoidingView
          {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}>
          <ScrollView>
            <Text style={styles.titleHeader}>
              This announcement will be sent to all the registered users for
              this event. You have total 5 announcements, so use it accordingly.
            </Text>
            <TextInput
              placeholder={
                'Type what you would like your registered users to know.'
              }
              style={styles.inputText}
              multiline={true}
              placeholderTextColor={colors.neutral_500}
              value={discription}
              onChangeText={text => setdiscription(text)}
            />
            <Text style={styles.remainText}>{`Announcements remaining (${count}/5)`}</Text>
            <CommonButton
              onPress={() => onNextPress()}
              title={'Send'}
              extraStyle={{
                width: 140,
                height: 45,
                alignSelf: 'center',
                marginTop: 20,
              }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp(16),
    gap: 10,
  },
  totalText: {
    flex: 1,
    ...FontStyle(16, colors.primary_500, '700'),
  },
  titleHeader: {
    ...FontStyle(14, colors.neutral_900, '700'),
    marginHorizontal: wp(10),
    marginTop: 15,
    marginBottom: 30,
  },
  inputText: {
    ...FontStyle(14, colors.neutral_900),
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 4,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 192,
    textAlignVertical: 'top',
    paddingTop: 10,
    marginHorizontal: wp(16),
  },
  remainText: {
    ...FontStyle(12, colors.neutral_900, '700'),
    textAlign: 'right',
    marginHorizontal: wp(16),
  },
});
