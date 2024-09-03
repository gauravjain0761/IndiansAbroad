import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    Dimensions,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Image,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import PagerView from 'react-native-pager-view';
import { SCREEN_WIDTH, fontname, hp, wp } from '../Themes/Fonts';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import SearchBar from '../Components/SearchBar';
import ConnectCard from '../Components/ConnectCard';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../Navigation/ScreenConstants';
import RenderUserIcon from '../Components/RenderUserIcon';
import { Icons } from '../Themes/Icons';
import { Menu, MenuItem } from 'react-native-material-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onBlockUserApi, onGetBlockUserList } from '../Services/OtherUserServices';
import { api } from '../utils/apiConstants'
import ConfirmationModal from '../Components/ConfirmationModal';
import { dispatchAction } from '../utils/apiGlobal';
import { IS_LOADING } from '../Redux/ActionTypes';
import NoDataFound from '../Components/NoDataFound';


export default function RenderBlockedItem({ item, index }) {

    const [visible, setVisible] = useState(false);
    const { blockUserList } = useSelector(e => e.common)
    const [blockModal, setblockModal] = useState(false)
    const dispatch = useDispatch()
    const hideMenu = () => setVisible(false);

    const showMenu = () => setVisible(true);

    const onUnBlockuser = () => {
        setblockModal(false)
        setTimeout(() => {
            dispatchAction(dispatch, IS_LOADING, true)
            let obj = {
                data: {
                    userId: item?.blockedUserId,
                    action: 'unblock'
                }
            }
            dispatch(onBlockUserApi(obj))
        }, 500);
    }


    return (
        <View key={item._id}>
            <View style={[ApplicationStyles.row, styles.listView]}>
                <View style={[ApplicationStyles.row]}>
                    <RenderUserIcon url={item?.avtar} type='user' height={45} isBorder={item?.subscribedMember} />
                    <Text style={styles.listText}>{item?.first_Name} {item?.last_Name}</Text>
                </View>
                <Menu
                    visible={visible}
                    anchor={
                        <TouchableOpacity
                            style={[ImageStyle(14, 14), { right: 15 }]}
                            onPress={showMenu}>
                            <Image
                                source={Icons.more}
                                style={[ImageStyle(14, 14), { right: 15 }]}
                            />
                        </TouchableOpacity>
                    }
                    onRequestClose={hideMenu}
                    style={styles.menu}>
                    <MenuItem
                        textStyle={styles.itemText}
                        onPress={() => {
                            hideMenu()
                            setTimeout(() => {
                                setblockModal(true)
                            }, 500);
                        }}>
                        Unblock
                    </MenuItem>
                </Menu>
            </View>
            <View style={styles.lineStyle} />
            <ConfirmationModal
                visible={blockModal}
                onClose={() => setblockModal(false)}
                title={`Do you want to unblock ${item?.first_Name} ${item?.last_Name}?`}
                successBtn={'Yes'}
                canselBtn={'No'}
                onPressCancel={() => setblockModal(false)}
                onPressSuccess={() => onUnBlockuser()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    chatText: {
        // top: -19,
        textAlign: 'center',
        ...FontStyle(18, colors.secondary_600, '700'),
        marginVertical: 5
    },
    tabMainView: {
        flexDirection: 'row',
    },
    tabItemView: {
        flex: 1,
        padding: wp(15),
        borderRadius: 50,
        alignItems: 'center',
    },
    listText: {
        ...FontStyle(14, colors.neutral_900),
        marginLeft: 15,
        flex: 1,
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
    itemText: {
        top: -4,
        ...FontStyle(16, colors.neutral_900),
    },
    menu: {
        backgroundColor: colors.neutral_300,
        borderWidth: 1,
        borderColor: colors.neutral_400,
        // marginTop: 12,
        height: 42,
        width: 100,
    },
});