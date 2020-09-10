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
        <View style={styles.conatainer}>
          <TextInput
            style={styles.input}
            placeholder="username@email.com"
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
          <TouchableOpacity onPress={this.props.handleSignIn}>
            <Text style={styles.text}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.handleSignUp}>
            <Text style={styles.text}>Register</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },

  text: {
    fontSize: 20,
    height: 40,
    color: "#f6bd60",
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: "black",
    marginBottom: 10,
    padding: 10,
    justifyContent: "center",
    flexDirection: "row",
    width: 110,
    alignContent: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  input: {
    height: 40,

    alignSelf: "center",

    fontSize: 15,
    width: 300,
    backgroundColor: "#faf3dd",
    // backgroundColor: "#FFFFFF50",
    padding: 10,
    color: "#e9c46a",
    marginBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    flexDirection: "row",
  },
});
