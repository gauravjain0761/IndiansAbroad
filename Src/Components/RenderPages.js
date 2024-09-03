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
import { getallIndianListApi, getallIndianUser, getAllPageListApi, getallPagesUser, getalluserposts, } from '../Services/PostServices';
import NoDataFound from './NoDataFound';
import { getDiscussionCountry } from '../Services/DiscussionServices';

export default function RenderPages() {
    const [searchText, setsearchText] = useState('')
    const [allPageList, setallPageList] = useState(undefined)
    const { user, allPages, allPagesCount } = useSelector(e => e.common);
    // const [areaList, setareaList] = useState([])
    const dispatch = useDispatch()
    const [refreshing, setRefreshing] = React.useState(false);
    const [page, setpage] = useState(1);
    const [loading, setloading] = useState(false);
    const navigation = useNavigation()

    // useEffect(() => {
    //     let obj = {
    //         params: { page: page, userId: user?._id, searchText: user?.region, },
    //         onSuccess: (res) => {
    //             console.log(res)
    //             setareaList(res?.data)
    //         }
    //     };
    //     dispatch(getAllPageListApi(obj));
    // }, [])

    useEffect(() => {
        getPagesList(1)
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
    const onOpenPageDetail = (item) => {
        navigation.navigate(screenName.pagesDetails, { pageDetail: item });
    }

    const RenderItem = ({ item, index }) => {
        return (
            <ConnectCard
                index={index}
                cardPress={() => { onOpenPageDetail(item) }}
                followingId={item?._id}
                name={`${item?.title}`}
                universityORcompany={item?.universityORcompany}
                userAvtar={item?.logo}
                isfollowing={item?.isfollowing}
                indians={false}
            />
        )
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getPagesList(1);
    }, []);

    const getPagesList = page => {
        let obj = {
            params: { page: page, userId: user?._id, searchText: searchText, },
            onSuccess: () => {
                setpage(page);
                setloading(false);
                setRefreshing(false)
            },
        };
        dispatch(getallPagesUser(obj));
    };

    const fetchMoreData = () => {
        if (allPages) {
            if (allPages.length < allPagesCount) {
                setloading(true);
                getPagesList(page + 1);
            }
        }
    };

    useEffect(() => {
        getPagesList(1)
    }, [searchText])

    const onSearchIndians = (text, page) => {
        setsearchText(text)
    }

    return (
        <View style={ApplicationStyles.flex} >
            <SearchBar value={searchText} onChangeText={text => onSearchIndians(text, 1)} placeholder={'Search Pages here'} />
            {/* <Text style={styles.peopleText}>{'Pages from your area'}</Text> */}
            {searchText !== '' ?
                <FlatList
                    style={styles.flatList}
                    columnWrapperStyle={styles.column}
                    numColumns={2}
                    bounces={false}
                    data={allPages}
                    renderItem={RenderItem}
                    showsVerticalScrollIndicator={false}
                    onEndReached={fetchMoreData}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={() => {
                        return (
                            <View>
                                {(allPages && loading) && <ActivityIndicator size={'large'} color={colors.black} />}
                                <View style={{ height: 200 }} />
                            </View>
                        )
                    }}
                />
                :
                <View style={ApplicationStyles.flex}>

                    {allPages &&
                        <FlatList
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            // ListHeaderComponent={() => {
                            //     return (
                            //         areaList.length > 0 ?
                            //             <View>
                            //                 <FlatList
                            //                     columnWrapperStyle={styles.column}
                            //                     numColumns={2}
                            //                     bounces={false}
                            //                     data={areaList}
                            //                     renderItem={RenderItem}
                            //                     showsVerticalScrollIndicator={false}
                            //                 />
                            //                 <RenderSeeMoreView onPressSeeMore={() => navigation.navigate(screenName.IndiansPageMore, { dataList: 'INDIANS', })} />
                            //             </View>
                            //             : <View />
                            //     )
                            // }}
                            style={styles.flatList}
                            columnWrapperStyle={styles.column}
                            numColumns={2}
                            data={allPages}
                            renderItem={RenderItem}
                            showsVerticalScrollIndicator={false}
                            onEndReached={fetchMoreData}
                            onEndReachedThreshold={0.1}
                            ListFooterComponent={() => {
                                return (
                                    <View>
                                        {(allPages && loading) && <ActivityIndicator size={'large'} color={colors.black} />}
                                        <View style={{ height: 200 }} />
                                    </View>
                                )
                            }} />
                    }
                </View>
            }

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
        marginTop: hp(10)
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