import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  Linking,
  Platform,
  Alert,
} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import BottomButton from "./BottomButton";
import { apiKey } from "./google-api";
import polyline from "@mapbox/polyline";
import socketIO from "socket.io-client";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
const LOCATION_TASK_NAME = "background-location-task";
const socket = socketIO.connect("http://192.168.0.152:5000");

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  let count = 1;
  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    const { locations } = data;

    // setInterval(() => {
    count++;
    socket.emit("driverTracking", {
      latitude: locations[0].coords.latitude,
      longitude: locations[0].coords.longitude,
    });
    console.log(count);
    // }, 500000);
  }
});

export default class Driver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      pointCoords: [],
      destination: "",
      routeResponse: {},
      lookingForPassengers: false,
    };
    this.acceptPassengerRequest = this.acceptPassengerRequest.bind(this);
    this.findPassengers = this.findPassengers.bind(this);

    this.getRouteDirections = this.getRouteDirections.bind(this);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  componentDidMount() {
    Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: 4,
      distanceInterval: 500,
    });
    this.watchId = navigator.geolocation.watchPosition(
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

  async getRouteDirections(destinationPlaceId) {
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

      return;
    } catch (error) {
      console.log(error);
    }
  }

  getRandomInt() {
    return Math.floor(Math.random() * Math.floor(1000));
  }

  findPassengers() {
    if (!this.state.lookingForPassengers) {
      this.setState({ lookingForPassengers: true });

      socket.on("connection");
      socket.emit("passengerRequest", {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      });

      socket.on("taxiRequest", async (routeResponse) => {
        // console.log(routeResponse);
        this.setState({
          passengerFound: true,
          routeResponse,
        });
        await this.getRouteDirections(
          routeResponse.geocoded_waypoints[0].place_id
        );
        // this.map.fitToCoordinates(this.props.pointCoords, {
        //   edgePadding: { top: 140, bottom: 140, left: 20, right: 20 },
        // });
      });
    }
  }

  acceptPassengerRequest = async () => {
    socket.emit("accepted", {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    });

    this.setState({
      lookingForPassengers: false,
      passengerFound: true,
    });
  };

  render() {
    let endMarker = null;
    let startMarker = null;
    let findingPassengerActIndicator = null;
    let passengerSearchText = "Join Event👥";
    let bottomButtonFunction = this.findPassengers;
    if (!this.state.latitude) return null;
    if (this.state.lookingForPassengers) {
      passengerSearchText = "Share Live LocationR";
      findingPassengerActIndicator = (
        <ActivityIndicator
          key={this.getRandomInt()}
          size="large"
          animating={this.state.lookingForPassengers}
        />
      );
    }

    if (this.state.passengerFound) {
      passengerSearchText = "FOUND PASSENGER! ACCEPT RIDE?";
      bottomButtonFunction = this.acceptPassengerRequest;
    }

    if (this.state.pointCoords.length > 1) {
      endMarker = (
        <Marker
          key={this.getRandomInt()}
          coordinate={this.state.pointCoords[this.state.pointCoords.length - 1]}
        >
          <Image
            style={{ width: 40, height: 40 }}
            source={require("../images/person-marker.png")}
          />
        </Marker>
      );
    }

    return (
      <View style={styles.container}>
        <MapView
          key={this.getRandomInt()}
          ref={(map) => {
            this.map = map;
          }}
          style={styles.map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          }}
          showsUserLocation={true}
        >
          <Polyline
            coordinates={this.state.pointCoords}
            strokeWidth={2}
            strokeColor="red"
          />
          {endMarker}
          {startMarker}
        </MapView>
        <BottomButton
          onPressFunction={bottomButtonFunction}
          buttonText={passengerSearchText}
        >
          {findingPassengerActIndicator}
        </BottomButton>
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
