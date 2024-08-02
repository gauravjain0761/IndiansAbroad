import { StyleSheet, View, SafeAreaView, Image, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import { FontStyle } from '../../utils/commonFunction';
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

export default function EditEventScreen() {
    const navigation = useNavigation()
    const { user } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const [image, setimage] = useState(undefined)
    const [eventTitle, seteventTitle] = useState('')
    const [contact, setcontact] = useState('')
    const [discription, setdiscription] = useState('')
    const [link, setlink] = useState('')
    const [starts, setstarts] = useState({ date: '', start: '', end: '' })
    const [ends, setends] = useState({ date: '', start: '', end: '' })
    const [currency, setcurrency] = useState(undefined)
    const [price, setprice] = useState('')
    const [available, setavailable] = useState('')

    const onSelectImage = () => {
        ImageCropPicker.openPicker({
            mediaType: 'photo',
            height: 169,
            width: SCREEN_WIDTH - wp(32),
            cropping: true
        }).then(image => {
            setimage(image)
        }).catch(error => { console.log('err---', error); });
    }


    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header onRightPress={() => navigation.navigate(screenName.EditEventScreen)} title={''} onlyLabel={'Edit Event'} showLeft={true} onLeftPress={() => { navigation.goBack() }} />
            <KeyboardAwareScrollView extraScrollHeight={50} style={{ paddingHorizontal: wp(16) }}>
                <TouchableOpacity onPress={() => onSelectImage()}>
                    {image ?
                        <Image source={{ uri: image.path }} style={styles.uploadImage} />
                        :
                        <View style={styles.uploadView}>
                            <Image source={Icons.photoUpload} style={styles.photoUpload} />
                            <Text style={styles.addText}>Add Photo</Text>
                        </View>
                    }
                </TouchableOpacity>
                <Input label={'Event Title'} extraStyle={styles.input} value={eventTitle} placeholder={'Your Event Title'} onChangeText={(text) => seteventTitle(text)} />
                <Input label={'Contact Details'} keyboardType={'phone-pad'} extraStyle={styles.input} value={contact} placeholder={'Mobile No./Email ID'} onChangeText={(text) => setcontact(text)} />
                <Text style={styles.labelText}>{"Event's Description"}</Text>
                <TextInput placeholder={'Description'} style={[styles.inputText, { height: 192, textAlignVertical: 'top', paddingTop: 10 }]} multiline={true} placeholderTextColor={colors.neutral_500} value={discription} onChangeText={(text) => setdiscription(text)} />
                <Input label={"Event's  Venue"} value={link} placeholder={'Venue / URL Link'} onChangeText={(text) => setlink(text)} />
                <Text style={styles.labelText}>Starts</Text>
                <View style={styles.rowViewDate}>
                    <Input extraStyle={{ flex: 1 }} showCalenderIcon={false} type={'dob'} value={starts.date !== '' ? moment(starts.date).format('MMM,DD YYYY') : ''} onChangeText={(text) => setstarts({ ...starts, date: text })} placeholder={'Choose Date'} />
                    <Input extraStyle={{ width: '25%' }} showCalenderIcon={false} mode={'time'} type={'dob'} value={starts.start !== '' ? moment(starts.start).format('HH:mm') : ''} onChangeText={(text) => setstarts({ ...starts, start: text })} placeholder={'Time'} />
                    <Input extraStyle={{ width: '25%' }} showCalenderIcon={false} mode={'time'} type={'dob'} value={starts.end !== '' ? moment(starts.end).format('HH:mm') : ''} onChangeText={(text) => setstarts({ ...starts, end: text })} placeholder={'Time'} />
                </View>
                <Text style={[styles.labelText]}>Ends</Text>
                <View style={styles.rowViewDate}>
                    <Input extraStyle={{ flex: 1 }} showCalenderIcon={false} type={'dob'} value={ends.date !== '' ? moment(ends.date).format('MMM,DD YYYY') : ''} onChangeText={(text) => setends({ ...ends, date: text })} placeholder={'Choose Date'} />
                    <Input extraStyle={{ width: '25%' }} showCalenderIcon={false} mode={'time'} type={'dob'} value={ends.start !== '' ? moment(ends.start).format('HH:mm') : ''} onChangeText={(text) => setends({ ...ends, start: text })} placeholder={'Time'} />
                    <Input extraStyle={{ width: '25%' }} showCalenderIcon={false} mode={'time'} type={'dob'} value={ends.end !== '' ? moment(ends.end).format('HH:mm') : ''} onChangeText={(text) => setends({ ...ends, end: text })} placeholder={'Time'} />
                </View>
                <Text style={styles.labelText}>Event fee</Text>
                <View style={styles.rowViewDate}>
                    <Input extraStyle={{ width: '35%' }} value={currency ? currency : ''} onChangeText={(text) => { setcurrency(text.code) }} placeholder={'Currency'} type={'dropdown'} data={currenciesArray} labelField={'code'} valueField={'code'} />
                    <Input keyboardType="number-pad" extraStyle={{ flex: 1 }} value={price} placeholder={'Price per ticket'} onChangeText={(text) => setprice(text)} />
                </View>
                <Input keyboardType="number-pad" extraStyle={{ flex: 1, marginTop: wp(10) }} value={available} placeholder={'Number of tickets available'} onChangeText={(text) => setavailable(text)} />
                <CommonButton onPress={() => navigation.goBack()} title={'Save'} extraStyle={{ width: 140, height: 45, alignSelf: 'center', marginTop: 20 }} />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    uploadView: {
        borderWidth: 1,
        borderColor: colors.neutral_500,
        backgroundColor: colors.inputBg,
        alignItems: 'center',
        borderRadius: 4,
        height: 169,
        alignItems: 'center',
        justifyContent: 'center'
    },
    photoUpload: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
        tintColor: colors.neutral_500
    },
    addText: {
        ...FontStyle(15, colors.neutral_500),
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
        height: 56,
    },
    uploadImage: {
        height: 169,
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 4
    },
    labelText: {
        ...FontStyle(15, colors.neutral_900),
        // marginHorizontal: wp(20),
        marginBottom: 4,
        marginTop: 8,
    },
    rowViewDate: {
        flexDirection: 'row',
        gap: wp(10)
    }
})