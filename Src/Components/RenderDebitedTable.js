import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colors from '../Themes/Colors'
import { FontStyle, ImageStyle } from '../utils/commonFunction'
import RenderUserIcon from './RenderUserIcon'
import { Icons } from '../Themes/Icons'

export default function RenderDebitedTable() {
    return (
        <View style={styles.outerView}>
            <View style={styles.headerRow}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.headerText,]}>Date</Text>
                </View>
                <View style={styles.line} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.headerText,]}>Time</Text>
                </View>
                <View style={styles.line} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.headerText,]}>Debited Amount</Text>
                </View>
            </View>
            <View style={styles.headerRow}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.desText,]}>Thurs,16/01/2024</Text>
                </View>
                <View style={styles.line} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.desText,]}>03:24 AM</Text>
                </View>
                <View style={styles.line} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.desText,]}>- £511</Text>
                </View>
            </View>
            <View style={styles.headerRow}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.desText,]}>Thurs,16/01/2024</Text>
                </View>
                <View style={styles.line} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.desText,]}>03:24 AM</Text>
                </View>
                <View style={styles.line} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.desText,]}>- £511</Text>
                </View>
            </View>
            <View style={styles.headerRow}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.desText,]}>Thurs,16/01/2024</Text>
                </View>
                <View style={styles.line} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.desText,]}>03:24 AM</Text>
                </View>
                <View style={styles.line} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.desText,]}>- £511</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    outerView: {
        borderRadius: 4,
        borderColor: colors.neutral_300,
        borderWidth: 1,
        marginHorizontal: 10
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral_300,
        // backgroundColor: colors.primary_300,

    },
    line: {
        width: 1,
        backgroundColor: colors.neutral_300,
    },
    headerText: {
        ...FontStyle(9, colors.neutral_600, '600'),
        textAlign: 'center',
        marginVertical: 5,
        // flex: 1
    },
    desText: {
        ...FontStyle(9, colors.neutral_900),
        textAlign: 'center',
        marginVertical: 5,
    },
    ticketView: { backgroundColor: colors.primary_300, padding: 5, borderRadius: 100, alignSelf: 'center', paddingHorizontal: 10, margin: 3 }
})