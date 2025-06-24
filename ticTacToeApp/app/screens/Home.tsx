import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import HomeView from "../sections/Home/view";
import { RootStackParamList } from "../types/navigation";

export default function Home({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, "Home"> }) {
  return <HomeView navigation={navigation} />;
}
