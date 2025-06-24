import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import VerifyView from "../sections/Verify/view";
import { RootStackParamList } from "../types/navigation";

export default function Verify({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, "Verify"> }) {
  return <VerifyView navigation={navigation} />;
}
