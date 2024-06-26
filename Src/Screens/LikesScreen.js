import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FontStyle } from '../utils/commonFunction'
import { fontname } from '../Themes/Fonts'
import colors from '../Themes/Colors'
import SearchBar from '../Components/SearchBar'
import RenderUserIcon from '../Components/RenderUserIcon'
import { useDispatch, useSelector } from 'react-redux'
import { onGetLikedUserList } from '../Services/PostServices'
import { api } from '../utils/apiConstants'

export default function LikesScreen() {
    const { goBack } = useNavigation()
    const [searchText, setSearchText] = useState('');
    const { likedUserList } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const { params } = useRoute()
    console.log(likedUserList)

    useEffect(() => {
        dispatch(onGetLikedUserList({
            data: { postId: params?.postId }
        }))
    }, [])


    const renderItem = ({ item, index }) => {
        return (
            <View key={index}>
                <TouchableOpacity key={index} style={[ApplicationStyles.row, styles.listView]}>
                    <RenderUserIcon url={api.IMAGE_URL + item?.avtar} height={45} isBorder={item?.subscribedMember} />
                    <Text style={styles.listText}>{item?.first_Name} {item?.last_Name}</Text>
                </TouchableOpacity>
                <View style={styles.lineStyle} />
            </View>
        );
    };

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header
                title={'IndiansAbroad'}
                showLeft={true}
                showRight={false}
                onLeftPress={() => goBack()}
            />
            <View style={{ borderTopWidth: 1, borderTopColor: colors.secondary_500, }}>
                <Text style={styles.chatText}>Likes</Text>
                <SearchBar
                    value={searchText}
                    onChangeText={text => setSearchText(text)}
                    placeholder={'Search'}
                />
            </View>
            <View style={{ paddingHorizontal: 0, marginTop: 8, flex: 1 }}>
                {likedUserList && <FlatList
                    data={likedUserList}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />}

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    chatText: {
        // top: -19,
        textAlign: 'center',
        ...FontStyle(fontname.actor_regular, 18, colors.secondary_600, '700'),
        marginVertical: 5
    },
    listText: {
        ...FontStyle(fontname.abeezee, 14, colors.neutral_900),
        marginLeft: 15,
        flex: 1
    },
    listView: {
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 5,
        borderColor: colors.neutral_400,
        backgroundColor: colors.inputBg,
        marginHorizontal: 8
    },
    lineStyle: {
        borderWidth: 0.6,
        marginVertical: 6,
        borderColor: colors.secondary_500
    }
})