import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Platform,
  TouchableWithoutFeedbackBase,
} from "react-native";
import LoginForm from "./src/components/LoginForm";
import axios from "axios";
import baseURL from "./baseUrl";

axios.defaults.baseURL = baseURL;

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      token: "",
      jwt: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.newJwt = this.newJwt.bind(this);
  }

  newJwt(jwt) {
    this.setState({ jwt: jwt });
  }

  handleChange(name, value) {
    this.setState({
      [name]: value,
    });
  }

  async handleSignUp() {
    try {
      const { email, password } = this.state;
      await axios.post("/auth/signup", { email, password });
      this.handleSignIn();
    } catch (error) {
      this.setState({ errorMessage: error.response.data.message });
    }
  }

  async handleSignIn() {
    try {
      this.setState({ errorMessage: "" });
      const { email, password } = this.state;
      const result = await axios.post(`${baseURL}/auth/login`, {
        email: this.state.email,
        password: this.state.password,
      });
      const token = `${result.data.token}`;
      this.setState({ token: token });
      console.log(this.state.token);
      alert(token);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}> On My Way! </Text>
        <LoginForm
          email={this.state.email}
          password={this.state.password}
          handleChange={this.handleChange}
          handleSignIn={this.handleSignIn}
          handleSignUp={this.handleSignUp}
        />

        <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
        <View></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#55CDFC",
  },
  headerText: {
    fontSize: 44,
    color: "white",
    marginTop: 30,
    textAlign: "center",
    fontWeight: "700",
    fontFamily: Platform.OS === "android" ? "sans-serif-light" : undefined,
  },
  errorMessage: {
    marginHorizontal: 10,
    fontSize: 18,
    color: "#F5D7CC",
    fontWeight: "bold",
  },
});
