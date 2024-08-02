import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import { useNavigation } from '@react-navigation/native';
import RenderUserIcon from '../../Components/RenderUserIcon';
import { hp, SCREEN_WIDTH, wp } from '../../Themes/Fonts';
import colors from '../../Themes/Colors';
import { FontStyle, ImageStyle } from '../../utils/commonFunction';
import { screenName } from '../../Navigation/ScreenConstants';
import RenderChatMedia from '../../Components/RenderChatMedia';
import RenderLinkChat from '../../Components/RenderLinkChat';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icons } from '../../Themes/Icons';
import NoDataFound from '../../Components/NoDataFound';
import GroupMemberItem from '../../Components/GroupMemberItem';

export default function GroupDetailScreen() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { chatMessageList, user, activeChatRoomUser } = useSelector(e => e.common);
    const [tabSelection, setTabSelection] = useState('media');
    const [visible, setVisible] = useState(false);
    const listData = [1, 2, 3, 4]

    const hideMenu = () => setVisible(false);

    const showMenu = () => setVisible(true);

    const renderItem = ({ item, index }) => {
        return (
            <View>
                <RenderChatMedia noOfItem={4} item={item} index={index} />
                {index == listData.length - 1 &&
                    <TouchableOpacity onPress={() => navigation.navigate(screenName.GroupMediaScreen)} style={styles.moreView}><Text style={styles.moreText}>50{'\n'}more</Text></TouchableOpacity>
                }
            </View>
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
                renderRight={() => {
                    return (
                        <Menu
                            visible={visible}
                            anchor={
                                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: wp(16), height: 50 }} onPress={showMenu}>
                                    <Image source={Icons.dotMenu} style={ImageStyle(22, 22)} />
                                </TouchableOpacity>
                            }
                            onRequestClose={hideMenu}
                            style={styles.menu}>
                            <MenuItem textStyle={styles.itemText} onPress={() => { hideMenu(), setTimeout(() => { }, 500); }}>
                                Edit
                            </MenuItem>
                            <MenuItem textStyle={styles.itemText} onPress={() => { hideMenu(), setTimeout(() => { }, 500); }}>
                                Leave Group
                            </MenuItem>
                        </Menu>
                    )
                }}
            />
            <ScrollView style={{ flex: 1 }} >
                <View style={styles.userViewStyle}>
                    <View style={styles.imageView}>
                        <RenderUserIcon url={activeChatRoomUser?.currentUser?.chatLogo[0]?.location} height={100} isBorder={false} />
                    </View>
                    <Text style={styles.userText}>{activeChatRoomUser?.currentUser?.chatName}</Text>

                </View>
                <Text style={styles.title}>Media & Links</Text>
                <View>
                    <FlatList
                        style={styles.flatList}
                        key={'#'}
                        keyExtractor={item => "#" + item?._id}
                        columnWrapperStyle={styles.columnStyle}
                        numColumns={4}
                        bounces={false}
                        data={listData}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                <View style={styles.memberView}>
                    <Text style={styles.menberText}>Member ({activeChatRoomUser?.currentUser?.users?.length})</Text>
                    <TouchableOpacity onPress={() => navigation.navigate(screenName.AddMemberScreen)} style={ApplicationStyles.row}>
                        <Image source={Icons.plus} style={styles.plusIcon} />
                        <Text style={[styles.menberText, { color: colors.primary_500 }]}>Add Member</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {/* activeChatRoomUser?.currentUser?.users */}
                    <FlatList
                        data={activeChatRoomUser?.currentUser?.users}
                        renderItem={({ item, index }) => {
                            return <GroupMemberItem item={item} index={index} />
                        }}
                        ListEmptyComponent={<NoDataFound />}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    itemText: {
        ...FontStyle(18, colors.neutral_900),
        width: 150
    },
    menu: {
        backgroundColor: colors.neutral_300,
        borderColor: colors.neutral_400,
        marginTop: 30,
        width: 150,
    },
    userViewStyle: {
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
        ...FontStyle(18, colors.neutral_900, '700'),
        textAlign: 'center',
        marginVertical: 10
    },
    title: {
        ...FontStyle(18, colors.neutral_900, '700'),
        marginHorizontal: wp(10),
        marginBottom: 10
    },
    columnStyle: {
        width: '100%',
        columnGap: wp(10),
        rowGap: wp(10),
        paddingBottom: wp(10)
    },
    flatList: {
        paddingHorizontal: wp(10),
    },
    moreView: {
        position: 'absolute',
        zIndex: 11111,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    moreText: {
        ...FontStyle(18, colors.white, '700'),
        textAlign: 'center',
        lineHeight: 20
    },
    menberText: {
        ...FontStyle(15, colors.neutral_900),
    },
    memberView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: wp(10),
        marginTop: wp(5)
    },
    plusIcon: {
        tintColor: colors.primary_500,
        height: 15, width: 15,
        marginRight: 5
    },

})