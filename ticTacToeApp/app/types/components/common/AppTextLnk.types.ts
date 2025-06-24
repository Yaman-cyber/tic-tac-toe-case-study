import { StyleProp, TextStyle, ViewStyle, TouchableOpacityProps } from "react-native";

export interface AppTextLnkProps extends TouchableOpacityProps {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}
