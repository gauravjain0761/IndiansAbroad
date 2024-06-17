import { FlatList, ScrollView, StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native'
import React from 'react'
import Header from '../Components/Header';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import PostCard from '../Components/PostCard';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import { Icons } from '../Themes/Icons';
import { fontname } from '../Themes/Fonts';
import colors from '../Themes/Colors';

export default function PostDetail() {
    const navigation = useNavigation()

    const renderItem = ({ item, index }) => {
        return <View>
            <View style={styles.headerView}>
                <TouchableOpacity style={styles.userImage}>
                    <Image source={Icons.userImage} style={ImageStyle(57, 57, 'cover')} />
                </TouchableOpacity>
                <View style={styles.commentBg}>
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

            </View>
        </View>
    }

    return (
        <View style={ApplicationStyles.applicationView}>
            <Header
                title={'IndiansAbroad'}
                showLeft={true}
                onLeftPress={() => {
                    navigation.goBack();
                }}
            />
            <ScrollView>
                <PostCard />
                <FlatList
                    data={[0, 1, 2, 3]}
                    renderItem={renderItem}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
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
    commentBg: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        backgroundColor: colors.inputBg,
        paddingVertical: 5,
        borderRadius: 4,
        paddingHorizontal: 3
    }
})