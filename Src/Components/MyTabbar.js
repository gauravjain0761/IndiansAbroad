import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { defaultFontStyle, fontname } from '../Themes/Fonts';
import colors from '../Themes/Colors';
import { Icons } from '../Themes/Icons';
import { screenName } from '../Navigation/ScreenConstants';
import { FontStyle } from '../utils/commonFunction';
import { useSelector } from 'react-redux';
import RenderUserIcon from './RenderUserIcon';

export default function MyTabbar({ state, descriptors, navigation }) {
  const { unreadMsgCount, user } = useSelector(e => e.common)
  return (
    <SafeAreaView style={{ backgroundColor: colors.white }}>
      <View style={styles.container}>
        <View style={styles.rowStyle}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            let iconName;
            if (route.name === screenName.homeScreen) {
              iconName = Icons.homeIcon;
            } else if (route.name === screenName.indiansPage) {
              iconName = Icons.peopleIcon1;
            } else if (route.name === screenName.discussionForum) {
              iconName = Icons.DiscussionOff;
            } else if (route.name === screenName.chatScreen) {
              iconName = Icons.chatIcon;
            } else if (route.name === screenName.profileScreen) {
              iconName = Icons.account;
            }

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.itemContainer}>
                {route.name == screenName.profileScreen ?
                  <RenderUserIcon url={user?.avtar} height={22} />
                  : <Image
                    style={{
                      ...styles.iconStyle,
                      tintColor: isFocused ? colors.primary_4574ca : colors.neutral_900,
                    }}
                    source={iconName}
                  />}
                {route.name == screenName.chatScreen && unreadMsgCount > 0 &&
                  <View style={{
                    position: 'absolute', zIndex: 1, top: !isFocused ? 8 : 2, right: 4,
                    backgroundColor: colors.danger_500,
                    borderRadius: 100,
                    paddingHorizontal: 8,
                    paddingVertical: 0,
                    borderWidth: 0.5
                  }}>
                    <Text style={FontStyle(11, colors.white, '700')}>{unreadMsgCount}</Text>
                  </View>
                }
                {isFocused && (
                  <Text
                    style={{
                      ...styles.labelTextStyle,
                      color: isFocused ? colors.primary_4574ca : colors.neutral_900,
                    }}>
                    {label}
                  </Text>
                )}

              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    alignSelf: 'center',
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderTopColor: colors.neutral_500,
    borderTopWidth: 2,
  },
  labelTextStyle: {
    ...FontStyle(11, colors.primary_8091ba),
    marginTop: 1,
  },
  itemContainer: {
    flex: 1,
    height: Platform.OS == 'ios' ? 50 : 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});
