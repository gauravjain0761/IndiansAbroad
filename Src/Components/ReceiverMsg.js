import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SCREEN_WIDTH, hp, wp } from '../Themes/Fonts';
import colors from '../Themes/Colors';
import { FontStyle } from '../utils/commonFunction';
import { Menu } from 'react-native-material-menu';
import { api } from '../utils/apiConstants';
import moment from 'moment';
import RenderUserIcon from './RenderUserIcon';
import RenderText from './RenderText';


const ReciverMsg = ({ data }) => {
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  return (
    <View>
      <View style={styles.conatiner}>
        <View style={{ marginTop: 3 }}>
          <RenderUserIcon url={data?.createdBy?.avtar} height={31} isBorder={data?.createdBy?.subscribedMember} />
        </View>
        {/* <Image
          resizeMode="cover"
          style={styles.imgStyle}
          source={{ uri: api.IMAGE_URL + data?.createdBy?.avtar }}
        /> */}
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
                <View style={{ flexDirection: 'row' }}>
                  <RenderText style={styles.msgTextStyle} text={data?.content}></RenderText>
                  <Text style={[styles.timeTextStyle, { color: colors.neutral_300 }]}>  {moment(data?.createdAt).format('HH:mm')}</Text>
                </View>
                {/* <Text style={styles.msgTextStyle}>{data?.content}<Text style={[styles.timeTextStyle, { color: colors.neutral_300 }]}>  {moment(data?.createdAt).format('HH:mm')}</Text></Text> */}
                <Text style={[styles.timeTextStyle, {
                  marginTop: -13,
                }]}>
                  {moment(data?.createdAt).format('HH:mm')}
                </Text>
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
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    // maxWidth: SCREEN_WIDTH - wp(100),
    marginHorizontal: wp(10),
    marginBottom: hp(10),
    // alignItems: 'center'
  },
  imgStyle: {
    height: wp(35),
    width: wp(35),
    borderRadius: wp(35 / 2),
  },
  boxContainer: {
    borderRadius: wp(5),
    backgroundColor: colors.neutral_300,
    // flexDirection: 'row'
  },
  nameTextStyle: {
    ...FontStyle(14, colors.neutral_900, '700'),
    paddingHorizontal: wp(10),
    paddingTop: wp(5)
  },
  msgTextStyle: {
    ...FontStyle(14, colors.neutral_900, '400'),
    paddingLeft: wp(5),
    paddingBottom: wp(5),
    maxWidth: SCREEN_WIDTH - wp(170)
  },
  columnContainer: {
    marginLeft: wp(10),
  },
  timeTextStyle: {
    ...FontStyle(10, colors.neutral_900, '400'),
    textAlign: 'right',
    alignSelf: 'flex-end',
    paddingHorizontal: 4,
    paddingBottom: 3,

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
