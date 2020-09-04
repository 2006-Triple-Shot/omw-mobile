import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { apiKey } from "./secret";
import _ from "lodash";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      error: null,
      destination: "",
      predictions: [],
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message })
    ),
      { enableHighAccuracy: true, timeout: 20000, minimumAge: 2000 };
  }

  async onChangeDestination(destination) {
    this.setState({ destination });
    const apiURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000`;
    try {
      const result = await fetch(apiURL);
      const json = await result.json();
      console.log("result JSON:", json);
      this.setState({
        predictions: json.predictions,
      });
    } catch (err) {
      console.error(err);
    }
  }

  pressedPrediction(prediction) {
    console.log(prediction);
    Keyboard.dismiss();
    this.setState({
      locationPredictions: [],
      destination: prediction.description,
    });
    Keyboard;
  }

  render() {
    const predictions = this.state.predictions.map((prediction) => (
      <Text
        onChangeDestination={this.pressedPrediction}
        key={prediction.id}
        style={styles.suggestions}
      >
        {prediction.description}
      </Text>
    ));
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.095,
            longitudeDelta: 0.0621,
          }}
          showsUserLocation={true}
        >
          <TextInput
            placeholder="Enter destination"
            style={styles.destinationInput}
            value={this.state.destination}
            onChangeText={(destination) =>
              this.onChangeDestination(destination)
            }
          />
          {/* {predictions} */}

          <Marker coordinate={this.state}></Marker>
        </MapView>
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
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    backgroundColor: "white",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    // height: 400,
    // width: 400,
    // justifyContent: "flex-end",
    // alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
