import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Icons } from '../Themes/Icons'
import { FontStyle, ImageStyle } from '../utils/commonFunction'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { SCREEN_WIDTH, fontname } from '../Themes/Fonts'
import colors from '../Themes/Colors'
import RenderUserIcon from './RenderUserIcon'
import PostShareModal from './PostShareModal'

export default function DiscussionForum({ item, index, isUser = false }) {
    const [menuModal, setmenuModal] = useState(false)
    return (
        <View key={index}>
            <View style={styles.headerView}>
                <TouchableOpacity style={styles.userImage}>
                    <RenderUserIcon height={57} isBorder />
                </TouchableOpacity>
                <View style={ApplicationStyles.flex}>
                    <Text style={styles.username}>Ranjani raman</Text>
                    {!isUser && <Text style={styles.degreeText}>Founder</Text>}
                    <Text style={styles.degreeText}>15 hours ago</Text>
                </View>
                {isUser ? <View>
                    <TouchableOpacity style={styles.messageView}>
                        <Image source={Icons.connect} style={ImageStyle(30, 30, 'cover')} />
                        <Text style={[styles.degreeText,{lineHeight:16}]}>Connect</Text>
                    </TouchableOpacity>
                </View> :  <TouchableOpacity style={styles.messageView}>
                        <Image source={Icons.trash} style={ImageStyle(30, 30, 'cover')} />
                        
                    </TouchableOpacity> }
            </View>
            <View>
                <Text style={styles.description}>Shop from Indian websites with international shipping</Text>
                <Text style={styles.description1}>Hey everyone, join here to discuss your shopping needs from India and we will deliver them to your home worldwide</Text>
            </View>
            <View>
                <Image source={Icons.postViewImage} style={styles.postImage} />
            </View>
            <PostShareModal menuModal={menuModal} setmenuModal={() => setmenuModal(false)} />
        </View>
    )
}

const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        gap: 10,
        paddingHorizontal: 10,
        paddingTop: 10
    },
    userImage: {
        height: 57, width: 57, borderRadius: 57 / 2
    },
    username: {
        ...FontStyle(fontname.actor_regular, 12, colors.neutral_900),
        // lineHeight:18
    },
    degreeText: {
        ...FontStyle(fontname.actor_regular, 11, colors.neutral_900),
        // lineHeight:18
    },
    messageView: {
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    description: {
        ...FontStyle(fontname.abeezee, 16, colors.neutral_900, "700"),
        paddingBottom: 10,
        paddingHorizontal: 20,
        marginTop: 10
    },
    description1: {
        ...FontStyle(fontname.actor_regular, 12, colors.neutral_900, "400"),
        paddingBottom: 10,
        paddingHorizontal: 20
    },
    postImage: {
        height: SCREEN_WIDTH - 5,
        resizeMode: 'contain',
        width: SCREEN_WIDTH - 5,
        borderRadius: 4,
        alignSelf: 'center'
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 4,
        borderColor: colors.secondary_500,
    },
    middlerow: {
        width: '85%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20
    },
    innerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'center',
        paddingVertical: 10
    },
    modalView: {
        backgroundColor: colors.neutral_300,
        paddingHorizontal: 3
    },
    modalUserName: {
        ...FontStyle(fontname.abeezee, 16, colors.neutral_900, '700'),
        paddingVertical: 15,
        textAlign: 'center'
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral_800,
    },
    modalText: {
        ...FontStyle(fontname.actor_regular, 18, colors.neutral_900),
        paddingVertical: 15,
        paddingHorizontal: 20
    }
})