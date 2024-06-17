import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ReactNativeModal from 'react-native-modal'

export default function ModalContainer({ isVisible, onClose, transparent = false, extraStyle = {}, children }) {
    return (
        <ReactNativeModal backdropOpacity={transparent ? 0 : 0.5} style={{ justifyContent: 'flex-end', margin: 0, ...extraStyle }} isVisible={isVisible} onBackButtonPress={() => onClose()} onBackdropPress={() => onClose()}>
            {children}
        </ReactNativeModal>
    )
}

const styles = StyleSheet.create({})