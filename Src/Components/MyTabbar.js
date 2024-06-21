import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import {defaultFontStyle, fontname} from '../Themes/Fonts';
import colors from '../Themes/Colors';
import {Icons} from '../Themes/Icons';
import {screenName} from '../Navigation/ScreenConstants';
import {FontStyle} from '../utils/commonFunction';

export default function MyTabbar({state, descriptors, navigation}) {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.rowStyle}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
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
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.itemContainer}>
                <Image
                  style={{
                    ...styles.iconStyle,
                    tintColor: isFocused ? colors.primary_6a7e : undefined,
                  }}
                  source={iconName}
                />
                {isFocused && (
                  <Text
                    style={{
                      ...styles.labelTextStyle,
                      color: isFocused ? colors.primary_6a7e : colors.black,
                    }}>
                    {label}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </>
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
    ...FontStyle(fontname.actor_regular, 11, colors.primary_8091ba,"700"),
    marginTop: 1,
  },
  itemContainer: {
    flex: 1,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
