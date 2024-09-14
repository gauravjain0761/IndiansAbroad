import { Image, StyleSheet, TouchableOpacity, Text, View, Linking } from 'react-native'
import React from 'react'
import { wp } from '../Themes/Fonts'
import { Icons } from '../Themes/Icons'
import { FontStyle, ImageStyle } from '../utils/commonFunction'
import colors from '../Themes/Colors'
import DocumentPicker, { pick } from 'react-native-document-picker';
import { useNavigation } from '@react-navigation/native'
import { screenName } from '../Navigation/ScreenConstants'

export default function RenderFileMessageView({ data }) {
    const navigation = useNavigation()

    return (
        <TouchableOpacity onPress={() => navigation.navigate(screenName.MediaPreviewScreen, { url: data?.file[0] })} style={styles.rowFile}>
            <Image source={Icons.pdf} style={ImageStyle(25, 25)} />
            <View>
                <Text style={styles.groupName}>{data?.file[0]?.location.split('/').pop()}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    rowFile: {
        backgroundColor: colors.white,
        marginHorizontal: 10,
        marginTop: 5,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        gap: 10,
        marginBottom: 15,
    },
    groupName: {
        ...FontStyle(13, colors.neutral_900, '500'),
        flex: 1,
        maxWidth: wp(200),
    },
})