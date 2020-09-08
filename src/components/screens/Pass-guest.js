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
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { apiKey } from "./google-api";
import _ from "lodash";
import socketIO from "socket.io-client";
import BottomButton from "./BottomButton";
import polyline from "@mapbox/polyline";

export default class Host extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      pointCoords: [],
      destination: "",
      routeResponse: {},
      predictions: [],
      lookingForGuest: false,
      driverIsOnTheWay: false,
      mylocation: {},
      driverLocation: {},
      guestList: [],
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

  async getRouteDirections(destinationPlaceId, destinationName) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}&destination=place_id:${destinationPlaceId}&key=${apiKey}`
      );

      const json = await response.json();

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
      console.log(err);
    }
  }

  getRandomInt() {
    return Math.floor(Math.random() * Math.floor(1000));
  }
  requestGuest() {
    this.setState({ lookingForGuest: true });

    const socket = socketIO.connect("http://192.168.0.153:5000");

    socket.on("connection");
    socket.emit("taxiRequest", this.state.routeResponse);

    socket.on("accepted", (driverLocation) => {
      console.log("++++++ACCEPTED++++++++");
      const pointCoords = [...this.state.pointCoords, driverLocation];

      // this.map.fitToCoordinates(pointCoords, {
      //   edgePadding: { top: 140, bottom: 20, left: 20, right: 20 },
      // });
      this.setState({
        lookingForGuest: false,
        driverIsOnTheWay: true,
        driverLocation,
        pointCoords,
        guestList: [...this.state.guestList, driverLocation],
      });
    });

    socket.on("driverTracking", (driverLocation) => {
      const pointCoords = [...this.state.pointCoords, driverLocation];

      // this.map.fitToCoordinates(pointCoords, {
      //   edgePadding: { top: 140, bottom: 20, left: 20, right: 20 },
      // });
      this.setState({
        lookingForGuest: false,
        driverIsOnTheWay: true,
        driverLocation,
        pointCoords,
      });

      // this.onChangeDestinationDebounced(driverLocation);
    });
  }

  render() {
    let marker = null;
    let getGuest = null;
    let findingGuestActIndicator = null;
    let driverMarker = null;

    if (!this.state.latitude) return null;
    if (this.state.guestList) {
      driverMarker = this.state.guestList.map((marker) => {
        <Marker coordinate={marker} key={this.getRandomInt()}>
          <Image
            source={require("../images/carIcon.png")}
            style={{ width: 40, height: 40 }}
          />
        </Marker>;
      });
    }

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

    if (this.state.lookingForGuest) {
      findingGuestActIndicator = (
        <ActivityIndicator
          size="large"
          animating={this.state.lookingForGuest}
        />
      );
    }

    if (this.state.pointCoords.length > 1) {
      //added =
      marker = (
        <Marker
          key={this.getRandomInt()}
          coordinate={this.state.pointCoords[this.state.pointCoords.length - 1]}
        />
      );
    }

    getGuest = (
      <BottomButton
        key={this.getRandomInt()}
        onPressFunction={() => this.requestGuest()}
        buttonText="Connect with Guests"
      >
        {findingGuestActIndicator}
      </BottomButton>
    );

    const predictions = this.state.predictions.map((prediction, index) => (
      <TouchableHighlight
        key={index}
        onPress={async () => {
          const destinationName = await this.getRouteDirections(
            prediction.place_id,
            prediction.structured_formatting.main_text
          );
          this.setState({ predictions: [], destination: destinationName });
          // this.map.fitToCoordinates(this.state.pointCoords, {
          //   edgePadding: { top: 20, bottom: 20, left: 20, right: 20 },
          // });
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
        <MapView
          key={this.getRandomInt()}
          ref={(map) => {
            this.map = map;
          }}
          style={styles.map}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
          showsUserLocation={true}
        >
          <Polyline
            key={this.getRandomInt()}
            coordinates={this.state.pointCoords}
            strokeWidth={1}
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
        {getGuest}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  findGuest: {
    backgroundColor: "black",
    marginTop: "auto",
    margin: 20,
    padding: 15,
    paddingLeft: 30,
    paddingRight: 30,
    alignSelf: "center",
  },
  findGuestText: {
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
