import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { apiKey } from "../../../secret";
import _ from "lodash";
import polyline from "@mapbox/polyline";
import io from "socket.io-client";
import Share from "../Share";

export default class Passenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      error: "",
      destination: "",
      predictions: [],
      pointCoords: [],
      routeResponse: {},
      lookingForDriver: false,
    };
    this.onChangeDestinationDebounced = _.debounce(
      this.onChangeDestination,
      1000
    );
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
    );
  }

  async getRouteDirections(destinationPlaceId, destinationName) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}
            &destination=place_id:${destinationPlaceId}&key=${apiKey}`
      );
      const json = await response.json();
      // console.log("json :", json);
      const points = polyline.decode(json.routes[0].overview_polyline.points);
      const pointCoords = points.map((point) => {
        return { latitude: point[0], longitude: point[1] };
      });
      this.setState({
        pointCoords,
        predictions: [],
        destination: destinationName,
        routeResponse: json,
      });
      Keyboard.dismiss();
      this.map.fitToCoordinates(pointCoords, {
        edgePadding: { top: 20, bottom: 20, left: 20, right: 20 },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async onChangeDestination(destination) {
    this.setState({ destination });
    const apiURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000`;
    try {
      const result = await fetch(apiURL);
      const json = await result.json();
      this.setState({
        predictions: json.predictions,
      });
    } catch (err) {
      console.error(err);
    }
  }

  requestDriver() {
    const socket = io("http://192.168.1.169:5000");
    socket.on("connect", () => {
      console.log("looking for driver");
      socket.emit("taxiRequest", this.state.routeResponse);
    });
  }

  render() {
    let marker = null;
    let driverButton = null;

    if (this.state.latitude === null) return null;
    if (this.state.pointCoords.length > 1) {
      marker = (
        <Marker
          coordinate={this.state.pointCoords[this.state.pointCoords.length - 1]}
        />
      );
      driverButton = (
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => this.requestDriver()}
        >
          <View>
            <Text style={styles.bottomButtonText}>Share to Host</Text>
          </View>
        </TouchableOpacity>
      );
    }

    const predictions = this.state.predictions.map((prediction, index) => (
      <TouchableHighlight
        key={index}
        onPress={() =>
          this.getRouteDirections(
            prediction.place_id,
            prediction.structured_formatting.main_text
          )
        }
      >
        <View>
          <Text style={styles.suggestions}>
            {prediction.structured_formatting.main_text}
          </Text>
        </View>
      </TouchableHighlight>
    ));

    return (
      <View style={styles.container}>
        <MapView
          ref={(map) => {
            this.map = map;
          }}
          style={styles.map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          showsUserLocation={true}
        >
          <Polyline
            coordinates={this.state.pointCoords}
            strokeWidth={4}
            strokeColor="blue"
          />
          {marker}
        </MapView>
        <TextInput
          placeholder="Enter destination..."
          style={styles.destinationInput}
          value={this.state.destination}
          clearButtonMode="always"
          onChangeText={(destination) => {
            console.log("button destination :", destination);
            this.setState({ destination, pointCoords: [] });
            this.onChangeDestinationDebounced(destination);
          }}
        />
        {predictions}
        {driverButton}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomButton: {
    backgroundColor: "black",
    marginTop: "auto",
    margin: 20,
    padding: 15,
    paddingLeft: 30,
    paddingRight: 30,
    alignSelf: "center",
  },
  bottomButtonText: {
    color: "white",
    fontSize: 20,
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
    marginRight: 5,
    marginLeft: 5,
    backgroundColor: "white",
    padding: 5,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
