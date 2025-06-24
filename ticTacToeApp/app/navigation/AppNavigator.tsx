import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Statistics from "../screens/Statistics";

import routes from "./routes";
import HomeNavigator from "./HomeNavigator";
import AppIcon from "../components/common/AppIcon";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name={routes.PLAY} component={HomeNavigator} options={{ headerShown: false, tabBarIcon: ({ color }) => <AppIcon color={color} name="Game" /> }} />
      <Tab.Screen name={routes.STATISTICS} component={Statistics} options={{ headerShown: false, tabBarIcon: ({ color }) => <AppIcon color={color} name="Stats" /> }} />
    </Tab.Navigator>
  );
}
