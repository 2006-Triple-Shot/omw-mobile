import React, { Component } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import axios from "axios";

const dummyEvents = [
  {
    title: "back",
    date: "2020-10-22",
    description:
      "Distinctio aliquam mollitia. Velit autem vel adipisci blanditiis et doloremque. ",
  },
  {
    title: "Gourde",
    date: "2021-03-18",

    description:
      "Amet consequatur omnis odio ut. At unde est corporis ea incidunt deleniti perferendis et commodi.",
  },
  {
    title: "deposit",
    date: "2021-04-28",

    description: "Doloribus architecto non nesciunt unde.",
  },
];

export default class MyEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [...dummyEvents],
    };
  }

  async componentDidMount() {
    // await this.getEvents();
  }
  async getEvents() {
    try {
      const events = await axios.get(
        "https://onmyway-api.herokuapp.com/api/users/test/events",
        testGet.headers
      );
      this.setState({ events: events });
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
    backgroundColor: "#00B8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 44,
    textAlign: "center",
    color: "black",
    marginTop: 10,
    marginBottom: 100,
    fontWeight: "200",
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
