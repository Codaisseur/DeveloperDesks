import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Button,
  RefreshControl,
  FlatList,
  Pressable,
} from "react-native";
import { useQuery } from "react-query";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DeskResult, fetchDesk, CommentResult, postComment } from "app/lib/api";
import { theme } from "app/ui";
import Comments from "app/components/Comments";
import { TextInput } from "react-native-gesture-handler";
import { useAppState } from "app/lib/appstate";

export function DeskScreen() {
  const { auth } = useAppState();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { params = {} } = useRoute();
  // const [text, set_text] = useState();

  const deskId = +(params as any).deskId;

  const { data: desk, status, error } = useQuery<DeskResult>({
    queryKey: ["desk", deskId],
    async queryFn(key: string, id: number) {
      return await fetchDesk(id);
    },
  });

  if (!desk) {
    return (
      <View style={styles.screen}>
        <View style={{ flex: 1 }} />
        <ActivityIndicator size="large" color={theme.colors.orange} />
        <View style={{ flex: 1.6 }} />
      </View>
    );
  }

  const title =
    desk.developer.name.slice(-1) === "s"
      ? `${desk.developer.name}' desk`
      : `${desk.developer.name}'s desk`;

  const { width } = Dimensions.get("window");
  const height = width * (2 / 3);

  const [text, onChangeText] = React.useState("");
  const [content, onChangeComment] = React.useState("");

  console.log("this is title", text);
  console.log("this is content", content);
  console.log(auth);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.headerText}>{title}</Text>
      <Image
        source={{ uri: desk.uri }}
        style={{ width, height, marginHorizontal: -16 }}
      />
      <FlatList
        data={desk.comments}
        keyExtractor={(comment) => `${comment.id}`}
        renderItem={({ item: comment }) => <Comments comment={comment} />}
      />
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        placeholder="title"
        onChangeText={(text) => onChangeText(text)}
        value={text}
      />
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        placeholder="comment"
        onChangeText={(text) => onChangeComment(text)}
        value={content}
      />
      <Button
        title="Add comment"
        onPress={() => {
          postComment(desk.id, title, content, auth.token);
          onChangeText("");
          onChangeComment("");
        }}
      />
      <Button title="go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 16,
  },
  headerText: {
    fontFamily: "RobotoSlab_800ExtraBold",
    fontWeight: "bold",
    fontSize: 32,
    lineHeight: 1.35 * 32,
    marginBottom: 16,
  },
});
