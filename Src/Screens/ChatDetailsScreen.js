import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Header from '../Components/Header';
import ApplicationStyles from '../Themes/ApplicationStyles';
import {FontStyle} from '../utils/commonFunction';
import {fontname, hp, wp} from '../Themes/Fonts';
import colors from '../Themes/Colors';
import SearchBar from '../Components/SearchBar';
import {Icons} from '../Themes/Icons';
import RenderUserIcon from '../Components/RenderUserIcon';
import ConnectCard from '../Components/ConnectCard';
import { screenName } from '../Navigation/ScreenConstants';
import { useNavigation } from '@react-navigation/native';
import ChatCard from '../Components/ChatCard';

export default function ChatDetailsScreen() {
  const [searchText, setSearchText] = useState('');
  const {navigate} = useNavigation();

  const ChatList = () => {
    return (
      <View style={styles.rowStyle}>
        <TouchableOpacity style={styles.userImage}>
          <RenderUserIcon height={57} isBorder />
        </TouchableOpacity>
        <View style={{marginLeft: 12, flex: 1}}>
          <Text style={styles.text}>Community Group</Text>
          <Text style={styles.text1}>ISRK</Text>
          <Text style={styles.text2}>Good Morning,Guys</Text>
        </View>
        <Text style={styles.text3}>2024-05-13</Text>
      </View>
    );
  };

  return (
    <View style={ApplicationStyles.applicationView}>
      <Header
        title={'IndiansAbroad'}
        showRight={true}
        isChatDetails={true}
        chatLeftPress={() => navigate(screenName.MyConnections)}
        chatRightPress={() => navigate(screenName.CreateGroup)}
      /> 
      <FlatList
        style={{
          paddingHorizontal: wp(8),
        }}
        columnWrapperStyle={{
          width: '100%',
          columnGap: wp(5),
          rowGap: hp(10),
        }}
        numColumns={2}
        bounces={false}
        data={[1, 2, 3, 2]}
        renderItem={({item}) => {
          return (
            <ChatCard
              cardPress={() => {
                navigate(screenName.indiansDetails);
              }}
              
            />
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chatText: {
    top: -8,
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 14, colors.secondary_600),
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(16),
    backgroundColor: colors.neutral_200,
    marginHorizontal: wp(8),
    borderRadius: 5,
    marginVertical: 5,
    paddingVertical: 5,
  },
  text: {
    lineHeight: 14,
    ...FontStyle(fontname.actor_regular, 9, colors.neutral_900),
  },
  text1: {
    marginTop: 1,
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_900, '700'),
  },
  text2: {
    lineHeight: 18,
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_900),
  },
  text3: {
    top: -8,
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_600),
  },
});
