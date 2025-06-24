import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import StatisticsView from "../sections/Statistics/view";
import { RootStackParamList } from "../types/navigation";

export default function Statistics({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, "Statistics"> }) {
  return <StatisticsView navigation={navigation} />;
}
