import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      fetched: false,

    };
    // this.getMe = this.getMe.bind(this)
  }

  componentDidMount() {
    // const {user} = this.props.route.params.params;
    // this.setState({
    //   user: user,
    //   fetched: true
    // })



  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.fetched ? (
          <View style={styles.card}>
            <Text>{this.state.user.firstName}</Text>
            <Text>{this.state.user.lastName}</Text>
            <Text>{this.state.user.email}</Text>
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

export default Profile;
