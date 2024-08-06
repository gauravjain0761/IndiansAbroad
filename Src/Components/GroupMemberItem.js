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
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import { fontname, hp, screen_width, wp } from '../Themes/Fonts';
import RenderUserIcon from './RenderUserIcon';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { useDispatch, useSelector } from 'react-redux';
import { onBlockUserApi, onConnectRequest, onUnFollowRequest } from '../Services/OtherUserServices';
import ConfirmationModal from './ConfirmationModal';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../Navigation/ScreenConstants';

export default function GroupMemberItem({ item, index, }) {
    const [RemoveMenu, setRemoveMenu] = useState(false);
    const { user } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const navigation = useNavigation()
    let isUser = item?._id == user._id;
    const hideMenuRemove = () => setRemoveMenu(false);
    const showMenuRemove = () => setRemoveMenu(true);

    const onOpenUserDetail = () => {
        if (!isUser) {
            navigation.navigate(screenName.indiansDetails, { userId: item?._id });
        }
        //  else {
        //     navigation.navigate(screenName.indiansDetails)
        // }
    };

    return (
        <View key={index}>
            <TouchableOpacity onPress={() => onOpenUserDetail()} style={[styles.header]}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <RenderUserIcon url={item?.avtar} height={45} isBorder={item?.subscribedMember} />
                    <Text numberOfLines={1} style={styles.text1}>
                        {item.first_Name} {item.last_Name}
                    </Text>
                </View>
                {item?.isAdmin ?
                    <Text style={[styles.menberText]}>Group Admin</Text>
                    :
                    <Menu
                        visible={RemoveMenu}
                        anchor={
                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: wp(16), height: 50 }} onPress={showMenuRemove}>
                                <Image source={Icons.dotMenu} style={ImageStyle(22, 22)} />
                            </TouchableOpacity>
                        }
                        onRequestClose={hideMenuRemove}
                        style={styles.menu}>
                        <MenuItem textStyle={styles.itemText} onPress={() => { hideMenuRemove(), setTimeout(() => { }, 500); }}>
                            Remove
                        </MenuItem>
                    </Menu>
                }

            </TouchableOpacity>
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
