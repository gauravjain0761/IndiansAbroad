import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import React from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import { fontname, screen_width, wp } from '../Themes/Fonts';
import ModalContainer from './ModalContainer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { onConnectRequest, onGetOtherUserInfo, onPagesConnectRequest, onPagesDisConnectRequest, onUnFollowRequest } from '../Services/OtherUserServices';
import { dispatchAction } from '../utils/apiGlobal';
import { SET_POST_PAGES_CONNECT, SET_POST_PAGES_DISCONNECT, UPDATE_POST_LIST } from '../Redux/ActionTypes';


export default function MessageScreenMoreMenu({ visible, onClose }) {
    const insets = useSafeAreaInsets();
    const { user, otherUserInfo } = useSelector((state) => state.common);
    const dispatch = useDispatch()
    return (
        <ModalContainer isVisible={visible} onClose={() => onClose()} >
            <View style={styles.modalView}>
                <TouchableOpacity style={styles.row}>
                    <Image style={styles.image} source={Icons.close} />
                    <Text style={styles.text}>Clear Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row}>
                    <Image style={styles.image} source={Icons.blockUser} />
                    <Text style={styles.text}>Disconnect</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row}>
                    <Image style={styles.image} source={Icons.block} />
                    <Text style={styles.text}>Block</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row}>
                    <Image style={[styles.image, { tintColor: colors.danger_500 }]} source={Icons.report} />
                    <Text style={[styles.text, { color: colors.danger_500 }]}>Report</Text>
                </TouchableOpacity>
                <View style={{ paddingBottom: insets.bottom }} />
            </View>
        </ModalContainer>
    )
}

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: colors.white,
        paddingHorizontal: 3,
        paddingVertical: wp(10)
    },
    row: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        paddingVertical: wp(10),
        marginHorizontal: wp(20)
    },
    image: {
        height: 20,
        width: 20,
        tintColor: colors.neutral_900
    },
    text: {
        ...FontStyle(14, colors.neutral_900)
    }
})