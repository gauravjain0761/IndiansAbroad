import { StyleSheet, View, SafeAreaView, Image, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../../Components/Input';
import RenderSteps from '../../Components/RenderSteps';
import ImageCropPicker from 'react-native-image-crop-picker';
import moment from 'moment';
import { currenciesArray } from '../../utils/constants';

export default function CreateEvent3() {
    const navigation = useNavigation()
    const { user } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const [bankName, setbankName] = useState('')
    const [accountNumber, setaccountNumber] = useState('')
    const [code, setcode] = useState('')
    const [firstName, setfirstName] = useState('')
    const [lastName, setlastName] = useState('')
    const [middleName, setmiddleName] = useState('')
    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header title={''} onlyLabel={'Create Event'} showLeft={true} onLeftPress={() => { navigation.goBack() }} />
            <KeyboardAwareScrollView style={{ paddingHorizontal: wp(16) }}>
                <RenderSteps totalStep={4} currentStep={2} />
                <Text style={styles.title}>Provide your bank details to receive payments if you charge any event fee to the attendees.</Text>
                <Input value={bankName} placeholder={'Bank name'} onChangeText={(text) => setbankName(text)} />
                <Input keyboardType="number-pad" extraStyle={{ marginTop: wp(10) }} value={accountNumber} placeholder={'Account Number'} onChangeText={(text) => setaccountNumber(text)} />
                <Input keyboardType="number-pad" extraStyle={{ marginTop: wp(10) }} value={code} placeholder={'Code'} onChangeText={(text) => setcode(text)} />

                <Text style={styles.title}>Bank account holder details</Text>
                <Input value={firstName} placeholder={'First name'} onChangeText={(text) => setfirstName(text)} />
                <Input extraStyle={{ marginTop: wp(10) }} value={middleName} placeholder={'Middle name'} onChangeText={(text) => setmiddleName(text)} />
                <Input extraStyle={{ marginTop: wp(10) }} value={lastName} placeholder={'Last name'} onChangeText={(text) => setlastName(text)} />
                <CommonButton onPress={() => navigation.navigate(screenName.CreateEvent4)} title={'Next'} extraStyle={{ width: 140, height: 45, alignSelf: 'center', marginTop: 20 }} />

            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        ...FontStyle(14, colors.neutral_900, '700'),
        marginTop: 40,
        marginBottom: 5
    },
})