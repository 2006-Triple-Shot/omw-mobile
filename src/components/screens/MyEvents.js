import React, { Component } from "react";
import {
  ScrollView,
  Button,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import axios from "axios";
import baseUrl from "../../../baseUrl";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class MyEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      user: {},
      token: "",
      isHost: false,
    };
    this.getEvents = this.getEvents.bind(this);
  }

  async componentDidMount() {
    const { user, token, isHost } = this.props.route.params;
    try {
      const events = await this.getEvents();
      this.setState({
        events: events.data,
        user: user,
        token: token,
        isHost: isHost,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getEvents() {
    try {
      const { token } = this.props.route.params;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      };
      const events = await axios.get(`${baseUrl}/api/events/`, config);
      // console.log("inside code before error catch");
      // console.log("GOT EVENTS", events.data);
      return events;
    } catch (err) {
      console.error("Try again, my friend. Try again.", err);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={{
            uri:
              "https://images.unsplash.com/photo-1597635814968-d26d10cebd89?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
          }}
          style={styles.image}
        >
          {/* <View>
            <Text style={styles.heading}></Text>
          </View> */}
          <ScrollView>
            {this.state.events
              ? this.state.events.map((event, index) => {
                  return (
                    <View key={index} style={styles.input}>
                      <Text style={styles.text2}>{event.title}</Text>
                      {/* <Text style={styles.paragraph}>{event.description}</Text> */}
                      {/* <Text>{event.date}</Text> */}
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("SingleEvent", {
                            params: {
                              eventId: event.id,
                              user: this.state.user,
                              isHost: this.state.isHost,
                              token: this.state.token,
                            },
                          })
                        }
                      >
                        <Text style={styles.text}>See Details..</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              : null}
          </ScrollView>
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
    fontSize: 22,
    height: 60,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
    padding: 15,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "center",
  },
  text2: {
    fontSize: 22,
    height: 40,
    color: "#7E2D29",
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
    padding: 15,
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
  },
  input: {
    alignSelf: "center",
    width: 320,
    backgroundColor: "#1B1D1A",
    backgroundColor: "#FFFFFF50",
    padding: 15,
    color: "#7E2D29",
    marginTop: 25,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  heading: {
    color: "white",
    backgroundColor: "#1A2425",
    fontSize: 20,
    width: 150,
    marginBottom: 10,
    justifyContent: "center",
    justifyContent: "center",
    flexDirection: "row",
    textAlign: "center",
    alignContent: "center",
    alignSelf: "center",
  },
});
