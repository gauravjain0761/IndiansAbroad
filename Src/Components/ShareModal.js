import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import ModalContainer from './ModalContainer';
import colors from '../Themes/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { getFollowerList } from '../Services/AuthServices';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { SCREEN_HEIGHT, fontname, hp, wp } from '../Themes/Fonts';
import RenderUserIcon from './RenderUserIcon';
import { FontStyle, ImageStyle, errorToast, searchUserByName } from '../utils/commonFunction';
import { Icons } from '../Themes/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onShareApi } from '../Services/PostServices';
import { dispatchAction } from '../utils/apiGlobal';
import { IS_LOADING, SET_MAIN_FOLLOWER_LIST } from '../Redux/ActionTypes';
import SearchBar from './SearchBar';
import NoDataFound from './NoDataFound';

export default function ShareModal({ visible, onClose, postId, isThread }) {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch()
    const { followerList, user, mainFollowerList } = useSelector(e => e.common)
    const [list, setlist] = useState(undefined)
    const [searchText, setSearchText] = useState('')
    const [mainList, setmainList] = useState(undefined)

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
        let temp = Object.assign([], mainFollowerList)
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
    const onPressShare = () => {


        let temp = mainFollowerList.filter(element => element.isSelected == true)
        if (temp.length > 0) {
            dispatchAction(dispatch, IS_LOADING, true)
            onClose()
            let idArray = []
            temp.forEach(element => {
                idArray.push(element?.followingId?._id)
            });
            let obj = {
                data: {
                    userIds: idArray.toString(),
                    loginUserId: user._id,
                    type: isThread ? 'thread' : 'post',
                    contentId: postId
                }
            }
            dispatch(onShareApi(obj))
        } else {
            errorToast('Please select atleast one of the following')
        }
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
        // let tempList = Object.assign([], mainFollowerList)

        let arr = searchUserByName(mainFollowerList, 'followingId', search)
        setlist(arr)
        // const filtered = tempList.filter((val) =>
        //     val.followingId.first_Name.toLowerCase().includes(search.toLowerCase())
        // );
        // const filter2 = tempList.filter((val) =>
        //     val.followingId.last_Name.toLowerCase().includes(search.toLowerCase())
        // );
        // let searchTextContact = Object.values(
        //     filtered.concat(filter2).reduce((r, o) => {
        //         r[o._id] = o;
        //         return r;
        //     }, {})
        // );
        // setlist(searchTextContact)
    }
    return (
        <ModalContainer statusBarTranslucent={true} avoidKeyboard={false} isVisible={visible} onClose={() => onClose()} transparent={true} >
            <View style={styles.modalView}>
                <TouchableOpacity onPress={() => onClose()} style={styles.closeIcon}>
                    <Image
                        source={Icons.closeRound}
                        style={[ImageStyle(36, 36)]}
                    />
                </TouchableOpacity>
                <SearchBar
                    value={searchText}
                    onChangeText={text => { setSearchText(text), onSearchName(text) }}
                    placeholder={'Search'}
                    containerStyles={{ marginVertical: 5 }}
                />
                {list && <FlatList
                    data={list}
                    renderItem={renderItem}
                    style={{ maxHeight: SCREEN_HEIGHT / 1.5 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<NoDataFound />}
                />}
                <TouchableOpacity onPress={() => onPressShare()} style={styles.blueButton}>
                    <Text style={styles.publishText}>Share</Text>
                </TouchableOpacity>
                <View style={{ paddingBottom: insets.bottom }} />
            </View>
        </ModalContainer>
    )
}

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: colors.white,
        paddingTop: 20,
        height: SCREEN_HEIGHT - 150
    },
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
    blueButton: {
        backgroundColor: colors.buttonBlue,
        alignSelf: 'flex-end',
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 10,
        width: 87,
        alignItems: 'center',
        borderRadius: 4,
        marginTop: hp(20)
    },
    closeIcon: {
        alignSelf: 'flex-end',
        paddingHorizontal: hp(10),
    }
})