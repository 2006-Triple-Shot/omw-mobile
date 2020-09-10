import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Platform,
  Image,
  ImageBackground,
  TouchableWithoutFeedbackBase,
} from "react-native";
import LoginForm from "./src/components/LoginForm";
import axios from "axios";
import baseURL from "./baseUrl";
import Apps from "./Apps";
axios.defaults.baseURL = baseURL;

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      token: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
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
      const result = await axios.post(`${baseURL}auth/login`, {
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
    if (this.state.token) {
      return <Apps token={this.state.token} />;
    }
    return (
      <View style={styles.container}>
        <ImageBackground
          source={{
            uri:
              "https://images.unsplash.com/photo-1597702822474-6dc92016e35d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
          }}
          style={styles.image}
        >
          <Text style={styles.text}> On My Way! </Text>
          <LoginForm
            email={this.state.email}
            password={this.state.password}
            handleChange={this.handleChange}
            handleSignIn={this.handleSignIn}
            handleSignUp={this.handleSignUp}
          />
          <Text style={styles.text}>{this.state.errorMessage}</Text>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  text: {
    color: "#f6bd60",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
});
