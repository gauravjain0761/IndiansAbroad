import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontStyle } from '../utils/commonFunction'
import { fontname, hp } from '../Themes/Fonts'
import colors from '../Themes/Colors'

export default function CommonButton({ title, extraStyle, onPress }) {
    return (
        <TouchableOpacity onPress={() => onPress ? onPress() : {}} style={[styles.blueButton, extraStyle]}>
            <Text style={styles.publishText}>{title}</Text>
        </TouchableOpacity>
    )
}

export const styles = StyleSheet.create({
    publishText: {
        ...FontStyle(16, colors.white),
    },
    blueButton: {
        backgroundColor: colors.buttonBlue,
        // paddingVertical: 10,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
})