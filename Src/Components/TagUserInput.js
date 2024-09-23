import { StyleSheet, Text, TextInput, Pressable, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import colors from '../Themes/Colors'
import { FontStyle } from '../utils/commonFunction'
import RenderUserIcon from './RenderUserIcon'

export default function TagUserInput({ keyword,
    onSelect, data }) {
    const { user, groupCreateAllUsers } = useSelector(e => e.common)
    const [showTagModal, setshowTagModal] = useState(false)
    const [userList, setuserList] = useState(false)

    if (keyword == null) {
        return null;
    }

    return (
        <View >
            <ScrollView keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'} style={styles.scrollView}>
                {
                    data.length > 0 && data.filter(one => one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
                        .map((item, index) => {

                            return (
                                <View key={index}>
                                    <Pressable activeOpacity={0.5} onPress={() => onSelect(item)} style={[ApplicationStyles.row, styles.listView]}>
                                        <RenderUserIcon url={item?.avtar} type='user' userId={item?._id} height={30} isBorder={item?.subscribedMember} />
                                        <Text style={styles.listText}>{item?.name}</Text>
                                    </Pressable>
                                </View>
                            )
                        }
                        )
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    listText: {
        ...FontStyle(12, colors.neutral_900),
        marginLeft: 15,
        flex: 1
    },
    listView: {
        paddingVertical: 5,
        paddingHorizontal: 8,
        // backgroundColor: colors.inputBg,
    },
    lineStyle: {
        borderWidth: 0.6,
        marginVertical: 6,
        borderColor: colors.secondary_500
    },
    scrollView: {
        backgroundColor: colors.inputBg, maxHeight: 200, borderWidth: 1
    }
})