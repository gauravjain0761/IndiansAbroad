import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import {useNavigation} from '@react-navigation/native';
import {errorToast, FontStyle, ImageStyle} from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {screenName} from '../../Navigation/ScreenConstants';
import {SCREEN_HEIGHT, SCREEN_WIDTH, wp} from '../../Themes/Fonts';
import {Icons} from '../../Themes/Icons';
import RenderUserIcon from '../../Components/RenderUserIcon';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {organizerVerifyTicketAction} from '../../Services/PostServices';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNQRGenerator from 'rn-qr-generator';

export default function QRScannerScreen() {
  const navigation = useNavigation();
  const {user} = useSelector(e => e.common);
  const dispatch = useDispatch();
  const [image, setimage] = useState(null);

  const onStarPres = (item) => {
    let obj = {
      data: {
        ticketId: item,
      },
      onSuccess: (res) => {
        console.log('res',res);
        
         navigation.navigate(screenName.QRSuccessScreen,{data:res})
      },
    };
    dispatch(organizerVerifyTicketAction(obj));
  };

  const onSelectImage = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
    })
      .then(image => {
        let imageUri = image.path;

        if (!imageUri.startsWith('file://')) {
            imageUri = `file://${imageUri}`;
          }
          RNQRGenerator.detect({uri: imageUri})
            .then(res => {
              if (res?.values?.length === 0) {
                errorToast("We couldn't detect a valid QR code")
              } else {
                console.log('res',res);
                const url = res?.values[0];
                const parts = url.split('/');
                const ticketId = parts[parts.length - 1];
                console.log(ticketId); 
                onStarPres(ticketId)
              }
            })
      })
      .catch(error => {
        console.log('err---', error);
      });
  };



  const onSuccess = e => {
    Alert.alert('QR Code Scanned!', e.data);
    if(e.data){
        const url = e.data;
        const parts = url.split('/');
        const ticketId = parts[parts.length - 1];
        console.log(ticketId); 
        onStarPres(ticketId)
    }
  };

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header onlyLabel={'IndiansAbroad Event Ticket Scanner'} title={''} />
      <View style={ApplicationStyles.flex}>
        <Text
          onPress={() => navigation.navigate(screenName.QRSuccessScreen)}
          style={styles.title}>
          Scan
        </Text>
        <View style={[styles.camera, {marginTop: 0}]}>
          <QRCodeScanner
            flashMode={RNCamera.Constants.FlashMode.torch}
            onRead={onSuccess}
            // showMarker
            cameraProps={{
              barCodeScanner: true,
            }}
            
            cameraContainerStyle={{
              backgroundColor: 'red',
              height: SCREEN_WIDTH / 1.5,
            }}
            containerStyle={{
              backgroundColor: 'red',
              marginTop: 100,
              height: SCREEN_WIDTH / 1.5,
            }}
            cameraStyle={styles.camera}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.scanView} onPress={() => onSelectImage()}>
        <Image source={Icons.gallery} style={styles.gallery}/>
        <Text style={styles.scanText}>Scan from gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.title2}>Cancel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    ...FontStyle(24, colors.neutral_900, '700'),
    textAlign: 'center',
    marginTop: 20,
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
    width: '100%',
  },
  scanText: {
    ...FontStyle(16, colors.neutral_900, '700'),
  },
  scanView:{
    marginTop: 20,
    position: 'absolute',
    bottom: SCREEN_HEIGHT*0.16,
    width: '100%',
    flexDirection:'row',
    alignItems:'center',
    alignSelf:'center',
    justifyContent:'center'
  },
  gallery:{
    width: 18,
    height: 18,
    marginRight:10
  }
});
