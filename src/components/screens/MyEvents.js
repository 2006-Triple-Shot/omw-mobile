import React, { Component } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import axios from "axios";
const testGet = {
  headers: {
    Authorizaton:
      "eyJhbGciOiJIUzI1NiJ9.TmF5ZWxpX0hlcnpvZzQyQHlhaG9vLmNvbQ.h2BXyk7RBRsI5eQoE7R-iArXxfVBQMlSbXBCIcLRHCg",
  },
};

export default class MyEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  componentDidMount() {
    this.getEvents();
  }
  async getEvents() {
    try {
      const events = await axios.get(
        "https://onmyway-api.herokuapp.com/api/users/test/events",
        testGet
      );
      this.setState({ events: events });
    } catch (err) {
      console.error(err);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.events.map((event) => {
          <View style={styles.event}>
            <Text style={styles.textBox}>{event.title}</Text>
            <Text style={styles.textBox}>{event.date}</Text>
            <Text style={styles.textBox}>{event.description}</Text>
          </View>;
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  event: {
    backgroundColor: "#00B8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  textBox: {
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
  },
});

export default MyEvents;
