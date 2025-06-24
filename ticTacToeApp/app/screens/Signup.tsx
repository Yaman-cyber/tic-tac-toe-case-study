import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import SignupView from "../sections/Signup/view";
import { RootStackParamList } from "../types/navigation";

export default function Signup({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, "Signup"> }) {
  return <SignupView navigation={navigation} />;
}
