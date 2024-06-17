import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Icons } from '../Themes/Icons'
import { FontStyle, ImageStyle } from '../utils/commonFunction'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { SCREEN_WIDTH, fontname } from '../Themes/Fonts'
import colors from '../Themes/Colors'
import ReactNativeModal from 'react-native-modal'
import ModalContainer from './ModalContainer'

export default function PostCard({ item, index }) {
    const [menuModal, setmenuModal] = useState(false)
    return (
        <View key={index}>
            <View style={styles.headerView}>
                <TouchableOpacity style={styles.userImage}>
                    <Image source={Icons.userImage} style={ImageStyle(57, 57, 'cover')} />
                </TouchableOpacity>
                <View style={ApplicationStyles.flex}>
                    <Text style={styles.username}>Nikita Khairnar</Text>
                    <Text style={styles.degreeText}>PhD Student, Seoul</Text>
                    <Text style={styles.degreeText}>15 hours ago</Text>
                </View>
                <View>
                    <TouchableOpacity style={styles.messageView}>
                        <Image source={Icons.messageIcon} style={ImageStyle(36, 36, 'cover')} />
                        <Text style={styles.degreeText}>Message</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Text style={styles.description}>Delicious dessert and Pretty view</Text>
            </View>
            <View>
                <Image source={Icons.postViewImage} style={styles.postImage} />
            </View>
            <View style={styles.bottomRow}>
                <View style={styles.middlerow}>
                    <TouchableOpacity style={styles.innerRow}>
                        <Image source={Icons.heart} style={ImageStyle(22, 22)} />
                        <Text style={styles.username}>7 Likes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.innerRow}>
                        <Image source={Icons.chatCircle} style={ImageStyle(22, 22)} />
                        <Text style={styles.username}>1 Comments</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.innerRow}>
                        <Image source={Icons.share} style={ImageStyle(22, 22)} />
                        <Text style={styles.username}>Share</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setmenuModal(true)} style={[styles.innerRow, { ...ApplicationStyles.flex }]}>
                    <Image source={Icons.dotMenu} style={ImageStyle(22, 22)} />
                </TouchableOpacity>
            </View>
            <ModalContainer isVisible={menuModal} onClose={() => setmenuModal(false)} transparent={true}>
                <View style={styles.modalView}>
                    <Text style={styles.modalUserName}>Nikita Khairnar</Text>
                    <View style={styles.line} />
                    <TouchableOpacity>
                        <Text style={styles.modalText}>Disconnect</Text>
                    </TouchableOpacity>
                    <View style={[styles.line, { borderBottomColor: colors.neutral_500 }]} />
                    <TouchableOpacity>
                        <Text style={styles.modalText}>Block/Unblock</Text>
                    </TouchableOpacity>
                    <View style={[styles.line, { borderBottomColor: colors.neutral_500 }]} />
                    <TouchableOpacity>
                        <Text style={styles.modalText}>Report</Text>
                    </TouchableOpacity>
                    <View style={styles.line} />
                </View>
            </ModalContainer>
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
        ...FontStyle(fontname.actor_regular, 13, colors.neutral_900)
    },
    degreeText: {
        ...FontStyle(fontname.actor_regular, 11, colors.neutral_900)
    },
    messageView: {
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    description: {
        ...FontStyle(fontname.actor_regular, 13, colors.neutral_900),
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