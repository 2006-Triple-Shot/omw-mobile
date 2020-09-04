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
} from "react-native";
import * as Location from "expo-location";
import io from "socket.io-client";

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

  const socket = io("http://192.168.1.169:3000");

  const findCurrentLocation = () => {
    console.log(navigator.geolocation.watchPosition);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("position:", position);
        // console.log("Before setLocation", location);
        setLocation(position);
        // console.log("After setLocation", location);
        // setMarkers([...markers, newPin]);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

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

  function sendChat() {
    this.socket.emit("chat message", chatMsg);
    setChatMsg("");
  }

  useEffect(() => {
    let mounted = true; //
    this.socket = socket;
    if (mounted) {
      (async () => {
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
          this.socket.emit("test location", location);
        } catch (err) {
          let status = Location.getProviderStatusAsync();
          if (!(await status).locationServicesEnabled) {
            alert("Enable location services");
          }
        }
      })();
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
        initialRegion={mapRegion}
        onRegionChange={onRegionChange}
        onPress={findCurrentLocation}
      >
        {markers.map((pin, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: pin.coords.latitude,
                longitude: pin.coords.longitude,
              }}
            ></Marker>
          );
        })}
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
