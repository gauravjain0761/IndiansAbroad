import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Header from '../Components/Header';
import ApplicationStyles from '../Themes/ApplicationStyles';
import {useNavigation} from '@react-navigation/native';
import colors from '../Themes/Colors';
import {Icons} from '../Themes/Icons';
import {FontStyle, ImageStyle} from '../utils/commonFunction';
import {fontname, hp, wp} from '../Themes/Fonts';
import RenderUserIcon from '../Components/RenderUserIcon';
import Input from '../Components/Input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DeleteModal from '../Components/DeleteModal';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfile() {
  const navigation = useNavigation();

  const [inputData, setInputData] = useState({
    firstName: 'Harshal',
    lastName: 'Jadhav',
    dob: '10 April 1999',
    city: 'Satara',
    state: 'Maharshtra',
    country: 'United Kindom',
    cityAbroad: 'London',
    university: 'Fabric Club',
    profession: 'Team Member',
    link: 'www.apple.com',
  });
  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header
        title={'Update Profile'}
        showLeft
        onLeftPress={() => navigation.goBack()}
        logoShow={false}
      />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{flex:1}}>
        <View style={styles.userIcon}>
          <RenderUserIcon height={100} />
        </View>
        <View style={styles.cardView}>
          <Text style={styles.cardText}>In London</Text>
        </View>
        <Input
          placeholder={''}
          value={inputData?.firstName}
          label={'First Name'}
        />
        <Input
          placeholder={''}
          value={inputData?.lastName}
          label={'Last Name'}
        />
        <Input
          placeholder={''}
          value={inputData?.dob}
          label={'Your birthday'}
        />
        <Input placeholder={''} value={inputData?.city} label={'City'} />
        <Input placeholder={''} value={inputData?.state} label={'State'} />
        <Input
          placeholder={''}
          value={inputData?.country}
          label={'Country (In Abroad)'}
        />
        <Input
          placeholder={''}
          value={inputData?.cityAbroad}
          label={'City (In Abroad)'}
        />
        <Input
          placeholder={''}
          value={inputData?.university}
          label={'University/Company'}
        />
        <Input
          placeholder={''}
          value={inputData?.profession}
          label={'Profession'}
        />
        <Input
          placeholder={''}
          value={inputData?.link}
          label={'Link(If Any)'}
        />
        <TouchableOpacity style={[styles.btnView, {marginTop: 20}]}>
          <Text style={styles.btnText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDeleteModal(true)}
          style={[styles.btnView, {backgroundColor: colors.danger_500}]}>
          <Text style={styles.btnText}>Delete Account</Text>
        </TouchableOpacity>
        <DeleteModal
          isVisible={deleteModal}
          onClose={() => {
            setDeleteModal(false);
          }}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userIcon: {
    alignSelf: 'center',
  },
  cardView: {
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 4,
    marginHorizontal: wp(20),
    borderRadius: 5,
    marginTop: 12,
    marginBottom: 14,
  },
  cardText: {
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 11, colors.neutral_500),
  },
  btnView: {
    backgroundColor: colors.buttonBlue,
    marginHorizontal: wp(20),
    marginBottom: 10,
    borderRadius: 5,
  },
  btnText: {
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 15, colors.white),
    paddingVertical: 16,
  },
});
