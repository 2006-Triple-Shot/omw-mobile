// import React, { Component } from "react";
// import { Keyboard, PermissionsAndroid, Platform } from "react-native";
// import polyline from "@mapbox/polyline";
// import { apiKey } from "./google-api";
// import Location from "expo-location";

// function genericContainer(WrappedComponent) {
//   return class extends Component {
//     constructor(props) {
//       super(props);
//       //   this.state = {
//       //     latitude: null,
//       //     longitude: null,
//       //     pointCoords: [],
//       //     destination: "",
//       //     routeResponse: {},
//       //   };
//       //   this.getRouteDirections = this.getRouteDirections.bind(this);
//     }

//     // componentWillUnmount() {
//     //   navigator.geolocation.clearWatch(this.watchId);
//     // }

//     // componentDidMount() {
//     //   this.watchId = navigator.geolocation.getCurrentPosition(
//     //     (position) => {
//     //       this.setState({
//     //         latitude: position.coords.latitude,
//     //         longitude: position.coords.longitude,
//     //       });
//     //     },
//     //     (error) => console.log(error),
//     //     { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
//     //   );
//     //   // Location.startLocationUpdatesAsync(taskName, options);
//     // }

//     // async getRouteDirections(destinationPlaceId, destinationName) {
// //       try {
// //         const response = await fetch(
// //           `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}&destination=place_id:${destinationPlaceId}&key=${apiKey}`
// //         );
// //         console.log(response);
// //         const json = await response.json();
// //         console.log(json);
// //         const points = PolyLine.decode(json.routes[0].overview_polyline.points);
// //         const pointCoords = points.map((point) => {
// //           return { latitude: point[0], longitude: point[1] };
// //         });
// //         this.setState({
// //           pointCoords,
// //           routeResponse: json,
// //         });
// //         Keyboard.dismiss();
// //         return destinationName;
// //       } catch (error) {
// //         console.error(error);
// //       }
// //     }

// //     render() {
// //       return (
// //         <WrappedComponent
// //           getRouteDirections={this.getRouteDirections}
// //           latitude={this.state.latitude}
// //           longitude={this.state.longitude}
// //           pointCoords={this.state.pointCoords}
// //           destination={this.state.destination}
// //           routeResponse={this.state.routeResponse}
// //         />
// //       );
// //     }
// //   };
// }

// export default genericContainer;
