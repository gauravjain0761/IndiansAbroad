import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import { useNavigation } from '@react-navigation/native';
import RenderUserIcon from '../../Components/RenderUserIcon';
import { hp, wp } from '../../Themes/Fonts';
import { FontStyle, ImageStyle, searchUserByName } from '../../utils/commonFunction';
import { getFollowerList } from '../../Services/AuthServices';
import { dispatchAction } from '../../utils/apiGlobal';
import { SET_MAIN_FOLLOWER_LIST } from '../../Redux/ActionTypes';
import SearchBar from '../../Components/SearchBar';
import NoDataFound from '../../Components/NoDataFound';
import { Icons } from '../../Themes/Icons';
import colors from '../../Themes/Colors';
import CommonButton from '../../Components/CommonButton';

export default function AddMemberScreen() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { followerList, user, mainFollowerList } = useSelector(e => e.common)
    const [list, setlist] = useState(undefined)
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        dispatch(getFollowerList({
            data: { userId: user._id, search: '' }
        }))
    }, [])

    useEffect(() => {
        if (followerList && followerList.length > 0) {
            followerList.forEach(element => {
                element.isSelected = false
            });
            setlist(followerList)
            dispatchAction(dispatch, SET_MAIN_FOLLOWER_LIST, followerList)
        }
    }, [followerList])
    const setSelect = (id) => {
        let temp = Object.assign([], list)
        temp.forEach(element => {
            if (element._id == id) {
                element.isSelected = !element.isSelected
            }

        });
        setlist(temp)
    }
    const onUpdateMain = (id) => {
        let temp2 = Object.assign([], mainFollowerList)
        temp2.forEach(element => {
            if (element._id == id) {
                element.isSelected = !element.isSelected
            }
        });
        dispatchAction(dispatch, SET_MAIN_FOLLOWER_LIST, temp2)
    }

    const renderItem = ({ item, index }) => {
        return (
            <View key={index} style={[ApplicationStyles.row, { paddingHorizontal: hp(10) }]}>
                <View style={[ApplicationStyles.row, styles.listView]}>
                    <RenderUserIcon url={item?.followingId?.avtar} height={48} isBorder={item?.followingId?.subscribedMember} />
                    <Text style={styles.listText}>{item?.followingId?.first_Name} {item?.followingId?.last_Name}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelect(item._id)}>
                    <Image
                        source={item?.isSelected ? Icons.checkbox1 : Icons.checkbox}
                        style={[ImageStyle(20, 20), { top: 1, marginRight: 6 }]}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    const onSearchName = (search) => {
        let arr = searchUserByName(mainFollowerList, 'followingId', search)
        setlist(arr)
    }

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header title={''} showLeft={true} onLeftPress={() => { navigation.goBack() }} onlyLabel={'Send Group Invitation'} />
            <SearchBar value={searchText} onChangeText={text => { setSearchText(text), onSearchName(text) }} placeholder={'Search users, posts, forums'} containerStyles={{ marginVertical: 5 }} />
            {list && <FlatList
                data={list}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<NoDataFound />}
            />}
            <CommonButton title={'Add'} extraStyle={{ margin: wp(20) }} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    listText: {
        ...FontStyle(14, colors.neutral_900),
        marginLeft: 15,
        flex: 1
    },
    listView: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 5,
        borderColor: colors.neutral_400,
        // backgroundColor: colors.inputBg,
        flex: 1,
    },
    publishText: {
        ...FontStyle(14, colors.white),
    },
})