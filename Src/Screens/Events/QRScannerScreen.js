import { StyleSheet, View, SafeAreaView, Image, Text, TouchableOpacity, FlatList, Alert } from 'react-native'
import React from 'react'
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import { FontStyle, ImageStyle } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { screenName } from '../../Navigation/ScreenConstants';
import { SCREEN_WIDTH, wp } from '../../Themes/Fonts';
import { Icons } from '../../Themes/Icons';
import RenderUserIcon from '../../Components/RenderUserIcon';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

export default function QRScannerScreen() {
    const navigation = useNavigation()
    const { user } = useSelector(e => e.common)
    const dispatch = useDispatch()

    const onSuccess = (e) => {
        Alert.alert('QR Code Scanned!', e.data);
        navigation.navigate(screenName.QRSuccessScreen)
    };

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header onlyLabel={'IndiansAbroad Event Ticket Scanner'} title={''} />
            <View style={ApplicationStyles.flex}>
                <Text onPress={() => navigation.navigate(screenName.QRSuccessScreen)} style={styles.title}>Scan</Text>
                <View style={[styles.camera, { marginTop: 0 }]}>
                    <QRCodeScanner
                        flashMode={RNCamera.Constants.FlashMode.torch}
                        onRead={onSuccess}
                        // showMarker
                        cameraProps={{
                            barCodeScanner: true,
                        }}
                        cameraContainerStyle={{ backgroundColor: 'red', height: SCREEN_WIDTH / 1.5 }}
                        containerStyle={{
                            backgroundColor: 'red', marginTop: 100,
                            height: SCREEN_WIDTH / 1.5
                        }}
                        cameraStyle={styles.camera} />
                </View>

            </View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.title2}>Cancel</Text>

            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        ...FontStyle(24, colors.neutral_900, '700'),
        textAlign: 'center',
        marginTop: 20
    },
    centerText: {
        fontSize: 18,
        padding: 16,
    },
    camera: {
        height: SCREEN_WIDTH / 1.5,
        width: SCREEN_WIDTH / 1.5,
        alignSelf: 'center',
    },
    title2: {
        ...FontStyle(20, colors.neutral_900, '700'),
        textAlign: 'center',
        marginTop: 20,
        position: 'absolute',
        bottom: 50,
        width: '100%'
    }
})