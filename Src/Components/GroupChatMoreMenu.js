import { View, Text, StyleSheet, Image, TouchableOpacity, } from 'react-native';
import React from 'react';
import { Icons } from '../Themes/Icons';
import { FontStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import { wp } from '../Themes/Fonts';
import ModalContainer from './ModalContainer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function GroupChatMoreMenu({ visible, onClose }) {
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
                    <Image style={styles.image} source={Icons.logout} />
                    <Text style={styles.text}>Leave group</Text>
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