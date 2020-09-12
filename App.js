import React, { Component } from "react";

// Main Screens
import {
  Welcome,
  Guest,
  Host,
  MyEvents,
  Event,
  New,
  Profile,
  Settings
} from "./src/components"
import Login from "./emreApp";


import { StyleSheet, Button, View, Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const MaterialBottomTabs = createMaterialBottomTabNavigator();

const createBottomTabs = () => {
  return (
    <MaterialBottomTabs.Navigator
      screenOptions={{
        tabBarColor: "#080C0E",
      }}
    >
      <MaterialBottomTabs.Screen name="MyEvents" component={MyEvents} />
      <MaterialBottomTabs.Screen name="Guest" component={Guest} />
      <MaterialBottomTabs.Screen name="Host" component={Host} />
      <MaterialBottomTabs.Screen name="Profile" component={Profile} />
      <MaterialBottomTabs.Screen name="New" component={New} />
      <MaterialBottomTabs.Screen name="Settings" component={Settings} />
    </MaterialBottomTabs.Navigator>
  );
}

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#71C8E2",
              borderColor: "#2e2c2b",
            },
            headerTitleStyle: {
              color: "black",
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={Welcome}
            options={{
              headerStyle: { backgroundColor: "#71C8E2" },
              headerTitleStyle: { color: "black" },
            }}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="BottomTabs" children={createBottomTabs} options={{title:"On My Way"} }/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}












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
