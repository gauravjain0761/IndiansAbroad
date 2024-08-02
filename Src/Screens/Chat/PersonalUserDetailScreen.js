import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import { useNavigation } from '@react-navigation/native';
import RenderUserIcon from '../../Components/RenderUserIcon';
import { hp, SCREEN_WIDTH, wp } from '../../Themes/Fonts';
import colors from '../../Themes/Colors';
import { FontStyle } from '../../utils/commonFunction';
import { screenName } from '../../Navigation/ScreenConstants';
import RenderChatMedia from '../../Components/RenderChatMedia';
import RenderLinkChat from '../../Components/RenderLinkChat';

export default function PersonalUserDetailScreen() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { chatMessageList, user, activeChatRoomUser } = useSelector(e => e.common);
    const [tabSelection, setTabSelection] = useState('media');
    const renderItem = ({ item, index }) => {
        return (
            <RenderChatMedia item={item} index={index} />
        )
    }

    const renderItemLink = ({ item, index }) => {
        return (
            <RenderLinkChat item={item} index={index} profileImage={activeChatRoomUser?.currentUser?.avtar} name={`${activeChatRoomUser?.currentUser?.first_Name} ${activeChatRoomUser?.currentUser?.last_Name}`} />
        )
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
            <ScrollView style={{ flex: 1 }} >
                <View style={styles.userViewStyle}>
                    <View style={styles.imageView}>
                        <RenderUserIcon url={activeChatRoomUser?.currentUser?.avtar} height={100} isBorder={activeChatRoomUser?.currentUser?.subscribedMember} />
                    </View>
                    <Text style={styles.userText}>{activeChatRoomUser?.currentUser?.first_Name} {activeChatRoomUser?.currentUser?.last_Name}</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate(screenName.indiansDetails, { userId: activeChatRoomUser?.currentUser?._id })}
                        style={[styles.btnView, { marginLeft: 8, marginRight: 2 }]}>
                        <Text style={styles.btnText}>View Profile</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tabMainView}>
                    <TouchableOpacity onPress={() => { setTabSelection('media') }} style={[{ marginRight: wp(5), borderBottomColor: tabSelection == 'media' ? colors.primary_4574ca : 'transparent' }, styles.tabItemView,]}>
                        <Text style={tabSelection == 'media' ? styles.tabText : styles.tabText1}>{'Media'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setTabSelection('link') }} style={[{ marginRight: wp(5), borderBottomColor: tabSelection == 'link' ? colors.primary_4574ca : 'transparent' }, styles.tabItemView,]}>
                        <Text style={tabSelection == 'link' ? styles.tabText : styles.tabText1}>{'Links'}</Text>
                    </TouchableOpacity>
                </View>
                {tabSelection == 'media' ?
                    <View>
                        <FlatList
                            style={styles.flatList}
                            key={'#'}
                            keyExtractor={item => "#" + item?._id}
                            columnWrapperStyle={styles.columnStyle}
                            numColumns={3}
                            bounces={false}
                            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                    :
                    <View>
                        <FlatList
                            key={'_'}
                            keyExtractor={item => "_" + item?._id}
                            numColumns={1}
                            style={styles.flatList}
                            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                            renderItem={renderItemLink}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    userViewStyle: {
        // backgroundColor: colors.secondary_500,
        padding: hp(10),
        alignItems: 'center'
    },
    userImage: {
        width: wp(110),
        height: wp(110),
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    userText: {
        ...FontStyle(18, colors.neutral_900,),
        textAlign: 'center',
        marginVertical: 10
    },
    btnView: {
        backgroundColor: colors.primary_4574ca,
        // width: wp(78),
        alignItems: 'center',
        height: hp(32),
        borderRadius: 4,
        marginBottom: hp(12),
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    btnText: {
        ...FontStyle(13, colors.white, '400'),
    },
    tabMainView: {
        flexDirection: 'row',
        marginHorizontal: 20
    },
    tabItemView: {
        flex: 1,
        padding: wp(10),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: wp(10),
        borderBottomWidth: 3
    },
    tabText: {
        textAlign: 'center',
        ...FontStyle(15, colors.primary_6a7e, '700'),
    },
    tabText1: {
        textAlign: 'center',
        ...FontStyle(15, colors.neutral_900, '700'),
    },
    columnStyle: {
        width: '100%',
        columnGap: wp(10),
        rowGap: wp(10),
        paddingBottom: wp(10)
    },
    flatList: {
        paddingHorizontal: wp(10),
    }
})