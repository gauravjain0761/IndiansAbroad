import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import colors from '../Themes/Colors'
import { FontStyle } from '../utils/commonFunction'
import RenderUserIcon from './RenderUserIcon'

export default function TagUserInput({ data, onPressUser }) {
    const { user, groupCreateAllUsers } = useSelector(e => e.common)
    const [showTagModal, setshowTagModal] = useState(false)
    const [userList, setuserList] = useState(false)


    return (
        <View >

            <ScrollView style={styles.scrollView}>
                {
                    data.length > 0 && data.map((item, index) => {

                        return (
                            <View key={index}>
                                <TouchableOpacity activeOpacity={0.5} onPress={() => onPressUser(item)} style={[ApplicationStyles.row, styles.listView]}>
                                    <RenderUserIcon url={item?.avtar} type='user' userId={item?._id} height={30} isBorder={item?.subscribedMember} />
                                    <Text style={styles.listText}>{item?.first_Name} {item?.last_Name}</Text>
                                </TouchableOpacity>
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
        backgroundColor: colors.inputBg, maxHeight: 250, borderWidth: 1
    }
})