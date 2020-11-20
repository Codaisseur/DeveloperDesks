import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  RefreshControl,
  Alert,
} from "react-native";
import { CommentResult, fetchDesk, postComment } from "app/lib/api";

export default function Comments({ comment }: { comment: CommentResult }) {
  const { title, content, developerId } = comment;

  return (
    <View>
      <Text>{`title: ${title}`}</Text>
      <Text>{`content: ${content}`}</Text>
    </View>
  );
}
