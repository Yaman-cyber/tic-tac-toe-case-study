import { GestureResponderEvent, StyleProp, TextStyle, ViewStyle, TouchableOpacityProps } from "react-native";

export interface AppButtonProps extends TouchableOpacityProps {
  text?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconName?: string;
  iconColor?: string;
  iconSize?: {
    width: number;
    height: number;
  };
}
