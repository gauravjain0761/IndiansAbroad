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
export default function CreateEvent2() {
    const navigation = useNavigation()
    const { user } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const [type, settype] = useState('onSite')
    const [link, setlink] = useState('')
    const [starts, setstarts] = useState({ date: '', start: '', end: '' })
    const [ends, setends] = useState({ date: '', start: '', end: '' })
    const [currency, setcurrency] = useState(undefined)
    const [price, setprice] = useState('')
    const [available, setavailable] = useState('')

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header title={''} onlyLabel={'Create Event'} showLeft={true} onLeftPress={() => { navigation.goBack() }} />
            <KeyboardAwareScrollView extraScrollHeight={50} style={{ paddingHorizontal: wp(16) }}>
                <RenderSteps totalStep={4} currentStep={2} />
                <View style={[ApplicationStyles.row, { gap: 20 }]}>
                    <TouchableOpacity onPress={() => settype('onSite')} style={styles.radioView}>
                        {type == 'onSite' ? <Image source={Icons.check} style={ImageStyle(20, 20)} /> : <View style={styles.unSelected} />}
                        <Text style={styles.radioText}>On site</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => settype('online')} style={styles.radioView}>
                        {type == 'online' ? <Image source={Icons.check} style={ImageStyle(20, 20)} /> : <View style={styles.unSelected} />}
                        <Text style={styles.radioText}>Online</Text>
                    </TouchableOpacity>
                </View>
                <Input extraStyle={{ marginTop: 5 }} value={link} placeholder={'Venue / URL Link'} onChangeText={(text) => setlink(text)} />
                <Text style={styles.title}>Starts</Text>
                <View style={styles.rowViewDate}>
                    <Input extraStyle={{ flex: 1 }} showCalenderIcon={false} type={'dob'} value={starts.date !== '' ? moment(starts.date).format('MMM,DD YYYY') : ''} onChangeText={(text) => setstarts({ ...starts, date: text })} placeholder={'Choose Date'} />
                    <Input extraStyle={{ width: '25%' }} showCalenderIcon={false} mode={'time'} type={'dob'} value={starts.start !== '' ? moment(starts.start).format('HH:mm') : ''} onChangeText={(text) => setstarts({ ...starts, start: text })} placeholder={'Time'} />
                    <Input extraStyle={{ width: '25%' }} showCalenderIcon={false} mode={'time'} type={'dob'} value={starts.end !== '' ? moment(starts.end).format('HH:mm') : ''} onChangeText={(text) => setstarts({ ...starts, end: text })} placeholder={'Time'} />
                </View>
                <Text style={[styles.title, { marginTop: 20 }]}>Ends</Text>
                <View style={styles.rowViewDate}>
                    <Input extraStyle={{ flex: 1 }} showCalenderIcon={false} type={'dob'} value={ends.date !== '' ? moment(ends.date).format('MMM,DD YYYY') : ''} onChangeText={(text) => setends({ ...ends, date: text })} placeholder={'Choose Date'} />
                    <Input extraStyle={{ width: '25%' }} showCalenderIcon={false} mode={'time'} type={'dob'} value={ends.start !== '' ? moment(ends.start).format('HH:mm') : ''} onChangeText={(text) => setends({ ...ends, start: text })} placeholder={'Time'} />
                    <Input extraStyle={{ width: '25%' }} showCalenderIcon={false} mode={'time'} type={'dob'} value={ends.end !== '' ? moment(ends.end).format('HH:mm') : ''} onChangeText={(text) => setends({ ...ends, end: text })} placeholder={'Time'} />
                </View>
                <Text style={styles.title}>Event fee</Text>
                <View style={styles.rowViewDate}>
                    <Input extraStyle={{ width: '35%' }} value={currency ? currency : ''} onChangeText={(text) => { setcurrency(text.code) }} placeholder={'Currency'} type={'dropdown'} data={currenciesArray} labelField={'code'} valueField={'code'} />
                    <Input keyboardType="number-pad" extraStyle={{ flex: 1 }} value={price} placeholder={'Price per ticket'} onChangeText={(text) => setprice(text)} />
                </View>
                <Input keyboardType="number-pad" extraStyle={{ flex: 1, marginTop: wp(10) }} value={available} placeholder={'Number of tickets available'} onChangeText={(text) => setavailable(text)} />
                <CommonButton onPress={() => navigation.navigate(screenName.CreateEvent3)} title={'Next'} extraStyle={{ width: 140, height: 45, alignSelf: 'center', marginTop: 20 }} />

            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    radioView: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        marginTop: 40
    },
    unSelected: {
        height: 20, width: 20, borderColor: colors.neutral_500, borderWidth: 1, borderRadius: 10
    },
    radioText: {
        ...FontStyle(14, colors.neutral_900, '700')
    },
    title: {
        ...FontStyle(14, colors.neutral_900, '700'),
        marginTop: 40,
        marginBottom: 5
    },
    rowViewDate: {
        flexDirection: 'row',
        gap: wp(10)
    }
})