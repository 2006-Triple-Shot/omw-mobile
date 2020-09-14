import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
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
      guestIsOnTheWay: false,
      mylocation: {},
      guestList: {},
      guestLocation: {},
    };

    this.onChangeDestinationDebounced = _.debounce(
      this.onChangeDestination,
      1000
    );
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
    let socket;
    if (process.env.NODE_ENV === "production") {
      socket = socketIO.connect(`${baseUrl}`);
    } else {
      socket =
        socketIO.connect("http://192.168.0.153:5000") ||
        socketIO.connect("http://192.168.1.169:5000");
    }

    socket.on("connection");
    socket.emit("guestRequest", this.state.routeResponse);

    socket.on("guestAccepts", (guestLocation, Id) => {
      console.log("ID :", Id);
      this.state.guestList[Id] = guestLocation;
      const pointCoords = [...this.state.pointCoords, guestLocation];

      this.setState({
        lookingForGuest: false,
        guestIsOnTheWay: true,
        guestLocation,
        pointCoords,
      });
    });

    socket.on("liveTracking", (guestLocation, Id) => {
      const pointCoords = [...this.state.pointCoords, guestLocation];
      this.state.guestList[Id] = guestLocation;
      this.setState({
        lookingForGuest: false,
        guestIsOnTheWay: true,
        guestLocation,
        pointCoords,
      });
    });
  }

  render() {
    let marker = null;
    let getGuest = null;
    let findingGuestActIndicator = null;
    let guestMarker1 = null;
    let guestMarker2 = null;
    let guestMarker3 = null;
    const drivers = Object.values(this.state.guestList);
    if (!this.state.latitude) return null;
    if (this.state.guestIsOnTheWay) {
      guestMarker1 = (
        <Marker coordinate={drivers[0]} key={this.getRandomInt()}>
          <Image
            source={require("../images/person.png")}
            style={{ width: 40, height: 40 }}
          />
        </Marker>
      );
      if (drivers.length > 1) {
        guestMarker2 = (
          <Marker coordinate={drivers[1]} key={this.getRandomInt()}>
            <Image
              source={require("../images/man.png")}
              style={{ width: 40, height: 40 }}
            />
          </Marker>
        );
        if (drivers.length > 2) {
          guestMarker3 = (
            <Marker coordinate={drivers[2]} key={this.getRandomInt()}>
              <Image
                source={require("../images/lady.png")}
                style={{ width: 40, height: 40 }}
              />
            </Marker>
          );
        }
      }
    }
    if (this.state.lookingForGuest) {
      findingGuestActIndicator = (
        <ActivityIndicator
          size="large"
          animating={this.state.lookingForGuest}
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
            latitudeDelta: 0.18,
            longitudeDelta: 0.18,
          }}
          showsUserLocation={true}
        >
          {/* <Polyline
            key={this.getRandomInt()}
            coordinates={this.state.pointCoords}
            strokeWidth={1}
            strokeColor="red"
          /> */}
          {guestMarker1}
          {guestMarker2}
          {guestMarker3}
        </MapView>
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
