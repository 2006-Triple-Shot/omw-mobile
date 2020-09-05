import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Keyboard,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { apiKey } from "./google-api";
import _ from "lodash";
import polyline from "@mapbox/polyline";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      error: "",
      destination: "",
      predictions: [],
      pointCoords: [],
      // locationPredictions: [],
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
        // this.getRouteDirections();
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
    );
  }
  // componentWillMount() {
  //   navigator.geolocation.clearWatch(this.watchId);
  // }
  async getRouteDirections(destinationPlaceId, destinationName) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}
        &destination=place_id:${destinationPlaceId}&key=${apiKey}`
      );
      const json = await response.json();
      console.log("json :", json);
      const points = polyline.decode(json.routes[0].overview_polyline.points);
      const pointCoords = points.map((point) => {
        return { latitude: point[0], longitude: point[1] };
      });
      this.setState({
        pointCoords,
        predictions: [],
        destination: destinationName,
      });
      Keyboard.dismiss();
      this.map.fitToCoordinates(pointCoords);
    } catch (error) {
      console.error(error);
    }
  }

  async onChangeDestination(destination) {
    this.setState({ destination });
    const apiURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000`;
    console.log(apiURL);
    try {
      const result = await fetch(apiURL);
      const json = await result.json();
      console.log("json :", json);
      this.setState({
        predictions: json.predictions,
      });
    } catch (err) {
      console.error(err);
    }
  }
  render() {
    let marker = null;
    if (this.state.latitude === null) return null;
    if (this.state.pointCoords.length > 1) {
      marker = (
        <Marker
          coordinate={this.state.pointCoords[this.state.pointCoords.length - 1]}
        />
      );
    }
    const predictions = this.state.predictions.map((prediction) => (
      <TouchableHighlight
        key={prediction.id}
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
            strokeColor="red"
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
            this.setState({ destination });
            this.onChangeDestinationDebounced(destination);
          }}
        />
        {predictions}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
