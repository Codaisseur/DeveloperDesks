import React, { useEffect, useState } from "react";
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
import { usePaginatedQuery } from "react-query";
import { useNavigation } from "@react-navigation/native";

import { fetchDesksList, DesksListResult, DeskResult } from "app/lib/api";
import { Pill } from "app/ui";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as geolib from "geolib";

export function DesksList() {
  const [filter, setFilter] = useState(0);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);
      console.log("userlocation", userLocation);
    })();
  }, []);

  const {
    resolvedData: list,
    isFetching,
    refetch,
    status,
    error,
  } = usePaginatedQuery<DesksListResult>({
    queryKey: ["desks_list", filter],
    async queryFn(key: string, filter: number) {
      return await fetchDesksList();
    },
  });

  if (error) {
    Alert.alert(`${error}`);
  }

  let sortedList = list ? [...list.results] : undefined;
  console.log("sorted", sortedList);
  if (filter === 0) {
    sortedList?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (filter === 2 && location) {
    sortedList?.sort((a, b) => {
      const distanceA = geolib.getDistance(
        { latitude: a.latitude, longitude: a.longitude },
        {
          latitude: location.coords.latitude,
          longitude: location.coords.latitude,
        }
      );
      const distanceB = geolib.getDistance(
        { latitude: b.latitude, longitude: b.longitude },
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      );
      return distanceA - distanceB;
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filters}>
        <View style={{ marginRight: 8 }}>
          <Pill
            text="Newest"
            selected={filter === 0}
            onPress={() => setFilter(0)}
          />
        </View>
        <View style={{ marginRight: 8 }}>
          <Pill
            text="Trending"
            selected={filter === 1}
            onPress={() => setFilter(1)}
          />
        </View>
        <View style={{ marginRight: 8 }}>
          <Pill
            text="Near me"
            selected={filter === 2}
            onPress={() => setFilter(2)}
          />
        </View>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        data={sortedList}
        keyExtractor={(desk) => `${desk.id}`}
        renderItem={({ item: desk }) => <DeskItem desk={desk} />}
      />
    </View>
  );
}

function DeskItem({ desk }: { desk: DeskResult }) {
  const navigation = useNavigation();

  const { width } = Dimensions.get("window");
  const height = width * (2 / 3);

  return (
    <Pressable
      style={styles.deskItemContainer}
      onPress={() => {
        navigation.navigate("Desk", { deskId: desk.id });
      }}
    >
      <Image source={{ uri: desk.uri }} style={{ width, height }} />
      <View style={{ marginHorizontal: 16, marginTop: 8 }}>
        <Text>
          <Text
            style={{
              fontWeight: "bold",
              fontFamily: "RobotoSlab_800ExtraBold",
            }}
          >
            {desk.developer.name}
          </Text>{" "}
          (<Text>{desk.developer.email}</Text>)
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filters: {
    marginHorizontal: 16 - 4,
    marginBottom: 12,
    flexDirection: "row",
  },
  deskItemContainer: {
    marginBottom: 32,
  },
});
