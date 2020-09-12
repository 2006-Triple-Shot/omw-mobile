import React, { Component } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator
} from "react-native";
import baseUrl from "./baseUrl";
import axios from "axios";
import Apple from "./manikaApp.js";
import { AppLoading } from "expo";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      email: "",
      token: "",
      user: {},
      isHost: false,
      isGuest: true,
      loggedIn: false,
      userEvents: [],
      userContacts: [],
      config: {},
      isReady: true
    };
    // this.populateArrayWithEventData = this.populateArrayWithEventData.bind(
    //   this
    // );
    this.handleChange = this.handleChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  componentDidMount() {
    if (this.state.loggedIn) {
    }
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
      const { email, password } = this.state;
      const result = await axios.post(`${baseUrl}/auth/login`, {
        email: email,
        password: password,
      });
      this.setState({isReady: false});
      const token = await result.data.token;
      this.setState({ token: token });
      const user = await this.getUser();
      this.setState({
        user: user.data,
        isHost: user.data.isHost,
        loggedIn: true,
        isReady: true
      });
      console.log("Got user ? ", user.data);

      this.props.navigation.navigate("BottomTabs");
    } catch (error) {
      console.log(error, "Nope.");
    }
  }

  async getUser() {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${this.state.token}`,
        },
      };
      const user = await axios.get(
        `${baseUrl}/api/users/${this.state.email}`,
        config
      );
      this.setState({
        config: config,
      });
      return user;
    } catch (err) {
      console.log(err, "Error.");
    }
  }

  // async populateArrayWithEventData() {
  //   try {
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `${this.state.token}`,
  //       },
  //     };
  //     const events = await axios.get(
  //       `${baseUrl}/api/users/test/events`,
  //       config
  //     );
  //     const results = [events];
  //     return results;
  //   } catch (err) {
  //     console.log(err, "It failed");
  //   }
  // }

  render() {

    return (
      <SafeAreaView style={styles.container}>
        {!this.state.isReady ? (
          <ActivityIndicator size="large" animating={this.state.isReady} />
        ) : null}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <Text style={styles.headerText}>On My Way</Text>
            <SafeAreaView>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="black"
                  onBlur={() => Keyboard.dismiss()}
                  value={this.state.email}
                  onChangeText={email => this.handleChange("email", email)}
                />
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  placeholder="Password"
                  placeholderTextColor="black"
                  value={this.state.password}
                  onChangeText={pw => this.handleChange("password", pw)}
                />
                <TouchableOpacity
                  onPress={this.handleSignIn}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    console.log("signup");
                  }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
            <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
          </View>
        </TouchableWithoutFeedback>
        {/* </ImageBackground> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#71C8E2",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 28,
    height: 40,
    color: "#71C8E2",
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#71C8E2",
    marginBottom: 16,
    padding: 10,
    justifyContent: "center",
    flexDirection: "row",
    width: 160,
    alignContent: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 30,
    height: 50,
    color: "#71C8E2",
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: "black",
    marginBottom: 10,
    justifyContent: "center",
    flexDirection: "row",
    width: 150,
    alignContent: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  input: {
    height: 40,
    alignSelf: "center",
    fontSize: 15,
    width: 300,
    backgroundColor: "#A7ECFF",
    padding: 10,
    color: "black",
    marginBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    flexDirection: "row",
  },


});
