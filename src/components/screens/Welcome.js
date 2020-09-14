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
          <View>
            <Text style={styles.text2}>On my way!</Text>
          </View>
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
    color: "#7E2D29",
    // backgroundColor: "#FFFFFF50",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
    // marginBottom: 400,
    marginTop: 400,
    alignSelf: "center",
    width: 160,
  },
  text2: {
    color: "#929BA0",
    textAlign: "center",
    fontSize: 40,
    padding: 10,
    alignSelf: "center",
  },
});

export default Welcome;
