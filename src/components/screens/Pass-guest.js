import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Keyboard,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { apiKey } from "./google-api";
import _ from "lodash";
import socketIO from "socket.io-client";
import BottomButton from "./BottomButton";
import polyline from "@mapbox/polyline";

// import * as TaskManager from "expo-task-manager";
// import * as Location from "expo-location";
// const LOCATION_TASK_NAME = "background-location-task";

// TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
//   if (error) {
//     console.error(error);
//     return;
//   }
//   if (data) {
//     const { locations } = data;
//     console.log(locations);
//     console.log(new Date().toGMTString());
//   }
// });

export default class Passenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      pointCoords: [],
      destination: "",
      routeResponse: {},
      predictions: [],
      lookingForDriver: false,
      driverIsOnTheWay: false,
      mylocation: {},
      driverLocation: {},
    };

    this.onChangeDestinationDebounced = _.debounce(
      this.onChangeDestination,
      1000
    );
    this.getRouteDirections = this.getRouteDirections.bind(this);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }
  componentDidMount() {
    this.watchId = navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
    );
  }
  // onPress = async () => {
  //   const { status } = await Location.requestPermissionsAsync();
  //   if (status === "granted") {
  //     await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
  //       accuracy: Location.Accuracy.lowest,
  //       distanceInterval: 0,
  //       timeInterval: 100,
  //     });
  //   }
  // };

  async getRouteDirections(destinationPlaceId, destinationName) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}&destination=place_id:${destinationPlaceId}&key=${apiKey}`
      );
      // console.log(response);
      const json = await response.json();
      // console.log(json);
      const points = polyline.decode(json.routes[0].overview_polyline.points);
      const pointCoords = points.map((point) => {
        return { latitude: point[0], longitude: point[1] };
      });
      this.setState({
        pointCoords,
        routeResponse: json,
      });
      Keyboard.dismiss();
      return destinationName;
    } catch (error) {
      console.error(error);
    }
  }

  async onChangeDestination(destination) {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}
    &input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000`;

    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      this.setState({
        predictions: json.predictions,
      });
    } catch (err) {
      console.error(err);
    }
  }

  getRandomInt() {
    return Math.floor(Math.random() * Math.floor(1000));
  }
  requestDriver() {
    this.setState({ lookingForDriver: true });

    const socket = socketIO.connect("http://192.168.0.152:5000");

    socket.on("connection");
    socket.emit("taxiRequest", this.state.routeResponse);
    socket.on("accepted", (driverLocation) => {
      this.setState({
        lookingForDriver: false,
        driverIsOnTheWay: true,
        driverLocation,
      });
      this.state.pointCoords = [...this.state.pointCoords, driverLocation];
      this.map.fitToCoordinates(pointCoords, {
        edgePadding: { top: 140, bottom: 20, left: 20, right: 20 },
      });

      // this.onChangeDestinationDebounced(driverLocation);
    });
  }

  render() {
    let marker = null;
    let getDriver = null;
    let findingDriverActIndicator = null;
    let driverMarker = null;

    if (!this.state.latitude) return null;
    if (this.state.driverIsOnTheWay) {
      driverMarker = (
        <Marker
          coordinate={this.state.driverLocation}
          key={this.getRandomInt()}
        >
          <Image
            source={require("../images/carIcon.png")}
            style={{ width: 40, height: 40 }}
          />
        </Marker>
      );
    }
    if (this.state.lookingForDriver) {
      findingDriverActIndicator = (
        <ActivityIndicator
          size="large"
          animating={this.state.lookingForDriver}
        />
      );
    }

    if (this.state.pointCoords.length >= 1) {
      //added =
      marker = (
        <Marker
          key={this.getRandomInt()}
          coordinate={this.state.pointCoords[this.state.pointCoords.length - 1]}
        />
      );
      getDriver = (
        <BottomButton
          key={this.getRandomInt()}
          onPressFunction={() => this.requestDriver()}
          buttonText="REQUEST 🚗"
        >
          {findingDriverActIndicator}
        </BottomButton>
      );
    }

    const predictions = this.state.predictions.map((prediction, index) => (
      <TouchableHighlight
        key={index}
        onPress={async () => {
          const destinationName = await this.getRouteDirections(
            prediction.place_id,
            prediction.structured_formatting.main_text
          );
          this.setState({ predictions: [], destination: destinationName });
          this.map.fitToCoordinates(this.state.pointCoords, {
            edgePadding: { top: 20, bottom: 20, left: 20, right: 20 },
          });
        }}
        key={this.getRandomInt()}
      >
        <View>
          <Text key={this.getRandomInt()} style={styles.suggestions}>
            {prediction.structured_formatting.main_text}
          </Text>
        </View>
      </TouchableHighlight>
    ));

    return (
      <View style={styles.container}>
        {/* <TouchableOpacity onPress={this.onPress}>
          <Text>Enable background location</Text>
        </TouchableOpacity> */}
        <MapView
          key={this.getRandomInt()}
          ref={(map) => {
            this.map = map;
          }}
          style={styles.map}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          showsUserLocation={true}
        >
          <Polyline
            key={this.getRandomInt()}
            coordinates={this.state.pointCoords}
            strokeWidth={4}
            strokeColor="red"
          />
          {marker}
          {driverMarker}
        </MapView>
        <TextInput
          placeholder="Enter destination..."
          style={styles.destinationInput}
          value={this.state.destination}
          clearButtonMode="always"
          onChangeText={(destination) => {
            this.setState({ destination, pointCoords: [] });
            this.onChangeDestinationDebounced(destination);
          }}
        />
        {predictions}
        {getDriver}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  findDriver: {
    backgroundColor: "black",
    marginTop: "auto",
    margin: 20,
    padding: 15,
    paddingLeft: 30,
    paddingRight: 30,
    alignSelf: "center",
  },
  findDriverText: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
  },
  suggestions: {
    backgroundColor: "white",
    padding: 5,
    fontSize: 18,
    borderWidth: 0.5,
    marginLeft: 5,
    marginRight: 5,
  },
  destinationInput: {
    height: 40,
    borderWidth: 0.5,
    marginTop: 50,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    backgroundColor: "white",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
