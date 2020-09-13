import React, { Component } from 'react'
import { Text, View } from 'react-native'
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
     const data = await this.getEventByIdFromNavProps()
     this.setState({
       fetched: true,
       user: this.props.navigation.params.user,
       event: data,
       isHost: this.props.params.isHost
     });
     console.log("event set and fetched");
   } catch (err) {
     console.log(err, "error from mount catch");
   }
  }

  async getEventByIdFromNavProps() {
    const {eventId} = this.props.navigation.params.eventId;
    console.log("this is event", eventId);
    try {
      const {data} = await axios.get(`${baseUrl}/${eventId}`);
      console.log("Success GET event", data);
      return data
    } catch (err) {
      console.log(err, "something went wrong")
    }
  }

  render() {
    if (this.state.fetched) {
      return (
        <View style={styles.container}>
          <View style={styles.textBox}>
            <Text style={styles.heading}>{this.state.event.title}</Text>
            <Text style={styles.paragraph}>{this.state.event.description}</Text>
            <Text>{this.state.event.date}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container} >
          <Text> Loading...</Text>
        </View>
      )
    }
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

export default SingleEvent
