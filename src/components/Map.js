import React, { useState, useEffect } from "react";
import MapView, {
  PROVIDER_GOOGLE,
  AnimatedRegion,
  Marker,
} from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import * as Location from "expo-location";

const initialRegion = {
  latitude: 40.742741,
  longitude: -73.989128,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

let initLocation = {
  coords: {
    latitude: 40.742741,
    longitude: -73.989128,
  },
};

const initialMarkers = [];

export default function App(props) {
  const [location, setLocation] = useState(initLocation);
  const [errorMsg, setErrorMsg] = useState("");
  const [mapRegion, setRegion] = useState(initialRegion);
  const [markers, setMarkers] = useState(initialMarkers);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([]);

  findCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log("position:", position);
        // const latitude = JSON.stringify(position.coords.latitude);
        // const longitude = JSON.stringify(position.coords.longitude);
        // console.log("Longitude :", position.coords.longitude);
        setLocation(position);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    // console.log("in useffect");
    findCurrentLocation();
  }, []);
  async function getLocation() {}

  function watchLocation() {
    return async function () {
      let marker = await Location.watchPositionAsync({
        enableHighAccuracy: true,
        mayShowUserSettingsDialog: true,
        timeInterval: 2000,
      });
      return marker;
    };
  }

  function onRegionChange(region) {
    setRegion(region);
  }

  useEffect(() => {
    let mounted = true; //

    if (mounted) {
      async () => {
        try {
          let { status } = await Location.requestPermissionsAsync();
          if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
          }
          const locale = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true,
            maximumAge: 2000,
            timeout: 20000,
          });
          // setLocation(locale);
        } catch (err) {
          let status = Location.getProviderStatusAsync();
          if (!(await status).locationServicesEnabled) {
            alert("Enable location services");
          }
        }
      };
    }
    return function cleanup() {
      mounted = false;
    };
  }, []); // add dependency

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
        mapRegion={initialRegion}
        onRegionChange={() => onRegionChange(initialRegion)}
        onPress={findCurrentLocation}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title={`My House`}
        ></Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c7f5f2",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});




// import React, { Component } from "react";
// import {
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   View,
//   Platform,
//   Alert,
//   Image,
//   SafeAreaView,
//   ImageBackground,
// } from "react-native";
// import baseUrl from "./baseUrl";
// import axios from "axios";
// import Apple from "./manikaApp.js";

// export default class Login extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       userId: 0,
//       email: "",
//       token: "",
//       user: {},
//       isHost: false,
//       isGuest: true,
//       loggedIn: false,
//       userEvents: [],
//       userContacts: [],
//       config: {}
//     };
//     this.populateArrayWithEventData = this.populateArrayWithEventData.bind(
//       this
//     );
//     this.handleChange = this.handleChange.bind(this);
//     this.handleSignIn = this.handleSignIn.bind(this);
//     this.handleSignUp = this.handleSignUp.bind(this);
//     this.getUser = this.getUser.bind(this);
//   }

//   componentDidMount() {
//     if (this.state.loggedIn) {
//     }
//   }

//   handleChange(name, value) {
//     this.setState({
//       [name]: value,
//     });
//   }

//   async handleSignUp() {
//     try {
//       const { email, password } = this.state;
//       await axios.post("/auth/signup", { email, password });
//       this.handleSignIn();
//     } catch (error) {
//       this.setState({ errorMessage: error.response.data.message });
//     }
//   }

//   async handleSignIn() {
//     try {
//       const { email, password } = this.state;
//       const result = await axios.post(`${baseUrl}/auth/login`, {
//         email: email,
//         password: password,
//       });
//       const token = await result.data.token;
//       this.setState({ token: token });
//       const user = await this.getUser();
//       this.setState({
//         user: user.data,
//         isHost: user.data.isHost,
//         loggedIn: true,
//       });
//       console.log("Got user ? ", user.data);
//     } catch (error) {
//       console.log(error, "Nope.");
//     }
//   }

//   async getUser() {
//     try {
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${this.state.token}`,
//         },
//       };
//       const user = await axios.get(
//         `${baseUrl}/api/users/${this.state.email}`,
//         config
//       );
//       this.setState({

//         config: config,
//       });
//       return user;
//     } catch (err) {
//       console.log(err, "Error.");
//     }
//   }

//   async populateArrayWithEventData() {
//     try {
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${this.state.token}`,
//         },
//       };
//       const events = await axios.get(`${baseUrl}/api/users/test/events`,
//         config
//       );
//       const results = [events];
//       return results;
//     } catch (err) {
//       console.log(err, "It failed");
//     }
//   }

//   render() {
//     if (this.state.loggedIn) {
//       return <Apple  />;
//     }
//     return (
//       <SafeAreaView style={styles.container}>
//         <ImageBackground
//           source={{
//             uri:
//               "https://images.unsplash.com/photo-1597702822474-6dc92016e35d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
//           }}
//           style={styles.image}
//         >
//           <View>
//             <Text style={styles.headerText}>On My Way</Text>
//             <SafeAreaView>
//               <View>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="your@email.com"
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   placeholderTextColor="black"
//                   value={this.state.email}
//                   onChangeText={email => this.handleChange("email", email)}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   secureTextEntry
//                   placeholder="Password"
//                   placeholderTextColor="black"
//                   value={this.state.password}
//                   onChangeText={pw => this.handleChange("password", pw)}
//                 />
//                 <TouchableOpacity
//                   onPress={this.handleSignIn}
//                   style={styles.button}
//                 >
//                   <Text style={styles.buttonText}>Sign in</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => {console.log("signup")}}
//                   style={styles.button}
//                 >
//                   <Text style={styles.buttonText}>Register</Text>
//                 </TouchableOpacity>
//               </View>
//             </SafeAreaView>
//             <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
//           </View>
//         </ImageBackground>
//       </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "column",
//     backgroundColor: "black",
//   },
//   image: {
//     flex: 1,
//     resizeMode: "cover",
//     justifyContent: "center",
//   },
//   headerText: {
//     fontSize: 20,
//     height: 40,
//     color: "#f6bd60",
//     fontWeight: "bold",
//     textAlign: "center",
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     backgroundColor: "black",
//     marginBottom: 10,
//     padding: 10,
//     justifyContent: "center",
//     flexDirection: "row",
//     width: 120,
//     alignContent: "center",
//     alignSelf: "center",
//     marginTop: 10,
//   },
//   buttonText: {
//     fontSize: 20,
//     height: 40,
//     color: "#f6bd60",
//     fontWeight: "bold",
//     textAlign: "center",
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     backgroundColor: "black",
//     marginBottom: 10,
//     padding: 10,
//     justifyContent: "center",
//     flexDirection: "row",
//     width: 110,
//     alignContent: "center",
//     alignSelf: "center",
//     marginTop: 10,
//   },
//   input: {
//     height: 40,
//     alignSelf: "center",
//     fontSize: 15,
//     width: 300,
//     backgroundColor: "#faf3dd",
//     // backgroundColor: "#FFFFFF50",
//     padding: 10,
//     color: "black",
//     marginBottom: 10,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     justifyContent: "center",
//     flexDirection: "row",
//   },

//   // buttonText: {
//   //   textAlign: "center",
//   //   fontSize: 16,
//   //   color: "#fff",
//   //   fontWeight: "500",
//   //   fontFamily: Platform.OS === "android" ? "sans-serif-light" : undefined,
//   // },
// });
