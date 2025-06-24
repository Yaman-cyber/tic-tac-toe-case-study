import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import LoginView from "../sections/Login/view";
import { RootStackParamList } from "../types/navigation";

export default function Login({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, "Login"> }) {
  return <LoginView navigation={navigation} />;
}
