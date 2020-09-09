import React, { Component } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import LoginForm from "./LoginForm";

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      hide: true,
    };
  }

  loginScreen() {
    navigation.navigate("LoginForm");
  }

  render() {
    const { property } = this.props;
    console.log(property);
    return (
      <View style={styles.container}>
        <Text>On My Way!</Text>

        <Button title="Enter" onPress={() => this.loginScreen()} color="#20f" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#55CDFC",
    alignItems: "center",
    justifyContent: "center",
  },
});
