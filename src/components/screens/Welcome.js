import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
} from "react-native";
import NativeForms from "native-forms";
import { TouchableOpacity } from "react-native-gesture-handler";

class Welcome extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={{
            uri:
              "https://images.unsplash.com/photo-1597995505938-2387426962ef?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
          }}
          style={styles.image}
        >
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Login")}
          >
            <View>
              <Text style={styles.text}>Login</Text>
            </View>
          </TouchableOpacity>
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
    color: "black",
    // color: "#AE744E",
    textAlign: "center",
    fontSize: 34,
    fontWeight: "bold",
    padding: 20,
    marginBottom: 200,
    // backgroundColor: "#1B2727",
    // width: 120,

    alignSelf: "center",
  },
  button: {
    color: "white",
    backgroundColor: "black",
    fontSize: 30,
    width: 100,
    marginBottom: 100,
    // justifyContent: "flex-start",
    height: 45,

    // flexDirection: "column",
    // textAlign: "center",
    // alignContent: "flex-start",
    // alignSelf: "flex-start",
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#71C8E2",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   backgroungImage: {
//     flex: 1,
//     justifyContent: "flex-start",
//     paddingVertical: 30,
//   },
//   button: {
//     color: "#71C8E2",
//     backgroundColor: "black",
//     fontSize: 30,
//     width: 110,
//     marginBottom: 10,
//     justifyContent: "center",
//     height: 45,
//     justifyContent: "center",
//     flexDirection: "row",
//     textAlign: "center",
//     alignContent: "center",
//     alignSelf: "center",
//   },
// });

export default Welcome;
