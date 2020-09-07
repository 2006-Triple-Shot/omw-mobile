import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { apiKey } from "../../../secret";
import _ from "lodash";
import polyline from "@mapbox/polyline";
import io from "socket.io-client";
// const socket = io("http://192.168.1.169:5000");

export default class Driver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      error: "",
      pointCoords: [],
      lookingForGuests: false,
      passengerFound: false,
    };
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

  async getRouteDirections(destinationPlaceId) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}
        &destination=place_id:${destinationPlaceId}&key=${apiKey}`
      );
      const json = await response.json();
      const points = polyline.decode(json.routes[0].overview_polyline.points);
      const pointCoords = points.map((point) => {
        return { latitude: point[0], longitude: point[1] };
      });
      this.setState({
        pointCoords,
      });
      this.map.fitToCoordinates(pointCoords, {
        edgePadding: { top: 20, bottom: 20, left: 20, right: 20 },
      });
    } catch (error) {
      console.error(error);
    }
  }

  lookForGuests() {
    const socket = io("http://192.168.1.169:5000");
    this.setState({ lookingForGuests: true });
    // socket.on("connect", () => {
    socket.emit("lookingForPassenger");
    // });
    socket.on("taxiRequest", (routeResponse) => {
      console.log(routeResponse);
      // this.setState({
      //   lookingForGuests: false,
      //   passengerFound: true,
      //   routeResponse,
      // });
      this.getRouteDirections(routeResponse.geocoded_waypoints[1].place_id);
    });
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
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => this.lookForGuests()}
        >
          <View>
            {this.state.lookingForGuests ? (
              <ActivityIndicator
                animating={this.state.lookingForGuests}
                size="large"
              />
            ) : null}
            <Text style={styles.bottomButtonText}>Find Guests</Text>
          </View>
        </TouchableOpacity>
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
