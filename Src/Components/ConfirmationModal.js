import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native';
import React from 'react';
import { FontStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import { fontname, hp } from '../Themes/Fonts';
import ModalContainer from './ModalContainer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ConfirmationModal({
    title,
    successBtn,
    onPressSuccess,
    canselBtn,
    onPressCancel,
    visible,
    onClose
}) {
    const insets = useSafeAreaInsets();
    return (
        <ModalContainer
            isVisible={visible}
            onClose={() => onClose()}
            transparent={true}>
            <View style={styles.modalView}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.btnRow}>
                    <TouchableOpacity onPress={() => onPressCancel()} style={styles.btns}>
                        <Text style={styles.btnText}>{canselBtn}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onPressSuccess()} style={styles.btns}>
                        <Text style={styles.btnText}>{successBtn}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingBottom: insets.bottom }} />
            </View>
        </ModalContainer >
    )
}

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: colors.neutral_300,
        paddingHorizontal: 3,
    },
    btnRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    btns: {
        backgroundColor: colors.secondary_750,
        width: '30%',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginBottom: hp(20)
    },
    btnText: {
        ...FontStyle(15, colors.white, '500')
    },
    title: {
        ...FontStyle(20, colors.neutral_900, '500'),
        textAlign: 'center',
        marginVertical: hp(25),
        marginHorizontal: hp(20)
    }
})