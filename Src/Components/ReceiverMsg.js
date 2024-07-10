import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {SCREEN_WIDTH, hp, wp} from '../Themes/Fonts';
import colors from '../Themes/Colors';
import {FontStyle} from '../utils/commonFunction';
import {Menu} from 'react-native-material-menu';
import {api} from '../utils/apiConstants';
import moment from 'moment';

const ReciverMsg = ({data}) => {
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  return (
    <View>
      <View style={styles.conatiner}>
        <Image
          resizeMode="cover"
          style={styles.imgStyle}
          source={{uri: api.IMAGE_URL + data?.createdBy?.avtar}}
        />
        <View style={styles.columnContainer}>
          <Menu
            style={styles.menuStyle}
            visible={visible}
            anchor={
              <TouchableOpacity
                onLongPress={showMenu}
                style={styles.boxContainer}>
                <Text style={styles.nameTextStyle}>
                  {data?.createdBy?.first_Name +
                    ' ' +
                    data?.createdBy?.last_Name}
                </Text>
                <Text style={styles.msgTextStyle}>{data?.content}</Text>
              </TouchableOpacity>
            }
            onRequestClose={hideMenu}>
            <View style={styles.menuChildrenContainer}>
              <TouchableOpacity onPress={hideMenu}>
                <Text style={styles.itemMenuTextStyle}>{'Forward'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={hideMenu}>
                <Text style={styles.itemMenuTextStyle}>{'Copy'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={hideMenu}>
                <Text style={styles.itemMenuTextStyle}>{'Delete for me'}</Text>
              </TouchableOpacity>
            </View>
          </Menu>
          <Text style={styles.timeTextStyle}>
            {moment(data?.createdAt).format('HH:mm')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    maxWidth: SCREEN_WIDTH - wp(50),
    marginHorizontal: wp(10),
    marginBottom: hp(10),
  },
  imgStyle: {
    height: wp(35),
    width: wp(35),
    borderRadius: wp(35 / 2),
  },
  boxContainer: {
    backgroundColor: colors.neutral_250,
    padding: wp(10),
    borderRadius: wp(5),
  },
  nameTextStyle: {
    ...FontStyle(14, colors.neutral_900, '900'),
  },
  msgTextStyle: {
    ...FontStyle(14, colors.neutral_900, '400'),
    marginTop: hp(5),
  },
  columnContainer: {
    marginLeft: wp(10),
  },
  timeTextStyle: {
    ...FontStyle(10, colors.neutral_500, '400'),
    marginTop: hp(5),
  },
  menuStyle: {
    backgroundColor: colors.neutral_400,
  },
  menuChildrenContainer: {
    padding: wp(10),
    borderWidth: 1,
    borderColor: colors.neutral_150,
  },
  itemMenuTextStyle: {
    ...FontStyle(14, colors.neutral_900, '600'),
    marginVertical: hp(1),
  },
});

export default ReciverMsg;
