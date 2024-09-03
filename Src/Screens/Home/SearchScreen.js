import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, FlatList, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../Components/Header'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FontStyle } from '../../utils/commonFunction'
import { fontname, hp } from '../../Themes/Fonts'
import colors from '../../Themes/Colors'
import SearchBar from '../../Components/SearchBar'
import RenderUserIcon from '../../Components/RenderUserIcon'
import { useDispatch, useSelector } from 'react-redux'
import { onGetLikedUserList, onGlobalSearchApi } from '../../Services/PostServices'
import { api } from '../../utils/apiConstants'
import NoDataFound from '../../Components/NoDataFound'
import FastImage from 'react-native-fast-image'
import { dispatchAction } from '../../utils/apiGlobal'
import { SET_ACTIVE_POST, SET_ACTIVE_POST_COMMENTS } from '../../Redux/ActionTypes'
import { screenName } from '../../Navigation/ScreenConstants'

export default function SearchScreen() {
    const { goBack, navigate } = useNavigation()
    const [searchText, setSearchText] = useState('');
    const { likedUserList, user, globalSearchData } = useSelector(e => e.common)
    const dispatch = useDispatch()

    const onGlobalSearch = (text) => {
        setSearchText(text)
        const obj = {
            data: {
                loginUserId: user._id,
                searchText: text.trim()
            }
        }
        dispatch(onGlobalSearchApi(obj))
    }

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header
                title={'IndiansAbroad'}
                showLeft={true}
                showRight={false}
                onLeftPress={() => goBack()}
            />
            <View style={{ borderTopWidth: 1, borderTopColor: colors.secondary_500, }}>
                <SearchBar
                    value={searchText}
                    onChangeText={text => onGlobalSearch(text)}
                    placeholder={'Search users, posts, forums'}
                />
            </View>
            <View style={{ paddingHorizontal: 0, marginTop: 8, flex: 1 }}>
                {globalSearchData?.posts?.records?.length == 0 && globalSearchData?.threads?.records?.length == 0 && globalSearchData?.users?.records?.length == 0 &&
                    <NoDataFound />
                }
                <ScrollView style={{ flex: 1, paddingHorizontal: hp(20) }}>
                    {globalSearchData?.posts?.records?.length > 0 &&
                        <View>
                            <Text style={styles.title}>Posts</Text>
                            {globalSearchData?.posts?.records.map((item, index) => {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        dispatchAction(dispatch, SET_ACTIVE_POST, item)
                                        dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined)
                                        navigate(screenName.PostDetail)
                                    }} style={styles.row} key={index}>
                                        <FastImage resizeMode={FastImage.resizeMode.stretch} source={{ uri: api.IMAGE_URL + item.avtar }} style={styles.imageAvtar} />
                                        <View style={ApplicationStyles.flex}>
                                            <Text numberOfLines={1} style={[styles.title, { color: colors.neutral_900, marginTop: 0 }]}>{item.title}</Text>
                                            <Text numberOfLines={1} style={styles.name}>- {item.first_Name} {item.last_Name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    }
                    {globalSearchData?.threads?.records?.length > 0 &&
                        <View>
                            <Text style={styles.title}>Threads</Text>
                            {globalSearchData?.threads?.records.map((item, index) => {
                                return (
                                    <TouchableOpacity style={styles.row} key={index}>
                                        <FastImage resizeMode={FastImage.resizeMode.stretch} source={{ uri: api.IMAGE_URL + item.avtar }} style={styles.imageAvtar} />
                                        <View style={ApplicationStyles.flex}>
                                            <Text numberOfLines={1} style={[styles.title, { color: colors.neutral_900, marginTop: 0 }]}>{item.title}</Text>
                                            <Text numberOfLines={1} style={styles.name}>- {item.first_Name} {item.last_Name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    }
                    {globalSearchData?.users?.records?.length > 0 &&
                        <View>
                            <Text style={styles.title}>Users</Text>
                            {globalSearchData?.users?.records.map((item, index) => {
                                return (
                                    <TouchableOpacity onPress={() => navigate(screenName.indiansDetails, { userId: item?._id })} key={index} style={[styles.row]}>
                                        <RenderUserIcon type='user' url={item?.avtar} userId={item?._id} height={45} isBorder={item?.subscribedMember} />
                                        <Text style={[styles.title, { color: colors.neutral_900, marginTop: 0 }]}> {item?.first_Name} {item?.last_Name}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    }
                </ScrollView>
            </View >
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    chatText: {
        // top: -19,
        textAlign: 'center',
        ...FontStyle(18, colors.secondary_600, '700'),
        marginVertical: 5
    },
    listText: {
        ...FontStyle(14, colors.neutral_900),
        marginLeft: 15,
        flex: 1
    },

    listView: {
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 5,
        borderColor: colors.neutral_400,
        backgroundColor: colors.inputBg,
        marginHorizontal: 8
    },
    lineStyle: {
        borderWidth: 0.6,
        marginVertical: 6,
        borderColor: colors.secondary_500
    },
    title: {
        marginTop: 10,
        ...FontStyle(15, colors.primary_8091ba, '700')
    },
    name: {
        ...FontStyle(13, colors.neutral_900)
    },
    imageAvtar: {
        width: 70,
        height: 70,
        // marginRight: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(10),
        gap: 10
    }
})