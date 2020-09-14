import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import axios from "axios";
import baseUrl from "../../../baseUrl";

export class SingleEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: 0,
      event: {},
      user: {},
      fetched: false,
      isHost: false,
    };
    this.getEventByIdFromNavProps = this.getEventByIdFromNavProps.bind(this);
  }

  async componentDidMount() {
    try {
      //  console.log(this.props.route.params)
      const { user, isHost } = this.props.route.params.params;
      const data = await this.getEventByIdFromNavProps();
      this.setState({
        fetched: true,
        user: user,
        event: data,
        isHost: isHost,
      });
      console.log("event set and fetched");
    } catch (err) {
      console.log(err, "error from mount catch");
    }
  }

  async getEventByIdFromNavProps() {
    const { eventId, token } = this.props.route.params.params;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    };
    console.log(this.props.route.params.params.eventId);
    console.log("this is event", eventId);
    const eventIdStr = eventId.toString();
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/events/${eventId}`,
        config
      );
      console.log("Success GET event", data);
      return data;
    } catch (err) {
      console.log(err, "something went wrong");
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
          {this.state.fetched ? (
            <View>
              <View style={styles.input}>
                <Text style={styles.text2}>{this.state.event.title}</Text>

                <Text style={styles.input2}>
                  Description: {this.state.event.description}
                </Text>
                {/* <Text>Date: {this.state.event.date}</Text> */}
                <View></View>
                <Text style={styles.text}>Invited Guest(s):</Text>
                {this.state.event.guest.map((guest, index) => {
                  return (
                    <View key={index} style={styles.text}>
                      <Text>
                        {guest.firstName}-{guest.lastName}
                      </Text>

                      {/* <Text>{guest.email}</Text> */}
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
                  <Text style={styles.input}>Find Guests On Map</Text>
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
    fontSize: 20,
    width: 320,
    backgroundColor: "#1B1D1A",
    backgroundColor: "#FFFFFF50",
    padding: 25,
    color: "#7E2D29",
    marginTop: 25,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  input2: {
    // alignSelf: "center",
    // width: 320,
    // backgroundColor: "#1B1D1A",
    // backgroundColor: "#FFFFFF50",
    // padding: 15,
    // color: "#7E2D29",
    // marginTop: 25,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#71C8E2",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   card: {
//     backgroundColor: "white",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   heading: {
//     color: "black",
//     fontSize: 30,
//     height: 120,
//     width: 330,
//     marginBottom: 10,
//     justifyContent: "center",
//     flexDirection: "row",
//     textAlign: "center",
//     alignContent: "center",
//     alignSelf: "center",
//   },
//   event: {
//     flex: 0.5,
//     paddingVertical: 20,
//     backgroundColor: "#00B8FF",
//     alignItems: "center",
//     height: 400,
//     width: 300,
//     justifyContent: "center",
//   },
//   textBox: {
//     flex: 0.5,
//     backgroundColor: "#FAC5DE",
//     padding: 5,
//     fontSize: 18,
//     borderWidth: 0.5,
//     marginLeft: 5,
//     marginRight: 5,
//     height: 400,
//     width: 300,
//     alignSelf: "center",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "black",
//   },
//   paragraph: {
//     alignSelf: "center",
//     justifyContent: "center",
//     fontSize: 18,
//   },
//   button: {

//     color: "white",
//     backgroundColor: "black",
//     fontSize: 18,
//     width: 110,
//     marginBottom: 10,
//     justifyContent: "center",
//     height: 45,
//     textAlign: "center",
//     alignContent: "center",
//     alignSelf: "center",
//   },
// });

export default SingleEvent;
