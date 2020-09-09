import React, { Component } from "react";
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Guest from "./src/components/screens/Guest";
import Host from "./src/components/screens/Host";
import Welcome from "./src/components/screens/Welcome";

import * as Location from "expo-location";
import Constants from "expo-constants";
import MyEvents from "./src/components/screens/MyEvents";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGuest: false,
      isHost: false,
      hasToken: false,
      myEventsShow: false,
    };
  }
  componentDidMount() {
    Location.requestPermissionsAsync();
  }
  click() {
    this.setState({ hasToken: true });
  }
  render() {
    if (this.state.isGuest) {
      return <Guest />;
    }

    if (this.state.isHost) {
      return <Host />;
    }

    if (this.state.myEventsShow) {
      return <MyEvents />;
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
          <Button
            title="MyEvents"
            onPress={() => this.setState({ myEventsShow: true })}
          />
          {/* <Welcome /> */}
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
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
