import React, { useState } from "react";
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
import askAsync from "expo-permissions";
import * as Permissions from "expo-permissions";
import Location, { getCurrentPositionAsync } from "expo-location";
import { UserLocation, DeveloperCard } from "./Types";
import { fetchDesksList, DesksListResult, DeskResult } from "app/lib/api";
import { Pill } from "app/ui";
import { getDistance } from "geolib";

export function DesksList() {
  const [filter, setFilter] = useState(0);
  const [location, set_location] = useState<UserLocation>({
    latitude: 0,
    longitude: 0,
  });

  const addDistanceToDeveloper = (array: DeskResult[]) => {
    const newArray = array.map((d) => {
      const distance = getDistance(
        { latitude: d.latitude, longitude: d.longitude },
        location
      );
      return { ...d, distance };
    });
    return newArray;
  };

  const getLocation = async () => {
    const response = await Permissions.askAsync(Permissions.LOCATION);
    console.log(response);
    const status = response.status;
    if (status !== "granted") {
      console.log("permission not granted");
      Alert.alert("permission not granted");
    }

    const userLocation = await getCurrentPositionAsync();
    console.log(userLocation);
    set_location({
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
    });
  };

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

  let newList = list ? [...list.results] : [];
  let sortedList = addDistanceToDeveloper(newList);

  if (filter === 0) {
    sortedList?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  //some if logic for geo location
  if (filter === 2) {
    // sortedList?.sort((a, b) => b.distance - b.distance);
  }
  // console.log("THIS IS SORTED", sortedList);

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
            onPress={() => {
              setFilter(2);
              getLocation();
            }}
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
