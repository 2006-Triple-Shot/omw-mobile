import React, { Component } from "react";
import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import BottomButton from "./BottomButton";
import { apiKey } from "./google-api";
import polyline from "@mapbox/polyline";
import socketIO from "socket.io-client";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import baseUrl from "../../../baseUrl";
import axios from "axios";

const LOCATION_TASK_NAME = "background-location-task";
let socket
if (process.env.NODE_ENV === "production") {
  socket = socketIO.connect(`${baseUrl}`);
} else {
  socket = socketIO.connect("http://192.168.1.169:5000");
}


TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {

  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    const { locations } = data;

    // setInterval(() => {

    socket.emit("liveTracking", {
      latitude: locations[0].coords.latitude,
      longitude: locations[0].coords.longitude,
    });

  }
});

export default class Guest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      latitude: null,
      longitude: null,
      pointCoords: [],
      destination: "",
      routeResponse: {},
      lookingForHosts: false,
      pending: true,
      indicator: true,
      complete: false,
    };
    this.acceptHostRequest = this.acceptHostRequest.bind(this);
    this.findHosts = this.findHosts.bind(this);

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
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => console.log(error),
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
      const pointCoords = points.map(point => {
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

  findHosts() {
    if (!this.state.lookingForHosts) {
      this.setState({ lookingForHosts: true });

      socket.on("connection");
      socket.emit(
        "joinEvent",
        {
          latitude: this.state.latitude,
          longitude: this.state.longitude,
        },
        this.props.Id
      );

      socket.on("guestRequest", async (routeResponse) => {
        // console.log(routeResponse);
        this.setState({
          hostFound: true,
          routeResponse,
          indicator: false,
        });
        // await this.getRouteDirections(
        // routeResponse.geocoded_waypoints[0].place_id
        // );
        // this.map.fitToCoordinates(this.props.pointCoords, {
        //   edgePadding: { top: 140, bottom: 140, left: 20, right: 20 },
        // });
      });
    }
  }

  acceptHostRequest = async () => {
    socket.emit("guestAccepts", {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    });

    this.setState({
      lookingForHosts: false,
      hostFound: true,
      pending: false,
    });
  };

  stopSharing() {
    socket.emit("stopSharing");
    this.setState({ complete: true });
  }
  render() {
    let endMarker = null;
    let startMarker = null;
    let button = null;
    let findingHostActIndicator = null;
    let hostSearchText = "Join 👥";
    let bottomButtonFunction = this.findHosts;
    if (!this.state.latitude) return null;

    if (this.state.lookingForHosts && this.state.indicator) {
      hostSearchText = "Hold, tight..";
      findingHostActIndicator = (
        <ActivityIndicator
          key={this.getRandomInt()}
          size="large"
          animating={this.state.lookingForHosts}
        />
      );
    }

    if (this.state.hostFound && this.state.pending) {
      hostSearchText = "Share Live Location";
      bottomButtonFunction = this.acceptHostRequest;
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
    if (this.state.pending) {
      button = (
        <BottomButton
          onPressFunction={bottomButtonFunction}
          buttonText={hostSearchText}
        >
          {findingHostActIndicator}
        </BottomButton>
      );
    }
    return (
      <View style={styles.container}>
        <MapView
          key={this.getRandomInt()}
          ref={map => {
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
          {/* <Polyline
            coordinates={this.state.pointCoords}
            strokeWidth={2}
            strokeColor="red"
          /> */}
          {endMarker}
          {startMarker}
        </MapView>
        {button}
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








// import React, { Component } from "react";
// import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
// import MapView, { Polyline, Marker } from "react-native-maps";
// import BottomButton from "./BottomButton";
// import { apiKey } from "./google-api";
// import polyline from "@mapbox/polyline";
// import socketIO from "socket.io-client";
// import * as TaskManager from "expo-task-manager";
// import * as Location from "expo-location";
// import axios from "axios";

// const LOCATION_TASK_NAME = "background-location-task";
// const socket = socketIO.connect("http://192.168.0.153:5000");

// TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
//   if (error) {
//     console.log(error);
//     return;
//   }
//   if (data) {
//     const { locations } = data;
//     count++;
//     socket.emit("liveTracking", {
//       latitude: locations[0].coords.latitude,
//       longitude: locations[0].coords.longitude,
//     });
//     console.log(connected);
//   }
// });

// export default class Guest extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       userId: "",
//       latitude: null,
//       longitude: null,
//       pointCoords: [],
//       destination: "",
//       routeResponse: {},
//       lookingForHosts: false,
//       pending: true,
//       indicator: true,
//       complete: false,
//     };
//     this.acceptHostRequest = this.acceptHostRequest.bind(this);
//     this.findHosts = this.findHosts.bind(this);

//     this.getRouteDirections = this.getRouteDirections.bind(this);
//   }

//   componentWillUnmount() {
//     navigator.geolocation.clearWatch(this.watchId);
//   }

//   componentDidMount() {
//     Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//       accuracy: 4,
//       distanceInterval: 500,
//     });
//     this.watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         this.setState({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//       },
//       (error) => console.log(error),
//       { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
//     );
//   }

//   async getRouteDirections(destinationPlaceId) {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}&destination=place_id:${destinationPlaceId}&key=${apiKey}`
//       );
//       const json = await response.json();
//       const points = polyline.decode(json.routes[0].overview_polyline.points);
//       const pointCoords = points.map((point) => {
//         return { latitude: point[0], longitude: point[1] };
//       });
//       this.setState({
//         pointCoords,
//         routeResponse: json,
//       });
//       return;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   getRandomInt() {
//     return Math.floor(Math.random() * Math.floor(1000));
//   }

//   findHosts() {
//     if (!this.state.lookingForHosts) {
//       this.setState({ lookingForHosts: true });
//       socket.on("connection");
//       socket.emit(
//         "joinEvent",
//         {
//           latitude: this.state.latitude,
//           longitude: this.state.longitude,
//         },
//         this.props.Id
//       );

//       socket.on("guestRequest", async (routeResponse) => {
//         this.setState({
//           hostFound: true,
//           routeResponse,
//           indicator: false,
//         });
//       });
//     }
//   }

//   acceptHostRequest = async () => {
//     socket.emit("guestAccepts", {
//       latitude: this.state.latitude,
//       longitude: this.state.longitude,
//     });
//     this.setState({
//       lookingForHosts: false,
//       hostFound: true,
//       pending: false,
//     });
//   };

//   stopSharing() {
//     socket.emit("stopSharing");
//     this.setState({ complete: true });
//   }
//   render() {
//     let endMarker = null;
//     let startMarker = null;
//     let button = null;
//     let findingHostActIndicator = null;
//     let hostSearchText = "Join 👥";
//     let bottomButtonFunction = this.findHosts;
//     if (!this.state.latitude) return null;
//     if (this.state.lookingForHosts && this.state.indicator) {
//       hostSearchText = "Hold, tight..";
//       findingHostActIndicator = (
//         <ActivityIndicator
//           key={this.getRandomInt()}
//           size="large"
//           animating={this.state.lookingForHosts}
//         />
//       );
//     }

//     if (this.state.hostFound && this.state.pending) {
//       hostSearchText = "Share Live Location";
//       bottomButtonFunction = this.acceptHostRequest;
//     }

//     if (this.state.pointCoords.length > 1) {
//       endMarker = (
//         <Marker
//           key={this.getRandomInt()}
//           coordinate={this.state.pointCoords[this.state.pointCoords.length - 1]}
//         >
//           <Image
//             style={{ width: 40, height: 40 }}
//             source={require("../images/person-marker.png")}
//           />
//         </Marker>
//       );
//     }
//     if (this.state.pending) {
//       button = (
//         <BottomButton
//           onPressFunction={bottomButtonFunction}
//           buttonText={hostSearchText}
//         >
//           {findingHostActIndicator}
//         </BottomButton>
//       );
//     }
//     return (
//       <View style={styles.container}>
//         <MapView
//           key={this.getRandomInt()}
//           ref={(map) => {
//             this.map = map;
//           }}
//           style={styles.map}
//           region={{
//             latitude: this.state.latitude,
//             longitude: this.state.longitude,
//             latitudeDelta: 0.15,
//             longitudeDelta: 0.15,
//           }}
//           showsUserLocation={true}
//         >
//           {endMarker}
//           {startMarker}
//         </MapView>
//         {button}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   findGuest: {
//     backgroundColor: "black",
//     marginTop: "auto",
//     margin: 20,
//     padding: 15,
//     paddingLeft: 30,
//     paddingRight: 30,
//     alignSelf: "center",
//   },
//   findGuestText: {
//     fontSize: 20,
//     color: "white",
//     fontWeight: "600",
//   },
//   suggestions: {
//     backgroundColor: "white",
//     padding: 5,
//     fontSize: 18,
//     borderWidth: 0.5,
//     marginLeft: 5,
//     marginRight: 5,
//   },
//   destinationInput: {
//     height: 40,
//     borderWidth: 0.5,
//     marginTop: 50,
//     marginLeft: 5,
//     marginRight: 5,
//     padding: 5,
//     backgroundColor: "white",
//   },
//   container: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });
