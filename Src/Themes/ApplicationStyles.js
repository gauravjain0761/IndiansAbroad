import { StyleSheet } from 'react-native';
import colors from './Colors';
import { FontStyle } from '../utils/commonFunction';
import { fontname, wp } from './Fonts';
export default ApplicationStyles = StyleSheet.create({
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
    ...FontStyle(20, colors.neutral_500, '700',),
    textAlign: 'center',
    marginTop: 100,
    marginHorizontal: 20
  },
  titleText: {
    ...FontStyle(27, colors.white, '700',),
  },
  titleTextBlack: {
    ...FontStyle(27, colors.neutral_900, '700',),
  },
  backIcon: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderColor: colors.primary_500,
    backgroundColor: colors.btnBg,
    marginHorizontal: wp(16),
    marginVertical: 12,
    alignSelf: 'flex-start'
  },
  menuItemText: {
    ...FontStyle(18, colors.neutral_900),
  },
  menu: {
    backgroundColor: colors.neutral_300,
    borderWidth: 1,
    borderColor: colors.neutral_400,
    marginTop: 12,
  },
});
