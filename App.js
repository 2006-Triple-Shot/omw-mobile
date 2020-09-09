// In App.js in a new project
import Welcome from "./src/components/screens/Welcome";
import Host from "./src/components/screens/Host";
import Guest from "./src/components/screens/Guest";
import FrontPage from "./src/components/screens/FrontPage";
import Apps from "./Appless";
import * as React from "react";
import { StyleSheet, Button, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./src/components/screens/Splash";

function MainScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* <Text>Home Screen</Text> */}
      <Apps />
      <Button title="Go to Apps" onPress={() => navigation.navigate("Apps")} />
    </View>
  );
}

function Splash({ navigation }) {
  return (
    <View style={styles.container}>
      {/* <Text>Home Screen</Text> */}
      <SplashScreen />

      <Button title="Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* <Text>Home Screen</Text> */}
      <Welcome />
      <Button
        title="Go to Maps"
        onPress={() => navigation.navigate("HostDetails")}
      />
      <Button
        title="Go to Guest Maps"
        onPress={() => navigation.navigate("GuestDetails")}
      />
      <Button
        title="Splash"
        onPress={() => navigation.navigate("SplashScreen")}
      />
      <Button title="Exit" onPress={() => navigation.navigate("GoodBye")} />
    </View>
  );
}
function HostDetailsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Details Screen</Text>

      <Host />
      {/* <Button
        title="Go to Details... again"
        onPress={() => navigation.push("Details")}
      /> */}
      {/* <Button title="Go to Home" onPress={() => navigation.navigate("Home")} /> */}
      {/* <Button title="Go back" onPress={() => navigation.goBack()} /> */}
      {/* <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      /> */}
    </View>
  );
}
function GuestDetailsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Details Screen</Text>
      <Guest />
    </View>
  );
}

// function LoginScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text>Login</Text>
//       <LoginScreen />
//     </View>
//   );
// }

const Stack = createStackNavigator();

function Apple() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SplashScreen" component={Splash} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Apps" component={MainScreen} />

        <Stack.Screen name="HostDetails" component={HostDetailsScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="GoodBye" component={FrontPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
export default Apple;
