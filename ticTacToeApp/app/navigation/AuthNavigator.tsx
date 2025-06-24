import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Verify from "../screens/Verify";

import routes from "./routes";

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={routes.LOGIN} component={Login} options={{ headerShown: false }} />
      <Stack.Screen name={routes.SIGNUP} component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name={routes.VERIFY} component={Verify} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
