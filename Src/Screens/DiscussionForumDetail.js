import { FlatList, ScrollView, StyleSheet, TouchableOpacity, Text, View, Image, SafeAreaView, TextInput } from 'react-native'
import React, { useState } from 'react'
import Header from '../Components/Header';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import PostCard from '../Components/PostCard';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import { Icons } from '../Themes/Icons';
import { fontname } from '../Themes/Fonts';
import colors from '../Themes/Colors';
import RenderUserIcon from '../Components/RenderUserIcon';
import DiscussionForum from '../Components/DiscussionForum';

export default function DiscussionForumDetail() {
    const navigation = useNavigation()
    const [commentText, setcommentText] = useState('')

    const RenderReply = ({ item, index, isLastIndex }) => {
        return (
            <View style={styles.replyCommentView}>
                <View style={[styles.replyCommnt, { alignItems: isLastIndex ? 'flex-start' : 'center' }]}>
                    <View style={[styles.verticalLine, { height: isLastIndex ? '50%' : '100%' }]} />
                    <View style={styles.horizontalLine} />
                    <View style={styles.innerCommentRow}>
                        <RenderUserIcon height={38} isBorder />
                        <View style={styles.commentBg}>
                            <View style={ApplicationStyles.flex}>
                                <Text style={[styles.username, { fontSize: 9 }]}>Nikita Khairnar</Text>
                                <Text style={[styles.degreeText, { fontSize: 7 }]}>PhD Student, Seoul</Text>
                                <Text style={styles.commentText}>Nice</Text>
                            </View>
                            <View style={styles.innerRow}>
                                <TouchableOpacity style={styles.likesRow}>
                                    <Image source={Icons.heart} style={ImageStyle(15, 15)} />
                                    <Text style={styles.likesText}>1 Likes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const RenderItem = ({ item, itemIndex }) => {
        const replyData = itemIndex == 0 ? [0] : [0, 1, 2, 3]
        return <View style={{ marginBottom: 10 }}>
            <View style={styles.headerView}>
                <RenderUserIcon height={53} isBorder />
                <View style={styles.commentBg}>
                    <View style={ApplicationStyles.flex}>
                        <Text style={styles.username}>Nikita Khairnar</Text>
                        <Text style={styles.degreeText}>PhD Student, Seoul</Text>
                        <Text style={styles.commentText2}>Great</Text>
                    </View>
                    <View style={styles.innerRow}>
                        <TouchableOpacity style={styles.likesRow}>
                            <Image source={Icons.heart} style={ImageStyle(15, 15)} />
                            <Text style={styles.likesText}>1 Likes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.likesRow}>
                            <Image source={Icons.replyIcon} style={ImageStyle(15, 15)} />
                            <Text style={styles.likesText}>Reply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {(itemIndex == 0 || itemIndex == 1) &&
                <FlatList
                    data={replyData}
                    renderItem={({ item, index }) => {
                        return <RenderReply item={item} index={index} isLastIndex={replyData.length - 1 == index} />
                    }}
                />
            }
        </View>
    }

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header
                title={''}
                showLeft={true}
                onLeftPress={() => {
                    navigation.goBack();
                }}
            />
            <ScrollView>
                <View style={{ marginBottom: 10 }}>
                    <DiscussionForum />
                </View>
                <Text style={styles.commentText1}>4 comments</Text>
                <FlatList
                    data={[0, 1, 2, 3]}
                    renderItem={({ item, index }) => {
                        return <RenderItem itemIndex={index} item={item} />
                    }}
                />
            </ScrollView>
            <SafeAreaView>
                <View style={styles.commnetInput}>
                    {/* <RenderUserIcon height={46} isBorder /> */}
                    <TextInput style={styles.input} placeholder=' Add Comment' placeholderTextColor={colors.neutral_500} />
                    <TouchableOpacity style={styles.sendButton}>
                        <Image source={Icons.send} style={ImageStyle(24, 24)} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sendButton}>
                        <Image source={Icons.share} style={ImageStyle(24, 24, 'cover')} />
                        <Text style={[styles.shareText, { lineHeight: 16 }]}>Share</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        // paddingTop: 10
    },
    userImage: {
        height: 57, width: 57, borderRadius: 57 / 2
    },
    username: {
        ...FontStyle(fontname.actor_regular, 13, colors.neutral_900, '700')
    },
    degreeText: {
        ...FontStyle(fontname.actor_regular, 11, colors.neutral_900)
    },
    shareText: {
        ...FontStyle(fontname.actor_regular, 12, colors.neutral_900)
    },
    commentBg: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: colors.inputBg,
        paddingVertical: 5,
        borderRadius: 4,
        paddingHorizontal: 3,
        alignItems: 'flex-start'
    },
    likesText: {
        ...FontStyle(fontname.abeezee, 12, colors.neutral_900)
    },
    innerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    likesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3
    },
    replyCommentView: {
        alignSelf: 'flex-end'
    },
    commentText: {
        ...FontStyle(fontname.actor_regular, 12, colors.neutral_900)
    },
    commentText1: {
        textAlign: 'center',
        marginBottom: 8,
        ...FontStyle(fontname.abeezee, 13, colors.neutral_100)
    },
    commentText2: {
        ...FontStyle(fontname.actor_regular, 16, colors.neutral_900)
    },
    verticalLine: {
        width: 1,
        backgroundColor: colors.neutral_400,
        height: '50%'
    },
    replyCommnt: {
        width: '83%',
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    innerCommentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingVertical: 5,
        gap: 5,
    },
    horizontalLine: {
        width: 5, backgroundColor: colors.neutral_400, height: 1, alignSelf: 'center'
    },
    commnetInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary_500,
        paddingLeft: 10,
        paddingVertical: 2
    },
    input: {
        backgroundColor: colors.inputBg,
        flex: 1,
        ...FontStyle(fontname.actor_regular, 14, colors.neutral_900),
        borderRadius: 4,
        height: 47,
        paddingHorizontal: 10,
        marginLeft: 10
    },
    sendButton: {
        paddingHorizontal: 10,
        alignItems: 'center'
    }
})