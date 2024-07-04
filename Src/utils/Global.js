import { CommonActions } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import { navigationRef } from '../Navigation/RootContainer';

export const resetNavigation = (name, params) => {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{ name: name, params: params }],
    }),
  );
};

export const openImagePickerForMultiple = ({
  params,
  onSucess,
  onFail,
  type
}) => {
  try {
    ImagePicker.openPicker({
      multiple: true,
      cropping: true,
      mediaType: type,
      freeStyleCropEnabled: true,
      ...params,
    })
      .then(image => {
        onSucess(image);
      })
      .catch(err => {
        onFail?.(err);
      });
  } catch (error) { }
};


export const openImagePicker = ({
  params,
  onSucess,
  onFail,
}) => {
  try {
    ImagePicker.openPicker({
      multiple: false,
      cropping: true,
      mediaType: 'photo',
      freeStyleCropEnabled: true,
      ...params,
    })
      .then(image => {
        onSucess(image);
      })
      .catch(err => {
        onFail?.(err);
      });
  } catch (error) { }
};

export const openCamera = ({ params, onSucess, onFail }) => {
  try {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
      freeStyleCropEnabled: true,
      ...params,
    })
      .then(image => {
        onSucess(image);
      })
      .catch(err => {
        onFail?.(err);
      });
  } catch (error) { }
};
