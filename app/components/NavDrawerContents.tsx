import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { theme, Button } from "app/ui";
import { DeskSvg } from "app/ui/DeskSvg";
import { useAppState, useSetAppState } from "app/lib/appstate";

export function NavDrawerContents() {
  const insets = useSafeAreaInsets();
  const navigaton = useNavigation();
  const { auth } = useAppState();
  const setState = useSetAppState();
  const navigation = useNavigation();

  const onLogoutPress = async () => {
    try {
      setState({ auth: null });
      navigation.navigate("Home");
    } catch (e) {
      Alert.alert("Oh no! An error occurred...");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 16, paddingHorizontal: 16 },
      ]}
    >
      {auth ? (
        <>
          <Text style={styles.loggedInText}>Welcome {auth.name}!</Text>
          <Button text="Log out" onPress={onLogoutPress} />
        </>
      ) : (
        <>
          <View style={{ flex: 1.2 }} />
          <Text style={styles.teaserText}>
            You're not logged in. Log in to post your own desk and share likes
            &amp; comments!
          </Text>
          <Button
            text="Log in or register"
            onPress={() => {
              navigaton.navigate("Login");
            }}
          />
        </>
      )}
      <View style={{ flex: 1 }} />
      <View style={styles.deskAtBottom}>
        <DeskSvg width={100} height={90} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.yellowishBrown,
  },
  teaserText: {
    fontSize: 16,
    lineHeight: 1.35 * 16,
    color: theme.colors.brown4,
    marginBottom: 16,
  },
  loggedInText: {
    fontSize: 24,
    color: theme.colors.brown4,
    marginTop: 16,
  },
  deskAtBottom: {
    alignItems: "center",
  },
});
