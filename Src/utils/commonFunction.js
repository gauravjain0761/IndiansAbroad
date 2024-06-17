import Toast from "react-native-toast-message";
import { icons } from "../theme/icons";

export const infoToast = (message) => {
    Toast.show({ type: "info", text1: message });
  };
  export const errorToast = (message) => {
    Toast.show({ type: "error", text1: message });
  };
  
  export const otpToast = (message) => {
    Toast.show({ type: "otp_success", text1: message });
  };
  
  export const successToast = (message) => {
    Toast.show({ type: "success", text1: message });
  };
