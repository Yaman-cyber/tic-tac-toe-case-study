import { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";
import { IconName } from "./AppIcon.types";

export interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIconName?: IconName;
  rightIconName?: IconName;
  leftIconColor?: string;
  rightIconColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  leftIconContainerStyle?: StyleProp<ViewStyle>;
  rightIconContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}
