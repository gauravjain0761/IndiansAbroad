import { StyleSheet, View, SafeAreaView, Image, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import { FontStyle, ImageStyle } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { screenName } from '../../Navigation/ScreenConstants';
import { wp } from '../../Themes/Fonts';
import { Icons } from '../../Themes/Icons';
import RenderUserIcon from '../../Components/RenderUserIcon';
export default function ListParticipantsScreen() {
    const navigation = useNavigation()
    const { user } = useSelector(e => e.common)
    const dispatch = useDispatch()

    const renderItem = ({ item }) => (
        <View style={styles.rowItem}>
            <RenderUserIcon height={45} isBorder={true} />
            <View style={ApplicationStyles.flex}>
                <Text style={styles.nameText}>Dhruv Solanki</Text>
                <Text style={styles.nameText}>Confirmation Number: 4598734</Text>
            </View>
            <Image source={Icons.checkRound} style={[ImageStyle(26, 26), { tintColor: colors.primary_500, marginHorizontal: 10 }]} />
        </View>
    )

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header title={''} showLeft={true} onLeftPress={() => { navigation.goBack() }} />
            <View style={styles.row}>
                <Image source={Icons.group} style={[ImageStyle(26, 26), { tintColor: colors.primary_500 }]} />
                <Text style={styles.totalText}>1.1K Particpants</Text>
                <TouchableOpacity onPress={() => navigation.navigate(screenName.AnnouncementScreen)}>
                    <Image source={Icons.megaphone} style={[ImageStyle(26, 26), { marginHorizontal: 10 }]} />
                </TouchableOpacity>
            </View>
            <View style={ApplicationStyles.flex}>
                <FlatList
                    data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 23]}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={styles.line} />}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: wp(16),
        gap: 10
    },
    totalText: {
        flex: 1, ...FontStyle(16, colors.primary_500, '700')
    },
    line: {
        height: 1,
        backgroundColor: colors.secondary_500
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 5,
        gap: 10,
        borderWidth: 1,
        borderColor: colors.neutral_400,
        backgroundColor: colors.inputBg,
        marginVertical: 10,
        borderRadius: 4,
        padding: 8
    },
    nameText: {
        ...FontStyle(14, colors.neutral_900)
    }
})