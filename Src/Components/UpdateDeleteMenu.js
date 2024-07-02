import React, { useState } from 'react';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icons } from '../Themes/Icons';
import { FontStyle } from '../utils/commonFunction';
import { fontname } from '../Themes/Fonts';
import colors from '../Themes/Colors';

export default function UpdateDeleteMenu({
  icon,
  containerStyle,
  onUpdatePress,
  onDeletePress,
}) {
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  return (
    <View style={[{ flex: 1 }, containerStyle]}>
      <Menu
        visible={visible}
        anchor={
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
            onPress={showMenu}>
            {icon}
          </TouchableOpacity>
        }
        onRequestClose={hideMenu}
        style={styles.menu}>
        <MenuItem
          textStyle={styles.itemText}
          onPress={() => {
            hideMenu(), onUpdatePress();
          }}>
          Update
        </MenuItem>
        <MenuItem
          textStyle={styles.itemText}
          onPress={() => {
            hideMenu(),
              setTimeout(() => {
                onDeletePress();
              }, 500);
          }}>
          Delete
        </MenuItem>
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  itemText: {
    ...FontStyle(fontname.actor_regular, 18, colors.neutral_900),
  },
  menu: {
    backgroundColor: colors.neutral_300,
    borderWidth: 1,
    borderColor: colors.neutral_400,
    marginTop: 12,
  },
});
