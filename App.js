import React, { Component } from "react";
import { StyleSheet, Button, View } from "react-native";
import Driver from "./src/components/screens/Dri-Host";
import Passenger from "./src/components/screens/Pass-guest";
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDriver: false,
      isPassenger: false,
    };
  }
  render() {
    return this.state.isDriver ? (
      <Driver />
    ) : this.state.isPassenger ? (
      <Passenger />
    ) : (
      <View style={styles.container}>
        <Button
          title="Passenger"
          onPress={() => this.setState({ isPassenger: true })}
        />
        <Button
          title="Driver"
          onPress={() => this.setState({ isDriver: true })}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  constainer: {
    paddingRight: 50,
    flex: 1,
    marginTop: 100,
  },
});
