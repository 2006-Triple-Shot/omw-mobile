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
// import Apple from "./Apple";

import * as Location from "expo-location";
import Constants from "expo-constants";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGuest: false,
      isHost: false,
      showLogin: true,
    };
  }
  componentDidMount() {
    Location.requestPermissionsAsync();
  }
  click() {
    this.setState({ hasToken: true });
  }
  render() {
    // if (this.state.showLogin) {
    //   return <Login />;
    // }
    if (this.state.isGuest) {
      user = <Guest />;
    }

    if (this.state.isHost) {
      user = <Host />;
    }

    // return (
    //   <SafeAreaView style={styles.container}>
    //     <View style={styles.separator}>
    //       <Button
    //         title="Host"
    //         onPress={() => this.setState({ isHost: true })}
    //       />
    //       <Button
    //         title="Guest"
    //         onPress={() => this.setState({ isGuest: true })}
    //       />

    //       {/* <Welcome /> */}
    //     </View>
    //   </SafeAreaView>
    // );
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
