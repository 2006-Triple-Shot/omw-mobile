import React, { Component } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import baseUrl from "../../../baseUrl";


export default class MyEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      user: {},
      token: ""

    };
  }

  async componentDidMount() {
    // const test = await populateArrayWithEventData();
    // console.log("test", test);
    const { user, token, config } = this.props;
    this.setState({
      user: user,
      token: token,
      config: config
    })
  }
  async getEvents() {
    try {
      const events = await axios.get(
        `${baseUrl}/api/users/test/events`,
        this.state.config
      );
      this.setState({ events: events });
      console.log("GOT EVENTS", events)
    } catch (err) {
      console.error(err);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.heading}>My Events</Text>
        </View>

        <View style={styles.event}>
          {this.state.events
            ? this.state.events.map((event, index) => {
                return (
                  <View key={index} style={styles.textBox}>
                    <Text>{event.title}</Text>
                    <Text>{event.date}</Text>
                  </View>
                );
              })
            : null}
        </View>
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
    fontSize: 44,
    textAlign: "center",
    color: "black",
    // backgroundColor: "white",
    marginTop: 10,
    marginBottom: 100,
    fontWeight: "400",
  },
  event: {
    flex: 0.5,
    backgroundColor: "#00B8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  textBox: {
    flex: 0.5,
    backgroundColor: "#fff",
    padding: 5,
    fontSize: 18,
    borderWidth: 0.5,
    marginLeft: 5,
    marginRight: 5,
    height: 80,
    width: 300,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
  },
});
