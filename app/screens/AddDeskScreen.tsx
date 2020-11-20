import React, { useState, useEffect, useCallback } from "react";
import {
  Image,
  Alert,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { useNavigation } from "@react-navigation/native";

import { useAsyncCallback } from "app/lib/useAsyncCallback";
import { HugeButton, Button, CameraIcon, GalleryIcon, theme } from "app/ui";
import { postDesk } from "../lib/api";
import { useAppState } from "app/lib/appstate";
import * as Location from "expo-location";

export function AddDeskScreen() {
  const [image, setImage] = useState<ImageInfo>();
  const [title, setTitle] = useState("");
  const { auth } = useAppState();
  const navigation = useNavigation();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  console.log("LOCATION", location);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);
    })();
  }, []);

  const launchCamera = useCallback(async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (!result.cancelled) {
      setImage(result);
    }
  }, [setImage]);

  const launchGallery = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (!result.cancelled) {
      setImage(result);
    }
  }, [setImage]);

  const [startUpload, { status, error }] = useAsyncCallback(async () => {
    if (!image || !auth || !location) return;

    const body = new FormData();
    body.append("upload_preset", "k8vaf22u");
    const cloudname = "daxjf54p3";
    body.append("file", {
      uri: image.uri,
      type: "image/jpg",
      name: Date.now() + ".jpg",
    } as any);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudname}/image/upload`,
      {
        method: "post",
        body: body,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const { url } = await res.json();
    const { latitude, longitude } = location.coords;
    const response = await postDesk(
      title,
      url,
      auth.token,
      latitude,
      longitude
    );
    if (response.status === "success") {
      Alert.alert("Success", "Thank you for sharing your desk! :D", [
        { text: "Home", onPress: () => navigation.navigate("Home") },
      ]);
    }
  });

  if (error) {
    Alert.alert("Oh no... Seems like something went wrong");
  }

  const width = Dimensions.get("window").width - 2 * 16;
  const imageSizing = {
    width,
    height: width * (2 / 3),
  };

  if (status === "loading") {
    return (
      <View style={styles.screen}>
        <View style={{ flex: 1 }} />
        <ActivityIndicator size="large" color={theme.colors.orange} />
        <View style={{ flex: 1.6 }} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.uploadButtonsRow}>
        <View style={{ flex: 1, padding: 8 }}>
          <HugeButton
            text="Take a photo"
            Icon={CameraIcon}
            onPress={launchCamera}
          />
        </View>
        <View style={{ flex: 1, padding: 8 }}>
          <HugeButton
            text="Select from gallery"
            Icon={GalleryIcon}
            onPress={launchGallery}
          />
        </View>
      </View>
      {!image ? (
        <View style={{ flex: 1 }} key="upload_todo">
          <View style={{ flex: 1 }} />
          <Text style={styles.emptyStateText}>
            Select a photo from your gallery, or take a photo, to continue.
          </Text>
          <View style={{ flex: 1.6 }} />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "position" : "height"}
          style={{ flex: 0.6 }}
        >
          <View style={{ flex: 1 }} key="upload">
            <Image source={{ uri: image.uri }} style={imageSizing} />
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.formField}
                value={title}
                placeholder={"Desk Title"}
                onChangeText={setTitle}
              />
            </View>
            <Button
              disabled={!title}
              text="Upload this image!"
              onPress={startUpload}
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
  },
  uploadButtonsRow: {
    flexDirection: "row",
    marginHorizontal: -8,
    marginTop: -8,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    lineHeight: 1.35 * 16,
    color: theme.colors.muted,
    marginHorizontal: 16,
  },
  formField: {
    height: 40,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 1,
    marginTop: 30,
    paddingLeft: 10,
  },
});
