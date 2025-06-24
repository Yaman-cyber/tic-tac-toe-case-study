/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import "./i18n";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, useColorScheme } from "react-native";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { store } from "./store";

import navigationTheme from "./navigation/navigationTheme";
import AuthLoader from "./components/common/AuthLoader";

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the recommendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer theme={navigationTheme}>
          <AuthLoader />
        </NavigationContainer>
      </I18nextProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;
