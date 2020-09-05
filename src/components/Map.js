import React, { useState, useEffect } from "react";
import MapView, {
  PROVIDER_GOOGLE,
  AnimatedRegion,
  Marker,
} from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import * as Location from "expo-location";

const initialRegion = {
  latitude: 40.742741,
  longitude: -73.989128,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

let initLocation = {
  coords: {
    latitude: 40.742741,
    longitude: -73.989128,
  },
};

const initialMarkers = [];

export default function App(props) {
  const [location, setLocation] = useState(initLocation);
  const [errorMsg, setErrorMsg] = useState("");
  const [mapRegion, setRegion] = useState(initialRegion);
  const [markers, setMarkers] = useState(initialMarkers);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([]);

  findCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("position:", position);
        // const latitude = JSON.stringify(position.coords.latitude);
        // const longitude = JSON.stringify(position.coords.longitude);
        console.log("Longitude :", position.coords.longitude);
        setLocation(position);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    console.log("in useffect");
    findCurrentLocation();
  }, []);
  async function getLocation() {}

  function watchLocation() {
    return async function () {
      let marker = await Location.watchPositionAsync({
        enableHighAccuracy: true,
        mayShowUserSettingsDialog: true,
        timeInterval: 2000,
      });
      return marker;
    };
  }

  function onRegionChange(region) {
    setRegion(region);
  }

  useEffect(() => {
    let mounted = true; //

    if (mounted) {
      async () => {
        try {
          let { status } = await Location.requestPermissionsAsync();
          if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
          }
          const locale = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true,
            maximumAge: 2000,
            timeout: 20000,
          });
          // setLocation(locale);
        } catch (err) {
          let status = Location.getProviderStatusAsync();
          if (!(await status).locationServicesEnabled) {
            alert("Enable location services");
          }
        }
      };
    }
    return function cleanup() {
      mounted = false;
    };
  }, []); // add dependency

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
        mapRegion={initialRegion}
        onRegionChange={() => onRegionChange(initialRegion)}
        onPress={findCurrentLocation}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title={`My House`}
        ></Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c7f5f2",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
