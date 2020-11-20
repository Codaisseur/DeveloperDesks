import React from "react";
import { StyleSheet, View, LogBox, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  RobotoSlab_800ExtraBold,
} from "@expo-google-fonts/roboto-slab";

import { NavigationRoot } from "app/navigation/NavigationRoot";
import { AppStateProvider } from "app/lib/appstate";
import { ApiQueryConfigProvider } from "app/lib/api";

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  const [fontsLoaded] = useFonts({
    RobotoSlab_800ExtraBold, //: require("./assets/fonts/RobotoSlab-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ApiQueryConfigProvider>
      <AppStateProvider>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <NavigationRoot />
        </View>
      </AppStateProvider>
    </ApiQueryConfigProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
