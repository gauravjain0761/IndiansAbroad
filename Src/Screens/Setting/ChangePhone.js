import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

import { useNavigation } from '@react-navigation/native'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import Header from '../../Components/Header'
import colors from '../../Themes/Colors'
import { fontname, hp } from '../../Themes/Fonts'
import { FontStyle } from '../../utils/commonFunction'


export default function ChangePhone() {
    const navigation = useNavigation()
    return (
        <View style={ApplicationStyles.applicationView}>
            <Header
                title={''}
                showLeft
                onLeftPress={() => navigation.goBack()}
            />
           
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: colors.secondary_500
    },
    itemView: {
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral_400
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: hp(12)
    },
    imageArrow: {
        transform: [{ rotate: '180deg' }],
        paddingHorizontal: hp(10)
    },
    itemText: {
        ...FontStyle(fontname.abeezee, 20, colors.neutral_900, '700')
    }
})