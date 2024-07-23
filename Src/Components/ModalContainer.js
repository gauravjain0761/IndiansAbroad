import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ReactNativeModal from 'react-native-modal'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ModalContainer({ isVisible, statusBarTranslucent = false, avoidKeyboard = true, onClose, transparent = false, extraStyle = {}, children }) {
    const insets = useSafeAreaInsets();

    return (
        <ReactNativeModal statusBarTranslucent={statusBarTranslucent} avoidKeyboard={avoidKeyboard} backdropOpacity={transparent ? 0 : 0.5}
            style={{ justifyContent: 'flex-end', margin: 0, ...extraStyle }}
            isVisible={isVisible}
            onBackButtonPress={() => onClose()}
            onBackdropPress={() => onClose()}>
            {children}
        </ReactNativeModal>
    )
}

const styles = StyleSheet.create({})