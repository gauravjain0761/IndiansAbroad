import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Icons } from '../Themes/Icons'
import { FontStyle, ImageStyle } from '../utils/commonFunction'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { SCREEN_WIDTH, fontname } from '../Themes/Fonts'
import colors from '../Themes/Colors'
import ReactNativeModal from 'react-native-modal'
import ModalContainer from './ModalContainer'
import RenderUserIcon from './RenderUserIcon'
import PostShareModal from './PostShareModal'
import UpdateDeleteMenu from './UpdateDeleteMenu'
import { useSelector } from 'react-redux'
import PostCarousal from './PostCarousal'

export default function PostCard({ item, index, isUser = false }) {
    const [menuModal, setmenuModal] = useState(false)
    const { allPost, allPostsCount } = useSelector(e => e.common)

    if (item?.createdBy) {
        return (
            <View key={index}>
                <View style={styles.headerView}>
                    <TouchableOpacity style={styles.userImage}>
                        <RenderUserIcon height={57} isBorder />
                    </TouchableOpacity>
                    <View style={ApplicationStyles.flex}>
                        <Text style={styles.username}>{item?.createdBy?.first_Name} {item?.createdBy?.last_Name}</Text>
                        {/* {!isUser && <Text style={styles.degreeText}>PhD Student, Seoul</Text>} */}
                        <Text style={styles.degreeText}>{item?.timeElapsed}</Text>
                    </View>
                    {!isUser && <View>
                        {item?.isFollowing ?
                            <TouchableOpacity style={styles.messageView}>
                                <Image source={Icons.messageIcon} style={ImageStyle(30, 30, 'cover')} />
                                <Text style={styles.degreeText}>Message</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.messageView}>
                                <Image source={Icons.personAdd} style={ImageStyle(30, 30, 'cover')} />
                                <Text style={styles.degreeText}>Connect</Text>
                            </TouchableOpacity>
                        }
                    </View>}
                </View>
                {item?.message !== '' && <View>
                    <Text style={styles.description}>{item?.message}</Text>
                </View>}
                {item?.mediaFiles.length > 0 &&
                    <PostCarousal images={item?.mediaFiles} />
                }
                <View style={styles.bottomRow}>
                    <View style={styles.middlerow}>
                        <TouchableOpacity style={styles.innerRow}>
                            <Image source={item?.isLiked ? Icons.heartFilled : Icons.heart} style={ImageStyle(22, 22)} />
                            <Text style={styles.username}>{item?.likeCount} Likes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.innerRow}>
                            <Image source={Icons.chatCircle} style={ImageStyle(22, 22)} />
                            <Text style={styles.username}>{item?.commentCount} Comments</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.innerRow}>
                            <Image source={Icons.share} style={ImageStyle(22, 22)} />
                            <Text style={styles.username}>Share</Text>
                        </TouchableOpacity>
                    </View>
                    {isUser ?
                        <UpdateDeleteMenu icon={(<Image source={Icons.dotMenu} style={ImageStyle(22, 22)} />)} />
                        :
                        <TouchableOpacity onPress={() => setmenuModal(true)} style={[styles.innerRow, { ...ApplicationStyles.flex }]}>
                            <Image source={Icons.dotMenu} style={ImageStyle(22, 22)} />
                        </TouchableOpacity>
                    }
                </View>
                <PostShareModal item={item} menuModal={menuModal} setmenuModal={() => setmenuModal(false)} />
            </View>
        )
    }
    return (
        <View key={index}>
            <View style={styles.headerView}>
                <TouchableOpacity style={styles.userImage}>
                    <RenderUserIcon height={57} isBorder />
                </TouchableOpacity>
                <View style={ApplicationStyles.flex}>
                    <Text style={styles.username}>Nikita Khairnar</Text>
                    {!isUser && <Text style={styles.degreeText}>PhD Student, Seoul</Text>}
                    <Text style={styles.degreeText}>15 hours ago</Text>
                </View>
                {!isUser && <View>
                    <TouchableOpacity style={styles.messageView}>
                        <Image source={Icons.messageIcon} style={ImageStyle(30, 30, 'cover')} />
                        <Text style={styles.degreeText}>Message</Text>
                    </TouchableOpacity>
                </View>}
            </View>
            <View>
                <Text style={styles.description}>Festival of Cultures {'\n'}Event in Edinburgh</Text>
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
                {isUser ?
                    <UpdateDeleteMenu icon={(<Image source={Icons.dotMenu} style={ImageStyle(22, 22)} />)} />
                    :
                    <TouchableOpacity onPress={() => setmenuModal(true)} style={[styles.innerRow, { ...ApplicationStyles.flex }]}>
                        <Image source={Icons.dotMenu} style={ImageStyle(22, 22)} />
                    </TouchableOpacity>
                }
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
        ...FontStyle(fontname.actor_regular, 13, colors.neutral_900),
        textTransform: 'capitalize'
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
        resizeMode: 'cover',
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