// In App.js in a new project
import Welcome from "./src/components/screens/Welcome";
import Host from "./src/components/screens/Host";
import Guest from "./src/components/screens/Guest";
import FrontPage from "./src/components/screens/FrontPage";
import Apps from "./Apps";
import Login from "./Login";

import * as React from "react";
import { StyleSheet, Button, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Login />
      <Button
        color="black"
        title="Go to Events Page"
        onPress={() => navigation.navigate("Welcome")}
      />
    </View>
  );
}
function DetailScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Welcome />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Stack = createStackNavigator();

function Apple() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: "#f6bd60",
            },
          }}
          name="Login"
          component={HomeScreen}
        />
        <Stack.Screen name="Welcome" component={DetailScreen} />
        {/* <Stack.Screen name="Apps" component={MainScreen} />

        <Stack.Screen name="HostDetails" component={HostDetailsScreen} />
        <Stack.Screen name="Login" component={LoginScreen} /> */}
        {/* <Stack.Screen name="GoodBye" component={FrontPage} /> */}
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
