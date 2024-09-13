import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../Components/Header'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import colors from '../../Themes/Colors'
import { Icons } from '../../Themes/Icons'
import { errorToast, FontStyle, ImageStyle, mobileNumberCheck, successToast } from '../../utils/commonFunction'
import { fontname, hp, wp } from '../../Themes/Fonts'
import { screenName } from '../../Navigation/ScreenConstants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../../Components/Input'
import { useDispatch, useSelector } from 'react-redux'
import { onGetSignupCountry, onGetUserInfoApi } from '../../Services/AuthServices'
import CommonButton from '../../Components/CommonButton'
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { dispatchAction } from '../../utils/apiGlobal'
import { IS_LOADING } from '../../Redux/ActionTypes'
import { onBuyPlan, onUpdatePaymentStatus } from '../../Services/PaymentService'

export default function PaymentAddressScreen() {
    const navigation = useNavigation()
    const [address, setaddress] = useState('')
    const [city, setcity] = useState('')
    const [state, setstate] = useState('')
    const [country, setcountry] = useState(undefined)
    const [pincode, setpincode] = useState('')
    const dispatch = useDispatch()
    const { countries, user, planList } = useSelector(e => e.common)
    const { params } = useRoute()

    useEffect(() => {
        dispatch(onGetSignupCountry({}))
    }, [])

    const onPay = () => {
        if (address.trim() == '') {
            errorToast('Please enter a city')
        } else if (!mobileNumberCheck(pincode.trim())) {
            errorToast('Please enter valid pincode')
        } else if (city.trim() == '') {
            errorToast('Please enter a city')
        } else if (state.trim() == '') {
            errorToast('Please enter a state')
        } else if (!country) {
            errorToast('Please select a country')
        } else {
            fetchPaymentSheetParams()
        }
    }

    const fetchPaymentSheetParams = async () => {
        dispatchAction(dispatch, IS_LOADING, true)
        let data = {
            userId: user?._id,
            planId: params?.selectedPlan,
            amount: planList.filter(obj => obj?._id == params?.selectedPlan)[0].sell_price,
            address: address.trim(),
            city: city.trim(),
            state: state.trim(),
            postalcode: pincode.trim(),
            country: country?.countryCode
        }
        let obj = {
            data: data,
            onSuccess: async (res) => {
                const { error, paymentOption } = await initPaymentSheet({
                    merchantDisplayName: "IndiansAbroad",
                    customerId: res?.data?.customer,
                    customerEphemeralKeySecret: res?.data?.ephemeralKey,
                    paymentIntentClientSecret: res?.data?.paymentIntent,
                    allowsDelayedPaymentMethods: true,
                    defaultBillingDetails: {
                        name: user?.first_Name + ' ' + user.last_Name,
                        email: user?.email,
                    },
                });
                if (!error) {
                    openPaymentSheet()
                } else {
                    dispatchAction(dispatch, IS_LOADING, false)
                    errorToast(error.message);
                }
            },
            onFailure: (err) => {
                dispatchAction(dispatch, IS_LOADING, false)
            }
        };
        dispatch(onBuyPlan(obj));
    };

    const openPaymentSheet = async () => {
        const { error, paymentOption } = await presentPaymentSheet();
        if (error) {
            dispatchAction(dispatch, IS_LOADING, false)
            if (error.code !== 'Canceled') {
                errorToast(error.message)
            }
        } else {
            onStripeSuccess()
        }
    }

    const onStripeSuccess = () => {
        let obj = {
            data: { userId: user?._id, planId: params?.selectedPlan, isPaid: true },
            onSuccess: res => {
                successToast('Payment Successful')
                dispatch(onGetUserInfoApi({
                    params: { userId: user._id, },
                    onSuccess: () => { navigation.replace("Home") }
                }))
            },
        }
        dispatch(onUpdatePaymentStatus(obj))
    }

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header title={''} showLeft onLeftPress={() => navigation.goBack()} onlyLabel={'Billing Address'} />
            <KeyboardAwareScrollView extraScrollHeight={50} style={{ marginHorizontal: wp(16), flex: 1, marginTop: 10 }}>
                <Input extraStyle={styles.input} value={address} placeholder={'Address'} onChangeText={text => setaddress(text)} />
                <Input extraStyle={styles.input} keyboardType={'phone-pad'} value={pincode} maxLength={6} placeholder={'Pincode'} onChangeText={(text) => setpincode(text)} />
                <Input extraStyle={styles.input} value={city} onChangeText={(text) => setcity(text)} placeholder={'City'} />
                <Input extraStyle={styles.input} value={state} onChangeText={(text) => setstate(text)} placeholder={'State'} />
                {countries && <Input extraStyle={styles.input} value={country ? country?.countryCode : ''} onChangeText={(text) => { setcountry(text) }} placeholder={'Country'} type={'dropdown'} data={countries} labelField={'countryName'} valueField={'countryCode'} />}
                <CommonButton extraStyle={styles.btn} title={'Pay'} onPress={() => onPay()} />
            </KeyboardAwareScrollView>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    input: { marginTop: 5, marginBottom: 10 },
    btn: {
        marginTop: 20
    }
})