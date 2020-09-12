import React, { Component } from "react";
import { ScrollView, Button, StyleSheet, Text, View } from "react-native";
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
        "headers": {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
      };
      const events = await axios.get(
        `${baseUrl}/api/users/test/events`,
        config
      );
      console.log("inside code before error catch");
      console.log("GOT EVENTS", events.data);
      return events
    } catch (err) {
      console.error("Try again, my friend. Try again.", err);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.heading}>My Events</Text>
        </View>
        <ScrollView >
          {this.state.events
            ? this.state.events.map((event, index) => {
                return (
                  <View key={index} style={styles.textBox}>
                    <Text>{event.title}</Text>
                    <Text style={styles.paragraph}>{event.description}</Text>
                    <Text>{event.date}</Text>
                    {this.state.isHost ? (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("Tabs", {
                            screen: "Host",
                          })
                        }
                      >
                        <Text style={styles.button}>Start Hosting</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("Tabs", {
                            screen: "Guest",
                          })
                        }
                      >

                          <Text style={styles.button}>Share Location</Text>

                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            : null}
        </ScrollView>
      </View>
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
  heading: {
    color: "#71C8E2",
    backgroundColor: "black",
    fontSize: 20,
    width: 150,
    marginBottom: 10,
    justifyContent: "center",
    height: 45,
    justifyContent: "center",
    flexDirection: "row",
    textAlign: "center",
    alignContent: "center",
    alignSelf: "center",
  },
  event: {
    flex: 0.5,
    paddingVertical: 20,
    backgroundColor: "#00B8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  textBox: {
    flex: 0.5,
    backgroundColor: "#FAC5DE",
    padding: 5,
    fontSize: 18,
    borderWidth: 0.5,
    marginLeft: 5,
    marginRight: 5,
    height: 120,
    width: 300,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
  },
  paragraph: {
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 12,
  },
  button: {
    color: "white",
    backgroundColor: "#71C8E2",
    fontSize: 18,
    width: 110,
    marginBottom: 10,
    justifyContent: "center",
    height: 45,
    textAlign: "center",
    alignContent: "center",
    alignSelf: "center",
  },
});
