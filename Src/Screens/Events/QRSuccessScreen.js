import { StyleSheet, View, SafeAreaView, Image, Text, TouchableOpacity, FlatList, Alert } from 'react-native'
import React from 'react'
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontStyle, ImageStyle } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { screenName } from '../../Navigation/ScreenConstants';
import { SCREEN_WIDTH, wp } from '../../Themes/Fonts';
import { Icons } from '../../Themes/Icons';
import RenderUserIcon from '../../Components/RenderUserIcon';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import CommonButton from '../../Components/CommonButton';
import moment from 'moment';

export default function QRSuccessScreen() {
    const navigation = useNavigation()
    const { user } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const {params} = useRoute()

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header onlyLabel={'IndiansAbroad Event Ticket'} title={''} />
            <View style={styles.ticketView}>
                <Text style={styles.ticketText}>{`${params?.data?.attendee?.first_name} ${params?.data?.attendee?.last_name}`}</Text>
                {/* <Text style={styles.ticketText}>Confarmation Number: 4598734</Text> */}
                <Text style={styles.ticketText}>{params?.data?.event?.title}</Text>
                <Text style={styles.ticketText}>Starts at : {`${params?.data?.event?.start_time ? moment(params?.data?.event?.start_time).format("hh:mm a") : ""}`}</Text>
                <Text style={styles.ticketText}>{params?.data?.event?.address}</Text>
                {/* <CommonButton onPress={() => navigation.pop(2)} title={'Valid/invalid/Already Scanned'} extraStyle={{ marginTop: 20, width: SCREEN_WIDTH / 1.3, alignSelf: 'center', height: 45 }} /> */}
            </View>
            <CommonButton onPress={() => navigation.pop(2)} title={'Get in'} extraStyle={{ marginTop: 20, width: SCREEN_WIDTH / 1.3, alignSelf: 'center', height: 45, marginHorizontal: 30 }} />
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    ticketView: {
        marginHorizontal: 10,
        borderColor: colors.neutral_400,
        borderWidth: 1,
        borderRadius: 4,
        padding: 15,
        backgroundColor: colors.inputBg
    },
    ticketText: {
        ...FontStyle(17, colors.neutral_900)
    }
})