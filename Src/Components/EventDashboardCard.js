import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import colors from '../Themes/Colors'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { Icons } from '../Themes/Icons'
import { wp } from '../Themes/Fonts'
import { FontStyle, ImageStyle } from '../utils/commonFunction'

export default function EventDashboardCard({ item, index }) {
    return (
        <View key={index} style={styles.cardView}>
            <View style={styles.innerCard}>
                <Image style={styles.cardImage} source={require('../assets/Icons/eventImage.jpg')} />
                <View style={styles.footer}>
                    <View style={ApplicationStyles.row}>
                        <View style={ApplicationStyles.flex}>
                            <Text style={styles.title}>Indian Festival Guide for November 2024</Text>
                            <Text style={styles.organizerText}>By IndiansAbroad</Text>
                        </View>
                        <View style={ApplicationStyles.row}>
                            <Text style={FontStyle(14, colors.neutral_900)}>1.1K</Text>
                            <Image source={Icons.group} style={styles.usersIcon} />
                        </View>
                    </View>
                    <View style={styles.bottomRow}>
                        <Text style={styles.addressText}>1930 Park lane, GB04SH, 6/14/2024</Text>
                        <TouchableOpacity style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
                            <Image source={Icons.checkSquare} style={ImageStyle(20, 20)} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
                            <Image source={Icons.starOutline} style={ImageStyle(20, 20)} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
                            <Image source={Icons.share} style={ImageStyle(24, 24)} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardView: {
        borderBottomWidth: 3,
        borderBottomColor: colors.secondary_500,
        paddingHorizontal: 3,
        paddingVertical: 3,
    },
    innerCard: {
        borderWidth: 1,
        borderColor: colors.neutral_800,
        borderRadius: 4
    },
    cardImage: {
        resizeMode: 'cover',
        height: 236,
        width: '100%'
    },
    footer: {
        paddingLeft: 5,
        paddingVertical: 5,
        paddingRight: wp(5)
    },
    usersIcon: {
        height: 23, width: 23, resizeMode: 'contain', marginLeft: 5,
        marginRight: 10
    },
    title: {
        ...FontStyle(16, colors.neutral_900, '700'),
        marginRight: 10
    },
    organizerText: {
        ...FontStyle(12, colors.neutral_900, '700'),
        marginRight: 10
    },
    addressText: {
        ...FontStyle(12, colors.neutral_900),
        flex: 1,
        paddingBottom: 10
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})