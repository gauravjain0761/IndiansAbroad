import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import React, { useState } from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle, successToast } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import { fontname, hp, screen_width, wp } from '../Themes/Fonts';
import RenderUserIcon from './RenderUserIcon';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { useDispatch, useSelector } from 'react-redux';
import { onBlockUserApi, onConnectRequest, onUnFollowRequest } from '../Services/OtherUserServices';
import ConfirmationModal from './ConfirmationModal';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../Navigation/ScreenConstants';
import { onGetChatDetail, onRemoveMember } from '../Services/ChatServices';

export default function GroupMemberItem({ item, index, }) {
    const [RemoveMenu, setRemoveMenu] = useState(false);
    const { user, activeChatDetails, activeChatRoomUser } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const navigation = useNavigation()
    let isUser = item?._id == user._id;
    const hideMenuRemove = () => setRemoveMenu(false);
    const showMenuRemove = () => setRemoveMenu(true);
    const [removeModal, setremoveModal] = useState(false)
    const onOpenUserDetail = () => {
        if (!isUser) {
            navigation.navigate(screenName.indiansDetails, { userId: item?._id });
        }
    };

    const onRemoveUser = () => {
        setremoveModal(false)
        let obj = {
            data: {
                userId: item?._id,
                groupId: activeChatDetails?._id
            },
            onSuccess: (res) => {
                successToast(`${item.first_Name} ${item.last_Name} is removed from this group`);
                let obj = { data: { userId: user?._id, chatId: activeChatRoomUser?.chatId } }
                dispatch(onGetChatDetail(obj))
            }
        }
        dispatch(onRemoveMember(obj))
    }

    return (
        <View key={index}>
            <TouchableOpacity onPress={() => onOpenUserDetail()} style={[styles.header]}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <RenderUserIcon url={item?.avtar} type='user' height={45} isBorder={item?.subscribedMember} />
                    <Text numberOfLines={1} style={styles.text1}>
                        {item.first_Name} {item.last_Name}
                    </Text>
                </View>
                {item?.isAdmin ?
                    <Text style={[styles.menberText]}>Group Admin</Text>
                    :
                    activeChatDetails?.createdBy?._id == user?._id ? <Menu
                        visible={RemoveMenu}
                        anchor={
                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: wp(16), height: 50 }} onPress={showMenuRemove}>
                                <Image source={Icons.dotMenu} style={ImageStyle(22, 22)} />
                            </TouchableOpacity>
                        }
                        onRequestClose={hideMenuRemove}
                        style={styles.menu}>
                        <MenuItem textStyle={styles.itemText} onPress={() => { hideMenuRemove(), setTimeout(() => { setremoveModal(true) }, 500); }}>
                            Remove
                        </MenuItem>
                    </Menu> : null
                }

            </TouchableOpacity>
            {removeModal && (
                <ConfirmationModal
                    visible={removeModal}
                    onClose={() => setremoveModal(false)}
                    title={`Are you sure you want remove ${item.first_Name} ${item.last_Name} from group?`}
                    successBtn={'Remove'}
                    canselBtn={'No'}
                    onPressCancel={() => setremoveModal(false)}
                    onPressSuccess={() => onRemoveUser()}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginBottom: hp(16),
        // paddingVertical: hp(5),
        paddingVertical: hp(15),
        paddingLeft: hp(15),
    },
    text1: {
        marginLeft: 12,
        ...FontStyle(14, colors.neutral_900),
        flex: 1, marginRight: 10
    },
    menu: {
        backgroundColor: colors.neutral_300,
        borderColor: colors.neutral_400,
        marginTop: 40,
    },
    itemText: {
        ...FontStyle(18, colors.neutral_900),
    },
    menberText: {
        ...FontStyle(15, colors.primary_500, '600'),
        paddingRight: hp(15)
    },
})
