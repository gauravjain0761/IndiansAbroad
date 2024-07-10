import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../Components/Header';
import ApplicationStyles from '../Themes/ApplicationStyles';
import {FontStyle} from '../utils/commonFunction';
import {fontname, hp, wp} from '../Themes/Fonts';
import colors from '../Themes/Colors';
import SearchBar from '../Components/SearchBar';
import {Icons} from '../Themes/Icons';
import RenderUserIcon from '../Components/RenderUserIcon';
import ConnectCard from '../Components/ConnectCard';
import {screenName} from '../Navigation/ScreenConstants';
import {useNavigation} from '@react-navigation/native';
import ChatCard from '../Components/ChatCard';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {getChatMessage, getChatRooms} from '../Services/ChatServices';

export default function ChatScreen() {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const {navigate} = useNavigation();
  const {user, chatRoomList} = useSelector(e => e.common);

  useEffect(() => {
    let obj = {
      data: {
        curruntUser: user._id,
        searchText: '',
        page: 1,
      },
      onSuccess: () => {},
    };
    dispatch(getChatRooms(obj));
  }, []);

  const ChatList = () => {
    return (
      <View style={styles.rowStyle}>
        <TouchableOpacity style={styles.userImage}>
          <RenderUserIcon height={64} isBorder />
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

  const onPressItem = (item, currentUser) => {
    let obj = {
      data: {
        search: '',
        chatId: item._id,
        currUser: user._id,
        page: 1,
        userId: user._id,
      },
      onSuccess: () => {
        navigate(screenName.Messaging, {currentUser, chatId: item._id});
      },
    };
    dispatch(getChatMessage(obj));
  };

  return (
    <View style={ApplicationStyles.applicationView}>
      <SafeAreaView edges={['top']}>
        <Header
          title={'IndiansAbroad'}
          showRight={true}
          isChat={true}
          chatLeftPress={() => navigate(screenName.MyConnections)}
          chatRightPress={() => navigate(screenName.CreateGroup)}
        />
      </SafeAreaView>
      <Text style={styles.chatText}>Chat Room</Text>
      <SearchBar
        value={searchText}
        onChangeText={text => setSearchText(text)}
        placeholder={'Search Chats here'}
      />
      {/* <ChatList /> */}
      <FlatList
        style={{
          paddingHorizontal: wp(8),
          paddingTop: hp(10),
        }}
        columnWrapperStyle={{
          width: '100%',
          columnGap: wp(5),
          rowGap: hp(10),
        }}
        numColumns={2}
        bounces={false}
        data={chatRoomList}
        renderItem={({item}) => {
          return (
            <ChatCard
              data={item}
              cardPress={currentUser => onPressItem(item, currentUser)}
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
    ...FontStyle(14, colors.secondary_600, '700'),
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(16),
    backgroundColor: colors.neutral_200,
    marginHorizontal: wp(8),
    borderRadius: 5,
    marginVertical: 5,
    paddingVertical: 10,
  },
  text: {
    lineHeight: 14,
    ...FontStyle(9, colors.neutral_900),
  },
  text1: {
    marginTop: 1,
    ...FontStyle(12, colors.neutral_900, '700'),
  },
  text2: {
    lineHeight: 18,
    ...FontStyle(12, colors.neutral_900),
  },
  text3: {
    top: -8,
    ...FontStyle(12, colors.neutral_600),
  },
});
