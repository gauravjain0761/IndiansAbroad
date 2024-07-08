import { View, Text, StyleSheet, TouchableOpacity, TextInput, } from 'react-native';
import React, { useState } from 'react';
import { FontStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import { fontname, hp } from '../Themes/Fonts';
import ModalContainer from './ModalContainer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onReportApi } from '../Services/PostServices';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchAction } from '../utils/apiGlobal';
import { IS_LOADING } from '../Redux/ActionTypes';

export default function ReportModal({ visible, onClose, postId }) {
    const insets = useSafeAreaInsets();
    const [reportMsg, setreportMsg] = useState('')
    const { user } = useSelector(e => e.common)
    const dispatch = useDispatch()

    const onPressReport = () => {
        onClose()
        dispatchAction(dispatch, IS_LOADING, true)
        let obj = {
            data: {
                userId: user?._id,
                reportId: postId,
                reportMessage: reportMsg.trim()
            },
            onSuccess: () => { }
        }
        dispatch(onReportApi(obj))

    }
    return (
        <ModalContainer isVisible={visible} onClose={() => onClose()} transparent={true} >
            <View style={styles.modalView}>
                <Text style={styles.title}>Report</Text>
                <TextInput value={reportMsg} onChangeText={(text) => setreportMsg(text)} multiline={true} placeholder='Write here...' style={styles.input} placeholderTextColor={colors.neutral_500} />
                <TouchableOpacity onPress={() => onPressReport()} style={styles.blueButton}>
                    <Text style={styles.publishText}>Submit</Text>
                </TouchableOpacity>
                <View style={{ paddingBottom: insets.bottom }} />
            </View>
        </ModalContainer>
    )
}

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: colors.neutral_300,
        paddingHorizontal: 3,
    },
    title: {
        ...FontStyle(16, colors.neutral_900, '700'),
        textAlign: 'center',
        marginVertical: hp(25),
        marginHorizontal: hp(20)
    },
    input: {
        backgroundColor: colors.white,
        marginHorizontal: hp(20),
        borderRadius: 5,
        height: 150,
        textAlignVertical: 'top',
        padding: 15,
        ...FontStyle(14, colors.neutral_900),
    },
    publishText: {
        ...FontStyle(14, colors.white),
    },
    blueButton: {
        backgroundColor: colors.buttonBlue,
        alignSelf: 'flex-end',
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 10,
        width: 87,
        alignItems: 'center',
        borderRadius: 4,
        marginTop: hp(20)
    },
})