import React, { useState, useEffect } from "react";
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
import { getDistance } from "geolib";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

export function DesksList() {
  const [filter, setFilter] = useState(0);
  const [myLocation, setMyLocation] = useState({});
  const [sortedList, setSortedList] = useState<any>([]);

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

  async function getLocationAsync() {
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    try {
      const { status, permissions } = await Permissions.askAsync(
        Permissions.LOCATION
      );
      if (status === "granted") {
        const currentPosition = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
        });
        const { latitude, longitude } = currentPosition.coords;
        setMyLocation({ latitude: latitude, longitude: longitude });
      } else {
        throw new Error("Location permission not granted");
      }
    } catch (e) {
      setMyLocation({ error: e });
    }
  }
  useEffect(() => {
    if (filter === 0) {
      setSortedList(
        [...list.results]?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } else if (filter === 2) {
      getLocationAsync();
      if (myLocation.latitude)
        setSortedList(
          [...list.results]?.sort((a, b) => {
            const aLocation = { latitude: a.latitude, longitude: a.longitude };
            const bLocation = { latitude: b.latitude, longitude: b.longitude };
            return (
              getDistance(myLocation, aLocation) -
              getDistance(myLocation, bLocation)
            );
          })
        );
    }
  }, [filter]);

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
