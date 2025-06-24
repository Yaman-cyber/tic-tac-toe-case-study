import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import PlayView from "../sections/Play/view";
import { RootStackParamList } from "../types/navigation";

export default function Play({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, "Play"> }) {
  return <PlayView navigation={navigation} />;
}
