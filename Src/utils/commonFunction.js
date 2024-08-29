import Toast from 'react-native-toast-message';
import { icons } from '../theme/icons';
import { defaultFontStyle } from '../Themes/Fonts';
import { currenciesArray } from './constants';

export const infoToast = message => {
  Toast.show({ type: 'info', text1: message });
};
export const errorToast = message => {
  Toast.show({ type: 'error', text1: message });
};

export const otpToast = message => {
  Toast.show({ type: 'otp_success', text1: message });
};

export const successToast = message => {
  Toast.show({ type: 'success', text1: message });
};

export const ImageStyle = (width, height, resizemode) => {
  return { width: width, height: height, resizeMode: resizemode ? resizemode : 'contain' };
};

export const FontStyle = (size, color, fontWeight) => {
  return { ...defaultFontStyle(size, color, fontWeight) };
};


export const emailCheck = (email) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(email) === false) {
    return false;
  } else {
    return true;
  }
};

export const nameCheck = (name) => {
  let reg = /^([a-zA-Z ]){2,30}$/;
  if (reg.test(name) === false) {
    return false;
  } else {
    return true;
  }
};

export const passwordCheck = (string) => {
  let reg = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;
  return reg.test(string);
};

export const mobileNumberCheck = (mobileNo) => {
  let reg = /^\d*$/
  return reg.test(mobileNo);
}

export const mergeJsonArraysByID = (...jsonArrays) => {
  // Create an object to hold the merged data
  const mergedObj = {};

  // Iterate over each JSON array
  jsonArrays?.forEach(array => {
    array?.forEach(item => {
      // Use the unique key (id) to manage entries
      mergedObj[item._id] = { ...mergedObj[item._id], ...item };
    });
  });

  // Convert the object back to an array
  return Object.values(mergedObj);
}

export const searchUserByName = (mainArray, field1, searchText) => {
  let list = mainArray
  const filtered = list?.filter((val) =>
    field1 ? val[field1]['first_Name'].toLowerCase().includes(searchText.toLowerCase()) : val['first_Name'].toLowerCase().includes(searchText.toLowerCase())
  );
  const filter2 = list?.filter((val) =>
    field1 ? val[field1]['last_Name'].toLowerCase().includes(searchText.toLowerCase()) : val['last_Name'].toLowerCase().includes(searchText.toLowerCase())

  );
  const filter3 = list?.filter((val) =>
    field1 ? (val[field1]['first_Name'] + ' ' + val[field1]['last_Name']).toLowerCase().includes(searchText.toLowerCase()) : (val['first_Name'] + ' ' + val['last_Name']).toLowerCase().includes(searchText.toLowerCase())
  );
  let arr = mergeJsonArraysByID(filtered, filter2, filter3);
  return arr
}

export const dateConvectTime=(inputDateStr)=>{
// Parse the input string to extract date and time components
const [day, month, year] = inputDateStr.split(' ')[0].split('-').map(Number);
const [hours, minutes] = inputDateStr.split(' ')[1].split(':').map(Number);

// Create a Date object in the local time zone
const localDate = new Date(year, month - 1, day, hours, minutes);

// Convert to UTC time
const utcDate = new Date(localDate.toUTCString());

// Format to ISO 8601 string
const isoString = utcDate.toISOString();

return isoString
}

export const currencyIcon=(value)=>{
    const selectValue=currenciesArray.filter((item)=>{return item.code == value})
    return selectValue?.[0]?.symbol || "$"
}