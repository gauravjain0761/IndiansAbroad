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

export default function EventPaymentScreen() {
    const navigation = useNavigation()
    const { user } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const [inputData, setInputData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
    });

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header title={''} showLeft={true} onLeftPress={() => { navigation.goBack() }} />
            <KeyboardAwareScrollView>
                <View style={styles.mainView}>
                    <Text style={styles.labelText}>Provide your bank details</Text>
                    <Input extraStyle={styles.input} value={inputData?.cardName} placeholder={'Card Holder Name'} onChangeText={(text) => setInputData({ ...inputData, cardName: text })} />
                    <Input keyboardType="number-pad" extraStyle={styles.input} value={inputData?.cardNumber} placeholder={'Card Number'} onChangeText={(text) => setInputData({ ...inputData, cardNumber: text })} />
                    <View style={styles.rowInput}>
                        <Input keyboardType="number-pad" extraStyle={styles.input} value={inputData?.expiry} placeholder={'MM/YY'} onChangeText={(text) => setInputData({ ...inputData, expiry: text })} />
                        <Input keyboardType="number-pad" extraStyle={styles.input} value={inputData?.cvv} placeholder={'CVV'} onChangeText={(text) => setInputData({ ...inputData, cvv: text })} />
                    </View>
                </View>
                <View style={styles.priceView}>
                    <View style={styles.priceRow}>
                        <Text style={styles.leftText}>Total</Text>
                        <Text style={styles.ticketText}>£16.50</Text>
                    </View>
                </View>
                <View style={[styles.blueView]}>
                    <CommonButton onPress={() => navigation.navigate(screenName.homeScreen)} title={'Pay'} extraStyle={{ width: 140, height: 45 }} />
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
    labelText: {
        ...FontStyle(15, colors.neutral_900),
    },
    mainView: {
        paddingHorizontal: wp(16)
    },
    input: {
        marginTop: wp(10),
        flex: 1
    },
    rowInput: {
        flexDirection: 'row',
        gap: wp(10)
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
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral_400,
        marginTop: 15,
        paddingHorizontal: wp(16),
        paddingVertical: 5
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingRight: 20
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
})