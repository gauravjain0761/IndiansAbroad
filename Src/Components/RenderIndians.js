import { View, Text, StyleSheet, Pressable, Animated, Dimensions, TouchableOpacity, FlatList, ScrollView, RefreshControl, ActivityIndicator, } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from './Header';
import PagerView from 'react-native-pager-view';
import { SCREEN_WIDTH, fontname, hp, wp } from '../Themes/Fonts';
import { FontStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import SearchBar from './SearchBar';
import ConnectCard from './ConnectCard';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { screenName } from '../Navigation/ScreenConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getallIndianListApi, getallIndianRegionListApi, getallIndianUser, getallPagesUser, getalluserposts, } from '../Services/PostServices';
import NoDataFound from './NoDataFound';
import { getDiscussionCountry } from '../Services/DiscussionServices';

export default function RenderIndians() {
    const [searchText, setsearchText] = useState('')
    const [allIndianList, setallIndianList] = useState(undefined)
    const { user, allIndian, allPages, allIndianCount, allIndianRegion } = useSelector(e => e.common);
    const [areaList, setareaList] = useState([])
    const dispatch = useDispatch()
    const [refreshing, setRefreshing] = React.useState(false);
    const [page, setpage] = useState(1);
    const [loading, setloading] = useState(false);
    const navigation = useNavigation()

    useEffect(() => {
        let obj = {
            data: { emails: [], search: user?.region, userId: user?._id, page: 1, limit: 0, },
            onSuccess: (res) => { }
        };
        dispatch(getallIndianRegionListApi(obj));
    }, [])



    useEffect(() => {
        getIndianList(1)
    }, [])

    const RenderSeeMoreView = ({ onPressSeeMore }) => {
        return (
            <View style={[ApplicationStyles.row, { alignSelf: 'center', marginBottom: hp(15), marginTop: 3 },]}>
                <View style={styles.lineView} />
                <TouchableOpacity
                    style={styles.seeBtn}
                    onPress={() => onPressSeeMore()}>
                    <Text style={styles.seeBtnText}>See More</Text>
                </TouchableOpacity>
                <View style={styles.lineView} />
            </View>
        )
    }

    const onOpenOtherUserDetail = (id) => {
        navigation.navigate(screenName.indiansDetails, { userId: id })
    }

    const RenderItem = ({ item, index }) => {
        return (<ConnectCard
            index={index}
            cardPress={() => { onOpenOtherUserDetail(item?._id) }}
            followingId={item?._id}
            name={`${item?.first_Name} ${item?.last_Name}`}
            universityORcompany={item?.universityORcompany}
            userAvtar={item?.avtar}
            isFollowing={item?.isFollowing}
            isFollowingRequested={item?.isFollowingRequested}
            isFollower={item?.isFollower}
            subscribedMember={item?.subscribedMember}
            indians={true}
        />)
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        let obj = {
            data: { emails: [], search: user?.region, userId: user?._id, page: 1, limit: 0, },
            onSuccess: (res) => { }
        };
        dispatch(getallIndianRegionListApi(obj));
        getIndianList(1);
    }, []);

    const getIndianList = (page) => {
        let obj = {
            data: {
                emails: [], //"dev.abhiharshe23@gmail.com"
                search: searchText,
                userId: user?._id,
                page: page,
                limit: 0,
            },
            onSuccess: () => {
                setpage(page);
                setloading(false);
                setRefreshing(false);
            },
        };
        dispatch(getallIndianUser(obj));
    }

    const fetchMoreData = () => {
        if (allIndian) {
            if (allIndian.length < allIndianCount) {
                setloading(true);
                getIndianList(page + 1);
            }
        }
    };

    // useEffect(() => {
    //     getIndianList(1)
    // }, [searchText])

    const onSearchIndians = (text, page) => {
        setsearchText(text)
        let obj = {
            data: {
                emails: [], //"dev.abhiharshe23@gmail.com"
                search: text,
                userId: user?._id,
                page: 1,
                limit: 0,
            },
            onSuccess: () => {
                setpage(page);
                setloading(false);
                setRefreshing(false);
            },
        };
        dispatch(getallIndianUser(obj));
    }
    console.log('allIndian.length--', allIndian?.length)
    return (
        <View style={ApplicationStyles.flex} >
            <SearchBar value={searchText} onChangeText={text => onSearchIndians(text, 1)} placeholder={'Search Indians here'} />
            {/* {searchText !== '' ?
                <FlatList
                    style={styles.flatList}
                    columnWrapperStyle={styles.column}
                    numColumns={2}
                    bounces={false}
                    data={allIndian}
                    renderItem={RenderItem}
                    showsVerticalScrollIndicator={false}
                    onEndReached={fetchMoreData}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={() => {
                        return (
                            <View>
                                {(allIndian && loading) && <ActivityIndicator size={'large'} color={colors.black} />}
                                <View style={{ height: 200 }} />
                            </View>
                        )
                    }}
                />
                :
                <View style={ApplicationStyles.flex}>
                    {allIndian &&
                        <FlatList
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            ListHeaderComponent={() => {
                                return (
                                    allIndianRegion?.filter(obj => obj?.isFollowing == 0 && obj?.isFollowingRequested == 0).slice(0, 2).length > 0 ?
                                        <View>
                                            <Text style={[FontStyle(14, colors.neutral_900, '700'), { marginVertical: 8 },]}> {'People you may know'}</Text>
                                            <FlatList
                                                columnWrapperStyle={styles.column}
                                                numColumns={2}
                                                bounces={false}
                                                data={allIndianRegion?.filter(obj => obj?.isFollowing == 0 && obj?.isFollowingRequested == 0).slice(0, 2)}
                                                renderItem={RenderItem}
                                                showsVerticalScrollIndicator={false}
                                            />
                                            <RenderSeeMoreView onPressSeeMore={() => navigation.navigate(screenName.IndiansPageMore, { dataList: 'INDIANS', })} />
                                        </View>
                                        : <View />
                                )
                            }}
                            style={styles.flatList}
                            columnWrapperStyle={styles.column}
                            numColumns={2}
                            data={allIndian?.filter(obj => obj?.isFollowing == 0 && obj?.isFollowingRequested == 0)}
                            renderItem={RenderItem}
                            showsVerticalScrollIndicator={false}
                            onEndReached={fetchMoreData}
                            onEndReachedThreshold={0.1}
                            ListFooterComponent={() => {
                                return (
                                    <View>
                                        {(allIndian && loading) && <ActivityIndicator size={'large'} color={colors.black} />}
                                        <View style={{ height: 200 }} />
                                    </View>
                                )
                            }} />
                    }
                </View>
            } */}

        </View>
    )
}

const styles = StyleSheet.create({
    peopleText: [
        FontStyle(14, colors.neutral_900, '700'),
        { marginHorizontal: wp(16), marginVertical: 8, },
    ],
    flatList: {
        paddingHorizontal: wp(16),
        // flex: 1,
    },
    column: {
        width: '100%',
        columnGap: wp(10),
    },
    lineView: {
        width: SCREEN_WIDTH * 0.34,
        borderWidth: 0.5,
        borderColor: colors.neutral_400,
    },
    seeBtn: {
        backgroundColor: colors.secondary_d9e2,
        paddingHorizontal: 12,
        borderRadius: 3,
        marginHorizontal: wp(7),
    },
    seeBtnText: {
        paddingVertical: 2,
        ...FontStyle(11, colors.neutral_900, '400'),
    },
})