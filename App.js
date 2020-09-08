import React, { Component } from "react";
import { StyleSheet, Button, View, SafeAreaView } from "react-native";
import Guest from "./src/components/screens/Dri-Host";
import Host from "./src/components/screens/Pass-guest";

import * as Location from "expo-location";
import Constants from "expo-constants";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGuest: false,
      isHost: false,
    };
  }
  componentDidMount() {
    Location.requestPermissionsAsync();
  }
  render() {
    if (this.state.isGuest) {
      return <Guest />;
    }

    if (this.state.isHost) {
      return <Host />;
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.separator}>
          <Button
            title="Host"
            onPress={() => this.setState({ isHost: true })}
          />
          <Button
            title="Guest"
            onPress={() => this.setState({ isGuest: true })}
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
