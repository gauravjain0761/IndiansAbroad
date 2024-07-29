import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator, Image, ScrollView, } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import PagerView from 'react-native-pager-view';
import { fontname, SCREEN_WIDTH, wp } from '../../Themes/Fonts';
import { FontStyle, ImageStyle } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import SearchBar from '../../Components/SearchBar';
import PostCard from '../../Components/PostCard';
import CreatePost from '../../Components/CreatePost';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { screenName } from '../../Navigation/ScreenConstants';
import { getalluserposts } from '../../Services/PostServices';
import { dispatchAction } from '../../utils/apiGlobal';
import { IS_LOADING, SET_ACTIVE_EVENT, SET_ACTIVE_POST, SET_ACTIVE_POST_COMMENTS, SET_ALL_EVENTS, SET_GLOBAL_SEARCH, } from '../../Redux/ActionTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoDataFound from '../../Components/NoDataFound';
import { getFollowerList } from '../../Services/AuthServices';
import { getDiscussionCountry } from '../../Services/DiscussionServices';
import { io } from 'socket.io-client';
import EventDashboardCard from '../../Components/EventDashboardCard';
import { Icons } from '../../Themes/Icons';
import RenderEventTicket from '../../Components/RenderEventTicket';
import RenderUserIcon from '../../Components/RenderUserIcon';

export default function EventDashboard() {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    return (
        <View style={ApplicationStyles.applicationView}>
            <SafeAreaView style={[ApplicationStyles.applicationView, {}]}>
                <Header title={'IndiansAbroad'} showLeft />
                <ScrollView style={styles.bottomView}>
                    <View style={styles.mainNameView}>
                        <RenderUserIcon height={40} />
                        <View style={ApplicationStyles.flex}>
                            <Text style={FontStyle(16, colors.neutral_900, '700')}>IndiansAbroad</Text>
                            <Text style={FontStyle(11, colors.neutral_900)}>Community page,London</Text>
                        </View>
                        <Image source={require('../../assets/Icons/qr-code.png')} style={styles.qrImage} />
                    </View>
                    <View style={styles.boxView}>
                        <View style={styles.innerBox}>
                            <Text style={FontStyle(17, colors.neutral_900, '700')}>Balance</Text>
                            <Text style={FontStyle(14, colors.neutral_900)}>£630</Text>
                        </View>
                        <View style={styles.innerBox}>
                            <Text style={FontStyle(17, colors.neutral_900, '700')}>Events</Text>
                            <Text style={FontStyle(14, colors.neutral_900)}>2</Text>
                        </View>
                    </View>
                    <View style={styles.boxView}>
                        <View style={styles.innerBox}>
                            <Text style={FontStyle(17, colors.neutral_900, '700')}>Total Bookings</Text>
                            <Text style={FontStyle(14, colors.neutral_900)}>890</Text>
                        </View>
                        <View style={styles.innerBox}>
                            <Text style={FontStyle(17, colors.neutral_900, '700')}>Total Transactions</Text>
                            <Text style={FontStyle(14, colors.neutral_900)}>8</Text>
                        </View>
                    </View>
                    <View style={styles.boxView}>
                        <Text style={styles.title}>Ongoing Event</Text>
                    </View>
                </ScrollView>
                <View style={{ paddingHorizontal: 10 }}>
                    <Text style={styles.title}>Withdraw</Text>
                    <View style={styles.withdrawView}>
                        <View style={{ flex: 1, marginVertical: 10, paddingLeft: 5 }}>
                            <Text style={styles.totalText}>Total balance remaining</Text>
                        </View>
                        <View style={styles.line} />
                        <View style={{ flex: 1, marginVertical: 10, justifyContent: 'center' }}>
                            <View style={styles.priceViewTotal}>
                                <Text style={FontStyle(12, colors.primary_500)}>£1650</Text>
                            </View>
                        </View>
                        <View style={styles.line} />
                        <View style={{ flex: 1, marginVertical: 10, justifyContent: 'center' }}>
                            <View style={styles.btn}>
                                <Text style={FontStyle(11, colors.white)}>Request Payout</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    bottomView: {
        // backgroundColor: 'red',
        flex: 1
    },
    title: {
        ...FontStyle(14, colors.neutral_900, '700'),
        marginBottom: 5
    },
    withdrawView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 4,
        borderColor: colors.neutral_300,
        borderWidth: 1,

    },
    totalText: {
        ...FontStyle(10, colors.neutral_900)
    },
    line: {
        width: 1,
        backgroundColor: colors.neutral_300,
    },
    priceViewTotal: {
        backgroundColor: '#F4F6FBFF',
        alignSelf: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderRadius: 50
    },
    btn: {
        backgroundColor: colors.primary_500,
        alignSelf: 'center',
        flex: 1,
        justifyContent: 'center',
        borderRadius: 4,
        paddingHorizontal: 10
    },
    mainNameView: {
        backgroundColor: colors.secondary_500,
        paddingHorizontal: wp(16),
        paddingVertical: 10,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    qrImage: {
        width: 38,
        height: 38,
    },
    boxView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginHorizontal: 10,
        marginTop: 10
    },
    innerBox: {
        backgroundColor: colors.neutral_300,
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15
    }
})