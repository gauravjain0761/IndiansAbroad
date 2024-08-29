import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import { useNavigation } from '@react-navigation/native';
import RenderUserIcon from '../../Components/RenderUserIcon';
import { hp, wp } from '../../Themes/Fonts';
import { FontStyle, ImageStyle, searchUserByName } from '../../utils/commonFunction';
import { dispatchAction } from '../../utils/apiGlobal';
import { SET_MAIN_FOLLOWER_LIST } from '../../Redux/ActionTypes';
import SearchBar from '../../Components/SearchBar';
import NoDataFound from '../../Components/NoDataFound';
import { Icons } from '../../Themes/Icons';
import colors from '../../Themes/Colors';
import CommonButton from '../../Components/CommonButton';
import { onGetGroupCreateUser, onInviteMember } from '../../Services/ChatServices';

export default function AddMemberScreen() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { followerList, user, groupCreateAllUsers, activeChatDetails } = useSelector(e => e.common)
    const [list, setlist] = useState(undefined)
    const [selectedUsers, setselectedUsers] = useState([])
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        setselectedUsers([])
        let obj = {
            params: {
                search: '',
                groupId: activeChatDetails?._id
            },
            onSuccess: (res) => {
                setlist(res?.data)
            }
        }
        dispatch(onGetGroupCreateUser(obj))
    }, [])

    const setSelect = (id) => {
        let temp = Object.assign([], selectedUsers)
        if (temp.includes(id)) {
            const index = temp.indexOf(id);
            if (index > -1) { // only splice array when item is found
                temp.splice(index, 1); // 2nd parameter means remove one item only
            }
            setselectedUsers(temp)
        } else {
            temp.push(id)
            setselectedUsers(temp)
        }
    }


    const renderItem = ({ item, index }) => {
        return (
            <View key={index} style={[ApplicationStyles.row, { paddingHorizontal: hp(10) }]}>
                <View style={[ApplicationStyles.row, styles.listView]}>
                    <RenderUserIcon url={item?.avtar} height={48} isBorder={item?.subscribedMember} />
                    <Text style={styles.listText}>{item?.first_Name} {item?.last_Name}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelect(item._id)}>
                    <Image source={selectedUsers.includes(item?._id) ? Icons.checkbox1 : Icons.checkbox} style={[ImageStyle(20, 20), { top: 1, marginRight: 6 }]} />
                </TouchableOpacity>
            </View>
        );
    };

    const onSearchName = (search) => {
        let arr = searchUserByName(groupCreateAllUsers, undefined, search)
        setlist(arr)
    }

    const onPressAdd = () => {
        let obj = {
            data: {
                groupId: activeChatDetails?._id,
                currentUser: user?._id,
                invitedUser: selectedUsers
            },
            onSuccess: () => {
                navigation.goBack()
            }
        }
        dispatch(onInviteMember(obj))
    }

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header title={''} showLeft={true} onLeftPress={() => { navigation.goBack() }} onlyLabel={'Send Group Invitation'} />
            <SearchBar value={searchText} onChangeText={text => { setSearchText(text), onSearchName(text) }} placeholder={'Search users'} containerStyles={{ marginVertical: 5 }} />
            {list && <FlatList data={list} renderItem={renderItem} showsVerticalScrollIndicator={false} ListEmptyComponent={<NoDataFound />} />}
            <CommonButton onPress={() => onPressAdd()} title={'Add'} extraStyle={{ margin: wp(20) }} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    listText: {
        ...FontStyle(14, colors.neutral_900),
        marginLeft: 15,
        flex: 1
    },
    listView: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 5,
        borderColor: colors.neutral_400,
        flex: 1,
    },
    publishText: {
        ...FontStyle(14, colors.white),
    },
})