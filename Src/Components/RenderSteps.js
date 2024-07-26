import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../Themes/Colors'
import { Icons } from '../Themes/Icons'
import { ImageStyle } from '../utils/commonFunction'

export default function RenderSteps({ currentStep, totalStep }) {
    console.log([...Array(totalStep).keys()])
    return (
        <View style={styles.main}>
            <View style={styles.rows} />
            <View style={styles.rowsView}>
                {[...Array(totalStep).keys()].map((element, index) => {
                    if (currentStep == index) {
                        return (
                            <View style={{ height: 17, width: 17, borderWidth: 4, borderColor: colors.primary_500, backgroundColor: colors.white, borderRadius: 50 }} />
                        )
                    } else if (index < currentStep) {
                        return (
                            <Image source={Icons.check} style={ImageStyle(17, 17)} />
                        )
                    } else {
                        return (
                            <View style={{ height: 17, width: 17, borderWidth: 2, borderColor: colors.neutral_300, backgroundColor: colors.white, borderRadius: 50 }} />
                        )
                    }

                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    rows: {
        height: 6,
        backgroundColor: colors.neutral_300,
        width: '100%',

    },
    rowsView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute', top: 0,
        zIndex: 111,
        width: '100%'
    },
    main: {
        width: '75%',
        alignSelf: 'center',
        height: 17,
        justifyContent: 'center'
    }
})