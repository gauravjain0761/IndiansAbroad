import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RenderUserIcon from './RenderUserIcon'
import { wp } from '../Themes/Fonts'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { FontStyle } from '../utils/commonFunction'
import colors from '../Themes/Colors'

export default function RenderLinkChat({ item, index, name, profileImage }) {
    return (
        <View key={index} style={styles.mainView} >
            <RenderUserIcon height={36} url={profileImage} />
            <View style={ApplicationStyles.flex}>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.linkText}>{'https ://remixicon.com/'}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: wp(10),
        gap: wp(10)
    },
    nameText: {
        ...FontStyle(14, colors.neutral_900)
    },
    linkText: {
        ...FontStyle(14, colors.neutral_500)
    }
})