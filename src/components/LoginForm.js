import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from "react-native";
import axios from "axios";

export default class LoginForm extends Component {
  render() {
    return (
      <SafeAreaView>
        <View>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="black"
            value={this.props.email}
            onChangeText={(email) => this.props.handleChange("email", email)}
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="black"
            value={this.props.password}
            onChangeText={(pw) => this.props.handleChange("password", pw)}
          />
          <TouchableOpacity
            onPress={this.props.handleSignIn}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.props.handleSignUp}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Create account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3A3743",
  },
  input: {
    height: 40,
    backgroundColor: "#E9D7C7",
    padding: 10,
    color: "black",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 20,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 23,
    color: "white",
    fontWeight: "500",
    fontFamily: Platform.OS === "android" ? "sans-serif-light" : undefined,
  },
});
