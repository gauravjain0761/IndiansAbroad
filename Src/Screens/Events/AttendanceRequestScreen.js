import { StyleSheet, View, SafeAreaView, Image, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import { FontStyle, ImageStyle } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { screenName } from '../../Navigation/ScreenConstants';
import { wp } from '../../Themes/Fonts';
import { Icons } from '../../Themes/Icons';
import CommonButton from '../../Components/CommonButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../../Components/Input';

export default function AttendanceRequestScreen() {
    const navigation = useNavigation()
    const { user } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const [inputData, setInputData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        numberOfTickets: 2
    });

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header title={''} onlyLabel={'Attendance request'} showLeft={true} onLeftPress={() => { navigation.goBack() }} />
            <KeyboardAwareScrollView>
                <View style={styles.topView}>
                    <Text style={styles.title}>Indian Festival Guide for November 2024 </Text>
                    <Input value={inputData?.firstName} label={'Your first name *'} placeholder={''} onChangeText={(text) => setInputData({ ...inputData, firstName: text })} />
                    <Input value={inputData?.lastName} label={'Your last name *'} placeholder={''} onChangeText={(text) => setInputData({ ...inputData, lastName: text })} />
                    <Input value={inputData?.phone} label={'Phone No *'} placeholder={''} onChangeText={(text) => setInputData({ ...inputData, phone: text })} />
                    <Input value={inputData?.email} label={'Your email *'} placeholder={''} onChangeText={(text) => setInputData({ ...inputData, firstName: text })} />
                    <View style={styles.ticketView}>
                        <Text style={styles.labelText}>No of tickets *</Text>
                        <View style={styles.ticketViewRow}>
                            {inputData.numberOfTickets >= 2 && <TouchableOpacity onPress={() => setInputData({ ...inputData, numberOfTickets: inputData.numberOfTickets - 1 })} style={styles.numberBtn}>
                                <Image source={Icons.minus} style={[ImageStyle(10, 10), { tintColor: colors.white }]} />
                            </TouchableOpacity>}
                            <Text style={styles.ticketText}>{inputData.numberOfTickets < 10 ? '0' + inputData.numberOfTickets : inputData.numberOfTickets}</Text>
                            <TouchableOpacity onPress={() => setInputData({ ...inputData, numberOfTickets: inputData.numberOfTickets + 1 })} style={styles.numberBtn}>
                                <Image source={Icons.add} style={[ImageStyle(12, 12), { tintColor: colors.white }]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.priceView}>
                    <View style={styles.priceRow}>
                        <Text style={styles.leftText}>Price</Text>
                        <Text style={styles.ticketText}>£15.00</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.leftText}>Platform fee</Text>
                        <Text style={styles.ticketText}>£1</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.leftText}>Total (Price+Tax)</Text>
                        <Text style={styles.ticketText}>£16.50</Text>
                    </View>
                </View>
                <View style={[styles.blueView]}>
                    <CommonButton onPress={() => navigation.navigate(screenName.EventPaymentScreen)} title={'Checkout'} extraStyle={{ width: 140, height: 45 }} />
                </View>
                <Text style={[styles.ticketText, { textAlign: 'center' }]}>{'\n'}IndiansAbroad{'\n'}</Text>
                <Text style={[styles.leftText, { textAlign: 'center' }]}>Secure payments via</Text>
                <Text style={[styles.leftText, { textAlign: 'center' }]}>We accept Visa</Text>
                <Text style={[styles.leftText, { textAlign: 'center' }]}>We accept Mastercard</Text>
                <Text style={[styles.leftText, { textAlign: 'center' }]}>We accept Maestro</Text>
                <View style={{ marginBottom: 100 }} />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        ...FontStyle(20, colors.neutral_900, '700'),
        textAlign: 'center',
        marginBottom: 10
    },
    topView: {
        paddingHorizontal: wp(16),
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderBottomColor: colors.neutral_400
    },
    ticketView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        alignItems: 'center',
    },
    labelText: {
        ...FontStyle(15, colors.neutral_900),
    },
    ticketViewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    ticketText: {
        ...FontStyle(14, colors.neutral_900, '700'),
    },
    leftText: {
        ...FontStyle(14, colors.neutral_900),
    },
    numberBtn: {
        backgroundColor: colors.neutral_900,
        height: 28, width: 28, borderRadius: 4, justifyContent: 'center', alignItems: 'center'
    },
    priceView: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral_400,
        borderTopColor: colors.neutral_400,
        marginVertical: 5,
        paddingHorizontal: wp(16),
        paddingVertical: 5
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20
    },
    blueView: {
        backgroundColor: colors.secondary_500,
        paddingHorizontal: wp(20),
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginVertical: 3,
        justifyContent: 'center'
    },
    title2: {

    }
})