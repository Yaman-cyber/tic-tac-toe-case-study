import { View, Dimensions } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";

import AppText from "../../../components/common/AppText";
import AppButton from "../../../components/common/AppButton";
import LanguageSwitcher from "../../../components/LanguageSwitcher";

import routes from "../../../navigation/routes";
import { RootStackParamList } from "../../../types/navigation";

import colors from "../../../config/colors";

const { width, height } = Dimensions.get("window");

export default function HomeView({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, typeof routes.HOME> }) {
  const { t } = useTranslation();

  console.log(Config.API_URL);

  return (
    <View style={{ flex: 1, backgroundColor: "blue" }}>
      <View style={{ flex: 1, backgroundColor: "#000" }}></View>

      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <LanguageSwitcher />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: width * 0.04,
            backgroundColor: colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            elevation: 6,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <AppButton
            text={t("hi")}
            textStyle={{ color: colors.white, fontSize: width * 0.045, fontWeight: "bold" }}
            buttonStyle={{ backgroundColor: colors.primary, borderRadius: 50, paddingVertical: height * 0.015, paddingHorizontal: width * 0.06 }}
          />
          <AppText>{t("hi")}</AppText>
        </View>
      </View>
    </View>
  );
}
