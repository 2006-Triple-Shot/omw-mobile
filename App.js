import React, { Component } from "react";
import { StyleSheet, Button, View, SafeAreaView } from "react-native";
import Driver from "./src/components/screens/Dri-Host";
import Passenger from "./src/components/screens/Pass-guest";
import * as Location from "expo-location";
import Constants from "expo-constants";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDriver: false,
      isPassenger: false,
    };
  }
  componentDidMount() {
    Location.requestPermissionsAsync();
  }
  render() {
    if (this.state.isDriver) {
      return <Driver />;
    }

    if (this.state.isPassenger) {
      return <Passenger />;
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.separator}>
          <Button
            title="Passenger"
            onPress={() => this.setState({ isPassenger: true })}
          />
          <Button
            title="Driver"
            onPress={() => this.setState({ isDriver: true })}
          />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
  },
  separator: {
    marginVertical: 28,
    borderBottomColor: "#737373",
    justifyContent: "space-between",
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
