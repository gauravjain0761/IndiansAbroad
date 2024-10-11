import { FlatList, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import { Icons } from '../../Themes/Icons'
import colors from '../../Themes/Colors'
import { FontStyle, ImageStyle } from '../../utils/commonFunction'
import { hp, wp } from '../../Themes/Fonts'
import CommonButton from '../../Components/CommonButton'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { onGetPlanList, onUpdateReceipt } from '../../Services/PaymentService'
import NoDataFound from '../../Components/NoDataFound'
import { screenName } from '../../Navigation/ScreenConstants'
import {
    requestPurchase, useIAP, validateReceiptIos, purchaseUpdatedListener,
    purchaseErrorListener,
} from 'react-native-iap';
import * as RNIap from "react-native-iap";
import { dispatchAction } from '../../utils/apiGlobal'
import { IS_LOADING } from '../../Redux/ActionTypes'
import { onGetUserInfoApi } from '../../Services/AuthServices'
var plan = undefined
export default function PaymentModalScreen() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { user, planList } = useSelector(e => e.common)
    const [selectedPlan, setselectedPlan] = useState(undefined)
    const [products, setProducts] = useState(undefined);
    const [isProcessing, setIsProcessing] = useState(false);

    // const restoreSubscriptions = async () => {
    //     try {
    //         const purchases = await RNIap.getAvailablePurchases();
    //         // console.log('ppp---', purchases)
    //         // Handle restored purchases
    //     } catch (error) {
    //         console.error('Error restoring purchases:', error);
    //     }
    // };
    console.log(selectedPlan)

    useEffect(() => {
        if (Platform.OS == 'ios') {
            // restoreSubscriptions()
            dispatchAction(dispatch, IS_LOADING, false)
            RNIap.initConnection().then(() => {
                RNIap.getProducts({ skus: ['com.ia.month', 'com.ia.year'] })
                    .then((res) => {
                        console.log('here--', res)
                        setProducts(res[0]);
                        dispatchAction(dispatch, IS_LOADING, false)
                    })
                    .catch((err) => {
                        console.log("err--", err);
                    });
            });
        }

        const subscription = purchaseUpdatedListener(async (purchase) => {
            console.log('-------', purchase)
            const { transactionId, transactionReceipt, productId } = purchase;
            // let plan = planList.filter(obj => obj._id == selectedPlan)
            // console.log('plan--', plan)
            // if (plan.length > 0) {
            if (isProcessing) return; // Skip if already processing a purchase
            setIsProcessing(true);
            if (transactionId && transactionReceipt) {
                try {
                    const receipt = purchase.transactionReceipt;
                    if (receipt) {
                        onPurchasePlan(purchase, selectedPlan);
                    }
                } catch (error) {
                    console.log('Error finishing transaction:', error);
                }
            } else {
                console.log('Transaction ID or receipt is missing');
            }
            setIsProcessing(false);
            // if (purchase.productId == 'com.ia.month') {
            // dispatchAction(dispatch, IS_LOADING, false)
            // try {
            //     console.log(purchase.transactionId)
            //     await RNIap.finishTransaction(purchase);
            //     let res = await RNIap.validateReceiptIos(purchase.transactionReceipt, true)
            //     console.log('res--', res)
            // } catch (error) {
            //     console.warn('Failed to finish transaction:', error);
            // }
            // }
        });
        const subscriptionError = purchaseErrorListener((error) => {
            // if (error.productId == 'com.ia.month') {
            console.log('purchaase error:', error);
            dispatchAction(dispatch, IS_LOADING, false)
            // }
        });
        return () => {
            subscription.remove();
            subscriptionError.remove();
            RNIap.endConnection();
        };
    }, [])

    const onPurchasePlan = (purchase, planId) => {
        console.log('ayaa', selectedPlan)
        let obj = {
            data: {
                receipt: purchase.transactionReceipt,
                planId: plan

            },
            onSuccess: async (res) => {
                await RNIap.finishTransaction({ purchase });
                console.log('api res--')
                dispatch(onGetUserInfoApi({
                    params: { userId: user._id, },
                    onSuccess: () => { navigation.replace("Home") }
                }))

            }
        }
        dispatch(onUpdateReceipt(obj))
    }

    const onSubscribeClick = () => {
        if (Platform.OS == 'ios') {
            let plan = planList.filter(obj => obj._id == selectedPlan)
            if (plan.length > 0) {
                console.log('plan[0].applePlanId--', plan[0].applePlanId)
                dispatchAction(dispatch, IS_LOADING, true)
                RNIap.requestSubscription({ sku: plan[0].applePlanId }).then(async (res) => {
                    // console.log('res requestSubscription--', res)
                    // if (res.transactionReceipt) {
                    //     try {
                    //         const receipt = res.transactionReceipt;
                    //         if (receipt) {
                    //             onPurchasePlan(res);
                    //         }
                    //     } catch (error) {
                    //         console.log('Error finishing transaction:', error);
                    //     }
                    // } else {
                    //     console.log('Transaction ID or receipt is missing');
                    // }
                }).catch(error => {
                    console.log('error requestSubscription----', error)
                    dispatchAction(dispatch, IS_LOADING, false)
                });
            }



        } else {
            navigation.navigate(screenName.PaymentAddressScreen, { selectedPlan: selectedPlan })
        }
    }


    useEffect(() => {
        dispatch(onGetPlanList())
    }, [])

    useEffect(() => {
        if (planList && planList.length > 0) {
            setselectedPlan(planList[0]?._id)
            plan = planList[0]?._id
        }
    }, [planList])

    return (
        <View style={ApplicationStyles.applicationView}>
            {/* <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}> */}
            <SafeAreaView style={ApplicationStyles.flex}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.closeStyle}>
                    <Image source={Icons.closeRound} style={[ImageStyle(30, 30), { tintColor: colors.black }]} />
                </TouchableOpacity>
                <ScrollView style={styles.whiteView}>
                    <View style={{ marginVertical: 20 }}>
                        <Text style={styles.des}>The ultimate community app designed to support, connect, and empower Indians living abroad.</Text>
                        <Text></Text>
                        <Text style={[styles.des, { color: colors.primary_500 }]}>An app for Indians by Indians.</Text>
                        <Text></Text>
                        {planList &&
                            <FlatList
                                style={styles.flatlist}
                                columnWrapperStyle={styles.column}
                                numColumns={2}
                                bounces={false}
                                data={[...planList]}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity onPress={() => { setselectedPlan(item?._id), plan = item?._id }}>
                                            <Text style={styles.des}>{item?.title}</Text>
                                            <View style={[styles.middleView, { borderColor: item?._id == selectedPlan ? colors?.secondary_750 : colors.neutral_800, backgroundColor: item?._id == selectedPlan ? colors?.secondary_500 : colors.neutral_300 }]}>
                                                <Text style={styles.rsText}>Only ${item?.sell_price}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                                showsVerticalScrollIndicator={false}

                                ListEmptyComponent={<NoDataFound />}
                            />
                        }
                        {selectedPlan &&
                            <Text style={styles.des}>
                                {'\n'}{'\n'}Our mission is to create a support network and form a huge Indian Expat community online.
                                {'\n'}{'\n'}
                                Therefore we are providing a boat load of services only for ${planList?.filter(obj => obj?._id == selectedPlan)[0].sell_price} a {planList?.filter(obj => obj?._id == selectedPlan)[0].duration == 1 ? 'month' : (planList?.filter(obj => obj?._id == selectedPlan)[0].duration + ' months')}.
                                {'\n'}{'\n'}
                                With your support we can make this mission successful, so let's thrive together.
                            </Text>
                        }
                    </View>
                </ScrollView>
                <CommonButton title={'Next'} onPress={() =>
                    // navigation.navigate(screenName.PaymentAddressScreen, { selectedPlan: selectedPlan })
                    onSubscribeClick()

                } extraStyle={{ marginBottom: 10, marginHorizontal: 10 }} />
            </SafeAreaView>
            {/* </ImageBackground> */}
        </View>
    )
}

const styles = StyleSheet.create({
    closeStyle: {
        alignSelf: 'flex-end',
        padding: 10
    },
    whiteView: {
        flex: 1,
        backgroundColor: colors.white,
        marginHorizontal: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
        // paddingVertical: 20,
    },
    des: {
        ...FontStyle(14, colors.neutral_900, '700'),
        textAlign: 'center',
        lineHeight: 22
    },
    middleView: {
        borderWidth: 1,
        borderColor: colors.neutral_800,
        alignSelf: 'center',
        height: 120,
        width: 130,
        borderRadius: 4,
        backgroundColor: colors.neutral_300,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    rsText: {
        ...FontStyle(24, colors.neutral_900, '700'),
        textAlign: 'center'
    },
    flatlist: {
        paddingHorizontal: wp(8),
        paddingTop: hp(10),
        alignSelf: 'center'
    },
    column: {
        width: '100%',
        columnGap: wp(20),
        rowGap: hp(10),
    }
})