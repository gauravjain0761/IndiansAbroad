import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import CommonButton from './CommonButton'
import { FontStyle } from '../utils/commonFunction'
import colors from '../Themes/Colors'
import { wp } from '../Themes/Fonts'

export default function CreatePageDescription({ onPress }) {
    return (
        <View>
            <Text style={styles.chatText}>My Page</Text>
            <ScrollView>
                <View style={styles.desView}>
                    <Text style={styles.title}>Expand Your Reach</Text>
                    <Text style={styles.des}>Connect with a wide audience of Indian expats and local Make your business, community, or group more visible.{'\n'}</Text>
                    <Text style={styles.title}>Engage Your Community</Text>
                    <Text style={styles.des}>Start and participate in engaging conversations. Easily promote and manage events.{'\n'}</Text>
                    <Text style={styles.title}>Showcase Your Expertise</Text>
                    <Text style={styles.des}>Post articles, updates, and resources. Establish yourself as a thought leader in your area of expertise.{'\n'}</Text>
                    <Text style={styles.title}>Enhanced Connectivity</Text>
                    <Text style={styles.des}>Communicate directly with followers and members. Keep everyone informed with instant notifications.{'\n'}</Text>
                    <Text style={styles.title}>Promote Your Business</Text>
                    <Text style={styles.des}>Reach potential customers within your community. Showcase and sell your products or services directly.</Text>
                </View>
                <CommonButton title={'CREATE PAGE'} onPress={() => onPress()} extraStyle={{ width: '50%', alignSelf: 'center', marginTop: 20 }} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    chatText: {
        // top: -19,
        textAlign: 'center',
        ...FontStyle(18, colors.secondary_600, '700'),
        marginVertical: 5
    },
    desView: {
        backgroundColor: colors.secondary_500,
        flex: 1,
        padding: wp(20),
        marginTop: 25
    },
    title: {
        ...FontStyle(14, colors.neutral_900, '700'),
        textAlign: 'center'
    },
    des: {
        ...FontStyle(14, colors.neutral_900, '400'),
        textAlign: 'center',
    }
})