import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { logout } from "../store/slices/authSlice";
import AppButton from "../components/common/AppButton";
import type { AppDispatch } from "../store";
import { RootStackParamList } from "../types/navigation";

import Play from "../screens/Play";
import Statistics from "../screens/Statistics";

import routes from "./routes";

const Stack = createNativeStackNavigator();

function HomeNavigator() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={routes.PLAY}
        component={Play}
        options={{
          headerShown: true,
          headerRight: () => (
            <AppButton
              text={t("Logout")}
              buttonStyle={{ backgroundColor: "transparent", marginRight: 10 }}
              textStyle={{ color: "red", fontWeight: "bold" }}
              onPress={async () => {
                await dispatch(logout()).unwrap();
                navigation.replace(routes.LOGIN);
              }}
            />
          ),
        }}
      />
      <Stack.Screen name={routes.STATISTICS} component={Statistics} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default HomeNavigator;
