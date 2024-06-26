import { StyleSheet } from 'react-native';
import colors from './Colors';
import { FontStyle } from '../utils/commonFunction';
import { fontname } from './Fonts';
export default StyleSheet.create({
  applicationView: {
    flex: 1,
    backgroundColor: colors.white
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flex: {
    flex: 1
  },
  noDataFound: {
    ...FontStyle(
      fontname.actor_regular,
      20,
      colors.neutral_500,
      '700',
    ),
    textAlign: 'center',
    marginTop: 100
  }
});
