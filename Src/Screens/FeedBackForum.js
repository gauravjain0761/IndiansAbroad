import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import colors from '../Themes/Colors';
import { fontname, hp, wp } from '../Themes/Fonts';
import { emailCheck, errorToast, FontStyle } from '../utils/commonFunction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { screenName } from '../Navigation/ScreenConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import CommonButton from '../Components/CommonButton';
import { onFeedback } from '../Services/AuthServices';

export default function FeedBackForum() {
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [suggestion, setsuggestion] = useState('')
    const { user } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const isFocused = useIsFocused()

    useEffect(() => {
        setemail(user?.email)
        setname(user?.first_Name + ' ' + user?.last_Name)
        setsuggestion('')
    }, [isFocused])

    const onPressSubmit = () => {
        if (name.trim() == '') {
            errorToast('Please enter name')
        } else if (!emailCheck(email.trim())) {
            errorToast('Please enter valid email')
        } else if (suggestion.trim() == '') {
            errorToast('Please enter suggestion')
        } else {
            let obj = {
                data: {
                    userId: user?._id,
                    name: name.trim(),
                    email: email.trim(),
                    suggestion: suggestion.trim()
                },
                onSuccess: () => {
                    navigation.goBack()
                }
            }
            dispatch(onFeedback(obj))
        }
    }

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header title={''} showLeft onLeftPress={() => navigation.goBack()} />
            <KeyboardAwareScrollView style={{ marginHorizontal: wp(16), flex: 1 }}>
                <Text style={styles.headerText}>FeedBack Form</Text>
                <Text style={styles.headerText1}>
                    We respect your opinions and suggestions.Help us improve with your counsel
                </Text>
                <TextInput
                    placeholder={'Name'}
                    style={styles.inputText}
                    value={name}
                    onChangeText={(text) => setname(text)}
                    placeholderTextColor={colors.neutral_400}
                />
                <TextInput
                    placeholder={'Email Address'}
                    style={styles.inputText}
                    value={email}
                    onChangeText={(text) => setemail(text)}
                    placeholderTextColor={colors.neutral_400}
                />
                <TextInput
                    placeholder={'Your suggestions'}
                    style={[styles.inputText, { borderColor: colors.inputBg, height: 192, textAlignVertical: 'top', paddingTop: 10 }]}
                    multiline={true}
                    placeholderTextColor={colors.neutral_500}
                    value={suggestion}
                    onChangeText={(text) => setsuggestion(text)}
                />
                <CommonButton title={'Submit'} onPress={() => onPressSubmit()} extraStyle={[styles.btnView]} />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: colors.secondary_500,
    },
    itemView: {
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral_400,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: hp(12),
    },
    imageArrow: {
        transform: [{ rotate: '180deg' }],
        paddingHorizontal: hp(10),
    },
    headerText: {
        ...FontStyle(21, colors.neutral_900, '700'),
    },
    headerText1: {
        marginTop: 3,
        ...FontStyle(12, colors.neutral_600, '400'),
    },
    itemText: {
        ...FontStyle(20, colors.neutral_900, '700'),
    },
    inputText: {
        ...FontStyle(14, colors.neutral_900),
        borderWidth: 1,
        borderColor: colors.neutral_500,
        backgroundColor: colors.inputBg,
        paddingVertical: 4,
        borderRadius: 5,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginTop: 20,
        height: 56
    },
    btnView: {
        backgroundColor: colors.buttonBlue,
        marginBottom: 10,
        borderRadius: 5,
        // width: '48%',
        marginTop: 30,
    },
    btnText: {
        textAlign: 'center',
        ...FontStyle(15, colors.white),
        paddingVertical: 12,
    },
});