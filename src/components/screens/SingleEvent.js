import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import axios from "axios"
import baseUrl from "../../../baseUrl";

export class SingleEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: 0,
      event: {},
      user: {},
      fetched: false,
      isHost: false
    }
    this.getEventByIdFromNavProps = this.getEventByIdFromNavProps.bind(this);
  }

  async componentDidMount() {
   try {
    //  console.log(this.props.route.params)
     const { user, isHost } = this.props.route.params.params;
     const data = await this.getEventByIdFromNavProps()
     this.setState({
       fetched: true,
       user: user,
       event: data,
       isHost: isHost
     });
     console.log("event set and fetched");
   } catch (err) {
     console.log(err, "error from mount catch");
   }
  }

  async getEventByIdFromNavProps() {
    const {eventId, token} = this.props.route.params.params;
    const config = {
      "headers": {
        "Content-Type": "application/json",
        "Authorization": `${token}`,
      },
    };
    console.log(this.props.route.params.params.eventId);
    console.log("this is event", eventId);
    const eventIdStr = eventId.toString();
    try {
      const {data} = await axios.get(`${baseUrl}/api/events/${eventId}`, config);
      console.log("Success GET event", data);
      return data
    } catch (err) {
      console.log(err, "something went wrong")
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.fetched ? (
          <View>
            <Text style={styles.heading}>{this.state.event.title}</Text>
            <View style={styles.textBox}>
              <Text style={styles.paragraph}>
                Description: {this.state.event.description}
              </Text>
              <Text>Date: {this.state.event.date}</Text>
              <Text>Guestlist:</Text>
              {this.state.event.guest.map((guest, index) => {
                return (
                  <View key={index} style={styles.card}>
                    <Text>{guest.firstName}</Text>
                    <Text>{guest.lastName}</Text>
                    <Text>{guest.email}</Text>
                  </View>
                );
              })}
            </View>
            {this.state.isHost ? (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("Tabs", {
                    screen: "Host",
                  })
                }
              >
                <Text style={styles.button}>Find Guests On Map</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("Tabs", {
                    screen: "Guest",
                  })
                }
              >
                <Text style={styles.button}>Share With Host</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text> Loading...</Text>
        )}
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
  card: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    color: "black",
    fontSize: 30,
    height: 120,
    width: 330,
    marginBottom: 10,
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
    height: 400,
    width: 300,
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
    height: 400,
    width: 300,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
  },
  paragraph: {
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  button: {

    color: "white",
    backgroundColor: "black",
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

export default SingleEvent
