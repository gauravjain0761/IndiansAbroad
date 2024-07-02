import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import ModalContainer from './ModalContainer';
import colors from '../Themes/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { getFollowerList } from '../Services/AuthServices';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { SCREEN_HEIGHT, fontname, hp, wp } from '../Themes/Fonts';
import RenderUserIcon from './RenderUserIcon';
import { FontStyle, ImageStyle, errorToast } from '../utils/commonFunction';
import { Icons } from '../Themes/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onShareApi } from '../Services/PostServices';
import { dispatchAction } from '../utils/apiGlobal';
import { IS_LOADING } from '../Redux/ActionTypes';

export default function ShareModal({ visible, onClose, postId }) {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch()
    const { followerList, user } = useSelector(e => e.common)
    const [list, setlist] = useState(undefined)
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
        }
    }, [followerList])

    const setSelect = (index) => {
        let temp = Object.assign([], list)
        temp[index].isSelected = !temp[index].isSelected
        setlist(temp)
    }

    const onPressShare = () => {
        onClose()
        dispatchAction(dispatch, IS_LOADING, true)
        let temp = list.filter(element => element.isSelected == true)
        if (temp.length > 0) {
            let idArray = []
            temp.forEach(element => {
                idArray.push(element._id)
            });
            let obj = {
                data: {
                    userIds: idArray.toString(),
                    loginUserId: user._id,
                    type: 'post',
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
                <TouchableOpacity onPress={() => setSelect(index)}>
                    <Image
                        source={item?.isSelected ? Icons.checkbox1 : Icons.checkbox}
                        style={[ImageStyle(20, 20), { top: 1, marginRight: 6 }]}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ModalContainer isVisible={visible} onClose={() => onClose()} transparent={true} >
            <View style={styles.modalView}>
                <TouchableOpacity onPress={() => onClose()} style={styles.closeIcon}>
                    <Image
                        source={Icons.closeRound}
                        style={[ImageStyle(36, 36)]}
                    />
                </TouchableOpacity>
                {list && <FlatList
                    data={list}
                    renderItem={renderItem}
                    style={{ maxHeight: SCREEN_HEIGHT / 1.5 }}
                    showsVerticalScrollIndicator={false}
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
        paddingTop: 20
    },
    listText: {
        ...FontStyle(fontname.actor_regular, 14, colors.neutral_900),
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
        ...FontStyle(fontname.actor_regular, 14, colors.white),
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