import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import { Icons } from '../../Themes/Icons'
import colors from '../../Themes/Colors'
import { FontStyle, ImageStyle } from '../../utils/commonFunction'
import { hp, wp } from '../../Themes/Fonts'
import CommonButton from '../../Components/CommonButton'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { onGetPlanList } from '../../Services/PaymentService'
import NoDataFound from '../../Components/NoDataFound'
import { screenName } from '../../Navigation/ScreenConstants'

export default function PaymentModalScreen() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { user, planList } = useSelector(e => e.common)
    const [selectedPlan, setselectedPlan] = useState(undefined)

    useEffect(() => {
        dispatch(onGetPlanList())
    }, [])

    useEffect(() => {
        if (planList && planList.length > 0) {
            setselectedPlan(planList[0]?._id)
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
                                        <TouchableOpacity onPress={() => setselectedPlan(item?._id)}>
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
                <CommonButton title={'Next'} onPress={() => navigation.navigate(screenName.PaymentAddressScreen, { selectedPlan: selectedPlan })} extraStyle={{ marginBottom: 10, marginHorizontal: 10 }} />
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